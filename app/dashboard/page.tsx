import Link from "next/link";
import {
  getDashboardStats,
  getInProgressProjects,
  getUpcomingTasks,
  getPriorityProject,
} from "@/lib/actions";
import { KpiCard } from "@/components/KpiCard";
import { ProjectStatusBadge } from "@/components/StatusBadge";
import { formatPrice, formatDate, isOverdue, isDueSoon } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, inProgressProjects, upcomingTasks, priorityProject] = await Promise.all([
    getDashboardStats(),
    getInProgressProjects(),
    getUpcomingTasks(),
    getPriorityProject(),
  ]);

  const hasTodayAlert  = stats.tasks_due_today_count > 0;
  const hasPausedAlert = stats.paused_count > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
          Overview
        </p>
        <h1 className="font-jakarta text-3xl font-black text-on-surface leading-tight">
          Dashboard
        </h1>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <KpiCard
          label="進行中の案件"
          value={`${stats.in_progress_count}`}
          icon="work"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          sub="現在対応中"
        />
        <KpiCard
          label="今週期限のタスク"
          value={`${stats.due_this_week_count}`}
          icon="event_upcoming"
          iconBg="bg-tertiary/10"
          iconColor="text-tertiary"
          sub="7日以内に期限"
        />
        <KpiCard
          label="完了案件"
          value={`${stats.completed_count}`}
          icon="task_alt"
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
          sub="これまでの実績"
        />
        <KpiCard
          label="総案件金額"
          value={formatPrice(stats.total_price)}
          icon="payments"
          accent
          sub="全案件の合計"
        />
      </div>

      {/* メインレイアウト */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左 2/3: 案件エリア */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* 優先案件カード（青グラデ） */}
          {priorityProject ? (
            <Link
              href={`/projects/${priorityProject.id}`}
              className="block rounded-xl bg-gradient-to-br from-primary to-primary/70 p-6 text-white shadow-md hover:opacity-95 transition-opacity"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
                    Priority Project
                  </p>
                  <h2 className="font-jakarta text-xl font-black leading-tight truncate">
                    {priorityProject.name}
                  </h2>
                  <p className="text-sm text-white/80 mt-0.5">{priorityProject.client_name}</p>
                </div>
                <div className="rounded-lg bg-white/20 p-2 shrink-0">
                  <span className="material-symbols-outlined text-[22px] leading-none text-white">
                    star
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-6 text-sm">
                <div>
                  <p className="text-white/60 text-xs mb-0.5">案件金額</p>
                  <p className="font-bold font-jakarta">{formatPrice(priorityProject.price)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-0.5">未完了タスク</p>
                  <p className="font-bold font-jakarta">{priorityProject.pending_tasks}件</p>
                </div>
                {priorityProject.earliest_due && (
                  <div>
                    <p className="text-white/60 text-xs mb-0.5">最近の期日</p>
                    <p className="font-bold font-jakarta">
                      {formatDate(priorityProject.earliest_due)}
                    </p>
                  </div>
                )}
                <div className="ml-auto">
                  <span className="material-symbols-outlined text-[20px] leading-none text-white/70">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-lowest p-6 text-center">
              <p className="text-sm text-outline">進行中の案件がありません</p>
              <Link
                href="/projects/new"
                className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-[14px] leading-none">add</span>
                案件を登録する
              </Link>
            </div>
          )}

          {/* 進行中案件リスト */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] leading-none text-outline">
                  folder_open
                </span>
                <h2 className="text-sm font-bold text-on-surface">進行中の案件</h2>
              </div>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                すべて見る
                <span className="material-symbols-outlined text-[14px] leading-none">chevron_right</span>
              </Link>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {inProgressProjects.length === 0 ? (
                <p className="px-5 py-6 text-sm text-outline">進行中の案件はありません</p>
              ) : (
                inProgressProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-container-low"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-on-surface">{p.name}</p>
                      <p className="text-xs text-outline">{p.client_name}</p>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p className="text-sm font-bold text-on-surface font-jakarta">
                        {formatPrice(p.price)}
                      </p>
                      <ProjectStatusBadge status={p.status} className="mt-0.5" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 右 1/3: アラート + タスク */}
        <div className="flex flex-col gap-4">
          {/* アラートバナー */}
          {hasTodayAlert && (
            <div className="flex items-start gap-3 rounded-xl bg-error-container p-4">
              <span className="material-symbols-outlined text-[18px] leading-none text-error shrink-0 mt-0.5">
                warning
              </span>
              <div>
                <p className="text-xs font-bold text-error">本日期限のタスクあり</p>
                <p className="text-xs text-error/80 mt-0.5">
                  {stats.tasks_due_today_count}件のタスクが今日期限です
                </p>
              </div>
            </div>
          )}
          {hasPausedAlert && (
            <div className="flex items-start gap-3 rounded-xl bg-tertiary/10 p-4">
              <span className="material-symbols-outlined text-[18px] leading-none text-tertiary shrink-0 mt-0.5">
                pause_circle
              </span>
              <div>
                <p className="text-xs font-bold text-tertiary">保留中の案件あり</p>
                <p className="text-xs text-tertiary/80 mt-0.5">
                  {stats.paused_count}件の案件が保留中です
                </p>
              </div>
            </div>
          )}

          {/* 期限が近いタスク */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm overflow-hidden flex-1">
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] leading-none text-outline">
                  schedule
                </span>
                <h2 className="text-sm font-bold text-on-surface">期限が近いタスク</h2>
              </div>
              <span className="text-[10px] text-outline bg-surface-container-high px-2 py-0.5 rounded-full">
                7日以内
              </span>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {upcomingTasks.length === 0 ? (
                <p className="px-5 py-6 text-sm text-outline">期限が近いタスクはありません</p>
              ) : (
                upcomingTasks.map((t) => {
                  const overdue = isOverdue(t.due_date);
                  const soon    = isDueSoon(t.due_date);
                  return (
                    <Link
                      key={t.id}
                      href={`/projects/${t.project_id}`}
                      className={cn(
                        "flex items-start gap-3 px-5 py-3 transition-colors hover:bg-surface-container-low",
                        overdue ? "task-urgent" : soon ? "task-soon" : ""
                      )}
                    >
                      <span
                        className={cn(
                          "material-symbols-outlined text-[16px] leading-none shrink-0 mt-0.5",
                          overdue ? "text-error" : soon ? "text-tertiary" : "text-outline"
                        )}
                      >
                        {overdue ? "error" : "radio_button_unchecked"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-on-surface">{t.name}</p>
                        <p className="text-[10px] text-outline">{t.project_name}</p>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold shrink-0",
                          overdue ? "text-error" : soon ? "text-tertiary" : "text-outline"
                        )}
                      >
                        {formatDate(t.due_date)}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* アドバイスカード */}
          <div className="rounded-xl bg-surface-container-low border border-outline-variant/20 px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[16px] leading-none text-primary">
                tips_and_updates
              </span>
              <p className="text-xs font-bold text-on-surface">クイックアクション</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/projects/new"
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                <span className="material-symbols-outlined text-[14px] leading-none">add</span>
                新規案件を登録
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 rounded-lg border border-outline-variant/30 px-3 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[14px] leading-none">list</span>
                案件一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
