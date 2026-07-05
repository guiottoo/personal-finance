"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Lithium313$") {
      document.cookie = "auth=ok; path=/; max-age=31536000; SameSite=Lax";
      router.push("/");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7] dark:bg-[#000] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-[320px]">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#000] dark:text-white">
            Finance
          </h1>
          <p className="text-[15px] text-[#8E8E93] mt-1">
            Digite a senha para acessar
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          autoFocus
          className={`w-full rounded-xl bg-white px-4 py-3 text-[17px] text-[#000] outline-none placeholder:text-[#C7C7CC] dark:bg-[#1C1C1E] dark:text-white ${
            error ? "ring-2 ring-[#FF3B30]" : "focus:ring-2 focus:ring-[#007AFF]"
          }`}
        />

        {error && (
          <p className="mt-2 text-[13px] text-[#FF3B30] text-center">
            Senha incorreta
          </p>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-[#007AFF] py-3 text-[17px] font-semibold text-white active:bg-[#0056CC]"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
