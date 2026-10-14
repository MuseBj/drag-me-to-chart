import { useState } from 'react';
import type { DragEvent } from 'react';
import type { ColorTheme, DashboardLayout, WidgetConfig, WidgetCatalogItem } from '../../types/dashboard';
import { DashboardCard } from '../widgets/DashboardCard';
import { LayoutGrid, Plus, Sparkles, FolderOpen, ArrowDown } from 'lucide-react';

interface CanvasProps {
  layout: DashboardLayout;
  theme: ColorTheme;
  selectedWidget: WidgetConfig | null;
  onSelectWidget: (widget: WidgetConfig) => void;
  onDeleteWidget: (id: string) => void;
  onDuplicateWidget: (widget: WidgetConfig) => void;
  onResizeSpan: (id: string, colSpan: number) => void;
  onReorderWidgets: (startIndex: number, endIndex: number) => void;
  onDropFromCatalog: (item: WidgetCatalogItem, targetIndex?: number) => void;
  onLoadTemplate: (key: string) => void;
}

export const Canvas = ({
  layout,
  theme,
  selectedWidget,
  onSelectWidget,
  onDeleteWidget,
  onDuplicateWidget,
  onResizeSpan,
  onReorderWidgets,
  onDropFromCatalog,
  onLoadTemplate,
}: CanvasProps) => {
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isCatalogDraggingOver, setIsCatalogDraggingOver] = useState(false);

  // Card re-ordering drag handlers
  const handleCardDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCardIndex(index);
  };

  const handleCardDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleCardDrop = (e: DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if drop is from catalog
    const catalogData = e.dataTransfer.getData('application/json');
    if (catalogData) {
      try {
        const item: WidgetCatalogItem = JSON.parse(catalogData);
        onDropFromCatalog(item, targetIndex);
      } catch (err) {
        console.error('Failed to parse dropped catalog item', err);
      }
    } else {
      // Reorder cards
      const sourceIndexStr = e.dataTransfer.getData('text/plain');
      const sourceIndex = parseInt(sourceIndexStr, 10);
      if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
        onReorderWidgets(sourceIndex, targetIndex);
      }
    }

    setDraggedCardIndex(null);
    setDragOverIndex(null);
    setIsCatalogDraggingOver(false);
  };

  const handleCardDragEnd = () => {
    setDraggedCardIndex(null);
    setDragOverIndex(null);
    setIsCatalogDraggingOver(false);
  };

  // Canvas-level drop (e.g. drop at the end of board)
  const handleCanvasDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsCatalogDraggingOver(true);
  };

  const handleCanvasDragLeave = () => {
    setIsCatalogDraggingOver(false);
  };

  const handleCanvasDrop = (e: DragEvent) => {
    e.preventDefault();
    const catalogData = e.dataTransfer.getData('application/json');
    if (catalogData) {
      try {
        const item: WidgetCatalogItem = JSON.parse(catalogData);
        onDropFromCatalog(item);
      } catch (err) {
        console.error('Failed to parse catalog drop', err);
      }
    }
    setIsCatalogDraggingOver(false);
  };

  return (
    <main
      className="flex-1 overflow-y-auto p-4 md:p-8 transition-colors min-h-screen"
      style={{ backgroundColor: theme.canvasBg }}
      onDragOver={handleCanvasDragOver}
      onDragLeave={handleCanvasDragLeave}
      onDrop={handleCanvasDrop}
    >
      {/* Printable / Capturable Container */}
      <div
        id="dashboard-canvas"
        className="max-w-[1600px] mx-auto p-6 md:p-8 rounded-2xl transition-all"
        style={{
          backgroundColor: theme.canvasBg,
        }}
      >
        {/* Dashboard Title & Meta header inside canvas */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b" style={{ borderColor: theme.cardBorder }}>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.accent }}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono opacity-80" style={{ color: theme.accent }}>
                Interactive Blueprint Preview
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1" style={{ color: theme.textPrimary }}>
              {layout.title}
            </h2>
            <p className="text-xs md:text-sm mt-1 max-w-3xl opacity-80" style={{ color: theme.textSecondary }}>
              {layout.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs no-export">
            <span
              className="px-2.5 py-1 rounded-full border text-[11px] font-semibold"
              style={{
                borderColor: theme.cardBorder,
                backgroundColor: theme.cardHeaderBg,
                color: theme.textSecondary,
              }}
            >
              {layout.widgets.length} Components
            </span>
            <span
              className="px-2.5 py-1 rounded-full border text-[11px] font-semibold"
              style={{
                borderColor: `${theme.accent}40`,
                backgroundColor: `${theme.accent}15`,
                color: theme.accent,
              }}
            >
              Theme: {theme.name}
            </span>
          </div>
        </div>

        {/* 12-Column Responsive Grid */}
        {layout.widgets.length > 0 ? (
          <div className="grid grid-cols-12 gap-5 transition-all">
            {layout.widgets.map((widget, index) => (
              <DashboardCard
                key={widget.id}
                widget={widget}
                theme={theme}
                index={index}
                isSelected={selectedWidget?.id === widget.id}
                onSelect={onSelectWidget}
                onDelete={onDeleteWidget}
                onDuplicate={onDuplicateWidget}
                onResizeSpan={onResizeSpan}
                onDragStart={handleCardDragStart}
                onDragOver={handleCardDragOver}
                onDrop={handleCardDrop}
                onDragEnd={handleCardDragEnd}
                isDraggingOver={dragOverIndex === index && draggedCardIndex !== index}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div
            className="rounded-2xl border-2 border-dashed p-12 text-center flex flex-col items-center justify-center my-8 transition-all"
            style={{
              borderColor: theme.cardBorder,
              backgroundColor: theme.cardHeaderBg,
            }}
          >
            <div
              className="p-4 rounded-2xl mb-4"
              style={{
                backgroundColor: `${theme.accent}15`,
                color: theme.accent,
              }}
            >
              <LayoutGrid size={36} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: theme.textPrimary }}>
              Your Dashboard Canvas is Empty
            </h3>
            <p className="text-xs max-w-md mt-1 opacity-75 leading-relaxed" style={{ color: theme.textSecondary }}>
              Drag charts and widgets from the component sidebar on the left, click "+ Add Component" above, or choose a pre-configured template below.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => onLoadTemplate('medical')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border hover:bg-white/10 transition-colors shadow-sm"
                style={{
                  borderColor: theme.accent,
                  backgroundColor: `${theme.accent}15`,
                  color: theme.accent,
                }}
              >
                <Sparkles size={14} style={{ color: theme.accent }} />
                <span>Load Patient Pipeline SRE (Medical)</span>
              </button>
              <button
                onClick={() => onLoadTemplate('saas')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border hover:bg-white/10 transition-colors"
                style={{
                  borderColor: theme.cardBorder,
                  color: theme.textPrimary,
                }}
              >
                <FolderOpen size={14} style={{ color: theme.accent }} />
                <span>Load SaaS Analytics</span>
              </button>
              <button
                onClick={() => onLoadTemplate('devops')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border hover:bg-white/10 transition-colors"
                style={{
                  borderColor: theme.cardBorder,
                  color: theme.textPrimary,
                }}
              >
                <Sparkles size={14} style={{ color: theme.colors[1] || theme.accent }} />
                <span>Load DevOps Monitoring</span>
              </button>
              <button
                onClick={() => onLoadTemplate('ecommerce')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border hover:bg-white/10 transition-colors"
                style={{
                  borderColor: theme.cardBorder,
                  color: theme.textPrimary,
                }}
              >
                <Plus size={14} style={{ color: theme.colors[2] || theme.accent }} />
                <span>Load E-Commerce Sales</span>
              </button>
            </div>
          </div>
        )}

        {/* Drop zone indicator when dragging from catalog */}
        {isCatalogDraggingOver && (
          <div
            className="mt-6 p-6 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs font-semibold animate-pulse"
            style={{
              borderColor: theme.accent,
              backgroundColor: `${theme.accent}10`,
              color: theme.accent,
            }}
          >
            <ArrowDown size={16} />
            <span>Drop new component here to append to bottom of dashboard</span>
          </div>
        )}
      </div>
    </main>
  );
};
