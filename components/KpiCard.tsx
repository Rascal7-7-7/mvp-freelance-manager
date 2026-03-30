import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: string;           // Material Symbol name
  iconBg?: string;
  iconColor?: string;
  sub?: string;
  accent?: boolean;       // 金額カードなどで青グラデ強調
  compact?: boolean;      // 長い数値（金額）用：フォントを抑えてオーバーフロー防止
}

export function KpiCard({
  label,
  value,
  icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  sub,
  accent = false,
  compact = false,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "p-3 sm:p-4 lg:p-5 rounded-xl border border-outline-variant/20 shadow-sm",
        accent
          ? "bg-gradient-to-br from-surface-container-lowest to-primary-fixed/10"
          : "bg-surface-container-lowest"
      )}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-outline mb-1 leading-tight truncate">{label}</p>
          <p
            className={cn(
              "font-black font-jakarta leading-tight overflow-hidden",
              compact
                ? "text-lg sm:text-xl lg:text-2xl"
                : "text-3xl sm:text-4xl lg:text-5xl"
            )}
            style={{ color: accent ? "var(--color-primary)" : "var(--color-on-surface)" }}
          >
            {value}
          </p>
          {sub && <p className="text-[10px] sm:text-xs text-outline mt-1 truncate">{sub}</p>}
        </div>
        <div className={cn("rounded-lg p-1.5 shrink-0", iconBg)}>
          <span className={cn("material-symbols-outlined text-[16px] sm:text-[18px] leading-none", iconColor)}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
