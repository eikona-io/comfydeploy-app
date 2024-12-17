import { CopyButton } from "../ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { StringLiteralUnion } from "shiki";
import { getHighlighter } from "shiki";

export async function CodeBlockServer(props: {
  code: string;
  lang: StringLiteralUnion<string>;
  className?: string;
  wrap?: boolean;
}) {
  const highlighter = await getHighlighter({
    themes: ["min-light"],
    langs: [props.lang],
  });

  return (
    <ScrollArea
      className={cn(
        `rounded-lg relative w-full text-sm group transition-height`,
        props.className,
      )}
    >
      <p
        className={`[&>pre]:p-4 rounded-lg max-h-96 overflow-visible min-w-full w-fit ${props.wrap ? "[&>pre>code>span]:text-wrap" : ""}`}
        style={{
          overflowWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{
          __html: highlighter.codeToHtml(props.code.trim(), {
            lang: props.lang,
            theme: "min-light",
          }),
        }}
      />
      <CopyButton
        className="transition-opacity opacity-0 group-hover:opacity-100 absolute p-2 text-xs min-h-0 h-fit right-2 top-2"
        text={props.code}
      />
    </ScrollArea>
  );
}
