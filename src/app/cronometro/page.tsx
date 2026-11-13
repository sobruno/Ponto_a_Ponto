"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  ChevronDown,
  Timer as TimerIcon,
  Sparkles
} from "lucide-react";

export default function CronometroPage() {
  const { tasks, activeTaskId, setActiveTaskId, addTimeSession } = useApp();

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSaveSession = () => {
    if (!selectedTask || seconds === 0) return;
    setIsRunning(false);
    addTimeSession(selectedTask.id, seconds);
    setSessionNotice(`Salvo ${formatTime(seconds)} na tarefa "${selectedTask.title}"!`);
    setSeconds(0);
    setTimeout(() => setSessionNotice(null), 3000);
  };

  // Format hh:mm:ss
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Circle progress calculation (cycles every 60 minutes)
  const progressPercent = ((seconds % 3600) / 3600) * 100;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <AppShell title="Cronômetro">
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Left Column: Minhas Tarefas (Desktop) */}
        <section className="hidden md:flex md:w-5/12 flex-col bg-[#1A1B20] border border-[#2B2D37] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#2B2D37] bg-[#1F2026] flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Minhas Tarefas
            </h2>
            <span className="text-xs text-[#8A90A0]">Selecione para vincular</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[580px]">
            {tasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    if (isRunning) {
                      if (confirm("Deseja trocar de tarefa enquanto o cronômetro está rodando?")) {
                        setActiveTaskId(task.id);
                      }
                    } else {
                      setActiveTaskId(task.id);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#252731] border-[#FF5E1A] shadow-md shadow-[#FF5E1A]/10 scale-[1.01]"
                      : "bg-[#18191E] border-[#292B34] hover:bg-[#202229] hover:border-[#383C48]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${task.colorStart}, ${task.colorEnd})`,
                      }}
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {task.title}
                      </h4>
                      <p className="text-xs text-[#7A8090]">
                        Total: {Math.floor(task.timeSpentSeconds / 60)} min
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[11px] font-semibold text-[#FF5E1A] bg-[#FF5E1A]/10 px-2 py-0.5 rounded-full border border-[#FF5E1A]/30">
                      Ativa
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Tempo de Trabalho & Circular Stopwatch */}
        <section className="w-full md:w-7/12 flex flex-col bg-[#1A1B20] border border-[#2B2D37] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#2B2D37] bg-[#1F2026] flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Tempo de Trabalho
            </h2>
            {selectedTask && (
              <span className="text-xs text-[#8A90A0] hidden sm:inline">
                {selectedTask.title}
              </span>
            )}
          </div>

          <div className="p-6 flex flex-col items-center justify-center flex-1 space-y-6">
            {/* Mobile Task Selector Dropdown matching prototype */}
            <div className="w-full max-w-sm md:hidden">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#989FA0] mb-1.5">
                Selecionar Tarefa
              </label>
              <div className="relative">
                <select
                  value={selectedTask?.id || ""}
                  onChange={(e) => setActiveTaskId(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-[#16171B] border border-[#2F323D] rounded-xl text-white text-sm focus:outline-hidden focus:border-[#FF5E1A]"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#8A90A0] absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Circular Stopwatch Visual Container */}
            <div className="relative flex items-center justify-center my-4">
              <svg className="w-72 h-72 transform -rotate-90">
                {/* Background Track Circle */}
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  className="stroke-[#22242D]"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Animated Progress Circle */}
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  className="transition-all duration-300 stroke-[#FF5E1A]"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    filter: isRunning
                      ? "drop-shadow(0 0 10px rgba(255, 94, 26, 0.5))"
                      : "none",
                  }}
                />
              </svg>

              {/* Central Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white drop-shadow-md">
                  {formatTime(seconds)}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#8A90A0] mt-2 font-medium">
                  {isRunning ? "Contando..." : seconds > 0 ? "Em pausa" : "Pronto"}
                </span>
                {selectedTask && (
                  <span className="text-xs text-[#FF5E1A] max-w-[180px] truncate mt-1">
                    {selectedTask.title}
                  </span>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
              <button
                onClick={toggleTimer}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 ${
                  isRunning
                    ? "bg-[#D97706] hover:bg-[#B45309] shadow-amber-500/20"
                    : "bg-[#FF5E1A] hover:bg-[#E04F12] shadow-[#FF5E1A]/20"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveSession}
                disabled={seconds === 0}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#272932] hover:bg-[#323540] disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-sm border border-[#373A48] transition-all active:scale-95"
                title="Salvar tempo dedicado na tarefa"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Salvar</span>
              </button>

              <button
                onClick={resetTimer}
                disabled={seconds === 0}
                className="p-3 rounded-xl bg-[#202228] hover:bg-[#282B33] disabled:opacity-40 disabled:pointer-events-none text-[#989FA0] hover:text-white border border-[#2D3039] transition-all"
                title="Zerar cronômetro"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {sessionNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-in fade-in">
                {sessionNotice}
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
