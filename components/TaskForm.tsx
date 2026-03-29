"use client";

import { useTransition, useRef } from "react";
import { createTask } from "@/lib/actions";
import { PlusCircle } from "lucide-react";

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
    <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-3">
      <input type="hidden" name="project_id" value={projectId} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          name="name"
          placeholder="タスク名を入力"
          required
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="status"
          defaultValue="todo"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todo">未着手</option>
          <option value="doing">作業中</option>
          <option value="done">完了</option>
        </select>
        <input
          type="date"
          name="due_date"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <PlusCircle size={15} />
          {isPending ? "追加中…" : "追加"}
        </button>
      </div>
    </form>
  );
}
