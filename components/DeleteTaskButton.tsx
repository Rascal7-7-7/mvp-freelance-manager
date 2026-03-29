"use client";

import { useTransition } from "react";
import { deleteTask } from "@/lib/actions";

interface Props {
  taskId: number;
  projectId: number;
}

export function DeleteTaskButton({ taskId, projectId }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      deleteTask(taskId, projectId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label="タスクを削除"
      className="rounded-lg p-1.5 text-outline/50 transition-colors hover:bg-error/10 hover:text-error disabled:opacity-40"
    >
      <span className="material-symbols-outlined text-[16px] leading-none">delete</span>
    </button>
  );
}
