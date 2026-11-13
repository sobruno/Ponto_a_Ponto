"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Trash2, 
  Edit3, 
  Save, 
  Sparkles,
  Timer,
  Tag
} from "lucide-react";
import Link from "next/link";
import { TaskStatus } from "@/types";

const statusLabels: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: "A Fazer", color: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30" },
  in_progress: { label: "Em Processo", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  review: { label: "Revisão", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  done: { label: "Finalizado", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
};

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function DetalhamentoPage() {
  const { tasks, activeTaskId, setActiveTaskId, updateTask, deleteTask } = useApp();

  const selectedTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];
  const [noteContent, setNoteContent] = useState<string>(selectedTask?.notes || "");
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Sync notes when selectedTask changes
  React.useEffect(() => {
    if (selectedTask) {
      setNoteContent(selectedTask.notes || "");
    }
  }, [selectedTask?.id]);

  const handleSaveNotes = () => {
    if (!selectedTask) return;
    updateTask(selectedTask.id, { notes: noteContent });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  return (
    <AppShell title="Detalhamento">
      {/* Decorative Striped Bar matching prototype */}
      <div 
        className="w-full h-2.5 opacity-20 border-b border-[#30333E]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #FF5E1A, #FF5E1A 6px, transparent 6px, transparent 12px)",
        }}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6 h-[calc(100%-10px)] flex flex-col md:flex-row gap-6">
        {/* Left Column: Minhas Tarefas */}
        <section className="w-full md:w-5/12 flex flex-col bg-[#1A1B20] border border-[#2B2D37] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-5 border-b border-[#2B2D37] bg-[#1F2026] flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Minhas Tarefas
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#272932] text-[#8E94A4] font-medium">
              {tasks.length} total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {tasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              const statusInfo = statusLabels[task.status];

              return (
                <div
                  key={task.id}
                  onClick={() => setActiveTaskId(task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? "bg-[#252731] border-[#FF5E1A] shadow-md shadow-[#FF5E1A]/10 scale-[1.01]"
                      : "bg-[#18191E] border-[#292B34] hover:bg-[#202229] hover:border-[#383C48]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{
                          background: `linear-gradient(135deg, ${task.colorStart}, ${task.colorEnd})`,
                        }}
                      />
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {task.title}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-[#8A90A0] line-clamp-2 pl-5">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pl-5 pt-1 text-[11px] text-[#717787] border-t border-[#252832]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{task.startDate} até {task.endDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[#A2A8B8]">
                      <Clock className="w-3.5 h-3.5 text-[#FF5E1A]" />
                      <span>{formatDuration(task.timeSpentSeconds)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Notas */}
        <section className="w-full md:w-7/12 flex flex-col bg-[#1A1B20] border border-[#2B2D37] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 md:p-5 border-b border-[#2B2D37] bg-[#1F2026] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                Notas & Registro
              </h2>
              {selectedTask && (
                <span className="text-xs text-[#8A90A0] hidden sm:inline">
                  — {selectedTask.title}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cronometro"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#272932] hover:bg-[#323540] text-xs font-semibold text-white border border-[#353846] transition-colors"
                title="Cronometrar esta tarefa"
              >
                <Timer className="w-3.5 h-3.5 text-[#FF5E1A]" />
                <span className="hidden sm:inline">Cronometrar</span>
              </Link>

              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF5E1A] hover:bg-[#FF6F30] text-xs font-semibold text-white shadow-md shadow-[#FF5E1A]/20 active:scale-95 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          </div>

          {selectedTask ? (
            <div className="flex-1 flex flex-col p-4 md:p-5 space-y-4">
              {/* Task Meta Bar */}
              <div className="p-3 bg-[#16171B] border border-[#282A33] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#848B9B]">Fase:</span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      updateTask(selectedTask.id, {
                        status: e.target.value as TaskStatus,
                      })
                    }
                    className="bg-[#24262E] border border-[#353846] rounded-lg px-2.5 py-1 text-white text-xs focus:outline-hidden focus:border-[#FF5E1A]"
                  >
                    <option value="todo">A Fazer</option>
                    <option value="in_progress">Em Processo</option>
                    <option value="review">Revisão</option>
                    <option value="done">Finalizado</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#848B9B]">Tempo Acumulado:</span>
                  <span className="font-mono font-semibold text-white bg-[#24262E] px-2.5 py-1 rounded-lg border border-[#353846]">
                    {formatDuration(selectedTask.timeSpentSeconds)}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(selectedTask.id)}
                  className="p-1 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Excluir tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Note Editor Area */}
              <div className="flex-1 flex flex-col relative">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Escreva anotações, checklists, ideias ou detalhes de execução para esta tarefa..."
                  className="w-full flex-1 p-4 bg-[#141519] border border-[#272932] rounded-xl text-white placeholder-[#535868] focus:outline-hidden focus:border-[#FF5E1A] text-sm resize-none font-sans leading-relaxed shadow-inner"
                />

                {isSavedNotice && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-semibold shadow-lg animate-in fade-in">
                    Notas salvas com sucesso!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#747A8A]">
              <p>Nenhuma tarefa selecionada.</p>
              <p className="text-xs mt-1">Selecione uma tarefa na lista ao lado para ver e editar suas anotações.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
