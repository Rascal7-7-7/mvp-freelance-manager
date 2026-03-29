import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Banknote, ClipboardList } from "lucide-react";
import { getProjectById } from "@/lib/actions";
import { ProjectStatusBadge, TaskStatusBadge } from "@/components/StatusBadge";
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 戻るリンク */}
      <Link
        href="/projects"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={14} />
        案件一覧に戻る
      </Link>

      {/* 案件ヘッダー */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">案件ID: #{project.id}</p>
          </div>
          <div className="shrink-0">
            <label className="mb-1 block text-xs text-gray-500">ステータスを変更</label>
            <ProjectStatusSelect projectId={project.id} current={project.status} />
          </div>
        </div>

        {/* 案件メタ情報 */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-1.5">
              <User size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">クライアント</p>
              <p className="text-sm font-medium text-gray-800">{project.client_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-50 p-1.5">
              <Banknote size={14} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">案件金額</p>
              <p className="text-sm font-semibold text-gray-800">{formatPrice(project.price)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gray-100 p-1.5">
              <Calendar size={14} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">登録日</p>
              <p className="text-sm text-gray-700">{formatDate(project.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* タスクセクション */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-gray-600" />
              <h2 className="font-semibold text-gray-800">タスク管理</h2>
            </div>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>
                未完了:{" "}
                <span className="font-semibold text-gray-700">{todoCount}</span>
              </span>
              <span>
                完了:{" "}
                <span className="font-semibold text-green-600">{doneCount}</span>
              </span>
            </div>
          </div>
          {/* タスク追加フォーム */}
          <TaskForm projectId={project.id} />
        </div>

        {/* タスク一覧 */}
        {project.tasks.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            タスクはまだありません。上のフォームから追加してください。
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {project.tasks.map((task) => {
              const overdue = task.status !== "done" && isOverdue(task.due_date);
              const soon = task.status !== "done" && isDueSoon(task.due_date);

              return (
                <li
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3.5 transition-colors",
                    task.status === "done" ? "opacity-60" : "hover:bg-gray-50"
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
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    )}
                  >
                    {task.name}
                  </span>

                  {/* バッジ */}
                  <TaskStatusBadge status={task.status} />

                  {/* 期日 */}
                  <span
                    className={cn(
                      "hidden text-xs sm:inline",
                      overdue
                        ? "font-semibold text-red-500"
                        : soon
                        ? "font-medium text-orange-500"
                        : "text-gray-400"
                    )}
                  >
                    {task.due_date ? formatDate(task.due_date) : "期限なし"}
                    {overdue && " (期限超過)"}
                  </span>

                  {/* 削除ボタン */}
                  <DeleteTaskButton taskId={task.id} projectId={project.id} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
