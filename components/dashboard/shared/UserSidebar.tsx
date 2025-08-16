"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Calendar, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/shared/Logo";

export default function UserSidebar() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "categories",
      label: "Categories",
      icon: LayoutDashboard,
      href: "/dashboard/categories",
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: Calendar,
      href: "/dashboard/expenses",
    },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-lg border border-slate-300"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky lg:top-0 inset-y-0 min-h-screen left-0 z-50 w-48 bg-white border-r border-slate-300 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col min-h-screen justify-between">
          {/* Header */}
          <div className="px-6 py-4 border-slate-300">
            <Logo />
          </div>

          {/* Navigation */}
          <nav className="flex-1 h-full p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                        isActive
                          ? "border border-indigo-200 bg-indigo-50 text-indigo-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <button
                onClick={handleLogout}
                className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
              >
                <LogOut size={14} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
