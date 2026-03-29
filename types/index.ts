export type ProjectStatus = "planning" | "in_progress" | "completed" | "paused";
export type TaskStatus = "todo" | "doing" | "done";

export interface Project {
  id: number;
  name: string;
  client_name: string;
  price: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  name: string;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

export interface PriorityProject extends Project {
  earliest_due: string | null;
  pending_tasks: number;
}

export interface DashboardStats {
  in_progress_count: number;
  completed_count: number;
  total_price: number;
  due_this_week_count: number;
  paused_count: number;
  tasks_due_today_count: number;
}

// ── Status labels ─────────────────────────────────────────────────────────────

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planning:    "準備中",
  in_progress: "進行中",
  completed:   "完了",
  paused:      "保留",
};

/** Material Design 3 tonal badge classes */
export const PROJECT_STATUS_COLOR: Record<ProjectStatus, string> = {
  planning:    "bg-surface-container-highest text-outline",
  in_progress: "bg-primary/10 text-primary",
  completed:   "bg-secondary/10 text-secondary",
  paused:      "bg-tertiary/10 text-tertiary",
};

/** Dot indicator color */
export const PROJECT_STATUS_DOT: Record<ProjectStatus, string> = {
  planning:    "bg-outline",
  in_progress: "bg-primary",
  completed:   "bg-secondary",
  paused:      "bg-tertiary",
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo:  "未着手",
  doing: "作業中",
  done:  "完了",
};

export const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  todo:  "bg-surface-container-high text-outline",
  doing: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  done:  "bg-secondary/10 text-secondary",
};
