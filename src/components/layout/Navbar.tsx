import { useState } from 'react';
import type { ColorTheme, DashboardLayout, WidgetCatalogItem } from '../../types/dashboard';
import { COLOR_THEMES } from '../../constants/themes';
import { WIDGET_CATALOG } from '../../constants/widgetCatalog';
import {
  Palette,
  Sparkles,
  Camera,
  FolderOpen,
  Plus,
  Layout,
  ChevronDown,
  Check,
} from 'lucide-react';

interface NavbarProps {
  layout: DashboardLayout;
  currentTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
  onSelectTemplate: (templateKey: string) => void;
  onClearDashboard: () => void;
  onOpenExport: () => void;
  onQuickCopyImage: () => void;
  onAddWidget: (item: WidgetCatalogItem) => void;
  onUpdateTitle: (title: string) => void;
}

export const Navbar = ({
  layout,
  currentTheme,
  onSelectTheme,
  onSelectTemplate,
  onClearDashboard,
  onOpenExport,
  onQuickCopyImage,
  onAddWidget,
  onUpdateTitle,
}: NavbarProps) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(layout.title);

  return (
    <header
      className="h-16 px-4 md:px-6 border-b flex items-center justify-between z-30 select-none transition-colors"
      style={{
        backgroundColor: currentTheme.cardBg,
        borderColor: currentTheme.cardBorder,
      }}
    >
      {/* Brand & Dashboard Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-md"
            style={{
              backgroundColor: currentTheme.accent,
              color: '#ffffff',
            }}
          >
            <Layout size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    onUpdateTitle(tempTitle || 'Untitled Dashboard');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                      onUpdateTitle(tempTitle || 'Untitled Dashboard');
                    }
                  }}
                  autoFocus
                  className="px-1.5 py-0.5 rounded text-sm font-bold bg-white/10 outline-none border border-blue-500"
                  style={{ color: currentTheme.textPrimary }}
                />
              ) : (
                <h1
                  onClick={() => {
                    setTempTitle(layout.title);
                    setIsEditingTitle(true);
                  }}
                  className="text-sm font-bold tracking-tight cursor-pointer hover:underline flex items-center gap-1.5"
                  style={{ color: currentTheme.textPrimary }}
                  title="Click to rename dashboard"
                >
                  <span>{layout.title}</span>
                  <span className="text-[10px] opacity-50 font-normal">(edit)</span>
                </h1>
              )}
            </div>
            <p className="text-[11px] hidden sm:block opacity-70" style={{ color: currentTheme.textSecondary }}>
              WYSIWYG Drag & Drop Studio with Apache ECharts
            </p>
          </div>
        </div>

        {/* Preset Templates Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-white/10 transition-colors"
            style={{
              borderColor: currentTheme.cardBorder,
              color: currentTheme.textSecondary,
            }}
          >
            <FolderOpen size={13} style={{ color: currentTheme.accent }} />
            <span>Templates</span>
            <ChevronDown size={11} />
          </button>

          {showTemplateMenu && (
            <div
              className="absolute left-0 top-full mt-1.5 w-64 rounded-xl shadow-2xl border p-1.5 z-40 text-xs backdrop-blur-md"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.cardBorder,
              }}
            >
              <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: currentTheme.textSecondary }}>
                Pre-built Dashboards
              </div>
              <button
                onClick={() => {
                  onSelectTemplate('medical');
                  setShowTemplateMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors flex flex-col bg-emerald-500/10 border border-emerald-500/30 mb-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">
                    Medical Practice: Patient Pipeline SRE
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    New
                  </span>
                </div>
                <span className="text-[11px] opacity-75" style={{ color: currentTheme.textSecondary }}>
                  Synthetic Form Probing, Twilio Voice IVR, SMS & NAP Audit
                </span>
              </button>
              <button
                onClick={() => {
                  onSelectTemplate('saas');
                  setShowTemplateMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors flex flex-col"
              >
                <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                  SaaS Executive Overview
                </span>
                <span className="text-[11px] opacity-70" style={{ color: currentTheme.textSecondary }}>
                  MRR, Churn, Donut Tiers & Weekly Heatmap
                </span>
              </button>
              <button
                onClick={() => {
                  onSelectTemplate('devops');
                  setShowTemplateMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors flex flex-col"
              >
                <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                  Cloud SRE & DevOps
                </span>
                <span className="text-[11px] opacity-70" style={{ color: currentTheme.textSecondary }}>
                  Gauge SLA, P99 Latency, Matrix Heatmap & Treemap
                </span>
              </button>
              <button
                onClick={() => {
                  onSelectTemplate('ecommerce');
                  setShowTemplateMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors flex flex-col"
              >
                <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                  E-Commerce Analytics
                </span>
                <span className="text-[11px] opacity-70" style={{ color: currentTheme.textSecondary }}>
                  Rose Charts, GMV Bars, Scatter Cohorts
                </span>
              </button>
              <div className="border-t my-1" style={{ borderColor: currentTheme.cardBorder }} />
              <button
                onClick={() => {
                  onClearDashboard();
                  setShowTemplateMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 font-semibold"
              >
                Clear to Blank Canvas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center/Right Toolbar */}
      <div className="flex items-center gap-2">
        {/* Quick Add Component Dropdown (for dropdown-oriented UX) */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-white/10 transition-colors"
            style={{
              borderColor: currentTheme.cardBorder,
              color: currentTheme.textPrimary,
              backgroundColor: currentTheme.cardHeaderBg,
            }}
          >
            <Plus size={13} style={{ color: currentTheme.accent }} />
            <span className="hidden sm:inline">Add Component</span>
            <ChevronDown size={11} />
          </button>

          {showAddMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-72 max-h-96 overflow-y-auto rounded-xl shadow-2xl border p-2 z-40 text-xs backdrop-blur-md"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.cardBorder,
              }}
            >
              <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: currentTheme.textSecondary }}>
                Choose Component to Insert
              </div>
              {WIDGET_CATALOG.map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    onAddWidget(item);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold block" style={{ color: currentTheme.textPrimary }}>
                      {item.name}
                    </span>
                    <span className="text-[10px] opacity-70 block" style={{ color: currentTheme.textSecondary }}>
                      {item.category} • {item.defaultColSpan}/12 cols
                    </span>
                  </div>
                  <Plus size={13} style={{ color: currentTheme.accent }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLOR SCHEME SELECTOR (A dozen or so color schemes!) */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-white/10 transition-colors"
            style={{
              borderColor: currentTheme.accent,
              backgroundColor: `${currentTheme.accent}15`,
              color: currentTheme.textPrimary,
            }}
            title="Choose from 14 curated color schemes"
          >
            {/* Palette swatch preview */}
            <div className="flex items-center -space-x-1">
              {currentTheme.colors.slice(0, 3).map((c: string, i: number) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-black/20"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="hidden md:inline">{currentTheme.name}</span>
            <ChevronDown size={11} />
          </button>

          {showThemeMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-80 max-h-[460px] overflow-y-auto rounded-2xl shadow-2xl border p-2 z-50 text-xs backdrop-blur-md"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.cardBorder,
              }}
            >
              <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: currentTheme.cardBorder }}>
                <div className="flex items-center gap-1.5 font-bold" style={{ color: currentTheme.textPrimary }}>
                  <Palette size={14} style={{ color: currentTheme.accent }} />
                  <span>Color Schemes (14 Palettes)</span>
                </div>
                <span className="text-[10px] opacity-60" style={{ color: currentTheme.textSecondary }}>
                  Live ECharts preview
                </span>
              </div>

              <div className="py-2 space-y-1">
                {COLOR_THEMES.map((th) => {
                  const isSelected = currentTheme.id === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        onSelectTheme(th);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'ring-1'
                          : 'hover:bg-white/5 opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${th.accent}15` : 'transparent',
                        borderColor: isSelected ? th.accent : 'transparent',
                      }}
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-bold text-xs truncate"
                            style={{ color: isSelected ? th.accent : currentTheme.textPrimary }}
                          >
                            {th.name}
                          </span>
                          <span
                            className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase"
                            style={{
                              backgroundColor: th.category === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
                              color: currentTheme.textSecondary,
                            }}
                          >
                            {th.category}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-70 truncate" style={{ color: currentTheme.textSecondary }}>
                          {th.description}
                        </p>
                        {/* Swatches */}
                        <div className="flex items-center gap-1 pt-0.5">
                          {th.colors.slice(0, 6).map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: th.accent }}
                        >
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Snapshot / Camera button */}
        <button
          onClick={onQuickCopyImage}
          className="p-2 rounded-lg border hover:bg-white/10 transition-colors"
          style={{
            borderColor: currentTheme.cardBorder,
            color: currentTheme.textSecondary,
          }}
          title="Quick Copy Dashboard Image to Clipboard"
        >
          <Camera size={16} />
        </button>

        {/* Export / LLM Blueprint Trigger */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-md transition-transform active:scale-95 text-white"
          style={{
            backgroundColor: currentTheme.accent,
          }}
        >
          <Sparkles size={14} />
          <span>Export & LLM Blueprint</span>
        </button>
      </div>
    </header>
  );
};
