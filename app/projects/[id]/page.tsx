import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/actions";
import { ProjectStatusBadge } from "@/components/StatusBadge";
import { ProjectStatusSelect } from "@/components/ProjectStatusSelect";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { TaskForm } from "@/components/TaskForm";
import { DeleteTaskButton } from "@/components/DeleteTaskButton";
import { formatPrice, formatDate, isOverdue, isDueSoon } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) notFound();

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const todoCount = project.tasks.filter((t) => t.status !== "done").length;
  const doneCount = project.tasks.filter((t) => t.status === "done").length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
      {/* 戻るリンク */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-xs text-outline hover:text-on-surface mb-6"
      >
        <span className="material-symbols-outlined text-[14px] leading-none">arrow_back</span>
        案件一覧に戻る
      </Link>

      {/* 案件ヘッダーカード */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <ProjectStatusBadge status={project.status} />
            </div>
            <h1 className="font-jakarta text-2xl font-black text-on-surface leading-tight">
              {project.name}
            </h1>
            <p className="text-xs text-outline mt-1">案件 #{project.id}</p>
          </div>
          <div className="shrink-0">
            <p className="text-[10px] font-bold text-outline mb-1">ステータスを変更</p>
            <ProjectStatusSelect projectId={project.id} current={project.status} />
          </div>
        </div>

        {/* 案件メタ情報 */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0">
              <span className="material-symbols-outlined text-[16px] leading-none text-primary">
                person
              </span>
            </div>
            <div>
              <p className="text-[10px] text-outline">クライアント</p>
              <p className="text-sm font-semibold text-on-surface">{project.client_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-secondary/10 p-2 shrink-0">
              <span className="material-symbols-outlined text-[16px] leading-none text-secondary">
                payments
              </span>
            </div>
            <div>
              <p className="text-[10px] text-outline">案件金額</p>
              <p className="text-sm font-bold text-on-surface font-jakarta">
                {formatPrice(project.price)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-surface-container-high p-2 shrink-0">
              <span className="material-symbols-outlined text-[16px] leading-none text-outline">
                calendar_today
              </span>
            </div>
            <div>
              <p className="text-[10px] text-outline">登録日</p>
              <p className="text-sm text-on-surface">{formatDate(project.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* タスクセクション */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
        {/* タスクヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] leading-none text-outline">
              checklist
            </span>
            <h2 className="text-sm font-bold text-on-surface">タスク管理</h2>
          </div>
          <div className="flex gap-3 text-xs text-outline">
            <span>
              未完了:{" "}
              <span className="font-bold text-on-surface">{todoCount}</span>
            </span>
            <span>
              完了:{" "}
              <span className="font-bold text-secondary">{doneCount}</span>
            </span>
          </div>
        </div>

        {/* タスク一覧 */}
        {project.tasks.length === 0 ? (
          <div className="py-10 text-center text-sm text-outline">
            タスクはまだありません。下のフォームから追加してください。
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/10">
            {project.tasks.map((task) => {
              const overdue = task.status !== "done" && isOverdue(task.due_date);
              const soon    = task.status !== "done" && isDueSoon(task.due_date);

              return (
                <li
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3.5 transition-colors",
                    task.status === "done"
                      ? "opacity-50"
                      : overdue
                      ? "task-urgent"
                      : soon
                      ? "task-soon"
                      : "hover:bg-surface-container-low"
                  )}
                >
                  {/* ステータス select */}
                  <TaskStatusSelect
                    taskId={task.id}
                    projectId={project.id}
                    current={task.status}
                  />

                  {/* タスク名 */}
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      task.status === "done"
                        ? "text-outline line-through"
                        : "text-on-surface"
                    )}
                  >
                    {task.name}
                  </span>

                  {/* 期日 */}
                  <span
                    className={cn(
                      "hidden text-xs sm:inline shrink-0",
                      overdue
                        ? "font-bold text-error"
                        : soon
                        ? "font-semibold text-tertiary"
                        : "text-outline"
                    )}
                  >
                    {task.due_date ? formatDate(task.due_date) : "—"}
                    {overdue && (
                      <span className="ml-1">
                        <span className="material-symbols-outlined text-[12px] leading-none align-middle">
                          warning
                        </span>
                      </span>
                    )}
                  </span>

                  {/* 削除ボタン */}
                  <DeleteTaskButton taskId={task.id} projectId={project.id} />
                </li>
              );
            })}
          </ul>
        )}

        {/* タスク追加フォーム */}
        <TaskForm projectId={project.id} />
      </div>
    </div>
  );
}
