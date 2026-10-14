import { useState } from 'react';
import type { DragEvent } from 'react';
import type { ColorTheme, WidgetConfig } from '../../types/dashboard';
import { EChartRenderer } from '../charts/EChartRenderer';
import { KpiWidget } from './KpiWidget';
import { TableWidget } from './TableWidget';
import { BannerWidget } from './BannerWidget';
import {
  GripVertical,
  Settings,
  Copy,
  Trash2,
  ChevronDown,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface DashboardCardProps {
  widget: WidgetConfig;
  theme: ColorTheme;
  index: number;
  isSelected: boolean;
  onSelect: (widget: WidgetConfig) => void;
  onDelete: (id: string) => void;
  onDuplicate: (widget: WidgetConfig) => void;
  onResizeSpan: (id: string, colSpan: number) => void;
  onDragStart: (e: DragEvent, index: number) => void;
  onDragOver: (e: DragEvent, index: number) => void;
  onDrop: (e: DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDraggingOver: boolean;
}

export const DashboardCard = ({
  widget,
  theme,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onResizeSpan,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDraggingOver,
}: DashboardCardProps) => {
  const [showColPicker, setShowColPicker] = useState(false);

  const colSpanOptions = [
    { span: 3, label: '1/4 (3 col)' },
    { span: 4, label: '1/3 (4 col)' },
    { span: 6, label: '1/2 (6 col)' },
    { span: 8, label: '2/3 (8 col)' },
    { span: 12, label: 'Full (12 col)' },
  ];

  // Tailored tailwind colSpan class mappings
  const getColSpanClass = (span: number) => {
    switch (span) {
      case 1: return 'col-span-12 sm:col-span-6 lg:col-span-1';
      case 2: return 'col-span-12 sm:col-span-6 lg:col-span-2';
      case 3: return 'col-span-12 sm:col-span-6 lg:col-span-3';
      case 4: return 'col-span-12 sm:col-span-6 lg:col-span-4';
      case 5: return 'col-span-12 sm:col-span-6 lg:col-span-5';
      case 6: return 'col-span-12 lg:col-span-6';
      case 7: return 'col-span-12 lg:col-span-7';
      case 8: return 'col-span-12 lg:col-span-8';
      case 9: return 'col-span-12 lg:col-span-9';
      case 10: return 'col-span-12 lg:col-span-10';
      case 11: return 'col-span-12 lg:col-span-11';
      case 12: default: return 'col-span-12';
    }
  };

  const renderContent = () => {
    switch (widget.type) {
      case 'kpi':
        return <KpiWidget widget={widget} theme={theme} />;
      case 'table':
        return <TableWidget widget={widget} theme={theme} />;
      case 'banner':
        return <BannerWidget widget={widget} theme={theme} />;
      default:
        return <EChartRenderer widget={widget} theme={theme} />;
    }
  };

  const isBanner = widget.type === 'banner';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(widget)}
      className={`group relative rounded-xl transition-all duration-200 flex flex-col ${getColSpanClass(
        widget.colSpan
      )} ${
        isDraggingOver ? 'ring-2 ring-dashed ring-offset-2 ring-blue-500 scale-[0.99] opacity-75' : ''
      } ${
        isSelected
          ? 'shadow-xl ring-2'
          : 'hover:shadow-lg'
      }`}
      style={{
        backgroundColor: theme.cardBg,
        borderColor: isSelected ? theme.accent : theme.cardBorder,
        borderWidth: 1,
        borderStyle: 'solid',
        minHeight: `${widget.height}px`,
        boxShadow: isSelected ? `0 0 0 2px ${theme.accent}60, 0 10px 25px -5px rgba(0, 0, 0, 0.3)` : undefined,
      }}
    >
      {/* Card Header (hidden on plain banner if desired, or simplified) */}
      {!isBanner && (
        <div
          className="flex items-center justify-between px-3.5 py-2.5 rounded-t-xl border-b select-none"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
          }}
        >
          {/* Drag Handle & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10 text-gray-400 no-export"
              title="Drag to rearrange"
            >
              <GripVertical size={14} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3
                  className="text-xs font-semibold truncate tracking-tight"
                  style={{ color: theme.textPrimary }}
                >
                  {widget.title}
                </h3>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium opacity-80"
                  style={{
                    backgroundColor: `${theme.accent}18`,
                    color: theme.accent,
                  }}
                >
                  {widget.type}
                </span>
              </div>
              {widget.subtitle && (
                <p
                  className="text-[11px] truncate opacity-75 mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  {widget.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action Toolbar (no-export tag so screenshots stay pristine) */}
          <div className="flex items-center gap-1 pl-2 opacity-80 group-hover:opacity-100 transition-opacity no-export">
            {/* Quick ColSpan Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColPicker(!showColPicker);
                }}
                className="flex items-center gap-1 px-1.5 py-1 text-[11px] rounded hover:bg-white/10 transition-colors"
                style={{ color: theme.textSecondary }}
                title="Resize column width span"
              >
                <Maximize2 size={12} />
                <span>{widget.colSpan}/12</span>
                <ChevronDown size={10} />
              </button>

              {showColPicker && (
                <div
                  className="absolute right-0 top-full mt-1 w-32 rounded-lg shadow-xl border py-1 z-30 text-xs backdrop-blur-md"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                    color: theme.textPrimary,
                  }}
                >
                  {colSpanOptions.map((opt) => (
                    <button
                      key={opt.span}
                      onClick={(e) => {
                        e.stopPropagation();
                        onResizeSpan(widget.id, opt.span);
                        setShowColPicker(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-white/10 transition-colors ${
                        widget.colSpan === opt.span ? 'font-bold' : ''
                      }`}
                      style={{
                        color: widget.colSpan === opt.span ? theme.accent : theme.textPrimary,
                      }}
                    >
                      <span>{opt.label}</span>
                      {widget.colSpan === opt.span && <span className="text-[10px]">●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Edit / Inspect */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(widget);
              }}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              style={{ color: theme.textSecondary }}
              title="Edit Title, Metrics & LLM Notes"
            >
              <Settings size={13} />
            </button>

            {/* Duplicate */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(widget);
              }}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              style={{ color: theme.textSecondary }}
              title="Duplicate Component"
            >
              <Copy size={13} />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(widget.id);
              }}
              className="p-1 rounded hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
              title="Remove from Dashboard"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Bar for Banners */}
      {isBanner && (
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10 no-export opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(widget);
            }}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
            title="Edit Banner"
          >
            <Settings size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(widget.id);
            }}
            className="p-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/60 text-rose-200 backdrop-blur-sm"
            title="Delete Banner"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {/* Card Body */}
      <div className="flex-1 p-3.5 overflow-hidden flex flex-col">
        {renderContent()}
      </div>

      {/* LLM / Metric Tag Indicator at Footer */}
      {!isBanner && widget.targetMetricName && (
        <div
          className="px-3.5 py-1.5 text-[10px] border-t flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity select-none"
          style={{
            borderColor: theme.cardBorder,
            backgroundColor: `${theme.cardHeaderBg}50`,
            color: theme.textMuted,
          }}
        >
          <div className="flex items-center gap-1 truncate">
            <span className="font-medium text-gray-400">Metric:</span>
            <span className="font-mono" style={{ color: theme.textSecondary }}>
              {widget.targetMetricName}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Sparkles size={10} style={{ color: theme.accent }} />
            <span className="text-[9px] uppercase tracking-wider">Ready for LLM</span>
          </div>
        </div>
      )}
    </div>
  );
};
