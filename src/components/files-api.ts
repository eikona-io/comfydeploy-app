import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";

export async function uploadFile(file: File) {
  // Ensure upload folder exists
  try {
    await api({
      url: "assets/folder",
      init: {
        method: "POST",
        body: JSON.stringify({ name: "upload", parent_path: "/" }),
      },
    });
  } catch (error: any) {
    // Check for the "folder already exists" error in multiple ways
    const errorMessage = error?.message || error?.toString() || "";
    const errorDetail = error?.detail || "";
    const errorBody = error?.body || "";

    const isFolderExistsError =
      errorMessage.includes("Folder already exists") ||
      errorDetail === "Folder already exists" ||
      (errorMessage.includes("status: 400") &&
        errorMessage.includes("Folder already exists")) ||
      (typeof errorBody === "string" &&
        errorBody.includes("Folder already exists"));

    if (isFolderExistsError) {
      // This is expected and good - folder exists, we can continue
      console.log("Upload folder already exists - continuing");
    } else {
      // For any other error, throw it
      console.error("Failed to create upload folder:", error);
      throw new Error("Failed to ensure upload folder exists");
    }
  }

  // Handle small files with regular upload
  if (file.size < 50 * 1024 * 1024) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api({
      url: "assets/upload",
      skipDefaultHeaders: true,
      init: {
        method: "POST",
        body: formData,
      },
      params: {
        parent_path: "/upload",
      },
    });
    return response;
  }

  const toastId = toast.loading("Preparing upload...", {
    duration: Number.POSITIVE_INFINITY,
  });

  // Get presigned URL
  const presignedUrlResponse = await api({
    url: "assets/presigned-url",
    params: {
      file_name: file.name,
      parent_path: "/upload",
      size: file.size,
      type: file.type,
    },
  });

  toast.loading("Starting upload...", { id: toastId });

  // Upload to presigned URL with progress tracking
  const xhr = new XMLHttpRequest();

  const uploadPromise = new Promise((resolve, reject) => {
    xhr.open("PUT", presignedUrlResponse.url, true);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progressPercentage = Math.round((e.loaded / e.total) * 80) + 10;
        toast.loading(`Uploading... ${progressPercentage}%`, { id: toastId });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.send(file);
  });

  await uploadPromise;

  toast.loading("Finalizing upload...", { id: toastId });

  // Register the uploaded asset
  const registeredAsset = await api({
    url: "assets/register",
    init: {
      method: "POST",
      body: JSON.stringify({
        file_id: presignedUrlResponse.file_id,
        file_name: file.name,
        file_size: file.size,
        db_path: presignedUrlResponse.db_path,
        url: presignedUrlResponse.download_url,
        mime_type: file.type,
      }),
    },
  });

  toast.success("File uploaded successfully!", { id: toastId });
  return registeredAsset;
}

export async function generateUploadUrl(
  filename: string,
  contentType: string,
  size: number,
) {
  return await api({
    url: "volume/file/generate-upload-url",
    init: {
      method: "POST",
      body: JSON.stringify({
        filename,
        contentType,
        size,
      }),
    },
  });
}

export async function uploadFileToVolume({
  volumeName,
  file,
  filename,
  subfolder,
  targetPath,
  apiEndpoint,
  onProgress,
}: {
  volumeName: string;
  file: File;
  filename?: string;
  subfolder?: string;
  targetPath?: string;
  apiEndpoint: string;
  onProgress?: (
    progress: number,
    uploadedSize: number,
    totalSize: number,
    estimatedTime: number,
  ) => void;
}) {
  const url = `${apiEndpoint}`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", filename || file.name);
  formData.append("volume_name", volumeName);
  if (targetPath) {
    formData.append("target_path", targetPath);
  }
  if (subfolder) {
    formData.append("subfolder", subfolder);
  }

  console.log(file.name, url);

  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        const uploadedSize = event.loaded;
        const totalSize = event.total;
        const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
        const uploadSpeed = uploadedSize / elapsedTime; // bytes per second
        const remainingSize = totalSize - uploadedSize;
        const estimatedTime = remainingSize / uploadSpeed; // in seconds

        onProgress(progress, uploadedSize, totalSize, estimatedTime);
      }
    };

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          console.log("File uploaded successfully:", result);
          resolve(result);
        } else {
          // Return the error from the server as plain text
          const errorMessage =
            xhr.responseText || `Server error: ${xhr.statusText}`;
          reject(new Error(errorMessage));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error occurred during file upload"));
      };

      xhr.send(formData);
    });
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
}
export async function initiateMultipartUpload(filename: string, contentType: string, size: number): Promise<{ uploadId: string; key: string }> {
  return api({
    url: "volume/file/initiate-multipart-upload",
    init: {
      method: "POST",
      body: JSON.stringify({ filename, contentType, size }),
    },
  });
}

