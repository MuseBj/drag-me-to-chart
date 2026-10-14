export type ChartType =
  | 'pie'
  | 'donut'
  | 'rose'
  | 'line'
  | 'area'
  | 'bar'
  | 'stacked-bar'
  | 'horizontal-bar'
  | 'heatmap-calendar'
  | 'heatmap-matrix'
  | 'scatter'
  | 'radar'
  | 'gauge'
  | 'funnel'
  | 'treemap'
  | 'kpi'
  | 'table'
  | 'banner'
  | 'event-timeline';

export type DataDomain = 'saas' | 'devops' | 'ecommerce' | 'finance' | 'healthcare' | 'medical-sre';

export interface ColorTheme {
  id: string;
  name: string;
  category: 'dark' | 'light';
  description: string;
  colors: string[];
  canvasBg: string;
  cardBg: string;
  cardBorder: string;
  cardHeaderBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  gridLineColor: string;
}

export interface WidgetConfig {
  id: string;
  type: ChartType;
  title: string;
  subtitle?: string;
  descriptionForLLM?: string;
  targetMetricName?: string;
  suggestedEndpoint?: string;
  colSpan: number; // 1 to 12
  height: number;  // in px
  variant?: string;
  showLegend?: boolean;
  showValues?: boolean;
  isSmooth?: boolean;
  domain?: DataDomain;
  customLabels?: string[];
  kpiData?: {
    value: string;
    unit?: string;
    change: string;
    isPositive: boolean;
    period: string;
    subtext: string;
  };
}

export interface DashboardLayout {
  id: string;
  title: string;
  description: string;
  themeId: string;
  domain: DataDomain;
  columns: number;
  widgets: WidgetConfig[];
  updatedAt: string;
}

export interface WidgetCatalogItem {
  type: ChartType;
  name: string;
  category: 'Charts' | 'Heatmaps' | 'Comparison' | 'Metrics & Tables' | 'Structure';
  icon: string;
  description: string;
  defaultColSpan: number;
  defaultHeight: number;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultDescriptionForLLM: string;
  defaultMetric: string;
}
