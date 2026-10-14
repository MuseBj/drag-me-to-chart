import { useState } from 'react';
import confetti from 'canvas-confetti';
import type { ColorTheme, DashboardLayout, WidgetCatalogItem, WidgetConfig } from './types/dashboard';
import { COLOR_THEMES } from './constants/themes';
import { PRESET_TEMPLATES } from './constants/templates';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/layout/Canvas';
import { InspectorModal } from './components/layout/InspectorModal';
import { ExportModal } from './components/layout/ExportModal';
import { copyDashboardImageToClipboard } from './utils/exportHelpers';

export function App() {
  const initialTemplate = PRESET_TEMPLATES.devops || PRESET_TEMPLATES.saas;
  const initialTheme =
    COLOR_THEMES.find((t) => t.id === initialTemplate.themeId) || COLOR_THEMES[0];

  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(initialTheme);
  const [layout, setLayout] = useState<DashboardLayout>(initialTemplate);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync theme if template changes
  const handleSelectTemplate = (key: string) => {
    const template = PRESET_TEMPLATES[key];
    if (template) {
      setLayout({ ...template, widgets: [...template.widgets] });
      const matchedTheme = COLOR_THEMES.find((t) => t.id === template.themeId);
      if (matchedTheme) {
        setCurrentTheme(matchedTheme);
      }
      showToast(`Loaded "${template.title}" template`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.1 } });
    }
  };

  const handleSelectTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    setLayout((prev) => ({ ...prev, themeId: theme.id }));
    showToast(`Switched palette to ${theme.name}`);
  };

  const handleClearDashboard = () => {
    setLayout((prev) => ({
      ...prev,
      widgets: [],
      title: 'Blank Canvas Dashboard',
      description: 'Drag components from the library to start designing',
    }));
    showToast('Dashboard cleared to blank canvas');
  };

  const handleUpdateTitle = (title: string) => {
    setLayout((prev) => ({ ...prev, title }));
  };

  // Add a widget from catalog
  const handleAddWidget = (item: WidgetCatalogItem, targetIndex?: number) => {
    const newWidget: WidgetConfig = {
      id: `${item.type}-${Date.now().toString(36)}`,
      type: item.type,
      title: item.defaultTitle,
      subtitle: item.defaultSubtitle,
      descriptionForLLM: item.defaultDescriptionForLLM,
      targetMetricName: item.defaultMetric,
      colSpan: item.defaultColSpan,
      height: item.defaultHeight,
      showLegend: true,
      domain: layout.domain,
      kpiData:
        item.type === 'kpi'
          ? {
              value: '184,920',
              unit: '',
              change: '+12.4%',
              isPositive: true,
              period: 'vs previous period',
              subtext: 'Tracking 4.2% above baseline expectation',
            }
          : undefined,
    };

    setLayout((prev) => {
      const widgets = [...prev.widgets];
      if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= widgets.length) {
        widgets.splice(targetIndex, 0, newWidget);
      } else {
        widgets.push(newWidget);
      }
      return { ...prev, widgets };
    });

    showToast(`Added ${item.name} to layout`);
  };

  // Duplicate an existing widget
  const handleDuplicateWidget = (widget: WidgetConfig) => {
    const duplicated: WidgetConfig = {
      ...widget,
      id: `${widget.type}-${Date.now().toString(36)}`,
      title: `${widget.title} (Copy)`,
    };

    setLayout((prev) => {
      const idx = prev.widgets.findIndex((w) => w.id === widget.id);
      const widgets = [...prev.widgets];
      if (idx !== -1) {
        widgets.splice(idx + 1, 0, duplicated);
      } else {
        widgets.push(duplicated);
      }
      return { ...prev, widgets };
    });

    showToast(`Duplicated ${widget.title}`);
  };

  // Delete widget
  const handleDeleteWidget = (id: string) => {
    setLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
    if (selectedWidget?.id === id) {
      setSelectedWidget(null);
      setIsInspectorOpen(false);
    }
    showToast('Component removed');
  };

  // Resize span
  const handleResizeSpan = (id: string, colSpan: number) => {
    setLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, colSpan } : w)),
    }));
  };

  // Reorder widgets in grid
  const handleReorderWidgets = (startIndex: number, endIndex: number) => {
    setLayout((prev) => {
      const list = [...prev.widgets];
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      return { ...prev, widgets: list };
    });
  };

  // Select widget to inspect
  const handleSelectWidget = (widget: WidgetConfig) => {
    setSelectedWidget(widget);
    setIsInspectorOpen(true);
  };

  // Save changes from inspector
  const handleSaveWidgetConfig = (updated: WidgetConfig) => {
    setLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === updated.id ? updated : w)),
    }));
    showToast(`Updated "${updated.title}"`);
  };

  // Quick snapshot from navbar camera button
  const handleQuickCopyImage = async () => {
    showToast('Capturing dashboard snapshot...');
    const res = await copyDashboardImageToClipboard('dashboard-canvas');
    showToast(res.message);
    if (res.success) {
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.1 } });
    }
  };

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden select-none"
      style={{ backgroundColor: currentTheme.canvasBg }}
    >
      {/* Top Navbar */}
      <Navbar
        layout={layout}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onSelectTemplate={handleSelectTemplate}
        onClearDashboard={handleClearDashboard}
        onOpenExport={() => setIsExportOpen(true)}
        onQuickCopyImage={handleQuickCopyImage}
        onAddWidget={handleAddWidget}
        onUpdateTitle={handleUpdateTitle}
      />

      {/* Main Workspace: Sidebar + Canvas */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          theme={currentTheme}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onAddWidget={(item) => handleAddWidget(item)}
        />

        <Canvas
          layout={layout}
          theme={currentTheme}
          selectedWidget={selectedWidget}
          onSelectWidget={handleSelectWidget}
          onDeleteWidget={handleDeleteWidget}
          onDuplicateWidget={handleDuplicateWidget}
          onResizeSpan={handleResizeSpan}
          onReorderWidgets={handleReorderWidgets}
          onDropFromCatalog={handleAddWidget}
          onLoadTemplate={handleSelectTemplate}
        />
      </div>

      {/* Component Inspector Modal */}
      <InspectorModal
        widget={selectedWidget}
        theme={currentTheme}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        onSave={handleSaveWidgetConfig}
        onDelete={handleDeleteWidget}
      />

      {/* Export & LLM Blueprint Modal */}
      <ExportModal
        layout={layout}
        theme={currentTheme}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        canvasElementId="dashboard-canvas"
      />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border animate-bounce backdrop-blur-md"
          style={{
            backgroundColor: currentTheme.cardBg,
            borderColor: currentTheme.accent,
            color: currentTheme.textPrimary,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentTheme.accent }}
          />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
