import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProject } from "@/lib/actions";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={14} />
          案件一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">新規案件を登録</h1>
        <p className="mt-1 text-sm text-gray-500">案件の基本情報を入力してください</p>
      </div>

      {/* フォーム */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form action={createProject} className="space-y-5">
          {/* 案件名 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              案件名 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="例：コーポレートサイト制作"
              className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* クライアント名 */}
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
              クライアント名 <span className="text-red-500">*</span>
            </label>
            <input
              id="client_name"
              name="client_name"
              type="text"
              required
              placeholder="例：株式会社サンプル"
              className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 案件金額 */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              案件金額（円）
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                ¥
              </span>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1000"
                defaultValue={0}
                placeholder="300000"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ステータス */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              ステータス
            </label>
            <select
              id="status"
              name="status"
              defaultValue="planning"
              className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="planning">準備中</option>
              <option value="in_progress">進行中</option>
              <option value="completed">完了</option>
              <option value="paused">保留</option>
            </select>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              案件を登録する
            </button>
            <Link
              href="/projects"
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
