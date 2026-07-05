"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { buildFinancialContext } from "@/lib/build-context";
import { Send, Loader2, Mic, MicOff, Trash2, Plus } from "lucide-react";
import Image from "next/image";

function parseMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function playDropSound() {
  try {
    const audio = new Audio("/notification.mp3");
    audio.volume = 1.0;
    audio.play().catch(() => {});
  } catch {}
}

interface Message {
  role: "user" | "ai";
  text: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("thomas-sessions") || "[]");
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem("thomas-sessions", JSON.stringify(sessions));
}

export default function ThomasPage() {
  const financialData = useFinancialData();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);
    if (loaded.length > 0) setActiveId(loaded[0].id);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, activeId]);

  const context = buildFinancialContext({
    settings: financialData.settings,
    transactions: financialData.transactions,
    categoryBudgets: financialData.categoryBudgets,
    accounts: financialData.accounts,
    currentContribution: financialData.currentContribution,
    currentAccumulated: financialData.currentAccumulated,
    goalProgress: financialData.goalProgress,
    currentSurplus: financialData.currentSurplus,
    selectedMonth: financialData.selectedMonth,
  });

  const activeSession = sessions.find((s) => s.id === activeId);

  const newSession = useCallback(() => {
    const session: ChatSession = {
      id: `s${Date.now()}`,
      title: "Nova conversa",
      messages: [],
      createdAt: Date.now(),
    };
    const updated = [session, ...sessions];
    setSessions(updated);
    saveSessions(updated);
    setActiveId(session.id);
  }, [sessions]);

  const deleteSession = useCallback(
    (id: string) => {
      const updated = sessions.filter((s) => s.id !== id);
      setSessions(updated);
      saveSessions(updated);
      if (activeId === id) setActiveId(updated[0]?.id || null);
    },
    [sessions, activeId]
  );

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");

    let sid = activeId;
    let currentSessions = [...sessions];

    if (!sid) {
      const session: ChatSession = {
        id: `s${Date.now()}`,
        title: userMsg.substring(0, 40),
        messages: [],
        createdAt: Date.now(),
      };
      currentSessions = [session, ...currentSessions];
      sid = session.id;
      setActiveId(sid);
    }

    // Add user message
    currentSessions = currentSessions.map((s) =>
      s.id === sid
        ? {
            ...s,
            title:
              s.messages.length === 0
                ? userMsg.substring(0, 40)
                : s.title,
            messages: [
              ...s.messages,
              { role: "user" as const, text: userMsg, timestamp: Date.now() },
            ],
          }
        : s
    );
    setSessions(currentSessions);
    saveSessions(currentSessions);
    setLoading(true);

    try {
      const session = currentSessions.find((s) => s.id === sid);
      const history = (session?.messages || []).slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context, history }),
      });
      const data = await res.json();
      const aiText = data.response || data.error || "Erro";
      playDropSound();

      currentSessions = currentSessions.map((s) =>
        s.id === sid
          ? {
              ...s,
              messages: [
                ...s.messages,
                {
                  role: "ai" as const,
                  text: aiText,
                  timestamp: Date.now(),
                },
              ],
            }
          : s
      );
      setSessions(currentSessions);
      saveSessions(currentSessions);
    } catch {
      currentSessions = currentSessions.map((s) =>
        s.id === sid
          ? {
              ...s,
              messages: [
                ...s.messages,
                {
                  role: "ai" as const,
                  text: "Erro de conexao. Tente novamente.",
                  timestamp: Date.now(),
                },
              ],
            }
          : s
      );
      setSessions(currentSessions);
      saveSessions(currentSessions);
    }
    setLoading(false);
  }, [input, loading, activeId, sessions, context]);

  // Web Speech API
  const toggleMic = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: { results: { 0: { 0: { transcript: string } } } }) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-[calc(100vh-52px)] gap-0 -mx-4 -my-5 sm:-mx-6 lg:-mx-8">
      {/* Sidebar - chat history */}
      <div className="hidden w-[260px] shrink-0 flex-col border-r border-[rgba(60,60,67,0.12)] bg-[#F2F2F7]/50 dark:border-[rgba(84,84,88,0.36)] dark:bg-[#1C1C1E]/50 sm:flex">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-[17px] font-semibold text-[#000] dark:text-white">
            Thomas
          </h2>
          <button
            onClick={newSession}
            className="rounded-full p-1.5 text-[#007AFF] active:bg-[#E5E5EA] dark:active:bg-[#3A3A3C]"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && (
            <p className="px-4 py-8 text-center text-[13px] text-[#8E8E93]">
              Nenhuma conversa
            </p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                s.id === activeId
                  ? "bg-[#007AFF]/10"
                  : "active:bg-[#E5E5EA] dark:active:bg-[#2C2C2E]"
              }`}
            >
              <div className="min-w-0">
                <p
                  className={`text-[15px] truncate ${
                    s.id === activeId
                      ? "font-semibold text-[#007AFF]"
                      : "text-[#000] dark:text-white"
                  }`}
                >
                  {s.title}
                </p>
                <p className="text-[11px] text-[#8E8E93]">
                  {s.messages.length} mensagens
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(s.id);
                }}
                className="rounded-full p-1 text-[#C7C7CC] opacity-0 group-hover:opacity-100 active:text-[#FF3B30]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col bg-white dark:bg-[#000]">
        {/* Chat header */}
        <div className="flex items-center justify-center border-b border-[rgba(60,60,67,0.12)] px-4 py-3 dark:border-[rgba(84,84,88,0.36)]">
          <div className="text-center">
            <Image src="/thomas.png" alt="Thomas" width={40} height={40} className="mx-auto mb-1 rounded-full bg-white" />
            <p className="text-[13px] font-semibold text-[#000] dark:text-white">
              Thomas
            </p>
            <p className="text-[11px] text-[#8E8E93]">
              Assistente Financeiro
            </p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {(!activeSession || activeSession.messages.length === 0) && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center max-w-[280px]">
                <Image src="/thomas.png" alt="Thomas" width={64} height={64} className="mx-auto mb-4 rounded-full bg-white" />
                <p className="text-[20px] font-semibold text-[#000] dark:text-white">
                  Oi! Sou o Thomas.
                </p>
                <p className="mt-1 text-[15px] text-[#8E8E93]">
                  Seu assistente financeiro com acesso aos seus dados em tempo
                  real.
                </p>
                <div className="mt-5 space-y-2">
                  {[
                    "Posso gastar R$ 200 hoje?",
                    "Quanto falta pro carro?",
                    "Meu aporte ta saudavel?",
                    "Resume meu mês",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="block w-full rounded-2xl bg-[#F2F2F7] px-4 py-2.5 text-left text-[15px] text-[#007AFF] active:bg-[#E5E5EA] dark:bg-[#1C1C1E] dark:active:bg-[#2C2C2E]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSession?.messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[75%]">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#007AFF] text-white rounded-br-md"
                      : "bg-[#E9E9EB] text-[#000] dark:bg-[#262628] dark:text-white rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.role === "ai" ? parseMarkdown(msg.text) : msg.text}</p>
                </div>
                <p
                  className={`mt-0.5 text-[11px] text-[#8E8E93] ${msg.role === "user" ? "text-right" : "text-left"}`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-2 flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-[#E9E9EB] px-4 py-3 dark:bg-[#262628]">
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#8E8E93] [animation-delay:0ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#8E8E93] [animation-delay:150ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-[#8E8E93] [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[rgba(60,60,67,0.12)] bg-[#F2F2F7] px-4 py-3 dark:border-[rgba(84,84,88,0.36)] dark:bg-[#1C1C1E]">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMic}
              className={`shrink-0 rounded-full p-2.5 transition-colors ${
                listening
                  ? "bg-[#FF3B30] text-white"
                  : "text-[#8E8E93] active:bg-[#E5E5EA] dark:active:bg-[#2C2C2E]"
              }`}
            >
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={
                listening ? "Ouvindo..." : "Pergunte ao Thomas..."
              }
              className="flex-1 rounded-full bg-white px-4 py-2.5 text-[15px] text-[#000] outline-none placeholder:text-[#C7C7CC] dark:bg-[#2C2C2E] dark:text-white"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#007AFF] text-white disabled:opacity-30"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
