"use client";

import { useTransition } from "react";
import { updateTaskStatus } from "@/lib/actions";
import { type TaskStatus, TASK_STATUS_LABEL } from "@/types";

const STATUS_OPTIONS: TaskStatus[] = ["todo", "doing", "done"];

interface Props {
  taskId: number;
  projectId: number;
  current: TaskStatus;
}

export function TaskStatusSelect({ taskId, projectId, current }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as TaskStatus;
    startTransition(() => { updateTaskStatus(taskId, projectId, next); });
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-2 py-1 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{TASK_STATUS_LABEL[s]}</option>
      ))}
    </select>
  );
}
