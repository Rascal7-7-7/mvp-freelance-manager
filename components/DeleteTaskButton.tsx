"use client";

import { useTransition } from "react";
import { deleteTask } from "@/lib/actions";
import { Trash2 } from "lucide-react";

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
      className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
    >
      <Trash2 size={14} />
    </button>
  );
}
