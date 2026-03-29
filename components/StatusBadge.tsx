import { cn } from "@/lib/utils";
import {
  type ProjectStatus,
  type TaskStatus,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_COLOR,
  PROJECT_STATUS_DOT,
  TASK_STATUS_LABEL,
  TASK_STATUS_COLOR,
} from "@/types";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
        PROJECT_STATUS_COLOR[status],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", PROJECT_STATUS_DOT[status])} />
      {PROJECT_STATUS_LABEL[status]}
    </span>
  );
}

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold",
        TASK_STATUS_COLOR[status],
        className
      )}
    >
      {TASK_STATUS_LABEL[status]}
    </span>
  );
}
