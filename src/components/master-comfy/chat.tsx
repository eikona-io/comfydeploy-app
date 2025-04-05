import { useState, useRef, useEffect } from "react";
import {
  Send,
  Image,
  Globe,
  Terminal,
  Code,
  HelpCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkflowStore } from "../workspace/Workspace";
import ReactMarkdown from "react-markdown";
import { sendEventToCD } from "../workspace/sendEventToCD";
import React from "react";
import { useWorkflowIdInSessionView } from "@/hooks/hook";
import { useOrganizationList } from "@clerk/clerk-react";

// Add the suggestion type
interface Suggestion {
  icon: React.ReactNode;
  text: string;
  prompt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  chunks?: string[]; // Store chunks for animation
}

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

const NodeLink = React.memo(
  ({ nodeId, posX, posY }: { nodeId: string; posX: string; posY: string }) => {
    return (
      <Button
        variant="gooeyLeft"
        size="xs"
        className="mx-0.5 mb-0 rounded-[8px]"
        onClick={(e) => {
          e.preventDefault();
          sendEventToCD("zoom_to_node", {
            nodeId,
            position: [Number.parseFloat(posX), Number.parseFloat(posY)],
          });
        }}
      >
        <Search className="mr-1 h-[12px] w-[12px]" />
        node {nodeId}
      </Button>
    );
  },
);

// Memoize the link component renderer
const LinkRenderer = React.memo(
  ({ href, children }: { href: string; children: React.ReactNode }) => {
    // Check if this is our special node link
    if (href?.startsWith("https://node:")) {
      const [_, __, nodeId, posX, posY] = href.split(":");
      return <NodeLink nodeId={nodeId} posX={posX} posY={posY} />;
    }

    // Regular link handling
    return <a href={href}>{children}</a>;
  },
);

// Memoize the entire MarkdownRenderer component
const MarkdownRenderer = React.memo(function MarkdownRenderer({
  markdown,
  className,
}: MarkdownRendererProps) {
  // Parse the markdown for node references before passing to ReactMarkdown
  const processedMarkdown = React.useMemo(() => {
    if (!markdown) return "";

    // Replace the special node syntax with an actual link format
    // that ReactMarkdown will parse as a proper link
    return markdown.replace(
      /`?\[\[node:(\d+):([-\d.]+),([-\d.]+)\]\]`?/g,
      (_, nodeId, posX, posY) => {
        return `[node-${nodeId}](https://node:${nodeId}:${posX}:${posY})`;
      },
    );
  }, [markdown]);

  return (
    <div
      className={cn("prose dark:prose-invert prose-sm max-w-none", className)}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-semibold text-lg">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-semibold text-base">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-semibold text-sm">{children}</h3>
          ),
          // Use the memoized link component
          a: LinkRenderer,
          code: ({ children }) => (
            <code className="whitespace-pre-wrap break-words">{children}</code>
          ),
          // Add custom styling for list items
          ul: ({ children }) => <ul className="my-2 pl-4">{children}</ul>,
          li: ({ children }) => <li className="my-1 pl-1">{children}</li>,
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
});

// Define default suggestions
const suggestions: Suggestion[] = [
  {
    icon: <Image className="h-4 w-4" />,
    text: "Image generation",
    prompt: "How do I generate a portrait image in ComfyUI?",
  },
  {
    icon: <Globe className="h-4 w-4" />,
    text: "Search online",
    prompt: "Can ComfyUI search images from the web?",
  },
  {
    icon: <Terminal className="h-4 w-4" />,
    text: "Workflow tips",
    prompt: "Give me tips for creating efficient ComfyUI workflows",
  },
  {
    icon: <Code className="h-4 w-4" />,
    text: "Custom nodes",
    prompt: "How do I create custom nodes in ComfyUI?",
  },
  {
    icon: <HelpCircle className="h-4 w-4" />,
    text: "Help",
    prompt: "What are the basic concepts I should know about ComfyUI?",
  },
];

const generateSessionId = () => crypto.randomUUID();

