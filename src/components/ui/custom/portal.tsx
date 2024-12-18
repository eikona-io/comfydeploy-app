import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Portal({
  targetId,
  trigger,
  children,
}: {
  targetId: string;
  trigger?: boolean;
  children: React.ReactNode;
}) {
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (trigger) {
      let timeoutId: ReturnType<typeof setTimeout>;
      const intervalId = setInterval(() => {
        const element = document.getElementById(targetId);
        if (element) {
          setRef(element);
          clearInterval(intervalId);
          clearTimeout(timeoutId);
        }
      }, 100); // Poll every 100 milliseconds

      // Set a timeout to stop polling after a certain period (e.g., 5 seconds)
      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        console.warn(
          `Element with id ${targetId} not found within timeout period.`
        );
      }, 1000);

      // Cleanup interval and timeout on component unmount or when trigger changes
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    } else {
      setRef(document.getElementById(targetId));
    }
  }, [trigger, targetId]);

  if (ref) {
    return createPortal(children, ref);
  }

  return <></>;
}
