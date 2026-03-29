"use client";

import { useTransition } from "react";
import { updateProjectStatus } from "@/lib/actions";
import { type ProjectStatus, PROJECT_STATUS_LABEL } from "@/types";

const STATUS_OPTIONS: ProjectStatus[] = ["planning", "in_progress", "completed", "paused"];

interface Props {
  projectId: number;
  current: ProjectStatus;
}

export function ProjectStatusSelect({ projectId, current }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ProjectStatus;
    startTransition(() => {
      updateProjectStatus(projectId, next);
    });
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {PROJECT_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
