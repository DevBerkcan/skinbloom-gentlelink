// components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Clock, BarChart3, Ban, LogOut } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/today", label: "Heute Timeline", icon: Clock },
    { href: "/admin/bookings", label: "Buchungen", icon: Calendar },
    { href: "/admin/blocked-slots", label: "Abwesenheiten", icon: Ban },
    { href: "/admin/tracking", label: "Tracking", icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    window.location.href = "/admin/login";
  };

  return (
    <nav className="bg-[#1E1E1E] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-bold text-white">
              Skinbloom Aesthetics
            </Link>

            <div className="flex gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#E8C7C3] text-white"
                        : "text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Abmelden</span>
          </button>
        </div>
      </div>
    </nav>
  );
}