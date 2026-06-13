"use client";

import { useState } from "react";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminPanel } from "@/components/AdminPanel";

export default function TowerHallPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      {!isLoggedIn ? (
        <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <AdminPanel onLogout={() => setIsLoggedIn(false)} />
      )}
    </main>
  );
}
