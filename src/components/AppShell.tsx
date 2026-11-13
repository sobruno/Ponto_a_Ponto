"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TaskModal } from "./TaskModal";
import { Menu, Plus } from "lucide-react";
import Image from "next/image";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  headerCenterSlot?: React.ReactNode;
  headerRightSlot?: React.ReactNode;
}

export function AppShell({
  children,
  title,
  headerCenterSlot,
  headerRightSlot,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#141519] text-[#E0E3EC] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header Bar matching wireframes */}
        <header className="h-16 shrink-0 px-4 md:px-6 bg-[#1A1B20] border-b border-[#292B33] flex items-center justify-between z-30">
          {/* Left: Hamburger button & optional Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-[#24262E] text-[#9EA4B5] hover:text-white hover:bg-[#2F323D] transition-all"
              aria-label="Abrir Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {title && (
              <h2 className="text-base md:text-lg font-bold tracking-wider uppercase text-white/90">
                {title}
              </h2>
            )}
          </div>

          {/* Center Slot (e.g. Month Navigator in Calendar) */}
          <div className="flex items-center justify-center flex-1 mx-2 md:mx-6 max-w-xl">
            {headerCenterSlot}
          </div>

          {/* Right Slot (e.g. View switcher toggle, New Task button) */}
          <div className="flex items-center gap-2 md:gap-3">
            {headerRightSlot}

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#FF5E1A] hover:bg-[#FF6F30] text-white text-xs font-semibold shadow-md shadow-[#FF5E1A]/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
}
