
import React, { useRef, useState, useEffect } from "react";
import { MessageCircle, UserRound, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { sender: "doctor" | "user"; content: string; timestamp: string };

const INITIAL: Msg[] = [
  { sender: "doctor", content: "Hello, your appointment is on Monday!", timestamp: "09:00" },
  { sender: "user", content: "Thank you!", timestamp: "09:01" },
  { sender: "doctor", content: "Have you received your recent test results?", timestamp: "09:02" },
];

export default function ChatMessages() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[415px] max-w-3xl mx-auto rounded-lg border bg-gradient-to-br from-[#FEC6A1]/60 to-[#D6BCFA]/80 shadow p-2 animate-fade-in">
      <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary to-[#7E69AB] text-white rounded-t-lg">
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold">Doctor Chat</span>
      </div>
      <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-none">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex mb-2 gap-2 animate-scale-in",
              m.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {m.sender === "doctor" && (
              <UserRound className="h-7 w-7 rounded-full bg-primary/10 text-primary shadow" />
            )}
            <div className={cn(
              "rounded-xl px-4 py-2 max-w-[65%] shadow",
              m.sender === "user"
                ? "bg-gradient-to-l from-[#F2FCE2] to-[#D3E4FD] text-gray-800 dark:text-gray-100"
                : "bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-gray-900 dark:text-white animate-pulse"
            )}>
              {m.content}
              <span className={cn(
                "block text-xs opacity-60 mt-1 text-end",
                m.sender === "user" ? "text-gray-500" : "text-gray-700 dark:text-white"
              )}>{m.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="flex items-center gap-3 p-2 bg-background rounded-b-lg"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className="flex-1 px-3 py-2 rounded bg-muted focus:bg-white/90 transition text-sm border focus:outline-primary"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-primary to-[#D946EF] text-white shadow animate-fade-in"
        >
          <SendHorizontal className="h-4 w-4 mr-1" /> Send
        </Button>
      </form>
    </div>
  );
}
