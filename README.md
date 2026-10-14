# drag-me-to-chart

> *“Cursed to assemble dashboards with your mouse forever.”*

A modern, highly-interactive WYSIWYG drag-and-drop dashboard studio built with React 19, TypeScript, Tailwind CSS v4, and Apache ECharts.

![drag-me-to-chart Studio Canvas](ScreenShots/Application.png)

---

## ✨ Highlights & Walkthrough

### 1. 🖱️ Drag & Drop Canvas & Component Library
Freely drag, drop, and rearrange visualization cards on a 12-column responsive grid. Browse a rich catalog of charts including **Gauges**, **Multi-Series Line Charts**, **Stacked Bars**, **Weekly Activity Heatmaps**, **Correlation Matrices**, **Treemaps**, and **Radar Charts**.

| Component Catalog | Component Inspector |
| :---: | :---: |
| ![Component Library](ScreenShots/Chart-options.png) | ![Component Configuration](ScreenShots/Component-configuration.png) |
| *Filter by Charts, Heatmaps, Comparisons, and KPIs* | *Fine-tune column spans, heights, labels, and LLM notes* |

---

### 2. 🎨 Themes & Pre-Built Templates
Switch palettes on the fly with 14 curated color schemes, or jumpstart your design with industry-specific dashboard templates.

| Curated Color Schemes | Pre-Built Dashboard Templates |
| :---: | :---: |
| ![Theme Palettes](ScreenShots/Themes.png) | ![Templates](ScreenShots/Templates.png) |
| *Live ECharts theme switching across all widgets* | *One-click starter templates for Cloud SRE, SaaS, Medical, & E-Commerce* |

---

### 3. 🤖 LLM Blueprint & Multi-Format Export
Convert your visual dashboard directly into actionable specifications or copy a pixel-perfect snapshot with one click.

| Coding LLM Prompt Export | JSON Layout Specification |
| :---: | :---: |
| ![LLM Prompt Generator](ScreenShots/Export-options2.png) | ![JSON Layout Schema](ScreenShots/Exports-options.png) |
| *Structured markdown prompt ready for Claude, ChatGPT, or Gemini* | *Full coordinate, widget type, and metric schema* |

- 📸 **1-Click Snapshot:** Copy high-res dashboard images directly to your clipboard or download as PNG.
- 🤖 **LLM Blueprint Generator:** Generates comprehensive frontend architect instructions so coding agents know exactly how to implement the backend queries, data models, and layout.
- 📐 **JSON Layout Spec:** Complete serializable layout tree for storage, sharing, or programmatic rendering.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm`

### Installation

```bash
# Clone the repository
git clone https://github.com/MuseBj/drag-me-to-chart.git

# Navigate into the project directory
cd drag-me-to-chart

# Install dependencies
npm install
```

### Development

Run the Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Linting

Run Oxlint:

```bash
npm run lint
```

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts:** [Apache ECharts](https://echarts.apache.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Exporting & Effects:** `html-to-image`, `canvas-confetti`
