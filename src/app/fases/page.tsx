"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { Task, TaskStatus } from "@/types";
import { 
  Plus, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Timer,
  FileText
} from "lucide-react";
import Link from "next/link";

interface ColumnDef {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: ColumnDef[] = [
  { id: "todo", title: "A FAZER", color: "#64748B" },
  { id: "in_progress", title: "EM PROCESSO", color: "#3B82F6" },
  { id: "review", title: "REVISÃO", color: "#F59E0B" },
  { id: "done", title: "FINALIZADO", color: "#10B981" },
];

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function FasesPage() {
  const { tasks, moveTaskStatus, setActiveTaskId } = useApp();
  const [mobileActiveCol, setMobileActiveCol] = useState<TaskStatus>("todo");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === "todo") return "in_progress";
    if (current === "in_progress") return "review";
    if (current === "review") return "done";
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === "done") return "review";
    if (current === "review") return "in_progress";
    if (current === "in_progress") return "todo";
    return null;
  };

  return (
    <AppShell title="Fases">
      <div className="h-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
        {/* Mobile Column Selector Tabs */}
        <div className="flex md:hidden items-center gap-1.5 p-1 bg-[#1A1B20] border border-[#2B2D37] rounded-xl mb-4 overflow-x-auto">
          {columns.map((col) => {
            const count = tasks.filter((t) => t.status === col.id).length;
            const isCurrent = mobileActiveCol === col.id;

            return (
              <button
                key={col.id}
                onClick={() => setMobileActiveCol(col.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? "bg-[#282B36] text-white border border-[#3E4252] shadow-sm"
                    : "text-[#858C9E] hover:text-white"
                }`}
              >
                <span>{col.title}</span>
                <span
                  className="px-1.5 py-0.2 rounded-full text-[10px]"
                  style={{
                    backgroundColor: isCurrent ? col.color : "#272932",
                    color: isCurrent ? "#fff" : "#98A0B2",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Kanban Board Columns Container */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 h-full overflow-hidden">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            const isHiddenOnMobile = mobileActiveCol !== col.id;

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex flex-col bg-[#1A1B20] border border-[#2B2D37] rounded-2xl overflow-hidden shadow-xl ${
                  isHiddenOnMobile ? "hidden md:flex" : "flex"
                }`}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-[#2B2D37] bg-[#1F2026] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <h3 className="text-xs md:text-sm font-bold text-white tracking-wider uppercase">
                      {col.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#272932] text-[#8E94A4]">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards Drop Area */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#15161A]/50">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#292B35] rounded-xl text-center text-[#686E7E] text-xs">
                      <span>Nenhuma tarefa aqui</span>
                      <span className="text-[10px] mt-0.5">Arraste um card para esta fase</span>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const nextStatus = getNextStatus(task.status);
                      const prevStatus = getPrevStatus(task.status);

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          className="p-3.5 rounded-xl bg-[#1E2027] border border-[#2C2F3A] hover:border-[#3D4252] shadow-md transition-all cursor-grab active:cursor-grabbing hover:scale-[1.01] group"
                        >
                          {/* Card Top: Gradient stripe & priority */}
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="h-1.5 w-12 rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${task.colorStart}, ${task.colorEnd})`,
                              }}
                            />
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                task.priority === "high"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : task.priority === "medium"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                            </span>
                          </div>

                          {/* Card Title & Desc */}
                          <h4 className="text-sm font-semibold text-white group-hover:text-[#FF5E1A] transition-colors leading-snug">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-xs text-[#8A90A0] mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Card Meta: Dates & Time */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#292B36] text-[11px] text-[#717787]">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{task.startDate.slice(5)} ~ {task.endDate.slice(5)}</span>
                            </div>

                            <div className="flex items-center gap-1 font-mono text-[#A2A8B8]">
                              <Clock className="w-3.5 h-3.5 text-[#FF5E1A]" />
                              <span>{formatDuration(task.timeSpentSeconds)}</span>
                            </div>
                          </div>

                          {/* Quick Step Buttons */}
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#262832]">
                            <div className="flex items-center gap-1">
                              <Link
                                href="/detalhamento"
                                onClick={() => setActiveTaskId(task.id)}
                                className="p-1 rounded text-[#808696] hover:text-white hover:bg-[#2A2D38] transition-colors"
                                title="Abrir Anotações"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </Link>
                              <Link
                                href="/cronometro"
                                onClick={() => setActiveTaskId(task.id)}
                                className="p-1 rounded text-[#808696] hover:text-[#FF5E1A] hover:bg-[#2A2D38] transition-colors"
                                title="Iniciar Cronômetro"
                              >
                                <Timer className="w-3.5 h-3.5" />
                              </Link>
                            </div>

                            <div className="flex items-center gap-1">
                              {prevStatus && (
                                <button
                                  onClick={() => moveTaskStatus(task.id, prevStatus)}
                                  className="p-1 rounded text-[#808696] hover:text-white hover:bg-[#2A2D38] transition-colors"
                                  title="Voltar fase"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {nextStatus && (
                                <button
                                  onClick={() => moveTaskStatus(task.id, nextStatus)}
                                  className="p-1 rounded bg-[#FF5E1A]/10 text-[#FF5E1A] hover:bg-[#FF5E1A] hover:text-white transition-colors"
                                  title="Avançar fase"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
