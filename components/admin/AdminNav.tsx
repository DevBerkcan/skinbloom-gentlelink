// components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Clock, BarChart3, Ban, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function AdminNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/today", label: "Heute", icon: Clock },
    { href: "/admin/bookings", label: "Buchungen", icon: Calendar },
    { href: "/admin/blocked-slots", label: "Abwesenheiten", icon: Ban },
    { href: "/admin/tracking", label: "Tracking", icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    window.location.href = "/admin/login";
  };

  return (
    <nav className="bg-[#1E1E1E] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - immer sichtbar */}
          <Link href="/admin/dashboard" className="text-xl font-bold text-white truncate max-w-[180px] sm:max-w-none">
            Skinbloom Aesthetics
          </Link>

          {/* Desktop Navigation - versteckt auf Mobile */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-[#E8C7C3] text-white"
                        : "text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white rounded-lg transition-colors whitespace-nowrap"
            >
              <LogOut size={18} />
              <span className="text-sm">Abmelden</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleLogout}
              className="p-2 text-[#8A8A8A] hover:bg-[#4C4C4C] rounded-lg transition-colors"
              aria-label="Abmelden"
            >
              <LogOut size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#8A8A8A] hover:bg-[#4C4C4C] rounded-lg transition-colors"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#4C4C4C]">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#E8C7C3] text-white"
                        : "text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}