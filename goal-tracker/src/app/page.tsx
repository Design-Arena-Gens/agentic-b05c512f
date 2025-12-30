"use client";

import { GoalCard } from "@/components/goal-card";
import { GoalForm } from "@/components/goal-form";
import { useGoals } from "@/hooks/use-goals";

const statTitles: Record<
  keyof ReturnType<typeof useGoals>["stats"],
  string
> = {
  total: "Total goals",
  active: "In progress",
  completed: "Completed",
  completionRate: "Completion rate",
  upcoming: "Upcoming deadlines",
  overdue: "Overdue",
};

export default function Home() {
  const {
    goals,
    stats,
    addGoal,
    updateProgress,
    toggleStatus,
    removeGoal,
    hydrated,
  } = useGoals();

  const statEntries = (
    Object.entries(stats) as Array<[keyof typeof stats, number]>
  ).filter(([key]) => key !== "completionRate");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 pb-20 pt-12">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <header className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            Personal Goal Navigator
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
              Map your goals, track momentum, celebrate progress.
            </h1>
            <p className="text-base text-zinc-600 md:text-lg">
              Capture goals, keep context close, and let your future self stay on
              track with a focused dashboard built for clarity.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {statEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-3xl border border-white bg-white/80 p-6 shadow-md shadow-indigo-100/50 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-sm font-medium text-indigo-600">
                {statTitles[key]}
              </p>
              <p className="mt-3 text-3xl font-semibold text-zinc-900">
                {value}
              </p>
            </div>
          ))}
          <div className="rounded-3xl border border-white bg-indigo-600/95 p-6 text-white shadow-lg shadow-indigo-400/60 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-100">
              Completion rate
            </p>
            <p className="mt-3 text-4xl font-semibold">{stats.completionRate}%</p>
            <p className="mt-4 text-sm text-indigo-100">
              Keep taking consistent action. Every win compounds.
            </p>
          </div>
        </section>

        <GoalForm onCreate={addGoal} />

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900">
              Your goals
            </h2>
            <span className="text-sm text-zinc-500">
              {goals.length} item{goals.length === 1 ? "" : "s"}
            </span>
          </div>

          {!hydrated ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-3xl bg-zinc-100"
                />
              ))}
            </div>
          ) : goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-indigo-300 bg-white/70 p-12 text-center text-indigo-900">
              <p className="text-lg font-semibold">
                Set your first goal to get started
              </p>
              <p className="max-w-md text-sm text-zinc-600">
                Capture a goal that matters. Add context, set a target, and track
                momentum as you move forward.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onProgressChange={updateProgress}
                  onToggleStatus={toggleStatus}
                  onDelete={removeGoal}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
