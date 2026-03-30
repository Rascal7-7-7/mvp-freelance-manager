import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: string;           // Material Symbol name
  iconBg?: string;
  iconColor?: string;
  sub?: string;
  accent?: boolean;       // 金額カードなどで青グラデ強調
}

export function KpiCard({
  label,
  value,
  icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  sub,
  accent = false,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "p-4 sm:p-6 rounded-xl border border-outline-variant/20 shadow-sm",
        accent
          ? "bg-gradient-to-br from-surface-container-lowest to-primary-fixed/10"
          : "bg-surface-container-lowest"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-outline mb-1 truncate">{label}</p>
          <p
            className={cn(
              "text-2xl sm:text-4xl font-black font-jakarta leading-none break-all",
              accent ? "text-primary" : "text-on-surface"
            )}
          >
            {value}
          </p>
          {sub && <p className="text-xs text-outline mt-1.5">{sub}</p>}
        </div>
        <div className={cn("rounded-lg p-1.5 sm:p-2 shrink-0", iconBg)}>
          <span className={cn("material-symbols-outlined text-[18px] sm:text-[22px] leading-none", iconColor)}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
