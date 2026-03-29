"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: "dashboard" },
  { href: "/projects",  label: "案件一覧",       icon: "list_alt"  },
  { href: "/projects/new", label: "案件登録",    icon: "add_box"   },
];

function isActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/projects/new") return pathname === "/projects/new";
  if (itemHref === "/projects") {
    return pathname.startsWith("/projects") && pathname !== "/projects/new";
  }
  return pathname === itemHref || pathname === "/";
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="h-screen w-64 hidden md:flex flex-col bg-slate-50 sticky top-0 shrink-0">
        {/* Logo */}
        <div className="px-6 py-7">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 font-jakarta">
            FreelanceHub
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-widest font-jakarta">
            Freelance OS
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ href, label, icon }) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                  active
                    ? "bg-white text-primary font-bold shadow-sm"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
                )}
              >
                <span
                  className="material-symbols-outlined text-[20px] leading-none"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="m-4 p-4 bg-slate-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs font-jakarta">
              FH
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">User Workspace</p>
              <p className="text-[10px] text-slate-500">フリーランス管理ツール</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center py-2.5 z-50">
        {navItems.map(({ href, label, icon }) => {
          const active = isActive(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1",
                active ? "text-primary" : "text-slate-400"
              )}
            >
              <span
                className="material-symbols-outlined text-[22px] leading-none"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
