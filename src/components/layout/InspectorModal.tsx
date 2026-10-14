import { useState, useEffect } from 'react';
import type { ColorTheme, WidgetConfig } from '../../types/dashboard';
import { X, Sparkles, Sliders, Check, Trash2 } from 'lucide-react';

interface InspectorModalProps {
  widget: WidgetConfig | null;
  theme: ColorTheme;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedWidget: WidgetConfig) => void;
  onDelete: (id: string) => void;
}

export const InspectorModal = ({
  widget,
  theme,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: InspectorModalProps) => {
  const [formState, setFormState] = useState<WidgetConfig | null>(widget);

  useEffect(() => {
    setFormState(widget);
  }, [widget]);

  if (!isOpen || !formState) return null;

  const handleChange = (field: keyof WidgetConfig, value: any) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleKpiChange = (field: string, value: any) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        kpiData: {
          value: prev.kpiData?.value ?? '',
          unit: prev.kpiData?.unit ?? '',
          change: prev.kpiData?.change ?? '',
          isPositive: prev.kpiData?.isPositive ?? true,
          period: prev.kpiData?.period ?? '',
          subtext: prev.kpiData?.subtext ?? '',
          [field]: value,
        },
      };
    });
  };

  const handleSave = () => {
    if (formState) {
      onSave(formState);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
            >
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                Configure Component
              </h3>
              <p className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
                Customize layout labels, metric semantics & LLM specification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Title & Subtitle */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1" style={{ color: theme.textSecondary }}>
                Component Title
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none text-xs"
                style={{
                  backgroundColor: theme.canvasBg,
                  borderColor: theme.cardBorder,
                  color: theme.textPrimary,
                }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1" style={{ color: theme.textSecondary }}>
                Subtitle / Description
              </label>
              <input
                type="text"
                value={formState.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Brief explanatory context"
                className="w-full px-3 py-2 rounded-lg border focus:outline-none text-xs"
                style={{
                  backgroundColor: theme.canvasBg,
                  borderColor: theme.cardBorder,
                  color: theme.textPrimary,
                }}
              />
            </div>
          </div>

          {/* Metric Name */}
          <div>
            <label className="block font-semibold mb-1" style={{ color: theme.textSecondary }}>
              Target Metric / Telemetry Name
            </label>
            <input
              type="text"
              value={formState.targetMetricName || ''}
              onChange={(e) => handleChange('targetMetricName', e.target.value)}
              placeholder="e.g. ARR ($), Hourly QPS, P99 Latency (ms)"
              className="w-full px-3 py-2 rounded-lg border focus:outline-none text-xs font-mono"
              style={{
                backgroundColor: theme.canvasBg,
                borderColor: theme.cardBorder,
                color: theme.accent,
              }}
            />
          </div>

          {/* KPI Specific Fields */}
          {formState.type === 'kpi' && (
            <div
              className="p-3 rounded-xl border space-y-3"
              style={{ backgroundColor: theme.cardHeaderBg, borderColor: theme.cardBorder }}
            >
              <h4 className="font-semibold text-xs" style={{ color: theme.textPrimary }}>
                KPI Stat Parameters
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] mb-1" style={{ color: theme.textSecondary }}>
                    Display Value
                  </label>
                  <input
                    type="text"
                    value={formState.kpiData?.value || ''}
                    onChange={(e) => handleKpiChange('value', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border focus:outline-none"
                    style={{
                      backgroundColor: theme.canvasBg,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1" style={{ color: theme.textSecondary }}>
                    Delta / Change (%)
                  </label>
                  <input
                    type="text"
                    value={formState.kpiData?.change || ''}
                    onChange={(e) => handleKpiChange('change', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border focus:outline-none"
                    style={{
                      backgroundColor: theme.canvasBg,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dimensions: Grid Span & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold" style={{ color: theme.textSecondary }}>
                  Column Span ({formState.colSpan}/12)
                </label>
                <span className="text-[10px] opacity-75" style={{ color: theme.textMuted }}>
                  {formState.colSpan <= 3 ? '1/4 width' : formState.colSpan <= 4 ? '1/3 width' : formState.colSpan <= 6 ? '1/2 width' : formState.colSpan <= 8 ? '2/3 width' : 'Full width'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={formState.colSpan}
                onChange={(e) => handleChange('colSpan', parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] opacity-50 mt-1" style={{ color: theme.textSecondary }}>
                <span>1 col</span>
                <span>4 col</span>
                <span>6 col</span>
                <span>8 col</span>
                <span>12 col</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold" style={{ color: theme.textSecondary }}>
                  Card Height ({formState.height}px)
                </label>
              </div>
              <input
                type="range"
                min="120"
                max="600"
                step="20"
                value={formState.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] opacity-50 mt-1" style={{ color: theme.textSecondary }}>
                <span>120px</span>
                <span>300px</span>
                <span>450px</span>
                <span>600px</span>
              </div>
            </div>
          </div>

          {/* Chart Display Toggles */}
          {['pie', 'donut', 'rose', 'line', 'area', 'bar', 'stacked-bar', 'radar', 'funnel'].includes(formState.type) && (
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: theme.textSecondary }}>
                <input
                  type="checkbox"
                  checked={formState.showLegend !== false}
                  onChange={(e) => handleChange('showLegend', e.target.checked)}
                  className="rounded accent-blue-500"
                />
                <span>Display Legend</span>
              </label>

              {['area', 'line'].includes(formState.type) && (
                <label className="flex items-center gap-2 cursor-pointer" style={{ color: theme.textSecondary }}>
                  <input
                    type="checkbox"
                    checked={formState.isSmooth !== false}
                    onChange={(e) => handleChange('isSmooth', e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Smooth Curve (Spline)</span>
                </label>
              )}
            </div>
          )}

          {/* Instructions for Coding LLMs */}
          <div
            className="p-3.5 rounded-xl border space-y-2"
            style={{
              backgroundColor: `${theme.accent}08`,
              borderColor: `${theme.accent}30`,
            }}
          >
            <div className="flex items-center gap-1.5" style={{ color: theme.accent }}>
              <Sparkles size={14} />
              <label className="font-bold text-xs uppercase tracking-wider">
                LLM Implementation Guidance & Notes
              </label>
            </div>
            <p className="text-[11px] opacity-80" style={{ color: theme.textSecondary }}>
              This description will be included in the exported prompt so your coding LLM knows exactly how to build this component, what queries to run, and how to format data.
            </p>
            <textarea
              rows={3}
              value={formState.descriptionForLLM || ''}
              onChange={(e) => handleChange('descriptionForLLM', e.target.value)}
              placeholder="e.g. Render an interactive line chart tracking P95/P99 latencies. When hovered, show exact millisecond timestamps and threshold alarms..."
              className="w-full px-3 py-2 rounded-lg border focus:outline-none text-xs"
              style={{
                backgroundColor: theme.canvasBg,
                borderColor: theme.cardBorder,
                color: theme.textPrimary,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3.5 border-t flex items-center justify-between"
          style={{
            backgroundColor: theme.cardHeaderBg,
            borderColor: theme.cardBorder,
          }}
        >
          <button
            onClick={() => {
              onDelete(formState.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={13} />
            <span>Delete Component</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors"
              style={{ color: theme.textSecondary }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-transform active:scale-95"
              style={{
                backgroundColor: theme.accent,
                color: '#ffffff',
              }}
            >
              <Check size={14} />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
