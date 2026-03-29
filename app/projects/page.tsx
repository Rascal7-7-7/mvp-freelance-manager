import Link from "next/link";
import { getProjects, getProjectsSummary } from "@/lib/actions";
import { ProjectStatusBadge } from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, summary] = await Promise.all([
    getProjects(),
    getProjectsSummary(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* ページヘッダー */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
            Projects
          </p>
          <h1 className="font-jakarta text-3xl font-black text-on-surface leading-tight">
            案件一覧
          </h1>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] leading-none">add</span>
          新規案件を登録
        </Link>
      </div>

      {/* インサイトカード */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm">
          <p className="text-xs text-outline mb-1">進行中の売上合計</p>
          <p className="font-jakarta text-2xl font-black text-primary leading-none">
            {formatPrice(summary.in_progress_total_price)}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm">
          <p className="text-xs text-outline mb-1">今週期限のある案件</p>
          <p className="font-jakarta text-2xl font-black text-tertiary leading-none">
            {summary.due_this_week_count}件
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm">
          <p className="text-xs text-outline mb-1">保留中の案件</p>
          <p className="font-jakarta text-2xl font-black text-on-surface leading-none">
            {summary.paused_count}件
          </p>
        </div>
      </div>

      {/* 案件テーブル */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-lowest py-16 text-center">
          <span className="material-symbols-outlined text-[40px] leading-none text-outline/40 mb-3 block">
            folder_open
          </span>
          <p className="text-sm text-outline">案件がまだ登録されていません</p>
          <Link
            href="/projects/new"
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[14px] leading-none">add</span>
            最初の案件を登録する
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/15 bg-surface-container-low text-left text-[11px] text-outline">
                <th className="px-5 py-3.5 font-bold">案件名</th>
                <th className="px-4 py-3.5 font-bold">クライアント</th>
                <th className="px-4 py-3.5 text-right font-bold">金額</th>
                <th className="px-4 py-3.5 font-bold">ステータス</th>
                <th className="px-4 py-3.5 font-bold">登録日</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {projects.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-surface-container-low">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-on-surface">{p.name}</span>
                  </td>
                  <td className="px-4 py-4 text-outline">{p.client_name}</td>
                  <td className="px-4 py-4 text-right font-bold text-on-surface font-jakarta">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-4">
                    <ProjectStatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-4 text-outline text-xs">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/projects/${p.id}`}
                      className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
                    >
                      詳細
                      <span className="material-symbols-outlined text-[14px] leading-none">
                        chevron_right
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
