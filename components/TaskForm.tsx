"use client";

import { useTransition, useRef } from "react";
import { createTask } from "@/lib/actions";

interface Props {
  projectId: number;
}

export function TaskForm({ projectId }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createTask(formData);
      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t border-dashed border-outline-variant/30 bg-white/50"
    >
      <input type="hidden" name="project_id" value={projectId} />

      {/* タスク名 */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="material-symbols-outlined text-primary text-[22px] leading-none shrink-0">
          add_task
        </span>
        <input
          type="text"
          name="name"
          required
          placeholder="次にやるべきことは？　新しいタスクをクイック追加..."
          className="flex-1 bg-transparent border-none text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-0"
        />
      </div>

      {/* ステータス */}
      <select
        name="status"
        defaultValue="todo"
        className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
      >
        <option value="todo">未着手</option>
        <option value="doing">作業中</option>
        <option value="done">完了</option>
      </select>

      {/* 期日 */}
      <input
        type="date"
        name="due_date"
        className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
      />

      {/* 追加ボタン */}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0"
      >
        <span className="material-symbols-outlined text-[16px] leading-none">check</span>
        {isPending ? "追加中..." : "追加"}
      </button>
    </form>
  );
}
