"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query, queryOne } from "./db";
import type {
  Project,
  Task,
  ProjectWithTasks,
  PriorityProject,
  DashboardStats,
  ProjectStatus,
  TaskStatus,
} from "@/types";

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return query<Project>(
    `SELECT id, name, client_name, price, status,
            created_at, updated_at
     FROM projects
     ORDER BY created_at DESC`
  );
}

export async function getProjectById(id: number): Promise<ProjectWithTasks | null> {
  const project = await queryOne<Project>(
    `SELECT id, name, client_name, price, status,
            created_at, updated_at
     FROM projects
     WHERE id = $1`,
    [id]
  );
  if (!project) return null;

  const tasks = await query<Task>(
    `SELECT id, project_id, name, status, due_date,
            created_at, updated_at
     FROM tasks
     WHERE project_id = $1
     ORDER BY
       CASE
         WHEN status = 'done' THEN 1
         ELSE 0
       END ASC,
       due_date ASC NULLS LAST,
       created_at ASC`,
    [id]
  );

  return { ...project, tasks };
}

export async function createProject(formData: FormData): Promise<void> {
  const name        = (formData.get("name") as string).trim();
  const client_name = (formData.get("client_name") as string).trim();
  const price       = parseInt(formData.get("price") as string, 10) || 0;
  const status      = (formData.get("status") as ProjectStatus) || "planning";

  if (!name || !client_name) {
    throw new Error("案件名とクライアント名は必須です。");
  }

  const [created] = await query<Project>(
    `INSERT INTO projects (name, client_name, price, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [name, client_name, price, status]
  );

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect(`/projects/${created.id}`);
}

export async function updateProjectStatus(
  id: number,
  status: ProjectStatus
): Promise<void> {
  await query(
    `UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2`,
    [status, id]
  );
  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export async function createTask(formData: FormData): Promise<void> {
  const project_id = parseInt(formData.get("project_id") as string, 10);
  const name       = (formData.get("name") as string).trim();
  const status     = (formData.get("status") as TaskStatus) || "todo";
  const due_date   = (formData.get("due_date") as string) || null;

  if (!name || !project_id) {
    throw new Error("タスク名は必須です。");
  }

  await query(
    `INSERT INTO tasks (project_id, name, status, due_date)
     VALUES ($1, $2, $3, $4)`,
    [project_id, name, status, due_date || null]
  );

  revalidatePath(`/projects/${project_id}`);
  revalidatePath("/dashboard");
}

export async function updateTaskStatus(
  taskId: number,
  projectId: number,
  status: TaskStatus
): Promise<void> {
  await query(
    `UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2`,
    [status, taskId]
  );
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: number, projectId: number): Promise<void> {
  await query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const [stats] = await query<DashboardStats>(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'in_progress')  AS in_progress_count,
       COUNT(*) FILTER (WHERE status = 'completed')    AS completed_count,
       COUNT(*) FILTER (WHERE status = 'paused')       AS paused_count,
       COALESCE(SUM(price), 0)                         AS total_price,
       (
         SELECT COUNT(*)
         FROM tasks
         WHERE status != 'done'
           AND due_date >= CURRENT_DATE
           AND due_date <= CURRENT_DATE + INTERVAL '7 days'
       )                                               AS due_this_week_count,
       (
         SELECT COUNT(*)
         FROM tasks
         WHERE status != 'done'
           AND due_date = CURRENT_DATE
       )                                               AS tasks_due_today_count
     FROM projects`
  );
  return {
    in_progress_count:    Number(stats.in_progress_count),
    completed_count:      Number(stats.completed_count),
    paused_count:         Number(stats.paused_count),
    total_price:          Number(stats.total_price),
    due_this_week_count:  Number(stats.due_this_week_count),
    tasks_due_today_count: Number(stats.tasks_due_today_count),
  };
}

/** 最も緊急度の高い進行中案件（未完了タスクの最早期日順） */
export async function getPriorityProject(): Promise<PriorityProject | null> {
  const row = await queryOne<PriorityProject>(
    `SELECT
       p.id, p.name, p.client_name, p.price, p.status,
       p.created_at, p.updated_at,
       MIN(t.due_date)                                       AS earliest_due,
       COUNT(t.id) FILTER (WHERE t.status != 'done')        AS pending_tasks
     FROM projects p
     LEFT JOIN tasks t ON t.project_id = p.id
     WHERE p.status = 'in_progress'
     GROUP BY p.id
     ORDER BY MIN(t.due_date) ASC NULLS LAST, p.updated_at DESC
     LIMIT 1`
  );
  if (!row) return null;
  return {
    ...row,
    price:        Number(row.price),
    pending_tasks: Number(row.pending_tasks),
  };
}

export async function getInProgressProjects(): Promise<Project[]> {
  return query<Project>(
    `SELECT id, name, client_name, price, status, created_at, updated_at
     FROM projects
     WHERE status = 'in_progress'
     ORDER BY updated_at DESC
     LIMIT 4`
  );
}

export async function getUpcomingTasks(): Promise<(Task & { project_name: string })[]> {
  return query<Task & { project_name: string }>(
    `SELECT t.id, t.project_id, t.name, t.status, t.due_date,
            t.created_at, t.updated_at,
            p.name AS project_name
     FROM tasks t
     JOIN projects p ON p.id = t.project_id
     WHERE t.status != 'done'
       AND t.due_date IS NOT NULL
       AND t.due_date <= CURRENT_DATE + INTERVAL '7 days'
     ORDER BY t.due_date ASC
     LIMIT 6`
  );
}

/** 案件一覧用サマリー */
export async function getProjectsSummary(): Promise<{
  in_progress_total_price: number;
  paused_count: number;
  due_this_week_count: number;
}> {
  const [row] = await query<{
    in_progress_total_price: number;
    paused_count: number;
    due_this_week_count: number;
  }>(
    `SELECT
       COALESCE(SUM(price) FILTER (WHERE status = 'in_progress'), 0) AS in_progress_total_price,
       COUNT(*) FILTER (WHERE status = 'paused')                      AS paused_count,
       (
         SELECT COUNT(DISTINCT t.project_id)
         FROM tasks t
         JOIN projects p2 ON p2.id = t.project_id
         WHERE t.status != 'done'
           AND t.due_date >= CURRENT_DATE
           AND t.due_date <= CURRENT_DATE + INTERVAL '7 days'
       )                                                              AS due_this_week_count
     FROM projects`
  );
  return {
    in_progress_total_price: Number(row.in_progress_total_price),
    paused_count:            Number(row.paused_count),
    due_this_week_count:     Number(row.due_this_week_count),
  };
}
