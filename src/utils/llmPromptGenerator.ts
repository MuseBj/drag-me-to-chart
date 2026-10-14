import type { DashboardLayout, ColorTheme, WidgetConfig } from '../types/dashboard';

export const generateLlmPrompt = (
  layout: DashboardLayout,
  theme: ColorTheme
): string => {
  const widgetsByRow: WidgetConfig[][] = [];
  let currentRow: WidgetConfig[] = [];
  let currentWidth = 0;

  layout.widgets.forEach((widget) => {
    if (currentWidth + widget.colSpan > 12) {
      if (currentRow.length > 0) widgetsByRow.push(currentRow);
      currentRow = [widget];
      currentWidth = widget.colSpan;
    } else {
      currentRow.push(widget);
      currentWidth += widget.colSpan;
    }
  });
  if (currentRow.length > 0) {
    widgetsByRow.push(currentRow);
  }

  const rowLayoutSummary = widgetsByRow
    .map((row, idx) => {
      const items = row
        .map((w) => `[${w.title} (${w.type.toUpperCase()}, ColSpan: ${w.colSpan}/12, Height: ${w.height}px)]`)
        .join(' + ');
      return `Row ${idx + 1}: ${items}`;
    })
    .join('\n');

  const componentDetails = layout.widgets
    .map((w, idx) => {
      return `### Component ${idx + 1}: ${w.title}
- **Type**: \`${w.type}\`
- **Subtitle / Context**: ${w.subtitle || 'N/A'}
- **Grid Footprint**: Width: ${w.colSpan}/12 columns, Height: ${w.height}px
- **Target Metric**: \`${w.targetMetricName || 'Telemetry Data'}\`
- **LLM Description / Requirements**: ${w.descriptionForLLM || 'Render a responsive chart with high visual fidelity using the specified theme.'}
- **Suggested API Endpoint**: \`GET /api/v1/${w.id.replace(/[^a-zA-Z0-9]/g, '-')}/metrics\`
- **Expected Data Contract / Schema**:
\`\`\`typescript
interface ${toPascalCase(w.id)}Data {
  timestamp?: string;
  metric: string;
  value: number | string;
  series?: Array<{ name: string; value: number }>;
}
\`\`\`
`;
    })
    .join('\n');

  return `# Dashboard Implementation Blueprint & Specification for Coding LLM

You are a Principal Frontend Architect. Your task is to build a production-grade, responsive dashboard matching the exact layout, component labeling, color theme, and specifications detailed below.

---

## 1. Executive Summary & Objective
- **Dashboard Title**: ${layout.title}
- **Domain Focus**: ${layout.domain.toUpperCase()} Analytics
- **Primary Function**: ${layout.description}
- **Chart Engine**: Apache ECharts (or compatible canvas/SVG charting library)
- **Styling Architecture**: Modern Tailwind CSS with a 12-column responsive grid

---

## 2. Visual Theme & Color Palette Specification
- **Theme Name**: ${theme.name} (${theme.category.toUpperCase()} Mode)
- **Design Aesthetic**: ${theme.description}
- **Canvas Background**: \`${theme.canvasBg}\`
- **Card Background**: \`${theme.cardBg}\`
- **Card Border**: \`${theme.cardBorder}\`
- **Header Accent**: \`${theme.cardHeaderBg}\`
- **Primary Text**: \`${theme.textPrimary}\`
- **Secondary Text**: \`${theme.textSecondary}\`
- **Muted Text**: \`${theme.textMuted}\`
- **Accent Highlight**: \`${theme.accent}\`
- **ECharts Color Palette Array**:
\`\`\`json
${JSON.stringify(theme.colors, null, 2)}
\`\`\`

---

## 3. Layout Grid Hierarchy (12-Column Layout)
Total Components: **${layout.widgets.length}**

${rowLayoutSummary}

---

## 4. Detailed Component Specifications

${componentDetails}

---

## 5. Coding Instructions for the LLM
1. **Layout Implementation**: Use CSS Grid \`grid-cols-12 gap-4\` or \`gap-6\`. Components should respect their assigned \`col-span-{n}\` on \`lg\` screens, and collapse to \`col-span-12\` or \`col-span-6\` on mobile/tablet viewports.
2. **Chart Styling**: Ensure all charts adopt the theme colors (\`${theme.colors.join(', ')}\`) and use transparent chart backgrounds so the card background (\`${theme.cardBg}\`) shows through cleanly.
3. **Typography & Spacing**: Display clear component titles, subtitles, and metric badges. Maintain consistent card padding, border radius, and subtle borders (\`${theme.cardBorder}\`).
4. **Mock Data & State**: Provide realistic mock state and handlers for time-range filtering (e.g. 24h, 7d, 30d, 1y).
`;
};

function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

export const generateReactCodeScaffold = (
  layout: DashboardLayout,
  theme: ColorTheme
): string => {
  return `import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// Theme: ${theme.name}
const THEME = {
  canvasBg: '${theme.canvasBg}',
  cardBg: '${theme.cardBg}',
  cardBorder: '${theme.cardBorder}',
  textPrimary: '${theme.textPrimary}',
  textSecondary: '${theme.textSecondary}',
  accent: '${theme.accent}',
  colors: ${JSON.stringify(theme.colors)},
};

export default function ${toPascalCase(layout.title || 'CustomDashboard')}() {
  return (
    <div
      className="min-h-screen p-6 md:p-8"
      style={{ backgroundColor: THEME.canvasBg, color: THEME.textPrimary }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">${layout.title}</h1>
          <p className="text-sm mt-1" style={{ color: THEME.textSecondary }}>
            ${layout.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 text-xs font-semibold rounded-full border"
            style={{
              backgroundColor: \`\${THEME.accent}15\`,
              borderColor: \`\${THEME.accent}40\`,
              color: THEME.accent,
            }}
          >
            Live Production Telemetry
          </span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-12 gap-5">
        ${layout.widgets
          .map((w) => {
            return `{/* ${w.title} (${w.type}) */}
        <div
          className="col-span-12 md:col-span-6 lg:col-span-${w.colSpan} rounded-xl border p-4 flex flex-col justify-between"
          style={{
            backgroundColor: THEME.cardBg,
            borderColor: THEME.cardBorder,
            minHeight: '${w.height}px',
          }}
        >
          <div className="mb-3">
            <h3 className="font-semibold text-sm" style={{ color: THEME.textPrimary }}>
              ${w.title}
            </h3>
            ${
              w.subtitle
                ? `<p className="text-xs mt-0.5" style={{ color: THEME.textSecondary }}>${w.subtitle}</p>`
                : ''
            }
          </div>
          <div className="flex-1 flex items-center justify-center">
            {/* ECharts Instance or Widget Component for '${w.type}' */}
            <div className="text-xs opacity-60">Chart Engine: ${w.type} (${w.targetMetricName || 'Data'})</div>
          </div>
        </div>`;
          })
          .join('\n\n        ')}
      </div>
    </div>
  );
}
`;
};
