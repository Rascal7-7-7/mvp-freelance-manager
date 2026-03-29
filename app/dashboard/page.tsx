import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  CalendarClock,
  Banknote,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  getDashboardStats,
  getInProgressProjects,
  getUpcomingTasks,
} from "@/lib/actions";
import { KpiCard } from "@/components/KpiCard";
import { ProjectStatusBadge, TaskStatusBadge } from "@/components/StatusBadge";
import { formatPrice, formatDate, isOverdue } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, inProgressProjects, upcomingTasks] = await Promise.all([
    getDashboardStats(),
    getInProgressProjects(),
    getUpcomingTasks(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-500">案件・タスク・金額の全体状況を確認できます</p>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="進行中の案件"
          value={`${stats.in_progress_count}件`}
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          sub="現在対応中"
        />
        <KpiCard
          label="今週期限のタスク"
          value={`${stats.due_this_week_count}件`}
          icon={CalendarClock}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          sub="7日以内に期限"
        />
        <KpiCard
          label="完了案件"
          value={`${stats.completed_count}件`}
          icon={CheckCircle2}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          sub="これまでの実績"
        />
        <KpiCard
          label="総案件金額"
          value={formatPrice(stats.total_price)}
          icon={Banknote}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          sub="全案件の合計"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* 進行中案件一覧 */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-800">進行中の案件</h2>
            <Link
              href="/projects"
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              すべて見る <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {inProgressProjects.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400">進行中の案件はありません</p>
            ) : (
              inProgressProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.client_name}</p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-800">{formatPrice(p.price)}</p>
                    <ProjectStatusBadge status={p.status} className="mt-0.5" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* 期限が近いタスク */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-800">期限が近いタスク</h2>
            <span className="text-xs text-gray-400">7日以内・未完了</span>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingTasks.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400">期限が近いタスクはありません</p>
            ) : (
              upcomingTasks.map((t) => {
                const overdue = isOverdue(t.due_date);
                return (
                  <Link
                    key={t.id}
                    href={`/projects/${t.project_id}`}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {overdue && (
                          <AlertCircle size={13} className="shrink-0 text-red-500" />
                        )}
                        <p className="truncate text-sm font-medium text-gray-900">{t.name}</p>
                      </div>
                      <p className="text-xs text-gray-500">{t.project_name}</p>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p
                        className={`text-xs font-medium ${
                          overdue ? "text-red-500" : "text-gray-600"
                        }`}
                      >
                        {formatDate(t.due_date)}
                      </p>
                      <TaskStatusBadge status={t.status} className="mt-0.5" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* クイックアクション */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/projects/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          新規案件を登録
        </Link>
        <Link
          href="/projects"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          案件一覧を見る
        </Link>
      </div>
    </div>
  );
}
