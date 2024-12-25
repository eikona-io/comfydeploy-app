import { useEffect } from "react";

type KeyboardShortcutOptions = {
  exactPath?: string; // Only trigger on exact path match
  disabled?: boolean; // Disable the shortcut
  preventDefault?: boolean; // Prevent default browser behavior
};

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: KeyboardShortcutOptions = {},
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Skip if shortcut is disabled
      if (options.disabled) return;

      // Skip if path doesn't match (when exactPath is specified)
      if (options.exactPath && window.location.pathname !== options.exactPath)
        return;

      // Skip if typing in input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;

      // Skip if modifier keys are pressed
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === key) {
        if (options.preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [key, callback, options]);
}
