"use client";

import { useMemo } from "react";

export type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate?: string;
  category?: string;
  progress: number;
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string;
};

type GoalCardProps = {
  goal: Goal;
  onProgressChange(id: string, value: number): void;
  onToggleStatus(id: string): void;
  onDelete(id: string): void;
};

const formatDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function getDueState(goal: Goal) {
  if (!goal.targetDate) return { label: "Someday", tone: "neutral" as const };
  const now = new Date();
  const due = new Date(goal.targetDate);
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) {
    return { label: `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`, tone: "danger" as const };
  }
  if (days === 0) {
    return { label: "Due today", tone: "warning" as const };
  }
  if (days <= 7) {
    return { label: `Due in ${days} day${days === 1 ? "" : "s"}`, tone: "warning" as const };
  }
  return { label: `Due in ${days} days`, tone: "neutral" as const };
}

const toneStyles: Record<
  ReturnType<typeof getDueState>["tone"],
  string
> = {
  danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  neutral: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-200",
};

export function GoalCard({
  goal,
  onProgressChange,
  onToggleStatus,
  onDelete,
}: GoalCardProps) {
  const formattedDate = useMemo(
    () => formatDate(goal.targetDate),
    [goal.targetDate],
  );
  const dueState = useMemo(() => getDueState(goal), [goal]);

  const isComplete = goal.status === "completed";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-md shadow-zinc-200/50 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/70">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-lg font-semibold text-indigo-600">
          {goal.title.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">
              {goal.title}
            </h2>
            {goal.category ? (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                {goal.category}
              </span>
            ) : null}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${toneStyles[dueState.tone]}`}
            >
              {dueState.label}
            </span>
          </div>

          {goal.description ? (
            <p className="max-w-2xl text-sm text-zinc-600">
              {goal.description}
            </p>
          ) : null}

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-zinc-500">
              <p>{isComplete ? "Goal completed" : "Progress"}</p>
              <p>{goal.progress}%</p>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={goal.progress}
              onChange={(event) =>
                onProgressChange(goal.id, Number(event.target.value))
              }
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-3 text-xs text-zinc-500">
            <p>Created {formatDate(goal.createdAt)}</p>
            {formattedDate ? <p>Target {formattedDate}</p> : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToggleStatus(goal.id)}
          className="rounded-full border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          {isComplete ? "Mark active" : "Mark complete"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className="rounded-full border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
