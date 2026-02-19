// components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Clock, BarChart3, Ban, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function AdminNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/calendar", label: "Kalender", icon: Calendar },
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
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <Image
                src="/icon.png"
                alt="Skinbloom"
                fill
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                className="rounded-lg object-contain brightness-0 invert"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:block text-base md:text-lg font-semibold text-[#ffff] leading-tight">
                Skinbloom Aesthetics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-[#017172] text-white"
                        : "text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white rounded-lg transition-colors whitespace-nowrap"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Abmelden</span>
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleLogout}
              className="p-2.5 text-[#8A8A8A] hover:bg-[#4C4C4C] rounded-lg transition-colors"
              aria-label="Abmelden"
            >
              <LogOut size={22} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-[#8A8A8A] hover:bg-[#4C4C4C] rounded-lg transition-colors"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#4C4C4C]">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#017172] text-white"
                        : "text-[#8A8A8A] hover:bg-[#4C4C4C] hover:text-white"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-base font-medium">{item.label}</span>
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