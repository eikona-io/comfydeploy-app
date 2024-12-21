import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Brush, Eraser } from "lucide-react";

export function DrawerMenu() {
  function onSelectBrush() {
    const event = new KeyboardEvent("keydown", {
      key: "d",
      code: "KeyD",
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      metaKey: false,
    });

    // Dispatch the event to enable draw mode
    document.dispatchEvent(event);
  }

  function onSelectEraser() {
    const event = new KeyboardEvent("keydown", {
      key: "e",
      code: "KeyE",
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      metaKey: false,
    });

    // Dispatch the event on the document to enable eraser
    document.dispatchEvent(event);
  }

  return (
    <ToggleGroup type="single" defaultValue="brush">
      <ToggleGroupItem
        value="brush"
        aria-label="Toggle brush"
        onClick={onSelectBrush}
      >
        <Brush />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="ereaser"
        aria-label="Toggle ereaser"
        onClick={onSelectEraser}
      >
        <Eraser />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
