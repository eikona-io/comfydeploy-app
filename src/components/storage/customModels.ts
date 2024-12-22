// IsValidFolderPath ensures that the path is a valid.
// Example of not valid paths:
// - /path
// - path//invalid
export function IsValidFolderPath(path: string): boolean {
  if (path.startsWith("/") || path.includes("//")) {
    return false;
  }
  return true;
}
// IsValidFolderPathError is the error message displayed when the folder path is invalid
export const IsValidFolderPathError =
  "Invalid Path: Cannot start with '/' or contain '//'";

// CustomModelFilenameRegex is the regex used to validate the filename of a model
export const CustomModelFilenameRegex = /^$|^[0-9a-zA-Z-._]+$/;

// InvalidFilenameError is the error message displayed when the filename is invalid
export const CustomModelFilenameError =
  "Invalid Filename: Use only letters, numbers, -, _, or .";
