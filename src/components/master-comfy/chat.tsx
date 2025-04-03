import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/lib/auth-store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fetchToken = useAuthStore((state) => state.fetchToken);

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
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
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
                  assistantResponse += data.text;
                  // Update the assistant message
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    if (assistantMessageIdx < newMessages.length) {
                      newMessages[assistantMessageIdx] = {
                        role: "assistant",
                        content: assistantResponse,
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
    <div className="border flex h-full flex-col rounded-md shadow-sm">
      <div className="border-b p-3">
        <h3 className="font-medium">ComfyUI Assistant</h3>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="my-12 text-center text-muted-foreground">
            Ask a question about ComfyUI
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={`msg-${i}-${message.role}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary rounded-br-none text-primary-foreground"
                      : "bg-muted rounded-bl-none text-foreground"
                  }`}
                >
                  {message.content ||
                    (isLoading && i === messages.length - 1 && "...")}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t flex gap-2 p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about ComfyUI..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
