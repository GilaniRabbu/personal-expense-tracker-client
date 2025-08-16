"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const UserTopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header
      ref={menuRef}
      className="w-full fixed z-40 top-0 right-0 border-b border-slate-300 bg-white px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1" />

        {/* Right side - Notifications */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="flex relative items-center gap-3">
            <div
              onClick={toggleMenu}
              className="w-8 group cursor-pointer h-8 bg-slate-300 rounded-full flex items-center justify-center"
            >
              <span className="text-sm font-medium text-slate-700">JD</span>
            </div>
            <div
              className={`absolute right-0 top-12 ${
                isOpen ? "block" : "hidden"
              } transition-all duration-200`}
            >
              <ul className="border border-slate-300 bg-white rounded-b-lg p-4 space-y-2 w-48">
                <li className="cursor-pointer text-sm text-slate-600">
                  <Link href="/categories">Category</Link>
                </li>
                <li className="cursor-pointer text-sm text-slate-600">
                  <Link href="/expenses">Expense</Link>
                </li>
                <li className="cursor-pointer text-sm text-slate-600">
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserTopNavbar;
