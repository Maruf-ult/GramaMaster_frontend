import { ChatMessageRequest } from "@/types/chats";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export function MessageBubble({ msg }: { msg: ChatMessageRequest }) {
  const isBot = msg.sender === "AI" || msg.sender === "Bot";
  return (
    <div className={cn(
      "flex items-end gap-2.5",
      isBot ? "flex-row" : "flex-row-reverse"
    )}>

      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5",
        isBot
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      )}>
        {isBot
          ? <Bot className="w-3.5 h-3.5" />
          : <User className="w-3.5 h-3.5" />
        }
      </div>

      <div className={cn(
        "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
        isBot
          ? "bg-card border border-border rounded-bl-sm text-foreground"
          : "bg-primary text-primary-foreground rounded-br-sm"
      )}>
        {msg.message}
        <div className={cn(
          "text-[10px] mt-1",
          isBot ? "text-muted-foreground" : "text-primary-foreground/70"
        )}>
          {new Date(msg.createdAt).toLocaleTimeString("en-BD", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}