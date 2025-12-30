"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

export type GoalDraft = {
  title: string;
  description: string;
  targetDate: string;
  category: string;
};

type GoalFormProps = {
  onCreate(goal: GoalDraft): void;
};

const initialDraft: GoalDraft = {
  title: "",
  description: "",
  targetDate: "",
  category: "",
};

export function GoalForm({ onCreate }: GoalFormProps) {
  const [draft, setDraft] = useState<GoalDraft>(initialDraft);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      return;
    }
    onCreate({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category.trim(),
    });
    setDraft(initialDraft);
    setShowAdvanced(false);
  };

  return (
    <form
      className="relative space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/60"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-900"
        >
          Goal title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="Launch a personal portfolio"
          value={draft.title}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-900"
        >
          Why it matters
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={600}
          placeholder="Describe how this goal moves you closer to your vision."
          value={draft.description}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((value) => !value)}
        className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
      >
        {showAdvanced ? "Hide planning options" : "Show planning options"}
      </button>

      {showAdvanced && (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="targetDate"
              className="block text-sm font-medium text-zinc-900"
            >
              Target date
            </label>
            <input
              id="targetDate"
              name="targetDate"
              type="date"
              value={draft.targetDate}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-zinc-900"
            >
              Area of life
            </label>
            <input
              id="category"
              name="category"
              type="text"
              maxLength={60}
              placeholder="Career, Health, Learning..."
              value={draft.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl bg-indigo-50 p-5 text-sm text-indigo-900">
        <p className="font-semibold">Quick tip</p>
        <p className="text-indigo-800">
          Write goals as outcomes you can measure. Example: “Publish my
          newsletter every week” instead of “Write more”.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add goal
        </button>
      </div>
    </form>
  );
}
