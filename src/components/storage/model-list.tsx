"use client";

import { useAuth } from "@clerk/nextjs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  InlineAutoForm,
  InsertModal,
  useUpdateServerActionDialog,
} from "@repo/components/ui/auto-form/auto-form-dialog";
import { useConfirmServerActionDialog } from "@repo/components/ui/auto-form/auto-form-dialog";
import { Badge } from "@repo/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/components/ui/tooltip";
import {
  File,
  Folder,
  Tree,
  TreeViewElement,
  useTree,
} from "@repo/components/ui/tree-view-api";
import { addModel } from "@repo/db/storage";
import { generateFinalPath } from "@repo/lib/ModelUtils";
import { sendEventToCD } from "@repo/lib/sendEventToCD";
import { uploadFile } from "@repo/lib/uploadFile";
import { FileIcon, Link, Pen, Plus, Trash } from "lucide-react";
import React, {
  forwardRef,
  use,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { z } from "zod";
import {
  AutoFormInputComponentProps,
  DependencyType,
} from "../../auto-form/types";
import {
  JSON_TEMPLATES,
  Model,
  // RefreshModels,
  generateJsonDefinition,
  useModelBrowser,
  useModelRerfresher,
  useModels,
} from "./model-list-view";
import {
  deleteFileFromVolume,
  deleteFileFromVolumePromise,
  EnhancedFileEntry,
  renameFileInVolumePromise,
  // renameFDropdownMenu,
  // ileInVolumePromise,
} from "@repo/db/volume/index";
import { useCDStore } from "../workspace/useMachineStore";
import { WorkspaceContext } from "@repo/components/ui/custom/workspace/WorkspaceContext";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { modelRelations } from "@/repo/db/schema";
import { getAllUserModels } from "@/server/getAllUserModel";
import { Button } from "@/repo/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/repo/components/ui/dropdown-menu";
import { getRelativeTime } from "@/repo/lib/getRelativeTime";
import { formatFileSize } from "@/components/StorageTable/FileTable";
import { useQueryState } from "next-usequerystate";
import {
  CustomModelFilenameRegex,
  CustomModelFilenameError,
  IsValidFolderPath,
  IsValidFolderPathError,
} from "@/utils/customModels";

const schema = z.object({
  // path: z.string(),
  // name: z.string(),
  type: z.enum(["url", "file"]).default("url"),
  url: z.string().default("").optional(),
  filename: z
    .string()
    .regex(CustomModelFilenameRegex, CustomModelFilenameError)
    .default(""),
  // .optional(),
  file: z.custom<FileList>().nullable().optional(),
  customPath: z.string().default("").describe("Folder Path"),
});

function generateFileTree(path: string) {
  const parts = path.split("/").filter(Boolean);
  let tree: any[] = [];
  let currentLevel = tree;
  let id = 0;

  parts.forEach((part, index) => {
    id++;
    const newItem = {
      // id: id.toString(),
      id: part,
      isSelectable: true,
      name: part,
      children: [],
    };

    currentLevel.push(newItem);

    if (index < parts.length - 1) {
      currentLevel = newItem.children;
    }
  });

  return tree;
}

// Add this function outside of the component
function renderFileTree(path: string) {
  const parts = path.split("/").filter(Boolean);

  const renderTreeItems = (items: string[], currentPath: string = "") => {
    if (items.length === 0) return null;

    const [current, ...rest] = items;
    const fullPath = `${currentPath}/${current}`;

    if (rest.length === 0) {
      return (
        <File key={fullPath} value={current}>
          <p>{current}</p>
        </File>
      );
    }

    return (
      <Folder key={fullPath} element={current} value={current}>
        {renderTreeItems(rest, fullPath)}
      </Folder>
    );
  };

  return renderTreeItems(parts);
}

type ModelItem = {
  model: any;
  path: string;
  dir: string;
  name: string;
  type: string;
  isPrivate: boolean;
  isPublic: boolean;
  category: string;
  id: string;
  isSelectable: boolean;
  children: ModelItem[];
};

interface SmartCollapseButtonProps {
  elements: TreeViewElement[];
  searchTerm: string;
  categories: string[];
  className?: string;
}

export const SmartCollapseButton = forwardRef<
  HTMLButtonElement,
  SmartCollapseButtonProps
>(
  (
    { elements: elementsProp, searchTerm, className, categories, ...props },
    ref,
  ) => {
    const elements = useDeferredValue(elementsProp);
    // const categories = useDeferredValue(categoriesProp);

    const { expendedItems, setExpendedItems } = useTree();

    const expendAllTree = useCallback(
      (elements: TreeViewElement[]) => {
        const newExpendedItems: string[] = [];

        const traverse = (
          element: TreeViewElement,
          parentPath: string = "",
        ) => {
          const currentPath = parentPath
            ? `${parentPath}/${element.name}`
            : element.name;
          if (
            element.isSelectable !== false &&
            (element.children?.length ?? 0) > 0
          ) {
            newExpendedItems.push(currentPath);
            element.children?.forEach((child) => traverse(child, currentPath));
          }
        };

        elements.forEach((element) => traverse(element));

        console.log(newExpendedItems);

        setExpendedItems?.((prev) => [
          ...new Set([...(prev ?? []), ...newExpendedItems]),
        ]);
      },
      [setExpendedItems],
    );

    const closeAll = useCallback(() => {
      setExpendedItems?.([]);
    }, [setExpendedItems]);

    // const shouldExpand = useMemo(() => {}, [elements, searchTerm, categories]);

    useEffect(() => {
      if (searchTerm === "" && categories.length === 0) {
        closeAll();
        return;
      }

      // if (categories && categories.length > 0) {
      const containsCategory = (element: TreeViewElement): boolean => {
        if (categories.includes(element.name.toLowerCase())) {
          return true;
        }
        if (element.children) {
          return element.children.some(containsCategory);
        }
        return false;
      };

      // }

      // if (!searchTerm) return false;

      const containsSearchTerm = (element: TreeViewElement): boolean => {
        if (element.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        if (element.children) {
          return element.children.some(containsSearchTerm);
        }
        return false;
      };

      // return elements.some(containsSearchTerm);

      const shouldExpand =
        elements.some(containsSearchTerm) || elements.some(containsCategory);

      if (shouldExpand) {
        expendAllTree(elements);
      }
    }, [elements, expendAllTree, closeAll]);

    // const toggleExpand = useCallback(() => {
    //   if ((expendedItems?.length ?? 0) > 0) {
    //     closeAll();
    //   } else {
    //     expendAllTree(elements);
    //   }
    // }, [expendedItems?.length ?? 0, closeAll, expendAllTree, elements]);

    return <></>;

    // return (
    //   <Button
    //     variant="ghost"
    //     className={`h-8 w-fit p-1 absolute bottom-1 right-2 ${className}`}
    //     onClick={toggleExpand}
    //     ref={ref}
    //     {...props}
    //   >
    //     {(expendedItems?.length ?? 0) > 0 ? "Collapse All" : "Expand All"}
    //     <span className="sr-only">Toggle</span>
    //   </Button>
    // );
  },
);

SmartCollapseButton.displayName = "SmartCollapseButton";

function ModelItemHoverDetails(props: { model: Model }) {
  const { model } = props;
  return (
    <>
      <div className="flex flex-col space-y-2">
        <span className="font-semibold text-base">{model.name}</span>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status:</span>
          <div className="flex items-center gap-2">
            {/* {model.status === "failed" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModelToRetry({
                    id: model.id,
                    name: model.model_name,
                  });
                }}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            )} */}
            <Badge
              variant={
                model.status === "success"
                  ? "success"
                  : model.status === "failed"
                    ? "destructive"
                    : "yellow"
              }
            >
              {model.status}
            </Badge>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Installed:</span>
          <span className="text-sm">{getRelativeTime(model.created_at)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Path:</span>
          <span className="text-sm truncate max-w-[200px]">
            {model.path?.endsWith("/") ? model.path : `${model.path}/`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Size:</span>
          <span className="text-sm">{formatFileSize(model.size)}</span>
        </div>
        {model.error_log && (
          <div className="mt-2 p-2 bg-red-100 rounded-md">
            <span className="text-sm font-medium text-red-800">Error:</span>
            <p className="text-xs text-red-700 mt-1">{model.error_log}</p>
          </div>
        )}
      </div>
    </>
  );
}

import { create } from "zustand";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/repo/components/ui/dialog";
import { useDebouncedCallback } from "use-debounce";
import { useDebounceValue } from "usehooks-ts";
import { ModelSelector } from "@/repo/components/ui/auto-form/custom/ModelSelector";
import { motion } from "framer-motion";

interface SelectedModelState {
  selectedModel: Model | null;
  setSelectedModel: (model: Model | null) => void;
  clearSelectedModel: () => void;
}

export const useSelectedModel = create<SelectedModelState>()((set) => ({
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),
  clearSelectedModel: () => set({ selectedModel: null }),
}));

export function ModelList(props: { apiEndpoint: string }) {
  const {
    insertModalSource,
    setInsertModalSource,
    filter,
    viewMode,
    isMinimized,
    selectedCategories,
    setFilter,
    setViewMode,
    setIsMinimized,
    addModelModalOpen,
    setAddModelModalOpen,
    setSelectedCategories,
  } = useModelBrowser();

  const { workflowId } = use(WorkspaceContext);

  const {
    flattenedModels,
    public_volume,
    private_volume,
    refetchPrivateVolume,
    refetchDownloadingModels,
  } = useModels();

  const { orgId, userId } = useAuth();
  const volumeName = "models_" + (orgId || userId);

  // const [selectedModel, setSelectedModel] = useQueryState("selectedModel");
  const { selectedModel, setSelectedModel } = useSelectedModel();

  const handleModelClick = (model: Model) => {
    setSelectedModel(model);

    if (!workflowId) return;

    const template =
      JSON_TEMPLATES[model.category as keyof typeof JSON_TEMPLATES] ||
      JSON_TEMPLATES.other;
    console.log(template);
    const jsonDefinition = generateJsonDefinition(template, model);
    console.log("Generated JSON Definition:", jsonDefinition);
    const getPathFromSecondSegment = (path: string) =>
      path.split("/").slice(1).join("/");

    switch (jsonDefinition.type) {
      case "checkpoint":
        sendEventToCD("add_node", {
          type: "CheckpointLoaderSimple",
          widgets_values: [getPathFromSecondSegment(jsonDefinition.modelPath)],
        });
        break;

      case "lora":
        sendEventToCD("add_node", {
          type: "LoraLoader",
          widgets_values: [
            getPathFromSecondSegment(jsonDefinition.modelPath),
            1,
            1,
          ],
        });
        break;

      case "other":
        const trimmedPath = model.path.replace("input/", "");
        console.log(trimmedPath);
        if (
          model.path.startsWith("input") &&
          /\.(png|jpe?g)$/i.test(trimmedPath)
        ) {
          sendEventToCD("add_node", {
            type: "LoadImage",
            widgets_values: [trimmedPath],
          });
          // else if (trimmedPath.endsWith(".mp4")) {
          //   sendEventToCD("add_node", {
          //     type: "VHS_LoadVideo",
          //     widgets_values: [],
          //   });
          // }
          break;
        }

        toast.error("Add this manually with supported nodes");
        break;

      default:
        toast.error("Add this manually with supported nodes");
        break;
    }
    // Here you would typically save or use the jsonDefinition
  };

  const filteredModels = useMemo(() => {
    return flattenedModels.filter((model) => {
      const folderName = model.path
        .split("/")
        .slice(0, -1)
        .join("/")
        .toLowerCase();
      const modelNameMatch = model.name
        .toLowerCase()
        .includes(filter.toLowerCase());
      const folderNameMatch = folderName.includes(filter.toLowerCase());

      return (
        model.status === "success" &&
        (modelNameMatch || folderNameMatch) &&
        (viewMode === "mixed" ||
          (viewMode === "private" && model.isPrivate) ||
          (viewMode === "public" && model.isPublic)) &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(model.category))
      );
    });
  }, [flattenedModels, filter, viewMode, selectedCategories]);

  // const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

  const [insertModalPath, setInsertModalPath] = useState("");

  const fileTree = useMemo<ModelItem[]>(() => {
    const tree: Record<string, any> = {};

    filteredModels.forEach((model) => {
      // remove leading slash
      const normalizedPath = model.path.startsWith("/")
        ? model.path.slice(1)
        : model.path;
      const pathParts = normalizedPath.split("/");
      let currentLevel = tree;

      pathParts.forEach((part, index) => {
        // console.log(model);
        if (!currentLevel[part]) {
          currentLevel[part] = {
            id: model.id || `folder-${index}`,
            dir: pathParts.slice(0, index + 1).join("/"),
            name:
              part ||
              `Unnamed ${index === pathParts.length - 1 ? "File" : "Folder"}`,
            path: model.path,
            type: index === pathParts.length - 1 ? "file" : "folder",
            isPrivate: model.isPrivate,
            isPublic: model.isPublic,
            category: model.category,
            isSelectable: true,
            model: model,
            children: {},
          };
        }
        if (index < pathParts.length - 1) {
          currentLevel = currentLevel[part].children;
        } else {
          // For the last part (file), update with model properties
          Object.assign(currentLevel[part], model);
        }
      });
    });

    const convertToArray = (obj: Record<string, any>): any[] => {
      return Object.values(obj).map((item: any) => {
        if (item.children) {
          return { ...item, children: convertToArray(item.children) };
        }
        return item;
      });
    };

    return convertToArray(tree);
  }, [filteredModels]);

  const { open, setOpen, dialog } = useConfirmServerActionDialog<{
    fileEntry: EnhancedFileEntry;
  }>({
    title: "Delete Model",
    description: "Are you sure you want to delete this model?",
    action: async (data) => {
      return await deleteFileFromVolumePromise(data);
    },
    mutateFn: () => refetchPrivateVolume(),
  });

  const {
    open: openRename,
    setOpen: setOpenRename,
    ui: renameDialog,
  } = useUpdateServerActionDialog({
    title: "Rename",
    description: "Rename this model",
    serverAction: renameFileInVolumePromise,
    mutateFn: () => refetchPrivateVolume(),
    formSchema: z.object({
      newFilename: z.string().min(1),
      fileEntry: z.object({
        path: z.string().min(1),
        type: z.number(),
        mtime: z.number(),
        size: z.number(),
        model: z.any(),
      }),
    }),
    dependencies: [
      {
        sourceField: "newFilename",
        targetField: "fileEntry",
        type: DependencyType.HIDES,
        when: () => true,
      },
    ],
  });

  const renderTreeElements = (elements: ModelItem[]) => {
    return elements.map((element) => {
      if (element.type == "folder" && element.children) {
        return (
          <Folder
            className="group"
            key={element.dir}
            element={element.name || "Unnamed Folder"}
            value={element.dir}
            tail={
              <div
                className="transition-all opacity-0 group-hover:opacity-100 p-1 h-fit min-h-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setAddModelModalOpen(true);
                  setInsertModalPath(element.dir);
                }}
              >
                <Plus className="w-4 h-4 "></Plus>
              </div>
              // <DropdownMenu>
              //   <DropdownMenuTrigger asChild>
              //     <div className="transition-all opacity-0 group-hover:opacity-100 p-1 h-fit min-h-0">
              //       <Plus className="w-4 h-4 "></Plus>
              //     </div>
              //   </DropdownMenuTrigger>
              //   <DropdownMenuContent className="w-48">
              //     <DropdownMenuLabel>Add models from</DropdownMenuLabel>
              //     <DropdownMenuItem
              //       onClick={(e) => {
              //         e.preventDefault();
              //         e.stopPropagation();
              //         e.nativeEvent.stopImmediatePropagation();
              //         setInsertModalSource("huggingface");
              //         setInsertModalPath(element.dir);
              //       }}
              //     >
              //       <img
              //         src="https://huggingface.co/favicon.ico"
              //         className="w-4 h-4 mr-2"
              //       ></img>
              //       <span>Hugging Face</span>
              //     </DropdownMenuItem>
              //     <DropdownMenuItem
              //       onClick={(e) => {
              //         e.preventDefault();
              //         e.stopPropagation();
              //         e.nativeEvent.stopImmediatePropagation();
              //         setInsertModalSource("civitai");
              //         setInsertModalPath(element.dir);
              //       }}
              //     >
              //       <img
              //         src="https://civitai.com/favicon.ico"
              //         className="w-4 h-4 mr-2"
              //       ></img>
              //       <span>CivitAI</span>
              //     </DropdownMenuItem>
              //     <DropdownMenuItem
              //       onClick={(e) => {
              //         e.preventDefault();
              //         e.stopPropagation();
              //         e.nativeEvent.stopImmediatePropagation();
              //         setInsertModalSource("comfymanager");
              //         setInsertModalPath(element.dir);
              //       }}
              //     >
              //       <img
              //         src="https://storage.googleapis.com/comfy-assets/favicon.ico"
              //         className="w-4 h-4 mr-2"
              //       ></img>
              //       <span>ComfyUI Manager</span>
              //     </DropdownMenuItem>
              //     <DropdownMenuItem
              //       onClick={(e) => {
              //         e.preventDefault();
              //         e.stopPropagation();
              //         e.nativeEvent.stopImmediatePropagation();
              //         setInsertModalSource("link");
              //         setInsertModalPath(element.dir);
              //       }}
              //     >
              //       <Link className="w-4 h-4 mr-2"></Link>
              //       <span>Link</span>
              //     </DropdownMenuItem>
              //     <DropdownMenuItem
              //       onClick={(e) => {
              //         e.preventDefault();
              //         e.stopPropagation();
              //         e.nativeEvent.stopImmediatePropagation();
              //         setInsertModalSource("local");
              //         setInsertModalPath(element.dir);
              //       }}
              //     >
              //       <FileIcon className="w-4 h-4 mr-2"></FileIcon>
              //       <span>Local</span>
              //     </DropdownMenuItem>
              //   </DropdownMenuContent>
              // </DropdownMenu>
            }
          >
            {renderTreeElements(element.children)}
          </Folder>
        );
      } else {
        return (
          <TooltipProvider key={element.dir}>
            <Tooltip>
              <TooltipTrigger>
                <File
                  value={element.dir}
                  className="text-ellipsis truncate @container"
                  handleSelect={() => {
                    handleModelClick(element as any);
                  }}
                  tail={
                    <div className="flex items-center gap-1">
                      {/* NOTE: currently not returning size on initial*/}
                      {element.model.size && (
                        <span className="@lg:flex hidden text-xs text-muted-foreground">
                          {formatFileSize(element.model.size)}
                        </span>
                      )}
                      {element.isPrivate && (
                        <div className="flex items-center gap-1 w-0 group-hover:w-[60px] transition-all opacity-0 group-hover:opacity-100 p-1 h-fit min-h-0">
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();

                              setOpenRename({
                                newFilename: element.name,
                                fileEntry: {
                                  path: element.path,
                                  type: 0,
                                  mtime: 0,
                                  size: 0,
                                  model: element,
                                },
                              });
                            }}
                            className="transition-all opacity-0 group-hover:opacity-100 p-1 h-fit min-h-0"
                          >
                            <Pen className="w-4 h-4 "></Pen>
                          </div>
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();
                              setOpen({
                                fileEntry: {
                                  path: element.path,
                                  type: 0,
                                  mtime: 0,
                                  size: 0,
                                  model: element as any,
                                },
                              });
                            }}
                            className="transition-all opacity-0 group-hover:opacity-100 p-1 h-fit min-h-0 text-red-500"
                          >
                            <Trash className="w-4 h-4 "></Trash>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-1">
                        {element.isPrivate && (
                          <Badge
                            variant={"outline"}
                            className="!text-[10px] px-1 py-0 bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Private
                          </Badge>
                        )}
                        {element.isPublic && (
                          <Badge
                            variant={"outline"}
                            className="!text-[10px] px-1 py-0 bg-green-500 hover:bg-green-600 text-white"
                          >
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                  }
                >
                  <p className="flex-1 text-left overflow-ellipsis overflow-hidden">
                    {element.name || "Unnamed File"}
                  </p>
                </File>
              </TooltipTrigger>
              <TooltipContent>
                <ModelItemHoverDetails model={element.model} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    });
  };

  const [values, setValues] = useState<Partial<z.infer<typeof schema>>>({});

  const [finalPath, setFinalPath] = useState("");

  useEffect(() => {
    const { customPath, filename } = values;
    const newFinalPath = generateFinalPath(undefined, customPath, filename);
    setFinalPath(newFinalPath);
  }, [values]);

  // const getAllFolderPaths = (items: ModelItem[]): string[] => {
  //   let paths: string[] = [];
  //   items.forEach(item => {
  //     if (item.type === 'folder') {
  //       paths.push(item.dir);
  //       if (item.children) {
  //         paths = paths.concat(getAllFolderPaths(item.children));
  //       }
  //     }
  //   });
  //   return paths;
  // };

  // const initialExpendedItems = useMemo(() => {
  //   if (filter) {
  //     return getAllFolderPaths(fileTree);
  //   }
  //   return [];
  // }, [filter, fileTree]);

  return (
    <>
      {/* <RefreshModels /> */}

      <Tree
        className="rounded-md h-full overflow-hidden p-2"
        // initialSelectedId="21"
        elements={fileTree}
        // initialExpendedItems={initialExpendedItems}
      >
        {renderTreeElements(fileTree)}
        <SmartCollapseButton
          elements={fileTree}
          searchTerm={filter}
          categories={selectedCategories}
        />
      </Tree>

      <InsertModal
        trigger={<></>}
        open={insertModalSource == "local"}
        setOpen={() => setInsertModalSource(undefined)}
        values={values}
        setValues={setValues}
        title={
          <p className="text-lg font-medium flex items-center gap-2">
            Upload file to <Badge>{insertModalPath}</Badge>
          </p>
        }
        description="Add a private model into the storage"
        data={{
          customPath: insertModalPath,
          file: null,
        }}
        serverAction={async (data) => {
          try {
            if (data.file) {
              const uploadToastId = toast.loading("Preparing upload...");
              try {
                await uploadFile({
                  volumeName: volumeName,
                  file: data.file[0],
                  targetPath: data.customPath,
                  apiEndpoint: props.apiEndpoint,
                  onProgress: (
                    progress,
                    uploadedSize,
                    totalSize,
                    estimatedTime,
                  ) => {
                    const uploadedMB = (uploadedSize / (1024 * 1024)).toFixed(
                      2,
                    );
                    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
                    toast.loading(
                      `Uploading: ${progress.toFixed(
                        0,
                      )}% (${uploadedMB}MB / ${totalMB}MB)
                      ETA: ${estimatedTime.toFixed(0)}s`,
                      { id: uploadToastId },
                    );
                  },
                });
                toast.success("Upload completed successfully!", {
                  id: uploadToastId,
                });
              } catch (error: any) {
                console.error("Upload error:", error);
                toast.error(`Upload failed: ${error.message}`, {
                  id: uploadToastId,
                });
              }

              const b = toast.loading("Refreshing...");
              try {
                await refetchPrivateVolume(true);

                toast.success("Refreshed!", {
                  id: b,
                });
              } catch (error) {
                toast.error("Failed to refresh!", {
                  id: b,
                });
              }
              return;
            }
          } catch (error) {
            toast.error(`Error adding model: ${error}`);
            console.error("Error adding model:", error);
            // Handle error (e.g., show an error message)
          }
        }}
        formSchema={z.object({
          file: z.custom<FileList>().nullable().optional(),
          customPath: z
            .string()
            .default("")
            .describe("Folder Path")
            .refine((v) => IsValidFolderPath(v), {
              message: IsValidFolderPathError,
            }),
        })}
        fieldConfig={{
          file: {
            fieldType: "file",
          },
          customPath: {
            fieldType: "select-custom-input",
            description: (
              <>
                <div className="mt-2">
                  <Tree
                    elements={generateFileTree(finalPath)}
                    initialSelectedId={values.filename}
                  >
                    {renderFileTree(finalPath)}
                  </Tree>
                </div>
              </>
            ),
          },
        }}
      />

      <InsertModal
        trigger={<></>}
        open={insertModalSource == "civitai"}
        setOpen={() => setInsertModalSource(undefined)}
        values={values}
        setValues={setValues}
        title={
          <p className="text-lg font-medium flex items-center gap-2">
            Add Model from CivitAI to <Badge>{insertModalPath}</Badge>
          </p>
        }
        description="Add a private model into the storage"
        data={{
          customPath: insertModalPath,
          url: "",
          filename: "",
        }}
        serverAction={async (data) => {
          try {
            if (!data.customPath || !data.filename || !data.url) {
              toast.error("Invalid data");
              throw new Error("Invalid data");
            }

            const result = await addModel({
              custom_path: data.customPath,
              filename: data.filename,
              url: data.url,
            });

            toast.success(result.message);
            refetchDownloadingModels();
            refetchPrivateVolume();

            console.log(result.message);
          } catch (error) {
            toast.error(`Error adding model: ${error}`);
            console.error("Error adding model:", error);
          }
        }}
        formSchema={z.object({
          url: z.string().default("").optional(),
          filename: z
            .string()
            .regex(CustomModelFilenameRegex, CustomModelFilenameError)
            .default(""),
          customPath: z
            .string()
            .default("")
            .describe("Folder Path")
            .refine((v) => IsValidFolderPath(v), {
              message: IsValidFolderPathError,
            }),
        })}
        fieldConfig={{
          url: {
            fieldType: "model-url-selector",
            inputProps: {
              type: "civitai",
            },
          },
          customPath: {
            fieldType: "select-custom-input",
            description: (
              <>
                <div className="mt-2">
                  <Tree
                    elements={generateFileTree(finalPath)}
                    initialSelectedId={values.filename}
                  >
                    {renderFileTree(finalPath)}
                  </Tree>
                </div>
              </>
            ),
          },
        }}
      />

      <InsertModal
        trigger={<></>}
        open={insertModalSource == "huggingface"}
        setOpen={() => setInsertModalSource(undefined)}
        values={values}
        setValues={setValues}
        title={
          <p className="text-lg font-medium flex items-center gap-2">
            Add Model from Hugging Face to <Badge>{insertModalPath}</Badge>
          </p>
        }
        description="Add a private model into the storage"
        data={{
          customPath: insertModalPath,
          url: "",
          filename: "",
        }}
        serverAction={async (data) => {
          try {
            if (!data.customPath || !data.filename || !data.url) {
              toast.error("Invalid data");
              throw new Error("Invalid data");
            }

            const result = await addModel({
              custom_path: data.customPath,
              filename: data.filename,
              url: data.url,
            });

            toast.success(result.message);
            refetchDownloadingModels();
            refetchPrivateVolume();

            console.log(result.message);
          } catch (error) {
            toast.error(`Error adding model: ${error}`);
            console.error("Error adding model:", error);
          }
        }}
        formSchema={z.object({
          url: z.string().default("").optional(),
          filename: z
            .string()
            .regex(CustomModelFilenameRegex, CustomModelFilenameError)
            .default("")
            .refine((v) => IsValidFolderPath(v), {
              message: IsValidFolderPathError,
            }),
          customPath: z.string().default("").describe("Folder Path"),
        })}
        fieldConfig={{
          url: {
            fieldType: "model-url-selector",
            inputProps: {
              type: "huggingface",
            },
          },
          customPath: {
            fieldType: "select-custom-input",
            description: (
              <>
                <div className="mt-2">
                  <Tree
                    elements={generateFileTree(finalPath)}
                    initialSelectedId={values.filename}
                  >
                    {renderFileTree(finalPath)}
                  </Tree>
                </div>
              </>
            ),
          },
        }}
      />

      <InsertModal
        trigger={<></>}
        open={insertModalSource == "link"}
        setOpen={() => setInsertModalSource(undefined)}
        values={values}
        setValues={setValues}
        title={
          <p className="text-lg font-medium flex items-center gap-2">
            Add Model from Link to <Badge>{insertModalPath}</Badge>
          </p>
        }
        description="Add a private model into the storage"
        data={{
          customPath: insertModalPath,
          url: "",
          filename: "",
        }}
        serverAction={async (data) => {
          try {
            if (!data.customPath || !data.filename || !data.url) {
              toast.error("Invalid data");
              throw new Error("Invalid data");
            }

            const result = await addModel({
              custom_path: data.customPath,
              filename: data.filename,
              url: data.url,
            });

            toast.success(result.message);
            refetchDownloadingModels();
            refetchPrivateVolume();

            console.log(result.message);
          } catch (error) {
            toast.error(`Error adding model: ${error}`);
            console.error("Error adding model:", error);
          }
        }}
        formSchema={z.object({
          url: z.string().default("").optional(),
          filename: z
            .string()
            .regex(CustomModelFilenameRegex, CustomModelFilenameError)
            .default(""),
          customPath: z
            .string()
            .default("")
            .describe("Folder Path")
            .refine((v) => IsValidFolderPath(v), {
              message: IsValidFolderPathError,
            }),
        })}
        fieldConfig={{
          url: {
            fieldType: "model-url-selector",
            inputProps: {
              type: "link",
            },
          },
          customPath: {
            fieldType: "select-custom-input",
            description: (
              <>
                <div className="mt-2">
                  <Tree
                    elements={generateFileTree(finalPath)}
                    initialSelectedId={values.filename}
                  >
                    {renderFileTree(finalPath)}
                  </Tree>
                </div>
              </>
            ),
          },
        }}
      />

      <InsertModal
        trigger={<></>}
        open={insertModalSource == "comfymanager"}
        setOpen={() => setInsertModalSource(undefined)}
        values={values}
        setValues={setValues}
        title={
          <p className="text-lg font-medium flex items-center gap-2">
            Add Model from Link to <Badge>{insertModalPath}</Badge>
          </p>
        }
        description="Add a private model into the storage"
        data={{
          customPath: insertModalPath,
          url: "",
          filename: "",
        }}
        serverAction={async (data) => {
          try {
            if (!data.customPath || !data.filename || !data.url) {
              toast.error("Invalid data");
              throw new Error("Invalid data");
            }

            const result = await addModel({
              custom_path: data.customPath,
              filename: data.filename,
              url: data.url,
            });

            toast.success(result.message);
            refetchDownloadingModels();
            refetchPrivateVolume();

            console.log(result.message);
          } catch (error) {
            toast.error(`Error adding model: ${error}`);
            console.error("Error adding model:", error);
          }
        }}
        formSchema={z.object({
          url: z.string().default("").optional(),
          filename: z
            .string()
            .regex(CustomModelFilenameRegex, CustomModelFilenameError)
            .default(""),
          customPath: z
            .string()
            .default("")
            .describe("Folder Path")
            .refine((v) => IsValidFolderPath(v), {
              message: IsValidFolderPathError,
            }),
        })}
        fieldConfig={{
          url: {
            fieldType: "model-url-selector",
            inputProps: {
              type: "comfymanager",
            },
          },
          customPath: {
            fieldType: "select-custom-input",
            description: (
              <>
                <div className="mt-2">
                  <Tree
                    elements={generateFileTree(finalPath)}
                    initialSelectedId={values.filename}
                  >
                    {renderFileTree(finalPath)}
                  </Tree>
                </div>
              </>
            ),
          },
        }}
      />

      <AddModelDialog insertModalPath={insertModalPath} />

      {dialog}
      {renameDialog}
    </>
  );
}

function AddModelDialog(props: { insertModalPath: string }) {
  const { addModelModalOpen, setAddModelModalOpen } = useModelBrowser();

  return (
    <Dialog open={addModelModalOpen} onOpenChange={setAddModelModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>
        {/* <DialogDescription>Add a model to the storage</DialogDescription> */}
        <AnyModelRegistry
          close={() => setAddModelModalOpen(false)}
          insertModalPath={props.insertModalPath}
        />
      </DialogContent>
    </Dialog>
  );
}

function useModelSearch(props: {
  search: string;
  provider: "civitai" | "huggingface" | "comfyui";
}) {
  const result = useQuery<any>({
    queryKey: ["search", "model"],
    queryKeyHashFn: (queryKey) =>
      [...queryKey, props.search, props.provider].toString(),
    meta: {
      params: {
        query: props.search,
        provider: props.provider,
      },
    },
  });

  return result;
}

export function AnyModelRegistry(props: {
  close: () => void;
  insertModalPath: string;
}) {
  const { refetchPrivateVolume, refetchDownloadingModels } = useModels();
  const { setInsertModalSource, insertModalSource } = useModelBrowser();

  const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = useDebounceValue("", 300);

  // const [debouncedSearch, setDebouncedSearch] = (search, 300);

  const [selected, setSelected] = React.useState<any>([]);

  const { data: dataCivitai, isLoading: isLoadingCivitai } = useModelSearch({
    search,
    provider: "civitai",
  });

  const { data: dataHuggingface, isLoading: isLoadingHuggingface } =
    useModelSearch({
      search,
      provider: "huggingface",
    });

  const { data: dataComfyui, isLoading: isLoadingComfyui } = useModelSearch({
    search,
    provider: "comfyui",
  });

  const isLoading =
    isLoadingCivitai || isLoadingHuggingface || isLoadingComfyui;

  const data = useMemo(() => {
    const allModels = [
      ...(dataComfyui?.models || []).map((model: any) => ({
        ...model,
        provider: "comfyui",
      })),
      ...(dataHuggingface?.models || []).map((model: any) => ({
        ...model,
        provider: "huggingface",
      })),
      ...(dataCivitai?.models || []).map((model: any) => ({
        ...model,
        provider: "civitai",
      })),
    ];

    return {
      models: allModels,
    };
  }, [dataCivitai, dataHuggingface, dataComfyui]);

  const modelList = React.useMemo(() => {
    return {
      models: !data?.models
        ? []
        : data?.models?.map((model: any) => {
            return {
              ...model,
              url: model.download_url,
              reference: model.reference_url,
              description: "",
              base: "",
            };
          }),
    };
  }, [data]);

  return (
    <motion.div className="flex flex-col gap-2" layout="position">
      <ModelSelector
        popover={false}
        searchId="any"
        selectMultiple={false}
        modelList={modelList}
        selected={selected}
        onSelectedChange={setSelected}
        label="Any"
        onSearch={setSearch}
        shouldFilter={false}
        isLoading={isLoading}
      />
      <>
        {!selected ||
          (selected.length == 0 && (
            <>
              {/* <div className="text-sm text-muted-foreground text-center w-full">
                Can't find model?
              </div> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="transition-all opacity-100 p-1 min-h-0 text-xs px-2"
                    size="default"
                    variant="outline"
                    Icon={Plus}
                    iconPlacement="right"
                  >
                    Add from custom source
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Add models from</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setInsertModalSource("huggingface");
                    }}
                  >
                    <img
                      src="https://huggingface.co/favicon.ico"
                      className="w-4 h-4 mr-2"
                    ></img>
                    <span>Hugging Face</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setInsertModalSource("civitai");
                    }}
                  >
                    <img
                      src="https://civitai.com/favicon.ico"
                      className="w-4 h-4 mr-2"
                    ></img>
                    <span>CivitAI</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setInsertModalSource("comfymanager");
                    }}
                  >
                    <img
                      src="https://storage.googleapis.com/comfy-assets/favicon.ico"
                      className="w-4 h-4 mr-2"
                    ></img>
                    <span>ComfyUI Manager</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setInsertModalSource("link");
                    }}
                  >
                    <Link className="w-4 h-4 mr-2"></Link>
                    <span>Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setInsertModalSource("local");
                    }}
                  >
                    <FileIcon className="w-4 h-4 mr-2"></FileIcon>
                    <span>Local</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ))}
      </>
      {/* {JSON.stringify(selected)} */}
      {selected && selected.length > 0 && (
        <InlineAutoForm
          className="animate-in fade-in"
          data={{
            filename: selected[0].filename,
            url:
              selected[0].provider == "civitai"
                ? selected[0].reference_url
                : selected[0].download_url,
            customPath: props.insertModalPath ?? selected[0].save_path,
          }}
          formSchema={z.object({
            filename: z.string(),
            url: z.string().readonly(),
            customPath: z
              .string()
              .default("")
              .describe("Folder Path")
              .refine((v) => IsValidFolderPath(v), {
                message: IsValidFolderPathError,
              }),
          })}
          fieldConfig={{
            url: {
              inputProps: {
                className: "pointer-events-none opacity-50",
                readOnly: true,
              },
            },
            customPath: {
              fieldType: "select-custom-input",
            },
          }}
          buttonTitle="Install"
          serverAction={async function (data: {
            customPath: string;
            filename: string;
            url: string;
          }): Promise<any> {
            try {
              if (!data.customPath || !data.filename || !data.url) {
                toast.error("Invalid data");
                throw new Error("Invalid data");
              }

              const result = await addModel({
                custom_path: data.customPath,
                filename: data.filename,
                url: data.url,
              });

              toast.success(result.message);
              refetchDownloadingModels();
              refetchPrivateVolume();

              props.close();

              console.log(result.message);
            } catch (error) {
              toast.error(`Error adding model: ${error}`);
              console.error("Error adding model:", error);
            }
          }}
        />
      )}
    </motion.div>
  );
}
