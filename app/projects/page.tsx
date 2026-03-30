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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      {/* ページヘッダー */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
            Projects
          </p>
          <h1 className="font-jakarta text-2xl sm:text-3xl font-black text-on-surface leading-tight">
            案件一覧
          </h1>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-opacity hover:opacity-90 shrink-0"
        >
          <span className="material-symbols-outlined text-[15px] leading-none">add</span>
          <span className="hidden sm:inline">新規案件を登録</span>
          <span className="sm:hidden">新規登録</span>
        </Link>
      </div>

      {/* インサイトカード */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3 sm:p-4 shadow-sm min-w-0">
          <p className="text-[10px] text-outline mb-1 leading-tight truncate">進行中の売上</p>
          <p className="font-jakarta text-sm sm:text-lg lg:text-2xl font-black text-primary leading-tight truncate">
            {formatPrice(summary.in_progress_total_price)}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3 sm:p-4 shadow-sm min-w-0">
          <p className="text-[10px] text-outline mb-1 leading-tight">今週期限</p>
          <p className="font-jakarta text-xl sm:text-2xl lg:text-3xl font-black text-tertiary leading-tight">
            {summary.due_this_week_count}件
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3 sm:p-4 shadow-sm min-w-0">
          <p className="text-[10px] text-outline mb-1 leading-tight">保留中</p>
          <p className="font-jakarta text-xl sm:text-2xl lg:text-3xl font-black text-on-surface leading-tight">
            {summary.paused_count}件
          </p>
        </div>
      </div>

      {/* 案件リスト */}
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
        <>
          {/* モバイル: カードレイアウト (lg未満) */}
          <div className="lg:hidden flex flex-col gap-2">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3.5 shadow-sm hover:bg-surface-container-low transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-on-surface leading-tight truncate">{p.name}</p>
                  <p className="text-xs text-outline mt-0.5 truncate">{p.client_name}</p>
                </div>
                <div className="shrink-0 text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-sm text-on-surface font-jakarta whitespace-nowrap">
                    {formatPrice(p.price)}
                  </p>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <span className="material-symbols-outlined text-[16px] leading-none text-outline/50 shrink-0">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>

          {/* デスクトップ: テーブルレイアウト (lg以上) */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
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
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-on-surface">{p.name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-outline">{p.client_name}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-on-surface font-jakarta whitespace-nowrap">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3.5">
                      <ProjectStatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 text-outline text-xs">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3.5 text-right">
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
        </>
      )}
    </div>
  );
}
