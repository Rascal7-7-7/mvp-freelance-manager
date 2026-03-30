import Link from "next/link";
import { createProject } from "@/lib/actions";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8">
      {/* ページヘッダー */}
      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs text-outline hover:text-on-surface mb-4"
        >
          <span className="material-symbols-outlined text-[14px] leading-none">arrow_back</span>
          案件一覧に戻る
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
          New Project
        </p>
        <h1 className="font-jakarta text-3xl font-black text-on-surface leading-tight">
          案件を登録
        </h1>
      </div>

      {/* フォームカード */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
        <form action={createProject} className="space-y-5">
          {/* 案件名 */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-on-surface mb-1.5">
              案件名 <span className="text-error">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="例：コーポレートサイト制作"
              className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>

          {/* クライアント名 */}
          <div>
            <label htmlFor="client_name" className="block text-xs font-bold text-on-surface mb-1.5">
              クライアント名 <span className="text-error">*</span>
            </label>
            <input
              id="client_name"
              name="client_name"
              type="text"
              required
              placeholder="例：株式会社サンプル"
              className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
          </div>

          {/* 案件金額 */}
          <div>
            <label htmlFor="price" className="block text-xs font-bold text-on-surface mb-1.5">
              案件金額（円）
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline select-none">
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
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low py-2.5 pl-7 pr-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* ステータス */}
          <div>
            <label htmlFor="status" className="block text-xs font-bold text-on-surface mb-1.5">
              ステータス
            </label>
            <select
              id="status"
              name="status"
              defaultValue="planning"
              className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors cursor-pointer"
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
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[16px] leading-none">check</span>
              案件を登録する
            </button>
            <Link
              href="/projects"
              className="flex-1 flex items-center justify-center rounded-lg border border-outline-variant/40 py-2.5 text-center text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
