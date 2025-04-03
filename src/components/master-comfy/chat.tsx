import { useState, useRef, useEffect } from "react";
import { Send, Image, Globe, Terminal, Code, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fetchToken = useAuthStore((state) => state.fetchToken);

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
        body: JSON.stringify({ message: userInput, is_testing: true }),
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
          content: "Sorry, there was an error communicating with the AI.",
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
                        "my-1 max-w-[80%] rounded-lg rounded-tr-none bg-gradient-to-br from-primary to-zinc-700 px-4 py-2 text-primary-foreground text-sm",
                      )}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {message.content}
                    </motion.div>
                  ) : (
                    <motion.div
                      className={cn(
                        "rounded-lg px-4 py-2 pl-0 text-foreground text-sm",
                      )}
                    >
                      {/* For assistant responses, render each chunk with animation */}
                      {message.chunks?.map((chunk, chunkIndex) => (
                        <motion.span
                          key={`chunk-${i}-${chunkIndex}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          {chunk}
                        </motion.span>
                      ))}
                      {/* If no chunks available, show the content directly */}
                      {!message.chunks && message.content}
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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ComfyUI..."
            className="flex-1"
            disabled={isLoading}
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
