import { cn } from "@/lib/utils";
import {
  type ProjectStatus,
  type TaskStatus,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_COLOR,
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        PROJECT_STATUS_COLOR[status],
        className
      )}
    >
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TASK_STATUS_COLOR[status],
        className
      )}
    >
      {TASK_STATUS_LABEL[status]}
    </span>
  );
}
