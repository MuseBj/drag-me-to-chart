import { useState, useRef } from 'react';
import type { DragEvent, MouseEvent } from 'react';
import type { ColorTheme, WidgetCatalogItem, WidgetConfig } from '../../types/dashboard';
import { WIDGET_CATALOG } from '../../constants/widgetCatalog';
import { ComponentThumbnail } from './ComponentThumbnail';
import { EChartRenderer } from '../charts/EChartRenderer';
import { KpiWidget } from '../widgets/KpiWidget';
import { TableWidget } from '../widgets/TableWidget';
import { BannerWidget } from '../widgets/BannerWidget';
import {
  PieChart,
  CircleDot,
  Sun,
  Grid,
  Flame,
  TrendingUp,
  Activity,
  BarChart2,
  Layers,
  AlignLeft,
  ScatterChart,
  Compass,
  Gauge,
  Filter,
  LayoutGrid,
  Hash,
  Table,
  Heading,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  GripHorizontal,
  Eye,
  X,
  Sparkles,
  Maximize2,
  Calendar,
} from 'lucide-react';

interface SidebarProps {
  theme: ColorTheme;
  isOpen: boolean;
  onToggle: () => void;
  onAddWidget: (item: WidgetCatalogItem) => void;
}

export const Sidebar = ({
  theme,
  isOpen,
  onToggle,
  onAddWidget,
}: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [hoveredItem, setHoveredItem] = useState<WidgetCatalogItem | null>(null);
  const [pinnedItem, setPinnedItem] = useState<WidgetCatalogItem | null>(null);
  const [flyoutCoords, setFlyoutCoords] = useState<{ top: number; left: number } | null>(null);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInsideFlyoutRef = useRef<boolean>(false);

  const categories = ['All', 'Charts', 'Heatmaps', 'Comparison', 'Metrics & Tables', 'Structure'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PieChart': return <PieChart size={16} />;
      case 'CircleDot': return <CircleDot size={16} />;
      case 'Sun': return <Sun size={16} />;
      case 'Grid': return <Grid size={16} />;
      case 'Flame': return <Flame size={16} />;
      case 'TrendingUp': return <TrendingUp size={16} />;
      case 'Activity': return <Activity size={16} />;
      case 'BarChart2': return <BarChart2 size={16} />;
      case 'Layers': return <Layers size={16} />;
      case 'AlignLeft': return <AlignLeft size={16} />;
      case 'ScatterPlot': return <ScatterChart size={16} />;
      case 'Compass': return <Compass size={16} />;
      case 'Gauge': return <Gauge size={16} />;
      case 'Filter': return <Filter size={16} />;
      case 'LayoutGrid': return <LayoutGrid size={16} />;
      case 'Hash': return <Hash size={16} />;
      case 'Table': return <Table size={16} />;
      case 'Heading': return <Heading size={16} />;
      case 'Calendar': return <Calendar size={16} />;
      default: return <BarChart2 size={16} />;
    }
  };

  const filteredItems = WIDGET_CATALOG.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: DragEvent, item: WidgetCatalogItem) => {
    // Clear preview when dragging begins
    setHoveredItem(null);
    setPinnedItem(null);
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Hover triggers for preview flyout
  const handleItemMouseEnter = (e: MouseEvent<HTMLElement>, item: WidgetCatalogItem) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Position flyout to the right of the sidebar, safely clamped inside viewport
    const top = Math.max(16, Math.min(rect.top - 20, window.innerHeight - 440));
    let left = rect.right + 12;
    if (left + 360 > window.innerWidth) {
      left = Math.max(16, rect.left - 370);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(item);
      setFlyoutCoords({ top, left });
    }, 120);
  };

  const handleItemMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isInsideFlyoutRef.current && !pinnedItem) {
        setHoveredItem(null);
      }
    }, 150);
  };

  const togglePinPreview = (e: MouseEvent, item: WidgetCatalogItem) => {
    e.stopPropagation();
    if (pinnedItem?.type === item.type) {
      setPinnedItem(null);
      setHoveredItem(null);
    } else {
      const rect = (e.currentTarget.closest('[data-catalog-card]') || e.currentTarget).getBoundingClientRect();
      const top = Math.max(16, Math.min(rect.top - 20, window.innerHeight - 440));
      let left = rect.right + 12;
      if (left + 360 > window.innerWidth) {
        left = Math.max(16, rect.left - 370);
      }
      setPinnedItem(item);
      setHoveredItem(item);
      setFlyoutCoords({ top, left });
    }
  };

  // Active preview item: pinned takes priority over hover
  const activePreview = pinnedItem || hoveredItem;

  const createPreviewWidget = (item: WidgetCatalogItem): WidgetConfig => ({
    id: `sidebar-preview-${item.type}`,
    type: item.type,
    title: item.defaultTitle,
    subtitle: item.defaultSubtitle,
    descriptionForLLM: item.defaultDescriptionForLLM,
    targetMetricName: item.defaultMetric,
    colSpan: item.defaultColSpan,
    height: item.defaultHeight,
    showLegend: true,
    domain: item.type === 'event-timeline' ? 'medical-sre' : 'saas',
    kpiData:
      item.type === 'kpi'
        ? {
            value: '$148,920',
            unit: '',
            change: '+14.2%',
            isPositive: true,
            period: 'vs last week',
            subtext: 'Tracking 4.2% above baseline expectation',
          }
        : undefined,
  });

  const renderPreviewContent = (item: WidgetCatalogItem) => {
    const previewWidget = createPreviewWidget(item);
    switch (item.type) {
      case 'kpi':
        return (
          <div className="h-36 w-full p-2">
            <KpiWidget widget={previewWidget} theme={theme} />
          </div>
        );
      case 'table':
        return (
          <div className="h-44 w-full p-1 overflow-hidden scale-90 origin-top">
            <TableWidget widget={previewWidget} theme={theme} />
          </div>
        );
      case 'banner':
        return (
          <div className="h-36 w-full p-1">
            <BannerWidget widget={previewWidget} theme={theme} />
          </div>
        );
      default:
        return (
          <div className="h-44 w-full">
            <EChartRenderer widget={previewWidget} theme={theme} />
          </div>
        );
    }
  };

  return (
    <aside
      className={`fixed lg:static top-0 left-0 h-full z-40 transition-all duration-300 flex flex-col border-r ${
        isOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'
      }`}
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.cardBorder,
      }}
    >
      {/* Sidebar Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardHeaderBg }}
      >
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
            >
              <LayoutGrid size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight" style={{ color: theme.textPrimary }}>
                Component Library
              </h2>
              <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                Visual thumbnails • Hover to preview
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto" title="Component Library">
            <LayoutGrid size={20} style={{ color: theme.accent }} />
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-white/10 text-gray-400 transition-colors"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b" style={{ borderColor: theme.cardBorder }}>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
              style={{
                backgroundColor: theme.canvasBg,
                borderColor: theme.cardBorder,
                color: theme.textPrimary,
              }}
            >
              <Search size={14} style={{ color: theme.textSecondary }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search charts, heatmaps..."
                className="w-full bg-transparent focus:outline-none placeholder:text-gray-500 text-xs"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'shadow-sm font-semibold'
                      : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: activeCategory === cat ? theme.accent : 'transparent',
                    color: activeCategory === cat ? '#ffffff' : theme.textSecondary,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Component Item List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredItems.map((item) => (
              <div
                key={item.type}
                data-catalog-card
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => onAddWidget(item)}
                onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                onMouseLeave={handleItemMouseLeave}
                className="group p-2.5 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99] relative flex flex-col gap-2"
                style={{
                  backgroundColor:
                    pinnedItem?.type === item.type
                      ? `${theme.accent}12`
                      : theme.cardHeaderBg,
                  borderColor:
                    pinnedItem?.type === item.type
                      ? theme.accent
                      : theme.cardBorder,
                }}
              >
                {/* Header Row: Thumbnail + Info + Actions */}
                <div className="flex items-start gap-2.5">
                  {/* Visual Miniature Vector Thumbnail */}
                  <div
                    className="w-14 h-11 flex-shrink-0 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105 duration-200 overflow-hidden shadow-sm"
                    style={{
                      backgroundColor: theme.canvasBg,
                      borderColor: theme.cardBorder,
                    }}
                    title={`Visual shape of ${item.name}`}
                  >
                    <ComponentThumbnail
                      type={item.type}
                      theme={theme}
                      className="w-12 h-9 p-0.5"
                    />
                  </div>

                  {/* Title & Category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4
                        className="text-xs font-semibold group-hover:underline underline-offset-2 truncate"
                        style={{ color: theme.textPrimary }}
                      >
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium"
                        style={{
                          backgroundColor: `${theme.colors[1] || theme.accent}18`,
                          color: theme.colors[1] || theme.accent,
                        }}
                      >
                        {item.category}
                      </span>
                      <span
                        className="text-[9px] opacity-60 font-mono"
                        style={{ color: theme.textSecondary }}
                      >
                        {item.defaultColSpan}/12 cols
                      </span>
                    </div>

                    <p
                      className="text-[11px] line-clamp-2 mt-1 leading-snug opacity-75"
                      style={{ color: theme.textSecondary }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Preview / Eye Button */}
                    <button
                      type="button"
                      onClick={(e) => togglePinPreview(e, item)}
                      className={`p-1.5 rounded-md transition-colors ${
                        pinnedItem?.type === item.type
                          ? 'bg-white/20'
                          : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                      }`}
                      style={{
                        color:
                          pinnedItem?.type === item.type
                            ? theme.accent
                            : theme.textSecondary,
                      }}
                      title="Inspect live preview"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Add to Canvas Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddWidget(item);
                      }}
                      className="p-1.5 rounded-md hover:bg-white/10 transition-colors opacity-70 group-hover:opacity-100"
                      style={{ color: theme.accent }}
                      title="Add to canvas"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                {/* Footer metadata */}
                <div
                  className="pt-1.5 border-t flex items-center justify-between text-[10px] opacity-60"
                  style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
                >
                  <div className="flex items-center gap-1">
                    <GripHorizontal size={11} />
                    <span>Drag & Drop</span>
                  </div>
                  <span className="truncate max-w-[130px]">{item.defaultMetric}</span>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-8" style={{ color: theme.textMuted }}>
                <Search size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No matching components found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed view icons */}
      {!isOpen && (
        <div className="flex-1 overflow-y-auto py-3 space-y-2 flex flex-col items-center">
          {WIDGET_CATALOG.slice(0, 14).map((item) => (
            <button
              key={item.type}
              onClick={() => onAddWidget(item)}
              onMouseEnter={(e) => handleItemMouseEnter(e, item)}
              onMouseLeave={handleItemMouseLeave}
              className="p-2.5 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white relative group"
              title={`Add ${item.name}`}
            >
              {getIcon(item.icon)}
            </button>
          ))}
        </div>
      )}

      {/* Floating Rich Preview Popover */}
      {activePreview && flyoutCoords && (
        <div
          onMouseEnter={() => {
            isInsideFlyoutRef.current = true;
          }}
          onMouseLeave={() => {
            isInsideFlyoutRef.current = false;
            if (!pinnedItem) {
              setHoveredItem(null);
            }
          }}
          className="fixed z-50 w-96 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95 flex flex-col overflow-hidden"
          style={{
            top: flyoutCoords.top,
            left: flyoutCoords.left,
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
            boxShadow: `0 20px 40px -15px rgba(0,0,0,0.6), 0 0 0 1px ${theme.cardBorder}`,
          }}
        >
          {/* Popover Header */}
          <div
            className="p-3.5 border-b flex items-center justify-between"
            style={{
              backgroundColor: theme.cardHeaderBg,
              borderColor: theme.cardBorder,
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: `${theme.accent}20`,
                  color: theme.accent,
                }}
              >
                {getIcon(activePreview.icon)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className="text-xs font-bold truncate"
                    style={{ color: theme.textPrimary }}
                  >
                    {activePreview.name}
                  </h3>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${theme.colors[1] || theme.accent}20`,
                      color: theme.colors[1] || theme.accent,
                    }}
                  >
                    {activePreview.category}
                  </span>
                </div>
                <p
                  className="text-[11px] truncate opacity-70 mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  {activePreview.defaultSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {pinnedItem ? (
                <button
                  onClick={() => {
                    setPinnedItem(null);
                    setHoveredItem(null);
                  }}
                  className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  title="Close preview"
                >
                  <X size={15} />
                </button>
              ) : (
                <div
                  className="text-[10px] px-1.5 py-0.5 rounded opacity-60 font-mono"
                  style={{ color: theme.textMuted }}
                >
                  Live Preview
                </div>
              )}
            </div>
          </div>

          {/* Metric & Layout Badge Strip */}
          <div
            className="px-3 py-1.5 border-b flex items-center justify-between text-[10px] font-mono"
            style={{
              backgroundColor: `${theme.cardHeaderBg}80`,
              borderColor: theme.cardBorder,
              color: theme.textSecondary,
            }}
          >
            <div className="flex items-center gap-1.5">
              <Maximize2 size={11} className="opacity-70" />
              <span>
                Default: {activePreview.defaultColSpan}/12 cols • ~{activePreview.defaultHeight}px
              </span>
            </div>
            <div className="truncate max-w-[140px] text-right font-medium" style={{ color: theme.accent }}>
              {activePreview.defaultMetric}
            </div>
          </div>

          {/* Live Component Preview Container */}
          <div
            className="p-3 flex items-center justify-center"
            style={{ backgroundColor: theme.canvasBg }}
          >
            <div
              className="w-full rounded-xl border p-2 shadow-inner overflow-hidden"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              }}
            >
              {renderPreviewContent(activePreview)}
            </div>
          </div>

          {/* Description & LLM Blueprint Prompt Note */}
          <div
            className="p-3 border-t text-[11px] space-y-1.5"
            style={{
              backgroundColor: theme.cardHeaderBg,
              borderColor: theme.cardBorder,
            }}
          >
            <div className="flex items-start gap-1.5">
              <Sparkles size={12} className="flex-shrink-0 mt-0.5" style={{ color: theme.accent }} />
              <p className="line-clamp-2 text-[10.5px] leading-relaxed" style={{ color: theme.textSecondary }}>
                <span className="font-semibold" style={{ color: theme.textPrimary }}>LLM Context: </span>
                {activePreview.defaultDescriptionForLLM}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <span className="text-[10px] opacity-60" style={{ color: theme.textMuted }}>
                {pinnedItem ? 'Preview pinned' : 'Hovering component'}
              </span>

              <button
                type="button"
                onClick={() => {
                  onAddWidget(activePreview);
                  setPinnedItem(null);
                  setHoveredItem(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                style={{ backgroundColor: theme.accent }}
              >
                <Plus size={14} />
                <span>Add to Canvas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
