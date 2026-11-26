"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send, Loader2, Bot, User, MessageSquare } from "lucide-react";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type {
  ChatHistoryRequest,
  ChatMessageRequest,
  ChatResponseRequest,
} from "@/types/chats";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/components/cards/MessageBubble";
import { TypingIndicator } from "@/components/cards/TypingIndicator";


const SUGGESTIONS = [
  "Explain Narration rules with examples",
  "Difference between Gerund and Participle?",
  "Give me 5 Right Form of Verbs tips",
  "How do Modifiers work in HSC grammar?",
];

export default function ChatbotPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessageRequest[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await apiClient<ApiResponse<ChatHistoryRequest>>(
          apiEndpoints.chat.history
        );
        if (res.success && res.data) {
          setSessionId(res.data.sessionId);
          setMessages(res.data.messagees ?? []);
        } else {

          setSessionId(crypto.randomUUID());
        }
      } catch {
        setSessionId(crypto.randomUUID());
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessageRequest = {
      sender: "User",
      message: trimmed,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    try {
      const res = await apiClient<ApiResponse<ChatResponseRequest>>(
        apiEndpoints.chat.message,
        {
          method: "POST",
          body: JSON.stringify({ sessionId, message: trimmed }),
        }
      );
      if (res.success && res.data) {

        if (res.data.sessionId) setSessionId(res.data.sessionId);
        const botMsg: ChatMessageRequest = {
          sender: "AI",
          message: res.data.response,
          createdAt: res.data.createdAt ?? new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        toast.error(res.message || "No response from AI.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message.");

      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };
  const isEmpty = messages.length === 0 && !historyLoading;
  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-3xl mx-auto">

      <div className="shrink-0 pb-3 border-b border-border flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold">GramaMaster AI</h1>
          <p className="text-xs text-muted-foreground">
            Your personal English grammar tutor
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Online
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {historyLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Ask me anything about grammar!</p>
              <p className="text-sm text-muted-foreground mt-1">
                I can explain rules, correct your sentences, and help you practice.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {sending && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 pt-3 border-t border-border">
        <div className="flex items-end gap-2 bg-card border border-border rounded-2xl px-4 py-2.5">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a grammar question... (Enter to send)"
            rows={1}
            disabled={sending}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-32 leading-relaxed py-0.5"
            style={{ field_sizing: "content" } as React.CSSProperties}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0",
              input.trim() && !sending
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {sending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
          Shift + Enter for new line · Enter to send
        </p>
      </div>
    </div>
  );
}
