import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatBytes } from "@/lib/utils";

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
export async function initiateMultipartUpload(
  filename: string,
  contentType: string,
  size: number,
): Promise<{
  uploadId: string;
  key: string;
  partSize: number;
}> {
  return api({
    url: "volume/file/initiate-multipart-upload",
    init: {
      method: "POST",
      body: JSON.stringify({ filename, contentType, size }),
    },
  });
}

export async function getPartUploadUrl(
  uploadId: string,
  key: string,
  partNumber: number,
): Promise<{ uploadUrl: string }> {
  return api({
    url: "volume/file/generate-part-upload-url",
    init: {
      method: "POST",
      body: JSON.stringify({ uploadId, key, partNumber }),
    },
  });
}

export async function completeMultipartUpload(
  uploadId: string,
  key: string,
  parts: { partNumber: number; eTag: string }[],
): Promise<{ status: string; key: string }> {
  return api({
    url: "volume/file/complete-multipart-upload",
    init: {
      method: "POST",
      body: JSON.stringify({ uploadId, key, parts }),
    },
  });
}

export async function abortMultipartUpload(
  uploadId: string,
  key: string,
): Promise<{ status: string }> {
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

const SMART_UPLOAD_CONFIG = {
  initialConcurrency: 4,
  slowThreshold: 0.3, // Retry if < 30% of average speed
  minSamplesForComparison: 2, // Need 2 completed chunks before comparing
  speedCheckInterval: 15000, // Check every 15 seconds
  minTimeBeforeCheck: 20000, // Wait 20s before first speed check
};

class SmartUploadManager {
  private completedSpeeds: number[] = [];
  private activeUploads = new Map<
    number,
    { startTime: number; lastCheck: number }
  >();

  recordCompletedSpeed(partNumber: number, bytesPerSecond: number): void {
    this.completedSpeeds.push(bytesPerSecond);
    this.activeUploads.delete(partNumber);
  }

  startTracking(partNumber: number): void {
    const now = Date.now();
    this.activeUploads.set(partNumber, { startTime: now, lastCheck: now });
  }

  getAverageSpeed(): number {
    if (this.completedSpeeds.length === 0) return 0;
    return (
      this.completedSpeeds.reduce((sum, speed) => sum + speed, 0) /
      this.completedSpeeds.length
    );
  }

  shouldRetrySlowPart(partNumber: number, currentProgress: number): boolean {
    const tracking = this.activeUploads.get(partNumber);
    if (
      !tracking ||
      this.completedSpeeds.length < SMART_UPLOAD_CONFIG.minSamplesForComparison
    ) {
      return false;
    }

    const now = Date.now();
    const timeElapsed = (now - tracking.startTime) / 1000;

    // Don't check too early
    if (timeElapsed < SMART_UPLOAD_CONFIG.minTimeBeforeCheck / 1000)
      return false;

    // Don't check too frequently
    if (now - tracking.lastCheck < SMART_UPLOAD_CONFIG.speedCheckInterval)
      return false;

    const currentSpeed = currentProgress / timeElapsed;
    const avgSpeed = this.getAverageSpeed();
    const threshold = avgSpeed * SMART_UPLOAD_CONFIG.slowThreshold;

    tracking.lastCheck = now;

    if (currentSpeed < threshold) {
      console.warn(
        `🐌 Part ${partNumber} slow: ${formatBytes(currentSpeed)}/s vs avg ${formatBytes(avgSpeed)}/s`,
      );
      return true;
    }

    return false;
  }
}

export async function uploadLargeFileToS3(
  file: File,
  onProgress?: (
    pct: number,
    uploaded: number,
    total: number,
    etaSeconds: number,
  ) => void,
): Promise<{ key: string; uploadId: string }> {
  const init = await initiateMultipartUpload(
    file.name,
    file.type || "application/octet-stream",
    file.size,
  );
  const partSize = init.partSize || 50 * 1024 * 1024;
  const totalParts = Math.ceil(file.size / partSize);
  if (totalParts > 10000)
    throw new Error(
      `File creates too many parts (${totalParts}). Increase part size.`,
    );
  const { uploadId, key } = init;

  const started = Date.now();
  const etags: { partNumber: number; eTag: string }[] = [];
  const progressByPart = new Map<number, number>();
  const smartManager = new SmartUploadManager();

  const reportProgress = () => {
    let uploaded = 0;
    for (const v of progressByPart.values()) uploaded += v;
    uploaded = Math.min(uploaded, file.size);
    const pct = (uploaded / file.size) * 100;
    const elapsed = (Date.now() - started) / 1000;
    const speed = uploaded / Math.max(elapsed, 0.001);
    const eta = (file.size - uploaded) / Math.max(speed, 1);
    if (onProgress) onProgress(pct, uploaded, file.size, eta);
  };

  const putPartXHR = (url: string, blob: Blob, partNumber: number) =>
    new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 3 * 60 * 1000; // 3 minute timeout

      const startTime = Date.now();
      let speedCheckTimer: NodeJS.Timeout;

      smartManager.startTracking(partNumber);

      // Check for slow upload periodically
      speedCheckTimer = setInterval(() => {
        const currentProgress = progressByPart.get(partNumber) || 0;
        if (smartManager.shouldRetrySlowPart(partNumber, currentProgress)) {
          clearInterval(speedCheckTimer);
          xhr.abort();
          reject(
            new Error(
              `slow_upload:${formatBytes(currentProgress / ((Date.now() - startTime) / 1000))}/s`,
            ),
          );
        }
      }, SMART_UPLOAD_CONFIG.speedCheckInterval);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressByPart.set(partNumber, e.loaded);
          reportProgress();
        }
      };

      xhr.onload = () => {
        clearInterval(speedCheckTimer);

        if (xhr.status >= 200 && xhr.status < 300) {
          const uploadTime = (Date.now() - startTime) / 1000;
          const speed = blob.size / uploadTime;

          smartManager.recordCompletedSpeed(partNumber, speed);

          const eTag = (
            xhr.getResponseHeader("ETag") ||
            xhr.getResponseHeader("etag") ||
            ""
          ).replaceAll('"', "");
          if (!eTag) {
            reject(new Error("Missing ETag from S3 response"));
            return;
          }

          progressByPart.set(partNumber, blob.size);
          reportProgress();
          resolve(eTag);
        } else {
          reject(new Error(`Part upload failed with ${xhr.status}`));
        }
      };

      const cleanup = () => clearInterval(speedCheckTimer);
      xhr.onerror =
        xhr.ontimeout =
        xhr.onabort =
          () => {
            cleanup();
            reject(new Error(`Part ${partNumber} upload failed`));
          };

      xhr.open("PUT", url);
      xhr.send(blob);
    });

  const uploadPartWithRetry = async (
    partNumber: number,
    blob: Blob,
    isLastAttempt = false,
  ) => {
    let attempt = 0;
    let delay = RETRY_CONFIG.retryDelay;

    while (true) {
      try {
        const { uploadUrl } = await getPartUploadUrl(uploadId, key, partNumber);
        const eTag = await putPartXHR(uploadUrl, blob, partNumber);
        etags.push({ partNumber, eTag });
        return { success: true, partNumber };
      } catch (err: any) {
        attempt++;

        const isSlowUpload = err.message.includes("slow_upload");
        if (isSlowUpload) {
          console.log(`🐌 Part ${partNumber} slow, retrying...`);
          delay = Math.max(delay, 5000);
        } else {
          console.log(`❌ Part ${partNumber} failed, retrying...`);
        }

        // If this is the final attempt for this part, fail it
        if (isLastAttempt && attempt >= RETRY_CONFIG.maxRetries) {
          return { success: false, partNumber, error: err };
        }

        // If not last attempt, keep retrying with exponential backoff
        if (!isLastAttempt && attempt >= RETRY_CONFIG.maxRetries) {
          return { success: false, partNumber, error: err };
        }

        await new Promise((r) => setTimeout(r, delay));
        delay *= RETRY_CONFIG.retryMultiplier;
      }
    }
  };

  try {
    const MAX_CONCURRENCY = SMART_UPLOAD_CONFIG.initialConcurrency;

    // Create a semaphore for concurrency control
    const semaphore = {
      count: MAX_CONCURRENCY,
      waiters: [] as Array<() => void>,
    };

    const acquire = () =>
      new Promise<void>((resolve) => {
        if (semaphore.count > 0) {
          semaphore.count--;
          resolve();
        } else {
          semaphore.waiters.push(resolve);
        }
      });

    const release = () => {
      if (semaphore.waiters.length > 0) {
        const waiter = semaphore.waiters.shift()!;
        waiter();
      } else {
        semaphore.count++;
      }
    };

    const partBlobs = new Map<number, Blob>();
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * partSize;
      const end = Math.min(start + partSize, file.size);
      partBlobs.set(partNumber, file.slice(start, end));
      progressByPart.set(partNumber, 0);
    }

    const uploadPart = async (partNumber: number, isLastAttempt = false) => {
      await acquire();
      const blob = partBlobs.get(partNumber)!;

      try {
        const result = await uploadPartWithRetry(
          partNumber,
          blob,
          isLastAttempt,
        );
        // Success logged elsewhere
        return result;
      } finally {
        release();
      }
    };

    // Phase 1: Initial upload attempts
    const initialPromises = Array.from(partBlobs.keys()).map((partNumber) =>
      uploadPart(partNumber, false),
    );
    const initialResults = await Promise.all(initialPromises);

    const failedParts = initialResults.filter((r) => !r.success);

    // Phase 2: Retry failed parts until all succeed or final attempt
    let retryRound = 1;
    let remainingFailures = failedParts;

    while (remainingFailures.length > 0 && retryRound <= 3) {
      const isLastAttempt = retryRound === 3;
      const retryPromises = remainingFailures.map((failure) =>
        uploadPart(failure.partNumber, isLastAttempt),
      );
      const retryResults = await Promise.all(retryPromises);

      remainingFailures = retryResults.filter((r) => !r.success);
      retryRound++;
    }

    if (remainingFailures.length > 0) {
      const failedPartNumbers = remainingFailures
        .map((f) => f.partNumber)
        .join(", ");
      throw new Error(
        `Upload failed: Parts ${failedPartNumbers} could not be uploaded after all retry attempts`,
      );
    }

    etags.sort((a, b) => a.partNumber - b.partNumber);
    await completeMultipartUpload(uploadId, key, etags);
    if (onProgress) onProgress(100, file.size, file.size, 0);
    return { key, uploadId };
  } catch (err) {
    try {
      await abortMultipartUpload(uploadId, key);
    } catch (abortErr) {
      // Silent cleanup failure
    }
    throw err;
  }
}
