import { SDImageEditor } from "@/components/SDInputs/SDImageEditor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Paperclip, Pencil, Trash, Folder } from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SDAssetInput } from "./sd-asset-input";
import { ImageInputsTooltip } from "../image-inputs-tooltip";

type SDImageInputProps = {
  label?: string;
  className?: string;
  inputClasses?: string;
  file: File | undefined;
  multiple?: boolean;
  onChange: (
    file:
      | File
      | string
      | undefined
      | FileList
      | { type: "folder"; path: string; name: string },
  ) => void;
  header?: ReactNode;
};

export function SDImageInput({
  label,
  className,
  inputClasses,
  file,
  onChange,
  multiple,
  header,
}: SDImageInputProps) {
  const dropRef: RefObject<HTMLDivElement> = useRef(null);
  const [openEditor, setOpenEditor] = useState(false);
  const [urlImagePreview, setUrlImagePreview] = useState<string | null>(null);
  const [urlImageLoading, setUrlImageLoading] = useState(false);

  const ImgView: ImgView | null = useMemo(() => {
    if (file && typeof file === "object") {
      const imgURL = URL.createObjectURL(file);
      const imgView: ImgView = {
        imgName: (file as File).name,
        imgURL: imgURL,
      };
      const imageDOMElement = new Image();
      imageDOMElement.src = imgURL;
      imageDOMElement.onload = () => {
        imgView.height = imageDOMElement.height;
        imgView.width = imageDOMElement.width;
      };
      return imgView;
    }
    return null;
  }, [file]);

  // Check if there's text in the input (URL string)
  const hasTextInput =
    typeof file === "string" && String(file).trim().length > 0;

  // Check if there's a folder selected
  const hasFolderInput =
    typeof file === "object" &&
    file !== null &&
    !Array.isArray(file) &&
    !(file instanceof File) &&
    "type" in file &&
    (file as any).type === "folder";

  // Function to check if URL is a valid image
  const isValidImageUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Effect to validate and load image preview for URLs
  useEffect(() => {
    if (!hasTextInput || typeof file !== "string") {
      setUrlImagePreview(null);
      setUrlImageLoading(false);
      return;
    }

    const url = String(file).trim();

    if (!isValidImageUrl(url)) {
      setUrlImagePreview(null);
      setUrlImageLoading(false);
      return;
    }

    setUrlImageLoading(true);
    setUrlImagePreview(null);

    const img = new Image();
    img.crossOrigin = "anonymous";

    const handleLoad = () => {
      setUrlImagePreview(url);
      setUrlImageLoading(false);
    };

    const handleError = () => {
      setUrlImagePreview(null);
      setUrlImageLoading(false);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [hasTextInput, file]);

  function onDeleteImg() {
    if (!file) {
      return;
    }
    onChange(undefined);
  }

  useEffect(() => {
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      console.log(files);
      if (files?.length) {
        onChange(multiple ? files : files[0]);
      }
    };
    if (!dropRef.current) {
      return;
    }

    // dropRef.current.addEventListener('dragover', handleDragOver);
    dropRef.current.addEventListener("drop", handleDrop);

    return () => {
      if (!dropRef.current) {
        return;
      }
      // dropRef.current.removeEventListener('dragover', handleDragOver);
      dropRef.current.removeEventListener("drop", handleDrop);
    };
  }, [multiple, onChange]);

  return (
    <div className={className} ref={dropRef}>
      {header}
      <div className={`${inputClasses} flex gap-1`}>
        {!ImgView && !hasFolderInput && (
          <>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-1">
                <Input
                  className="rounded-[8px]"
                  placeholder="Type your URL or drop a file"
                  value={String(file || "")}
                  onChange={(e) => onChange(e.target.value)}
                />

                {hasTextInput ? (
                  <ImageInputsTooltip tooltipText="Edit">
                    <Button
                      variant="outline"
                      type="button"
                      className="cursor-pointer rounded-[8px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      onClick={() => setOpenEditor(true)}
                    >
                      <Pencil size={18} />
                    </Button>
                  </ImageInputsTooltip>
                ) : (
                  <>
                    <Input
                      id={`file-input-${label}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (!e?.target.files) {
                          return;
                        }
                        onChange(e.target.files[0]);
                      }}
                      type="file"
                    />
                    <Label
                      htmlFor={`file-input-${label}`}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          className:
                            "cursor-pointer rounded-[8px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50",
                        }),
                      )}
                    >
                      <Paperclip size={18} />
                    </Label>
                    <div className="flex items-center justify-center">
                      <SDAssetInput onChange={onChange} />
                    </div>
                  </>
                )}
              </div>

              {/* URL Image Preview */}
              {hasTextInput && (urlImagePreview || urlImageLoading) && (
                <div className="flex items-center gap-3 rounded-[8px] border border-gray-200 p-2 dark:border-gray-700">
                  {urlImageLoading ? (
                    <div className="h-12 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  ) : (
                    <img
                      src={urlImagePreview || ""}
                      alt="Preview"
                      className="h-12 w-12 rounded object-cover"
                      onError={() => setUrlImagePreview(null)}
                    />
                  )}
                  <div className="flex flex-auto items-center justify-between">
                    <p className="line-clamp-1 font-medium text-xs">
                      {urlImageLoading ? "Loading preview..." : "Image preview"}
                    </p>
                    <ImageInputsTooltip tooltipText="Delete">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={onDeleteImg}
                      >
                        <Trash
                          className="text-red-700 hover:text-red-600"
                          size={16}
                        />
                      </Button>
                    </ImageInputsTooltip>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {ImgView && (
          <div className="flex w-full items-center justify-between rounded-[8px] border border-gray-200 px-2 py-1 dark:border-gray-700">
            <div className="flex flex-auto items-center gap-2">
              <p className="line-clamp-1 font-medium text-xs">
                {ImgView.imgName}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ImageInputsTooltip tooltipText="Edit">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setOpenEditor(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenEditor(true);
                    }
                  }}
                >
                  <Pencil size={16} />
                </Button>
              </ImageInputsTooltip>
              <ImageInputsTooltip tooltipText="Delete">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={onDeleteImg}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onDeleteImg();
                    }
                  }}
                >
                  <Trash
                    className="text-red-700 hover:text-red-600"
                    size={16}
                  />
                </Button>
              </ImageInputsTooltip>
            </div>
          </div>
        )}
        {hasFolderInput && (
          <div className="flex w-full items-center justify-between rounded-[8px] border border-gray-200 px-2 py-1 dark:border-gray-700">
            <div className="flex flex-auto items-center gap-2">
              <Folder className="h-4 w-4 text-gray-400" />
              <p className="line-clamp-1 font-medium text-xs">
                Folder: {(file as any).name}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ImageInputsTooltip tooltipText="Delete">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={onDeleteImg}
                >
                  <Trash
                    className="text-red-700 hover:text-red-600"
                    size={16}
                  />
                </Button>
              </ImageInputsTooltip>
            </div>
          </div>
        )}
      </div>

      {/* Image Editor Dialog */}
      {(hasTextInput || ImgView) && (
        <SDImageEditor
          open={openEditor}
          onOpenChange={setOpenEditor}
          imageUrl={ImgView ? ImgView.imgURL : String(file || "")}
          onSave={(editedFile) => {
            onChange(editedFile);
            setOpenEditor(false);
          }}
        />
      )}
    </div>
  );
}

export type ImgView = {
  imgName: string;
  imgURL: string;
  width?: number;
  height?: number;
};
