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
        "p-6 rounded-xl border border-outline-variant/20 shadow-sm",
        accent
          ? "bg-gradient-to-br from-surface-container-lowest to-primary-fixed/10"
          : "bg-surface-container-lowest"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm text-outline mb-1 truncate">{label}</p>
          <p
            className={cn(
              "text-4xl font-black font-jakarta leading-none",
              accent ? "text-primary" : "text-on-surface"
            )}
          >
            {value}
          </p>
          {sub && <p className="text-xs text-outline mt-1.5">{sub}</p>}
        </div>
        <div className={cn("rounded-lg p-2 shrink-0", iconBg)}>
          <span className={cn("material-symbols-outlined text-[22px] leading-none", iconColor)}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
