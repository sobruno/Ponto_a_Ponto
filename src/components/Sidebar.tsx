"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  FileText, 
  Timer, 
  Kanban, 
  ChevronLeft, 
  X,
  Plus
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewTaskModal?: () => void;
}

const navItems = [
  {
    name: "Planejamento",
    href: "/",
    icon: Calendar,
    description: "Calendário e visão temporal",
  },
  {
    name: "Detalhamento",
    href: "/detalhamento",
    icon: FileText,
    description: "Tarefas e anotações",
  },
  {
    name: "Cronômetro",
    href: "/cronometro",
    icon: Timer,
    description: "Medição de tempo",
  },
  {
    name: "Fases",
    href: "/fases",
    icon: Kanban,
    description: "Quadro Kanban de progresso",
  },
];

export function Sidebar({ isOpen, onClose, onOpenNewTaskModal }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#1A1B20] border-r border-[#2B2D35] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header with Logo */}
        <div className="flex items-center justify-between p-6 border-b border-[#2B2D35]">
          <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-1 border border-[#3A3D48] group-hover:border-[#FF5E1A] transition-colors">
              <Image
                src="/logo/Logo.png"
                alt="Ponto a Ponto Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-[#FF5E1A] transition-colors">
                Ponto a Ponto
              </h1>
              <p className="text-xs text-[#8E94A4]">Organizador Pessoal</p>
            </div>
          </Link>

          {/* Close / Collapse button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9EA3B0] hover:text-white hover:bg-[#282A33] transition-colors"
            title="Recolher menu"
          >
            <ChevronLeft className="w-5 h-5 hidden md:block" />
            <X className="w-5 h-5 md:hidden" />
          </button>
        </div>

        {/* Quick Action Button: Nova Tarefa */}
        {onOpenNewTaskModal && (
          <div className="px-4 pt-4">
            <button
              onClick={() => {
                onOpenNewTaskModal();
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5E1A] to-[#FF8C38] text-white font-medium text-sm shadow-lg shadow-[#FF5E1A]/20 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-[#272932] text-white border-2 border-[#FF5E1A] shadow-md shadow-[#FF5E1A]/10 font-semibold"
                    : "text-[#A1A7B5] hover:text-white hover:bg-[#22242B] border-2 border-transparent"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? "bg-[#FF5E1A] text-white"
                      : "bg-[#24262E] text-[#8E94A4]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-[11px] font-normal text-[#747A8A]">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[#2B2D35] text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#6F7585]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF5E1A]" />
            <span>Ponto a Ponto v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
