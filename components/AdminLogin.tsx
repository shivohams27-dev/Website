"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "./Toast";

export function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [retryMessage, setRetryMessage] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast("Admin access granted", "success");
        onLoginSuccess();
      } else if (res.status === 429) {
        const data = await res.json();
        setRateLimited(true);
        setRetryMessage(data.error);
      } else {
        toast("Invalid password", "error");
      }
    } catch {
      toast("Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md">
        <h2 className="font-syne text-2xl text-text-primary mb-2 text-center">Towerhall</h2>
        <p className="font-dm text-text-muted text-sm text-center mb-8">Enter the master key to access the control panel.</p>

        {rateLimited ? (
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-red-400 font-dm text-sm">{retryMessage}</p>
            </div>
            <p className="text-text-muted font-dm text-xs">This IP has been temporarily blocked due to too many failed attempts.</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter admin key..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="bg-[#111] border border-border rounded-lg px-4 py-3 font-jetbrains text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="bg-accent text-[#0a0a0a] font-dm font-semibold px-4 py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 flex justify-center items-center h-12"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Panel"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
