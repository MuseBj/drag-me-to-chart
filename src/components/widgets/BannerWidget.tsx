import type { ColorTheme, WidgetConfig } from '../../types/dashboard';
import { Layers, Sparkles } from 'lucide-react';

interface BannerWidgetProps {
  widget: WidgetConfig;
  theme: ColorTheme;
}

export const BannerWidget = ({ widget, theme }: BannerWidgetProps) => {
  return (
    <div
      className="h-full flex items-center justify-between px-6 py-4 rounded-xl border relative overflow-hidden"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
        backgroundImage: `radial-gradient(circle at right, ${theme.colors[0]}15 0%, transparent 60%)`,
      }}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
          <h2
            className="text-lg font-bold tracking-tight"
            style={{ color: theme.textPrimary }}
          >
            {widget.title}
          </h2>
          <span
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: `${theme.accent}15`,
              color: theme.accent,
              borderColor: `${theme.accent}30`,
            }}
          >
            Section
          </span>
        </div>
        {widget.subtitle && (
          <p className="text-xs max-w-2xl" style={{ color: theme.textSecondary }}>
            {widget.subtitle}
          </p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
            color: theme.textSecondary,
          }}
        >
          <Sparkles size={13} style={{ color: theme.accent }} />
          <span>Interactive Grid</span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
            color: theme.textSecondary,
          }}
        >
          <Layers size={13} style={{ color: theme.colors[1] || theme.accent }} />
          <span>12-Col Responsive</span>
        </div>
      </div>
    </div>
  );
};
