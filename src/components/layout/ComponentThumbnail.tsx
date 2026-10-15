import type { ChartType, ColorTheme } from '../../types/dashboard';

interface ComponentThumbnailProps {
  type: ChartType;
  theme: ColorTheme;
  className?: string;
}

export const ComponentThumbnail = ({
  type,
  theme,
  className = 'w-16 h-12',
}: ComponentThumbnailProps) => {
  const c1 = theme.colors[0] || theme.accent;
  const c2 = theme.colors[1] || theme.accent;
  const c3 = theme.colors[2] || theme.textSecondary;
  const grid = theme.gridLineColor || 'rgba(255,255,255,0.1)';

  switch (type) {
    case 'donut':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <circle cx="32" cy="24" r="16" fill="none" stroke={c1} strokeWidth="6" strokeDasharray="60 40" strokeDashoffset="10" />
          <circle cx="32" cy="24" r="16" fill="none" stroke={c2} strokeWidth="6" strokeDasharray="30 70" strokeDashoffset="70" />
          <circle cx="32" cy="24" r="6" fill={theme.cardBg} />
        </svg>
      );

    case 'pie':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <circle cx="32" cy="24" r="16" fill={c1} />
          <path d="M 32 24 L 32 8 A 16 16 0 0 1 48 24 Z" fill={c2} />
          <path d="M 32 24 L 48 24 A 16 16 0 0 1 38 39 Z" fill={c3} />
        </svg>
      );

    case 'rose':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <path d="M 32 24 L 32 8 A 16 16 0 0 1 45 16 Z" fill={c1} opacity="0.9" />
          <path d="M 32 24 L 45 16 A 14 14 0 0 1 46 28 Z" fill={c2} opacity="0.8" />
          <path d="M 32 24 L 46 28 A 12 12 0 0 1 36 36 Z" fill={c3} opacity="0.8" />
          <path d="M 32 24 L 36 36 A 10 10 0 0 1 24 33 Z" fill={c1} opacity="0.7" />
          <path d="M 32 24 L 24 33 A 15 15 0 0 1 20 20 Z" fill={c2} opacity="0.9" />
        </svg>
      );

    case 'area':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <defs>
            <linearGradient id={`area-grad-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c1} stopOpacity="0.6" />
              <stop offset="100%" stopColor={c1} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d="M 8 38 L 8 28 Q 20 12 32 22 T 56 14 L 56 38 Z" fill={`url(#area-grad-${type})`} />
          <path d="M 8 28 Q 20 12 32 22 T 56 14" fill="none" stroke={c1} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'line':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <line x1="8" y1="38" x2="56" y2="38" stroke={grid} strokeWidth="1" />
          <path d="M 8 32 L 20 16 L 34 26 L 46 12 L 56 20" fill="none" stroke={c1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 8 36 L 20 28 L 34 32 L 46 22 L 56 26" fill="none" stroke={c2} strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      );

    case 'bar':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <line x1="8" y1="40" x2="56" y2="40" stroke={grid} strokeWidth="1" />
          <rect x="12" y="24" width="7" height="16" rx="2" fill={c1} />
          <rect x="23" y="14" width="7" height="26" rx="2" fill={c1} />
          <rect x="34" y="20" width="7" height="20" rx="2" fill={c1} />
          <rect x="45" y="10" width="7" height="30" rx="2" fill={c2} />
        </svg>
      );

    case 'stacked-bar':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <line x1="8" y1="40" x2="56" y2="40" stroke={grid} strokeWidth="1" />
          {/* Bar 1 */}
          <rect x="14" y="28" width="8" height="12" fill={c1} rx="1" />
          <rect x="14" y="20" width="8" height="7" fill={c2} />
          <rect x="14" y="14" width="8" height="5" fill={c3} rx="1" />
          {/* Bar 2 */}
          <rect x="28" y="24" width="8" height="16" fill={c1} rx="1" />
          <rect x="28" y="14" width="8" height="9" fill={c2} />
          <rect x="28" y="8" width="8" height="5" fill={c3} rx="1" />
          {/* Bar 3 */}
          <rect x="42" y="26" width="8" height="14" fill={c1} rx="1" />
          <rect x="42" y="18" width="8" height="7" fill={c2} />
          <rect x="42" y="12" width="8" height="5" fill={c3} rx="1" />
        </svg>
      );

    case 'horizontal-bar':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <rect x="8" y="10" width="46" height="6" rx="3" fill={c1} />
          <rect x="8" y="20" width="34" height="6" rx="3" fill={c1} opacity="0.8" />
          <rect x="8" y="30" width="22" height="6" rx="3" fill={c2} />
        </svg>
      );

    case 'heatmap-calendar':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <g transform="translate(10, 8)">
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3, 4, 5].map((col) => {
                const op = ((row * 3 + col * 5) % 9) / 10 + 0.15;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={col * 7.5}
                    y={row * 8}
                    width="6"
                    height="6"
                    rx="1.5"
                    fill={c1}
                    opacity={op}
                  />
                );
              })
            )}
          </g>
        </svg>
      );

    case 'heatmap-matrix':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <g transform="translate(14, 8)">
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => {
                const isDiag = row === col;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={col * 9}
                    y={row * 8}
                    width="7.5"
                    height="6.5"
                    rx="1"
                    fill={isDiag ? c1 : row + col > 3 ? c2 : c3}
                    opacity={isDiag ? 1 : 0.4 + (row * 0.15)}
                  />
                );
              })
            )}
          </g>
        </svg>
      );

    case 'scatter':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <circle cx="16" cy="30" r="5" fill={c1} opacity="0.8" />
          <circle cx="28" cy="18" r="8" fill={c2} opacity="0.85" />
          <circle cx="44" cy="26" r="6" fill={c1} opacity="0.9" />
          <circle cx="50" cy="14" r="4" fill={c3} opacity="0.7" />
          <circle cx="36" cy="36" r="5" fill={c2} opacity="0.8" />
        </svg>
      );

    case 'radar':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          {/* Web lines */}
          <polygon points="32,8 48,16 48,32 32,40 16,32 16,16" fill="none" stroke={grid} strokeWidth="1" />
          <polygon points="32,14 42,19 42,29 32,34 22,29 22,19" fill="none" stroke={grid} strokeWidth="1" />
          {/* Radar area */}
          <polygon points="32,10 46,18 40,30 32,32 20,28 18,17" fill={c1} fillOpacity="0.4" stroke={c1} strokeWidth="1.5" />
        </svg>
      );

    case 'gauge':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <path d="M 14 36 A 20 20 0 1 1 50 36" fill="none" stroke={grid} strokeWidth="5" strokeLinecap="round" />
          <path d="M 14 36 A 20 20 0 1 1 44 20" fill="none" stroke={c1} strokeWidth="5" strokeLinecap="round" />
          <line x1="32" y1="32" x2="42" y2="22" stroke={theme.textPrimary} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="3" fill={theme.cardBg} stroke={c1} strokeWidth="1.5" />
        </svg>
      );

    case 'funnel':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <polygon points="12,10 52,10 46,18 18,18" fill={c1} />
          <polygon points="19,20 45,20 40,28 24,28" fill={c1} opacity="0.8" />
          <polygon points="25,30 39,30 36,38 28,38" fill={c2} />
        </svg>
      );

    case 'treemap':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <rect x="8" y="8" width="30" height="32" rx="2" fill={c1} opacity="0.85" />
          <rect x="40" y="8" width="16" height="18" rx="2" fill={c2} opacity="0.9" />
          <rect x="40" y="28" width="16" height="12" rx="2" fill={c3} opacity="0.8" />
        </svg>
      );

    case 'kpi':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <text x="10" y="20" fill={theme.textPrimary} fontSize="11" fontWeight="bold" fontFamily="monospace">
            248K
          </text>
          <rect x="38" y="10" width="18" height="9" rx="4.5" fill={c1} opacity="0.2" />
          <text x="41" y="17" fill={c1} fontSize="7" fontWeight="bold">
            +14%
          </text>
          <path d="M 10 36 Q 22 26 34 32 T 54 26" fill="none" stroke={c1} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'table':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <rect x="8" y="8" width="48" height="7" rx="1.5" fill={grid} />
          <rect x="8" y="18" width="20" height="5" rx="1" fill={c1} opacity="0.7" />
          <rect x="32" y="18" width="14" height="5" rx="1" fill={c2} opacity="0.7" />
          <rect x="8" y="26" width="24" height="5" rx="1" fill={theme.textSecondary} opacity="0.5" />
          <rect x="36" y="26" width="10" height="5" rx="1" fill={c1} opacity="0.7" />
          <rect x="8" y="34" width="16" height="5" rx="1" fill={theme.textSecondary} opacity="0.5" />
          <rect x="28" y="34" width="18" height="5" rx="1" fill={c3} opacity="0.7" />
        </svg>
      );

    case 'banner':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <rect x="6" y="14" width="52" height="20" rx="4" fill={theme.cardBg} stroke={c1} strokeWidth="1" />
          <circle cx="14" cy="24" r="3" fill={c1} />
          <rect x="20" y="21" width="22" height="3.5" rx="1" fill={theme.textPrimary} />
          <rect x="20" y="27" width="14" height="2" rx="0.5" fill={theme.textSecondary} />
        </svg>
      );

    case 'event-timeline':
      return (
        <svg viewBox="0 0 64 48" className={className}>
          {/* Top bars */}
          <rect x="12" y="18" width="5" height="10" rx="1" fill={c1} />
          <rect x="20" y="10" width="5" height="18" rx="1" fill={c1} />
          <rect x="28" y="14" width="5" height="14" rx="1" fill={c1} />
          <rect x="36" y="8" width="5" height="20" rx="1" fill={c2} />
          <rect x="44" y="12" width="5" height="16" rx="1" fill={c1} />
          {/* Divider */}
          <line x1="8" y1="31" x2="56" y2="31" stroke={grid} strokeWidth="1" />
          {/* Swimlane dots */}
          <circle cx="22.5" cy="35" r="2" fill={c2} />
          <circle cx="38.5" cy="39" r="2.2" fill={c1} />
          <circle cx="14.5" cy="41" r="1.5" fill={theme.textSecondary} />
          <circle cx="46.5" cy="35" r="2" fill={c2} />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 48" className={className}>
          <rect x="10" y="10" width="44" height="28" rx="4" fill={c1} opacity="0.3" />
        </svg>
      );
  }
};
