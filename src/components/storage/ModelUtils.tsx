export const UPLOAD_TYPE_DIR_MAP = {
  checkpoint: "checkpoints",
  lora: "loras",
  embedding: "embeddings",
  clip: "clip",
  clip_vision: "clip_vision",
  configs: "configs",
  controlnet: "controlnet",
  upscale_models: "upscale_models",
  vae: "vae",
  unet: "unet",
  ipadapter: "ipadapter",
  gligen: "gligen",
  custom: "custom",
  custom_node: "custom_node",
};

function joinPaths(...parts: string[]): string {
  return parts
    .map((part, i) => {
      if (i === 0) {
        return part.trim().replace(/[\/]+$/, "");
      } else {
        return part.trim().replace(/(^[\/]+|[\/]+$)/g, "");
      }
    })
    .filter((x) => x.length)
    .join("/");
}

export function generateFinalPath(
  model_type?: string | null,
  custom_path?: string,
  filename?: string,
  include_base_path = true,
): string {
  const basePath = include_base_path ? "/comfyui/models" : "";
  let dirPath = basePath;

  if (model_type && model_type !== "custom") {
    dirPath = joinPaths(
      dirPath,
      UPLOAD_TYPE_DIR_MAP[model_type as keyof typeof UPLOAD_TYPE_DIR_MAP],
    );
  }

  if (custom_path && custom_path !== "default") {
    dirPath = joinPaths(dirPath, custom_path);
  }

  if (filename) {
    return joinPaths(dirPath, filename);
  } else {
    return dirPath.endsWith("/") ? dirPath : `${dirPath}/`;
  }
}
