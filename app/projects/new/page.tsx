import Link from "next/link";
import { createProject } from "@/lib/actions";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
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
        <h1 className="font-jakarta text-2xl sm:text-3xl font-black text-on-surface leading-tight">
          案件を登録
        </h1>
      </div>

      {/* メインレイアウト: PC は左フォーム + 右インフォ */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* フォームカード (lg: 3/5幅) */}
        <div className="lg:col-span-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
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
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-3 text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
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
                className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-3 text-sm text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
              />
            </div>

            {/* 案件金額 + ステータス: PC で横並び */}
            <div className="grid gap-4 sm:grid-cols-2">
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
                    className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low py-3 pl-7 pr-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-xs font-bold text-on-surface mb-1.5">
                  ステータス
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="planning"
                  className="w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="planning">準備中</option>
                  <option value="in_progress">進行中</option>
                  <option value="completed">完了</option>
                  <option value="paused">保留</option>
                </select>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">check</span>
                案件を登録する
              </button>
              <Link
                href="/projects"
                className="flex items-center justify-center rounded-lg border border-outline-variant/40 px-5 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low whitespace-nowrap"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </div>

        {/* 右インフォパネル (lg: 2/5幅) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* ガイドカード */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <span className="material-symbols-outlined text-[18px] leading-none text-primary">
                  info
                </span>
              </div>
              <p className="text-sm font-bold text-on-surface">入力のヒント</p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[15px] leading-none text-primary shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <p className="text-xs font-semibold text-on-surface">案件名</p>
                  <p className="text-[11px] text-outline mt-0.5">
                    クライアントや自分が識別しやすい名前をつけましょう
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[15px] leading-none text-primary shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <p className="text-xs font-semibold text-on-surface">案件金額</p>
                  <p className="text-[11px] text-outline mt-0.5">
                    税抜き・税込みどちらでも構いません。後から変更できます
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[15px] leading-none text-primary shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <p className="text-xs font-semibold text-on-surface">ステータス</p>
                  <p className="text-[11px] text-outline mt-0.5">
                    「準備中」から始め、作業開始時に「進行中」へ変更します
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* ステータス凡例 */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
            <p className="text-xs font-bold text-on-surface mb-3">ステータスの意味</p>
            <div className="space-y-2.5">
              {[
                { dot: "bg-outline", label: "準備中", desc: "受注前・見積り中" },
                { dot: "bg-primary", label: "進行中", desc: "作業中・対応中" },
                { dot: "bg-secondary", label: "完了", desc: "納品・請求済み" },
                { dot: "bg-tertiary", label: "保留", desc: "一時停止・待機中" },
              ].map(({ dot, label, desc }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span className="text-xs font-semibold text-on-surface w-12 shrink-0">{label}</span>
                  <span className="text-[11px] text-outline">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
