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
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    const authenticated = localStorage.getItem("admin_authenticated") === "true";

    if (!authenticated) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-barber-red" />
      </div>
    );
  }

  // Don't show nav on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show protected content with navigation
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