export function Chat() {
  // ========== for testing ==========
  const isLocalEnvironment = process.env.NODE_ENV === "development";
  if (!isLocalEnvironment) {
    return null;
  }
  // ========== end of testing ==========

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fetchToken = useAuthStore((state) => state.fetchToken);

  // Use useRef to keep the same ID across renders
  const chatSessionIdRef = useRef<string>(generateSessionId());

  // get workflow
  const { workflow } = useWorkflowStore();

  // Handle suggestion click
  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  };

  // Auto-scroll to bottom when messages change but ignore linting warning
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    // Save input before clearing it
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Get auth token
      const token = await fetchToken();

      // Add an empty assistant message that we'll update
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", chunks: [] },
      ]);
      const assistantMessageIdx = messages.length + 1; // +1 because we just added the user message

      // Make a POST request to the API
      const apiUrl = `${process.env.NEXT_PUBLIC_CD_API_URL}/api/ai`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userInput,
          // is_testing: true,
          chat_session_id: chatSessionIdRef.current,
          ...(workflow ? { workflow_json: JSON.stringify(workflow) } : {}),
          // machine_id: "fcde86e9-c37f-4b2b-9aa3-d0084894dfcf",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Process streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let assistantResponse = "";
        const chunks: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Decode the chunk and parse event data
          const chunk = decoder.decode(value);
          const events = chunk.split("\n\n").filter((line) => line.trim());

          for (const event of events) {
            if (event.startsWith("data: ")) {
              try {
                const data = JSON.parse(event.slice(6)); // Remove "data: " prefix

                if (data.done) {
                  // Just mark as done, don't update the message with empty content
                  break;
                }

                if (data.text) {
                  chunks.push(data.text);
                  assistantResponse += data.text;
                  // Update the assistant message
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    if (assistantMessageIdx < newMessages.length) {
                      newMessages[assistantMessageIdx] = {
                        role: "assistant",
                        content: assistantResponse,
                        chunks: [...chunks], // Store all chunks
                      };
                    }
                    return newMessages;
                  });
                }
              } catch (error) {
                console.error("Error parsing SSE data:", error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        // Replace the last message with an error message
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong.",
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <h3 className="font-medium">Master Comfy</h3>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-6">
            <div className="my-12 text-center text-muted-foreground text-sm">
              Ask a question about ComfyUI
            </div>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {messages.map((message, i) => (
                <motion.div
                  key={`msg-${i}-${message.role}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  {message.role === "user" ? (
                    <motion.div
                      className={cn(
                        "my-1 max-w-[80%] break-words rounded-lg rounded-tr-none bg-gradient-to-br from-primary to-zinc-700 px-4 py-2 text-primary-foreground text-sm",
                      )}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {message.content}
                    </motion.div>
                  ) : (
                    <motion.div className={cn("rounded-lg px-4 py-2 pl-0")}>
                      <MarkdownRenderer
                        markdown={message.content}
                        className="text-sm"
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Show pulsing image during loading */}
            <motion.div
              className="flex items-end justify-between"
              layout
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
              }}
            >
              <motion.img
                src="/icon-light.svg"
                alt="comfydeploy thinking"
                className="h-7 w-7"
                animate={
                  isLoading
                    ? {
                        opacity: [0.4, 1, 0.4],
                        scale: [0.97, 1.03, 0.97],
                      }
                    : {
                        opacity: 1,
                        scale: 1,
                      }
                }
                transition={{
                  duration: 1.5,
                  repeat: isLoading ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                  repeatType: "loop",
                }}
              />

              {/* Disclaimer after generation is complete */}
              {messages.length > 0 && !isLoading && (
                <motion.div
                  className="self-end text-[10px] text-muted-foreground"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  Results may not be accurate. Please use with caution.
                </motion.div>
              )}
            </motion.div>

            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input form with suggestions above it */}
      <div className="border-t">
        {/* Suggestion bubbles - only show when no messages or explicitly wanted */}
        {messages.length === 0 && (
          <div className="relative mx-2 my-2">
            <ScrollArea>
              <AnimatePresence>
                <div className="flex flex-row items-center">
                  {suggestions.map((suggestion, i) => (
                    <motion.button
                      key={`suggestion-${i}`}
                      className="mx-1 flex flex-shrink-0 items-center gap-1.5 rounded-full border bg-muted px-2.5 py-1 text-xs transition-colors first:ml-0 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSuggestionClick(suggestion.prompt)}
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: i * 0.05,
                        ease: "easeOut",
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {suggestion.icon}
                      <span>{suggestion.text}</span>
                    </motion.button>
                  ))}
                </div>
              </AnimatePresence>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-3 px-1"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ComfyUI..."
            className="min-h-[30px] flex-1 resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
