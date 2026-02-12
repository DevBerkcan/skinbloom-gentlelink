// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "barber2025";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_authenticated", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Ungültige Anmeldedaten");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1E1E] to-[#2C2C2C] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-2 border-[#E8C7C3]/20 shadow-2xl">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E8C7C3] to-[#D8B0AC] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">
              Admin Login
            </h1>
            <p className="text-[#8A8A8A]">
              Skinbloom Aesthetics Buchungssystem
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="text"
              label="Benutzername"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              startContent={<User size={18} className="text-[#8A8A8A]" />}
              isRequired
              classNames={{
                input: "text-[#1E1E1E]",
                label: "text-[#8A8A8A]",
                inputWrapper: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
              }}
            />

            <Input
              type="password"
              label="Passwort"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock size={18} className="text-[#8A8A8A]" />}
              isRequired
              classNames={{
                input: "text-[#1E1E1E]",
                label: "text-[#8A8A8A]",
                inputWrapper: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
              }}
            />

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold shadow-lg"
              size="lg"
              isLoading={loading}
            >
              Anmelden
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8A8A8A]">
            Standard: admin / barber2025
          </div>
        </CardBody>
      </Card>
    </div>
  );
}