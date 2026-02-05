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

    // Simple authentication - in production, this should be server-side
    // For now, using hardcoded credentials (change these!)
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
    <div className="min-h-screen bg-gradient-to-br from-barber-black via-barber-grey-900 to-barber-black flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-barber-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-barber-black mb-2">
              Admin Login
            </h1>
            <p className="text-barber-grey-600">
              Barber Dario Buchungssystem
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="text"
              label="Benutzername"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              startContent={<User size={18} className="text-barber-grey-400" />}
              isRequired
              classNames={{
                input: "text-barber-black",
                inputWrapper: "bg-white",
              }}
            />

            <Input
              type="password"
              label="Passwort"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock size={18} className="text-barber-grey-400" />}
              isRequired
              classNames={{
                input: "text-barber-black",
                inputWrapper: "bg-white",
              }}
            />

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-barber-red text-white font-semibold"
              size="lg"
              isLoading={loading}
            >
              Anmelden
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-barber-grey-500">
            Standard: admin / barber2025
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
