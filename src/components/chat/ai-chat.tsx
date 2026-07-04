"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

export function AiChat({ context }: { context: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.response || data.error || "Erro" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Erro de conexão" },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-lg active:bg-[#0062CC] transition-transform hover:scale-105"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col rounded-2xl bg-white shadow-2xl dark:bg-[#1C1C1E] sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(60,60,67,0.12)] px-4 py-3 dark:border-[rgba(84,84,88,0.36)]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#34C759]" />
              <span className="text-[15px] font-semibold text-[#000] dark:text-white">
                Assistente Financeiro
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-[#8E8E93] active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[15px] font-medium text-[#000] dark:text-white">
                  Pergunte sobre suas finanças
                </p>
                <p className="text-[13px] text-[#8E8E93] mt-1">
                  Tenho acesso aos seus dados em tempo real
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    "Posso gastar R$ 200 hoje?",
                    "Quanto vai sobrar esse mês?",
                    "Meu aporte tá bom?",
                    "O orçamento de besteiras vai estourar?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                      }}
                      className="block w-full rounded-xl bg-[#F2F2F7] px-3 py-2 text-left text-[13px] text-[#007AFF] active:bg-[#E5E5EA] dark:bg-[#2C2C2E]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#007AFF] text-white"
                      : "bg-[#F2F2F7] text-[#000] dark:bg-[#2C2C2E] dark:text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-[#F2F2F7] px-3.5 py-2.5 dark:bg-[#2C2C2E]">
                  <Loader2 size={14} className="animate-spin text-[#8E8E93]" />
                  <span className="text-[13px] text-[#8E8E93]">Pensando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[rgba(60,60,67,0.12)] px-3 py-2.5 dark:border-[rgba(84,84,88,0.36)]">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Pergunte algo..."
                className="flex-1 rounded-full bg-[#F2F2F7] px-4 py-2 text-[15px] text-[#000] outline-none placeholder:text-[#C7C7CC] dark:bg-[#2C2C2E] dark:text-white"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#007AFF] text-white disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
