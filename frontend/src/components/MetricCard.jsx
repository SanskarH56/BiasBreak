// MetricCard.jsx
import { motion } from "framer-motion";

const TYPE_CONFIG = {
  neutral: {
    valueClass: "text-slate-950",
    iconClass: "bg-slate-50 text-slate-600 border-slate-200",
    glowClass: "bg-slate-300",
    accentClass: "from-slate-50 via-white to-white",
  },
  primary: {
    valueClass: "text-indigo-700",
    iconClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
    glowClass: "bg-indigo-400",
    accentClass: "from-indigo-50 via-white to-white",
  },
  success: {
    valueClass: "text-emerald-700",
    iconClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    glowClass: "bg-emerald-400",
    accentClass: "from-emerald-50 via-white to-white",
  },
  danger: {
    valueClass: "text-rose-700",
    iconClass: "bg-rose-50 text-rose-700 border-rose-100",
    glowClass: "bg-rose-400",
    accentClass: "from-rose-50 via-white to-white",
  },
  warning: {
    valueClass: "text-amber-700",
    iconClass: "bg-amber-50 text-amber-700 border-amber-100",
    glowClass: "bg-amber-400",
    accentClass: "from-amber-50 via-white to-white",
  },
};

const TREND_CONFIG = {
  up: {
    prefix: "↑",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  down: {
    prefix: "↓",
    className: "bg-rose-50 text-rose-700 border-rose-100",
  },
  neutral: {
    prefix: "",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  },
};

export default function MetricCard({
  title,
  value,
  sub,
  trend,
  trendDir = "neutral",
  type = "neutral",
  icon,
  delay = 0,
}) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.neutral;
  const trendConfig = TREND_CONFIG[trendDir] || TREND_CONFIG.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="card card-hover group relative min-h-[176px] overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.accentClass}`} />

      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${config.glowClass} opacity-10 blur-2xl transition group-hover:opacity-20`} />
      <div className={`absolute bottom-0 left-0 h-1 w-full ${config.glowClass} opacity-70`} />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
              {title}
            </p>

            {sub && (
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                {sub}
              </p>
            )}
          </div>

          {icon && (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition group-hover:-translate-y-0.5 ${config.iconClass}`}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <p
            className={`font-mono text-[2.15rem] font-extrabold leading-none tracking-[-0.07em] ${config.valueClass}`}
          >
            {value}
          </p>

          {trend && (
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.06em] ${trendConfig.className}`}
            >
              {trendConfig.prefix && <span>{trendConfig.prefix}</span>}
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
