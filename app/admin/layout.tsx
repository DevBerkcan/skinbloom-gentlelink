// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    const authenticated = localStorage.getItem("admin_authenticated") === "true";

    if (!authenticated) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E8C7C3]" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return (
      <>
        <AdminNav />
        {children}
      </>
    );
  }

  return null;
}