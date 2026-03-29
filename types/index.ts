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

export interface DashboardStats {
  in_progress_count: number;
  completed_count: number;
  total_price: number;
  due_this_week_count: number;
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "準備中",
  in_progress: "進行中",
  completed: "完了",
  paused: "保留",
};

export const PROJECT_STATUS_COLOR: Record<ProjectStatus, string> = {
  planning: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "未着手",
  doing: "作業中",
  done: "完了",
};

export const TASK_STATUS_COLOR: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-600",
  doing: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};