export async function getPartUploadUrl(uploadId: string, key: string, partNumber: number): Promise<{ uploadUrl: string }> {
  return api({
    url: "volume/file/generate-part-upload-url",
    init: {
      method: "POST",
      body: JSON.stringify({ uploadId, key, partNumber }),
    },
  });
}

export async function completeMultipartUpload(uploadId: string, key: string, parts: { partNumber: number; eTag: string }[]): Promise<{ status: string; key: string }> {
  return api({
    url: "volume/file/complete-multipart-upload",
    init: {
      method: "POST",
      body: JSON.stringify({ uploadId, key, parts }),
    },
  });
}

export async function abortMultipartUpload(uploadId: string, key: string): Promise<{ status: string }> {
  return api({
    url: "volume/file/abort-multipart-upload",
    init: {
      method: "POST",
      body: JSON.stringify({ uploadId, key }),
    },
  });
}

const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryMultiplier: 2,
};

function getPartSize(fileSize: number) {
  if (fileSize < 1 * 1024 * 1024 * 1024) return 5 * 1024 * 1024;
  if (fileSize < 5 * 1024 * 1024 * 1024) return 10 * 1024 * 1024;
  if (fileSize < 15 * 1024 * 1024 * 1024) return 25 * 1024 * 1024;
  if (fileSize < 50 * 1024 * 1024 * 1024) return 50 * 1024 * 1024;
  return 100 * 1024 * 1024;
}

export async function uploadLargeFileToS3(
  file: File,
  onProgress?: (pct: number, uploaded: number, total: number, etaSeconds: number) => void
): Promise<{ key: string; uploadId: string }> {
  const partSize = getPartSize(file.size);
  const totalParts = Math.ceil(file.size / partSize);

  const { uploadId, key } = await initiateMultipartUpload(
    file.name,
    file.type || "application/octet-stream",
    file.size
  );

  const started = Date.now();
  const etags: { partNumber: number; eTag: string }[] = [];
  const progressByPart = new Map<number, number>();

  const reportProgress = () => {
    if (!onProgress) return;
    let uploaded = 0;
    for (const v of progressByPart.values()) uploaded += v;
    uploaded = Math.min(uploaded, file.size);
    const pct = (uploaded / file.size) * 100;
    const elapsed = (Date.now() - started) / 1000;
    const speed = uploaded / Math.max(elapsed, 0.001);
    const remaining = file.size - uploaded;
    const eta = remaining / Math.max(speed, 1);
    onProgress(pct, uploaded, file.size, eta);
  };

  const putPartXHR = (url: string, blob: Blob, partNumber: number) =>
    new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressByPart.set(partNumber, e.loaded);
          reportProgress();
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const e1 = xhr.getResponseHeader("ETag");
          const e2 = xhr.getResponseHeader("etag");
          const tag = (e1 || e2 || "").replaceAll('"', "");
          if (!tag) {
            reject(
              new Error(
                "Missing ETag from S3 response. Please ensure your bucket CORS ExposeHeaders includes ETag."
              )
            );
            return;
          }
          progressByPart.set(partNumber, blob.size);
          reportProgress();
          resolve(tag);
        } else {
          reject(new Error(`Part upload failed with ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("Network error during part upload"));
      xhr.send(blob);
    });

  const uploadPartWithRetry = async (partNumber: number, blob: Blob) => {
    let attempt = 0;
    let delay = RETRY_CONFIG.retryDelay;
    while (true) {
      try {
        const { uploadUrl } = await getPartUploadUrl(uploadId, key, partNumber);
        const eTag = await putPartXHR(uploadUrl, blob, partNumber);
        etags.push({ partNumber, eTag });
        return;
      } catch (err) {
        attempt++;
        if (attempt >= RETRY_CONFIG.maxRetries) throw err as any;
        await new Promise((r) => setTimeout(r, delay));
        delay *= RETRY_CONFIG.retryMultiplier;
      }
    }
  };

  try {
    const inFlight: Promise<void>[] = [];
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * partSize;
      const end = Math.min(start + partSize, file.size);
      const blob = file.slice(start, end);
      progressByPart.set(partNumber, 0);
      inFlight.push(uploadPartWithRetry(partNumber, blob));
      if (inFlight.length >= 6) {
        await Promise.all(inFlight);
        inFlight.length = 0;
      }
    }
    if (inFlight.length) await Promise.all(inFlight);

    etags.sort((a, b) => a.partNumber - b.partNumber);
    await completeMultipartUpload(uploadId, key, etags);
    if (onProgress) onProgress(100, file.size, file.size, 0);
    return { key, uploadId };
  } catch (err) {
    try {
      await abortMultipartUpload(uploadId, key);
    } catch {}
    throw err;
  }
}
