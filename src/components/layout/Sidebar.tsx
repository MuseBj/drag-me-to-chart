import { useState } from 'react';
import type { DragEvent } from 'react';
import type { ColorTheme, WidgetCatalogItem } from '../../types/dashboard';
import { WIDGET_CATALOG } from '../../constants/widgetCatalog';
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
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
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
                Drag or click to insert
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
                      ? 'shadow-sm'
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
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => onAddWidget(item)}
                className="group p-2.5 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99] relative"
                style={{
                  backgroundColor: theme.cardHeaderBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-lg transition-colors group-hover:scale-110 duration-200"
                      style={{
                        backgroundColor: `${theme.accent}15`,
                        color: theme.accent,
                      }}
                    >
                      {getIcon(item.icon)}
                    </div>
                    <div>
                      <h4
                        className="text-xs font-semibold group-hover:underline underline-offset-2"
                        style={{ color: theme.textPrimary }}
                      >
                        {item.name}
                      </h4>
                      <span
                        className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium"
                        style={{
                          backgroundColor: `${theme.colors[1] || theme.accent}15`,
                          color: theme.colors[1] || theme.accent,
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddWidget(item);
                    }}
                    className="p-1 rounded-md hover:bg-white/10 transition-colors opacity-70 group-hover:opacity-100"
                    style={{ color: theme.accent }}
                    title="Add to canvas"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p
                  className="text-[11px] line-clamp-2 mt-2 leading-relaxed opacity-75"
                  style={{ color: theme.textSecondary }}
                >
                  {item.description}
                </p>

                <div
                  className="mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] opacity-60"
                  style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
                >
                  <div className="flex items-center gap-1">
                    <GripHorizontal size={11} />
                    <span>Drag & Drop</span>
                  </div>
                  <span>Default {item.defaultColSpan}/12 cols</span>
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
          {WIDGET_CATALOG.slice(0, 10).map((item) => (
            <button
              key={item.type}
              onClick={() => onAddWidget(item)}
              className="p-2.5 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white"
              title={`Add ${item.name}`}
            >
              {getIcon(item.icon)}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};
