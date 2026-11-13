"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Task, TaskStatus, TimeSession } from "@/types";

interface AppContextType {
  tasks: Task[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "timeSpentSeconds">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: TaskStatus) => void;
  timeSessions: TimeSession[];
  addTimeSession: (taskId: string, durationSeconds: number) => void;
  activeTask: Task | undefined;
}

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Planejamento Estratégico Q1",
    description: "Definir metas e objetivos para o primeiro trimestre.",
    startDate: "2026-11-09",
    endDate: "2026-11-13",
    status: "in_progress",
    priority: "high",
    colorStart: "#FF5E1A",
    colorEnd: "#FFA24C",
    timeSpentSeconds: 7200,
    notes: "# Planejamento Estratégico\n- Metas definidas para o produto\n- Alinhamento de design e cronograma\n- Pontos de contato semanais",
    createdAt: "2026-11-09T10:00:00.000Z",
    updatedAt: "2026-11-09T10:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Prototipação da Interface",
    description: "Desenvolver wireframes para desktop e mobile.",
    startDate: "2026-11-12",
    endDate: "2026-11-15",
    status: "in_progress",
    priority: "medium",
    colorStart: "#3B82F6",
    colorEnd: "#8B5CF6",
    timeSpentSeconds: 5400,
    notes: "Wireframes validados com base nas 4 visões principais: Calendário, Detalhes, Cronômetro e Fases.",
    createdAt: "2026-11-12T10:00:00.000Z",
    updatedAt: "2026-11-12T10:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Configuração do Banco e Infra",
    description: "Integrar Supabase e modelar tabelas de tarefas e logs de tempo.",
    startDate: "2026-11-16",
    endDate: "2026-11-18",
    status: "todo",
    priority: "high",
    colorStart: "#10B981",
    colorEnd: "#06B6D4",
    timeSpentSeconds: 0,
    notes: "Estruturar tabelas no PostgreSQL com sincronização em tempo real.",
    createdAt: "2026-11-13T10:00:00.000Z",
    updatedAt: "2026-11-13T10:00:00.000Z",
  },
  {
    id: "task-4",
    title: "Revisão de UX e Acessibilidade",
    description: "Avaliar contraste, navegação por teclado e responsividade mobile.",
    startDate: "2026-11-19",
    endDate: "2026-11-20",
    status: "review",
    priority: "low",
    colorStart: "#F59E0B",
    colorEnd: "#EF4444",
    timeSpentSeconds: 1800,
    notes: "Garantir contraste das fontes e facilidade de toque no cronômetro e kanban mobile.",
    createdAt: "2026-11-13T10:00:00.000Z",
    updatedAt: "2026-11-13T10:00:00.000Z",
  },
  {
    id: "task-5",
    title: "Criação da Identidade Visual e Logo",
    description: "Conceito dos pontos laranjas conectados por gradiente.",
    startDate: "2026-11-05",
    endDate: "2026-11-08",
    status: "done",
    priority: "medium",
    colorStart: "#EC4899",
    colorEnd: "#F43F5E",
    timeSpentSeconds: 10800,
    notes: "Logo finalizado nos formatos 32x32 e resolução completa.",
    createdAt: "2026-11-05T10:00:00.000Z",
    updatedAt: "2026-11-08T10:00:00.000Z",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "ponto_a_ponto_data_v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>("task-1");
  const [timeSessions, setTimeSessions] = useState<TimeSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks);
        }
        if (parsed.timeSessions && Array.isArray(parsed.timeSessions)) {
          setTimeSessions(parsed.timeSessions);
        }
      }
    } catch (e) {
      console.error("Failed to load from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tasks, timeSessions })
      );
    } catch (e) {
      console.error("Failed to save to storage", e);
    }
  }, [tasks, timeSessions, isLoaded]);

  const addTask = (
    data: Omit<Task, "id" | "createdAt" | "updatedAt" | "timeSpentSeconds">
  ) => {
    const newTask: Task = {
      ...data,
      id: "task-" + Date.now(),
      timeSpentSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setActiveTaskId(newTask.id);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  const moveTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const addTimeSession = (taskId: string, durationSeconds: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newSession: TimeSession = {
      id: "session-" + Date.now(),
      taskId,
      taskTitle: task.title,
      startedAt: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds,
    };

    setTimeSessions((prev) => [newSession, ...prev]);
    updateTask(taskId, {
      timeSpentSeconds: (task.timeSpentSeconds || 0) + durationSeconds,
    });
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <AppContext.Provider
      value={{
        tasks,
        activeTaskId,
        setActiveTaskId,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        timeSessions,
        addTimeSession,
        activeTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
