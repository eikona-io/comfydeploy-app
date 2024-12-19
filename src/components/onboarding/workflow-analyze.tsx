export type CustomNodeInfo = {
  url: string;
  name: string;
  hash?: string; // Make hash optional
  warning?: string;
  files?: string[]; // Make files optional
  install_type?: string; // Make install_type optional
  node?: { inputs: Record<string, any>; class_type?: string }[]; // Add node property
  pip?: string[]; // Add pip property
};

export type ConflictingNodeInfo = {
  url: string;
  name: string;
  files: string[];
  install_type: string;
  pip?: string[];
  hash?: string | null;
};

export type WorkflowDependencies = {
  comfyui: string | undefined;
  custom_nodes: {
    [url: string]: CustomNodeInfo;
  };
  missing_nodes: string[];
  conflicting_nodes: {
    [nodeName: string]: ConflictingNodeInfo[];
  };
};
