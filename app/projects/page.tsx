import Link from "next/link";
import { PlusCircle, ChevronRight } from "lucide-react";
import { getProjects } from "@/lib/actions";
import { ProjectStatusBadge } from "@/components/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">案件一覧</h1>
          <p className="mt-1 text-sm text-gray-500">登録済みの案件を管理できます</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusCircle size={16} />
          新規案件を登録
        </Link>
      </div>

      {/* 案件テーブル */}
      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-gray-500">案件がまだ登録されていません</p>
          <Link
            href="/projects/new"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            <PlusCircle size={14} />
            最初の案件を登録する
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500">
                <th className="px-5 py-3.5 font-medium">案件名</th>
                <th className="px-4 py-3.5 font-medium">クライアント</th>
                <th className="px-4 py-3.5 text-right font-medium">金額</th>
                <th className="px-4 py-3.5 font-medium">ステータス</th>
                <th className="px-4 py-3.5 font-medium">登録日</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{p.client_name}</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-800">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-4">
                    <ProjectStatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-4 text-gray-500">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/projects/${p.id}`}
                      className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
                    >
                      詳細 <ChevronRight size={14} />
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
