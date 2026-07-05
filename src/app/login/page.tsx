"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Lithium313$") {
      document.cookie = "auth=ok; path=/; max-age=31536000; SameSite=Lax";
      router.push("/");
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => { setError(false); setShake(false); }, 600);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7] dark:bg-[#000] px-4">
      <form onSubmit={handleSubmit} className={`w-full max-w-[280px] ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#5AC8FA] to-[#007AFF] mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-[22px] font-semibold text-[#000] dark:text-white">
            Finance
          </h1>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoFocus
            className={`w-full rounded-2xl bg-white/80 backdrop-blur-sm px-4 py-3.5 text-center text-[17px] text-[#000] outline-none placeholder:text-[#C7C7CC] dark:bg-[#1C1C1E]/80 dark:text-white ${
              error ? "ring-2 ring-[#FF3B30]" : "focus:ring-2 focus:ring-[#007AFF]/40"
            }`}
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#007AFF] py-3.5 text-[17px] font-semibold text-white active:opacity-80 transition-opacity"
          >
            Desbloquear
          </button>
        </div>

        {error && (
          <p className="mt-3 text-[13px] text-[#FF3B30] text-center">
            Senha incorreta
          </p>
        )}
      </form>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
