"use client";

import React, { useState } from "react";
import { X, Calendar as CalendarIcon, Palette } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TaskPriority, TaskStatus } from "@/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorPresets = [
  { start: "#FF5E1A", end: "#FFA24C", label: "Laranja Ponto" },
  { start: "#3B82F6", end: "#8B5CF6", label: "Azul Púrpura" },
  { start: "#10B981", end: "#06B6D4", label: "Esmeralda Ciano" },
  { start: "#EC4899", end: "#F43F5E", label: "Rosa Rubi" },
  { start: "#8B5CF6", end: "#EC4899", label: "Violeta Neon" },
  { start: "#F59E0B", end: "#EF4444", label: "Âmbar Coral" },
];

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { addTask } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("2026-11-13");
  const [endDate, setEndDate] = useState("2026-11-13");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [colorStart, setColorStart] = useState(colorPresets[0].start);
  const [colorEnd, setColorEnd] = useState(colorPresets[0].end);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      priority,
      status,
      colorStart,
      colorEnd,
      notes: "",
    });

    // Reset and close
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1E2027] border border-[#2F323D] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2B2E38]">
          <h2 className="text-lg font-semibold text-white">Criar Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C93A4] hover:text-white hover:bg-[#2B2E38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9DA4B5] mb-1.5">
              Título da Tarefa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Desenvolver fluxo de checkout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#141519] border border-[#2F333E] rounded-xl text-white placeholder-[#5E6475] focus:outline-hidden focus:border-[#FF5E1A] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9DA4B5] mb-1.5">
              Descrição
            </label>
            <textarea
              rows={2}
              placeholder="Breve descrição dos objetivos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#141519] border border-[#2F333E] rounded-xl text-white placeholder-[#5E6475] focus:outline-hidden focus:border-[#FF5E1A] text-sm resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9DA4B5] mb-1.5">
                Data de Início
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate < e.target.value) setEndDate(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-[#141519] border border-[#2F333E] rounded-xl text-white text-sm focus:outline-hidden focus:border-[#FF5E1A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9DA4B5] mb-1.5">
                Data de Conclusão
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141519] border border-[#2F333E] rounded-xl text-white text-sm focus:outline-hidden focus:border-[#FF5E1A]"
                />
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9DA4B5] mb-1.5">
                Fase Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-[#141519] border border-[#2F333E] rounded-xl text-white text-sm focus:outline-hidden focus:border-[#FF5E1A]"
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Processo</option>
                <option value="review">Revisão</option>
                <option value="done">Finalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9DA4B5] mb-1.5">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-[#141519] border border-[#2F333E] rounded-xl text-white text-sm focus:outline-hidden focus:border-[#FF5E1A]"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          {/* Gradient Color Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9DA4B5] mb-1.5 flex items-center justify-between">
              <span>Gradiente Temporal (Calendário)</span>
              <div
                className="w-16 h-3 rounded-full border border-white/20"
                style={{
                  background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
                }}
              />
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {colorPresets.map((preset, idx) => {
                const isSelected =
                  colorStart === preset.start && colorEnd === preset.end;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setColorStart(preset.start);
                      setColorEnd(preset.end);
                    }}
                    className={`h-9 rounded-xl border-2 transition-all p-0.5 ${
                      isSelected
                        ? "border-white scale-105 shadow-md shadow-black"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2B2E38]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#9BA2B3] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF5E1A] to-[#FF8C38] text-white font-medium text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#FF5E1A]/20"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
