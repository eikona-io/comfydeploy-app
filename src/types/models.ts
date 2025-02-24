export type ModelSource = "huggingface" | "civitai" | "link";

export interface ModelSourceOption {
  id: ModelSource;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Adding model requests

export interface HuggingfaceModel {
  repoId: string;
}

export interface CivitaiModel {
  url: string;
}

export interface AddModelRequest {
  source: ModelSource;
  folderPath: string;
  filename?: string;

  huggingface?: HuggingfaceModel;
  civitai?: CivitaiModel;
  downloadLink?: string;
}

// Verify responses

export interface VerifyHFRepoResponse {
  exists: boolean;
}

export interface VerifyCivitAIResponse {
  exists: boolean;
  title?: string;
  preview_url?: string;
  filename?: string;
  model_id?: string; // For Civitai
  version_id?: string; // For Civitai
}
