"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GoalDraft } from "@/components/goal-form";
import type { Goal } from "@/components/goal-card";

const STORAGE_KEY = "agentic-goal-tracker/goals";

const parseGoals = (value: string | null): Goal[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Goal[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((goal) => typeof goal?.id === "string");
  } catch {
    return [];
  }
};

const createGoal = (draft: GoalDraft): Goal => {
  const isoNow = new Date().toISOString();
  return {
    id:
      typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: draft.title,
    description: draft.description,
    targetDate: draft.targetDate || undefined,
    category: draft.category || undefined,
    progress: 0,
    status: "active",
    createdAt: isoNow,
    updatedAt: isoNow,
  };
};

export function useGoals() {
  const isBrowser = typeof window !== "undefined";
  const [goals, setGoals] = useState<Goal[]>(() =>
    parseGoals(
      isBrowser ? window.localStorage.getItem(STORAGE_KEY) : null,
    ),
  );

  useEffect(() => {
    if (!isBrowser) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals, isBrowser]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const handler = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setGoals(parseGoals(event.newValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [isBrowser]);

  const addGoal = useCallback((draft: GoalDraft) => {
    setGoals((prev) => [createGoal(draft), ...prev]);
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal;
        const clamped = Math.max(0, Math.min(100, progress));
        const status = clamped >= 100 ? "completed" : goal.status;
        return {
          ...goal,
          progress: clamped,
          status,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal;
        const nextStatus = goal.status === "completed" ? "active" : "completed";
        return {
          ...goal,
          status: nextStatus,
          progress: nextStatus === "completed" ? 100 : goal.progress,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter((goal) => goal.status === "completed");
    const active = total - completed.length;
    const completionRate = total === 0 ? 0 : Math.round((completed.length / total) * 100);
    const now = new Date();
    const upcoming = goals.filter(
      (goal) =>
        goal.status === "active" &&
        goal.targetDate &&
        new Date(goal.targetDate) >= now,
    );
    const overdue = goals.filter(
      (goal) =>
        goal.status === "active" &&
        goal.targetDate &&
        new Date(goal.targetDate) < now,
    );

    return {
      total,
      completed: completed.length,
      active,
      completionRate,
      upcoming: upcoming.length,
      overdue: overdue.length,
    };
  }, [goals]);

  return {
    goals,
    stats,
    addGoal,
    updateProgress,
    toggleStatus,
    removeGoal,
    hydrated: isBrowser,
  };
}
