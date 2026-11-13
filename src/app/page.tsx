"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ListTodo
} from "lucide-react";
import Link from "next/link";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO,
  isWithinInterval
} from "date-fns";
import { ptBR } from "date-fns/locale";

const weekDaysFull = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];

const weekDaysShort = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
];

export default function PlanejamentoPage() {
  const { tasks, setActiveTaskId } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 13)); // Current simulated date
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedDay, setSelectedDay] = useState<Date>(new Date(2026, 10, 13));

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Calendar dates generation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Filter tasks for the selected day
  const tasksForSelectedDay = tasks.filter((t) => {
    try {
      const start = parseISO(t.startDate);
      const end = parseISO(t.endDate);
      return isWithinInterval(selectedDay, { start, end }) || isSameDay(selectedDay, start) || isSameDay(selectedDay, end);
    } catch {
      return false;
    }
  });

  return (
    <AppShell
      title="Planejamento"
      headerCenterSlot={
        /* Month Pill Navigator from Prototype */
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-[#8E94A4] hover:text-white hover:bg-[#252832] transition-colors"
              title="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="px-5 py-1.5 rounded-2xl bg-[#23252E] border border-[#333742] text-sm md:text-base font-semibold text-white tracking-wide capitalize shadow-inner">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </div>

            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-[#8E94A4] hover:text-white hover:bg-[#252832] transition-colors"
              title="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      }
      headerRightSlot={
        /* Toggle Switch from Prototype (Month / Week) */
        <div className="flex items-center bg-[#21232B] p-1 rounded-full border border-[#313540]">
          <button
            onClick={() => setViewMode("month")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === "month"
                ? "bg-[#FF5E1A] text-white shadow-sm"
                : "text-[#8E94A4] hover:text-white"
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              viewMode === "week"
                ? "bg-[#FF5E1A] text-white shadow-sm"
                : "text-[#8E94A4] hover:text-white"
            }`}
          >
            Semana
          </button>
        </div>
      }
    >
      <div className="h-full flex flex-col p-3 md:p-6 max-w-7xl mx-auto">
        {/* Calendar Grid Container */}
        <div className="flex-1 flex flex-col bg-[#1A1B20] border border-[#2B2D37] rounded-2xl overflow-hidden shadow-xl">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-[#2B2D37] bg-[#1F2026]">
            {weekDaysFull.map((day, idx) => (
              <div
                key={day}
                className="py-3 text-center text-xs md:text-sm font-semibold uppercase tracking-wider text-[#8A90A0]"
              >
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{weekDaysShort[idx]}</span>
              </div>
            ))}
          </div>

          {/* Days Matrix */}
          <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-[#16171B]">
            {days.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date(2026, 10, 13));
              const isSelected = isSameDay(day, selectedDay);

              // Tasks active on this day
              const dayTasks = tasks.filter((t) => {
                try {
                  const start = parseISO(t.startDate);
                  const end = parseISO(t.endDate);
                  return (
                    isWithinInterval(day, { start, end }) ||
                    isSameDay(day, start) ||
                    isSameDay(day, end)
                  );
                } catch {
                  return false;
                }
              });

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-1.5 md:p-2 border-b border-r border-[#262832] transition-colors cursor-pointer flex flex-col justify-between group ${
                    isCurrentMonth ? "bg-[#1A1B20]/60" : "bg-[#141518]/90 opacity-40"
                  } ${
                    isSelected ? "ring-2 ring-inset ring-[#FF5E1A] bg-[#22242D]" : "hover:bg-[#20222A]"
                  }`}
                >
                  {/* Day Number Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs md:text-sm font-semibold rounded-lg px-1.5 py-0.5 ${
                        isToday
                          ? "bg-[#FF5E1A] text-white shadow-md shadow-[#FF5E1A]/30 font-bold"
                          : isCurrentMonth
                          ? "text-[#C8CDD8]"
                          : "text-[#585E6E]"
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] text-[#868C9D] md:hidden font-mono">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Tasks List inside cell with Gradual Color Transition */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 3).map((task) => {
                      const isStart = isSameDay(day, parseISO(task.startDate));
                      const isEnd = isSameDay(day, parseISO(task.endDate));
                      const isSingleDay = task.startDate === task.endDate;

                      return (
                        <div
                          key={task.id}
                          title={`${task.title} (${task.startDate} até ${task.endDate})`}
                          className={`text-[10px] md:text-xs font-medium px-2 py-0.5 md:py-1 rounded-md truncate text-white shadow-xs transition-transform hover:scale-[1.02] ${
                            isSingleDay
                              ? "rounded-md"
                              : isStart
                              ? "rounded-l-md rounded-r-xs"
                              : isEnd
                              ? "rounded-r-md rounded-l-xs"
                              : "rounded-none"
                          }`}
                          style={{
                            background: `linear-gradient(90deg, ${task.colorStart}, ${task.colorEnd})`,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                          }}
                        >
                          <span className="drop-shadow-xs">{task.title}</span>
                        </div>
                      );
                    })}

                    {dayTasks.length > 3 && (
                      <div className="text-[9px] md:text-[11px] text-[#A0A6B6] font-medium pl-1">
                        +{dayTasks.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Summary Bar */}
        <div className="mt-4 p-4 bg-[#1A1B20] border border-[#2B2D37] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#FF5E1A]" />
              <span>Tarefas em {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}:</span>
            </h3>
            <p className="text-xs text-[#8A90A0] mt-0.5">
              {tasksForSelectedDay.length === 0
                ? "Nenhuma tarefa agendada para este dia."
                : `${tasksForSelectedDay.length} tarefa(s) em andamento.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tasksForSelectedDay.map((t) => (
              <Link
                key={t.id}
                href="/detalhamento"
                onClick={() => setActiveTaskId(t.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#23252E] hover:bg-[#2B2E3A] border border-[#333744] text-xs font-medium text-white transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${t.colorStart}, ${t.colorEnd})`,
                  }}
                />
                <span>{t.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
