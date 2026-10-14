import type { ColorTheme, WidgetConfig } from '../../types/dashboard';
import { MOCK_DATA } from '../../constants/mockData';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TableWidgetProps {
  widget?: WidgetConfig;
  theme: ColorTheme;
}

export const TableWidget = ({ widget, theme }: TableWidgetProps) => {
  const isMedical =
    widget?.domain === 'medical-sre' ||
    widget?.id.includes('medical') ||
    widget?.id.includes('synth') ||
    widget?.targetMetricName?.toLowerCase().includes('probe');

  const rows = isMedical && MOCK_DATA.medicalTableRows
    ? MOCK_DATA.medicalTableRows
    : MOCK_DATA.tableRows;

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Healthy':
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Warning':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Critical':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: theme.cardBorder,
                backgroundColor: theme.cardHeaderBg,
                color: theme.textSecondary,
              }}
            >
              <th className="py-2.5 px-3 font-semibold">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>{isMedical ? 'Probe ID' : 'Record ID'}</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">
                {isMedical ? 'Synthetic Check / Target' : 'Account / Target'}
              </th>
              <th className="py-2.5 px-3 font-semibold">
                {isMedical ? 'Alias / Protocol Details' : 'Category'}
              </th>
              <th className="py-2.5 px-3 font-semibold text-right">
                {isMedical ? 'Measured SLI (SLO)' : 'Value ($)'}
              </th>
              <th className="py-2.5 px-3 font-semibold text-center">Health Status</th>
              <th className="py-2.5 px-3 font-semibold text-right">Last Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: theme.gridLineColor }}>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-white/5 transition-colors"
                style={{ color: theme.textPrimary }}
              >
                <td className="py-2.5 px-3 font-mono font-medium" style={{ color: theme.accent }}>
                  {row.id}
                </td>
                <td className="py-2.5 px-3 font-medium">{row.target}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: theme.textSecondary }}>
                  {row.category}
                </td>
                <td className="py-2.5 px-3 font-mono font-semibold text-right">{row.value}</td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${getBadgeStyle(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right" style={{ color: theme.textMuted }}>
                  {row.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="flex items-center justify-between pt-2 px-3 border-t text-[11px]"
        style={{ borderColor: theme.cardBorder, color: theme.textSecondary }}
      >
        <span>Showing 6 of 124 records</span>
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-40"
            disabled
          >
            <ChevronLeft size={14} />
          </button>
          <span className="font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.cardHeaderBg }}>
            1
          </span>
          <button className="p-1 rounded hover:bg-white/10 transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
