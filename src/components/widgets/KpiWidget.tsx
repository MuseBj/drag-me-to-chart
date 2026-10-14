import type { ColorTheme, WidgetConfig } from '../../types/dashboard';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface KpiWidgetProps {
  widget: WidgetConfig;
  theme: ColorTheme;
}

export const KpiWidget = ({ widget, theme }: KpiWidgetProps) => {
  const isPositive = widget.kpiData?.isPositive ?? true;
  const value = widget.kpiData?.value ?? '248,510';
  const unit = widget.kpiData?.unit ?? '';
  const change = widget.kpiData?.change ?? '+14.2%';
  const period = widget.kpiData?.period ?? 'vs last 30 days';
  const subtext = widget.kpiData?.subtext ?? 'Target: 250,000 (99.4% on track)';

  // Mini sparkline points
  const points = [14, 18, 15, 22, 28, 25, 34, 38, 36, 45, 52, 58];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const width = 160;
  const height = 44;

  const pathD = points
    .map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p - min) / (max - min || 1)) * (height - 8) - 4;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="flex flex-col justify-between h-full p-2 select-none">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold opacity-75" style={{ color: theme.textSecondary }}>
            {widget.targetMetricName || 'Live Metric'}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold tracking-tight" style={{ color: theme.textPrimary }}>
              {value}
            </span>
            {unit && (
              <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                {unit}
              </span>
            )}
          </div>
        </div>

        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isPositive
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{change}</span>
        </div>
      </div>

      <div className="flex items-end justify-between mt-3 pt-2 border-t" style={{ borderColor: theme.cardBorder }}>
        <div className="text-xs" style={{ color: theme.textMuted }}>
          <div className="flex items-center gap-1">
            <Activity size={12} style={{ color: theme.accent }} />
            <span>{period}</span>
          </div>
          <p className="mt-0.5 opacity-90 truncate max-w-[180px]">{subtext}</p>
        </div>

        {/* Micro Sparkline */}
        <div className="w-[140px] h-[36px] overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`kpi-grad-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.colors[0]} stopOpacity="0.4" />
                <stop offset="100%" stopColor={theme.colors[0]} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#kpi-grad-${widget.id})`} />
            <path
              d={pathD}
              fill="none"
              stroke={theme.colors[0]}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
