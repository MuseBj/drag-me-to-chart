import * as echarts from 'echarts';
import type { ColorTheme, WidgetConfig } from '../../types/dashboard';
import { MOCK_DATA } from '../../constants/mockData';

export const buildEChartsOption = (
  widget: WidgetConfig,
  theme: ColorTheme
): echarts.EChartsOption => {
  const { colors, gridLineColor, textPrimary, textSecondary, cardBg } = theme;

  // Base tooltip styling matching active theme
  const baseTooltip: echarts.TooltipComponentOption = {
    trigger: 'item',
    backgroundColor: cardBg,
    borderColor: colors[0],
    borderWidth: 1,
    textStyle: { color: textPrimary, fontSize: 12 },
    padding: [8, 12],
    extraCssText: 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35); border-radius: 8px;',
  };

  const baseGrid: echarts.GridComponentOption = {
    top: 36,
    left: 48,
    right: 24,
    bottom: 36,
    containLabel: true,
  };

  switch (widget.type) {
    case 'donut': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          formatter: '{b}: <b>{c}</b> ({d}%)',
        },
        legend: {
          show: widget.showLegend !== false,
          bottom: '2%',
          left: 'center',
          textStyle: { color: textSecondary, fontSize: 11 },
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
        },
        series: [
          {
            name: widget.title,
            type: 'pie',
            radius: ['45%', '72%'],
            center: ['50%', '46%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
              borderColor: cardBg,
              borderWidth: 2,
            },
            label: {
              show: widget.showValues ?? false,
              color: textPrimary,
              fontSize: 11,
              formatter: '{b}: {d}%',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 13,
                fontWeight: 'bold',
                color: textPrimary,
              },
              scaleSize: 8,
            },
            data:
              (widget.id.includes('email') || widget.domain === 'medical-sre') &&
              MOCK_DATA.medicalEmailAuth
                ? MOCK_DATA.medicalEmailAuth
                : MOCK_DATA.donut,
          },
        ],
      };
    }

    case 'pie': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          formatter: '{b}: <b>{c}%</b>',
        },
        legend: {
          show: widget.showLegend !== false,
          bottom: '2%',
          textStyle: { color: textSecondary, fontSize: 11 },
          icon: 'circle',
        },
        series: [
          {
            name: widget.title,
            type: 'pie',
            radius: '68%',
            center: ['50%', '46%'],
            itemStyle: {
              borderColor: cardBg,
              borderWidth: 2,
              borderRadius: 4,
            },
            label: {
              show: widget.showValues ?? true,
              color: textSecondary,
              fontSize: 11,
              formatter: '{b}',
            },
            data: MOCK_DATA.pie,
          },
        ],
      };
    }

    case 'rose': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          formatter: '{b}: <b>{c}</b> ({d}%)',
        },
        legend: {
          show: widget.showLegend !== false,
          bottom: '0%',
          textStyle: { color: textSecondary, fontSize: 11 },
          icon: 'circle',
        },
        series: [
          {
            name: widget.title,
            type: 'pie',
            radius: ['15%', '70%'],
            center: ['50%', '44%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5,
              borderColor: cardBg,
              borderWidth: 2,
            },
            label: {
              show: widget.showValues ?? false,
              color: textSecondary,
              fontSize: 11,
            },
            data: MOCK_DATA.rose,
          },
        ],
      };
    }

    case 'area': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          trigger: 'axis',
        },
        grid: baseGrid,
        legend: {
          show: widget.showLegend !== false,
          top: 0,
          right: 10,
          textStyle: { color: textSecondary, fontSize: 11 },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: MOCK_DATA.area.dates,
          axisLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        series: [
          {
            name: 'Current Year ARR',
            type: 'line',
            smooth: widget.isSmooth ?? true,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 3, color: colors[0] },
            itemStyle: { color: colors[0] },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${colors[0]}80` },
                { offset: 1, color: `${colors[0]}05` },
              ]),
            },
            data: MOCK_DATA.area.seriesA,
          },
          {
            name: 'Prior Year Benchmark',
            type: 'line',
            smooth: widget.isSmooth ?? true,
            symbol: 'none',
            lineStyle: { width: 2, color: colors[1], type: 'dashed' },
            itemStyle: { color: colors[1] },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${colors[1]}40` },
                { offset: 1, color: `${colors[1]}00` },
              ]),
            },
            data: MOCK_DATA.area.seriesB,
          },
        ],
      };
    }

    case 'line': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          trigger: 'axis',
        },
        legend: {
          show: widget.showLegend !== false,
          top: 0,
          right: 10,
          textStyle: { color: textSecondary, fontSize: 11 },
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data:
            widget.id.includes('form') && MOCK_DATA.medicalFormLatency
              ? MOCK_DATA.medicalFormLatency.hours
              : MOCK_DATA.line.dates,
          axisLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          name: widget.id.includes('form') ? 'seconds' : 'ms',
          nameTextStyle: { color: textSecondary, fontSize: 10 },
          splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        series:
          widget.id.includes('form') && MOCK_DATA.medicalFormLatency
            ? [
                {
                  name: 'Form-to-CRM Latency (s)',
                  type: 'line',
                  smooth: widget.isSmooth ?? true,
                  lineStyle: { width: 3, color: colors[0] },
                  itemStyle: { color: colors[0] },
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: `${colors[0]}40` },
                      { offset: 1, color: `${colors[0]}02` },
                    ]),
                  },
                  data: MOCK_DATA.medicalFormLatency.latencySeconds,
                },
                {
                  name: '90s SLO Threshold',
                  type: 'line',
                  symbol: 'none',
                  lineStyle: { width: 2, color: '#ef4444', type: 'dashed' },
                  itemStyle: { color: '#ef4444' },
                  data: MOCK_DATA.medicalFormLatency.sloThreshold,
                },
              ]
            : [
                {
                  name: 'P99 Latency',
                  type: 'line',
                  smooth: widget.isSmooth ?? true,
                  lineStyle: { width: 2.5, color: colors[0] },
                  itemStyle: { color: colors[0] },
                  data: MOCK_DATA.line.p99,
                },
                {
                  name: 'P95 Latency',
                  type: 'line',
                  smooth: widget.isSmooth ?? true,
                  lineStyle: { width: 2, color: colors[1] },
                  itemStyle: { color: colors[1] },
                  data: MOCK_DATA.line.p95,
                },
                {
                  name: 'Average Response',
                  type: 'line',
                  smooth: widget.isSmooth ?? true,
                  lineStyle: { width: 2, color: colors[2] },
                  itemStyle: { color: colors[2] },
                  data: MOCK_DATA.line.avg,
                },
              ],
      };
    }

    case 'bar': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          show: widget.showLegend !== false,
          top: 0,
          right: 10,
          textStyle: { color: textSecondary, fontSize: 11 },
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data:
            widget.id.includes('nap') && MOCK_DATA.medicalNapAudit
              ? MOCK_DATA.medicalNapAudit.categories
              : MOCK_DATA.bar.categories,
          axisLine: { lineStyle: { color: gridLineColor } },
          axisLabel: {
            color: textSecondary,
            fontSize: 10,
            rotate: widget.id.includes('nap') ? 25 : 0,
          },
        },
        yAxis: {
          type: 'value',
          name: widget.id.includes('nap') ? 'Links / Schemas' : '$k',
          nameTextStyle: { color: textSecondary, fontSize: 10 },
          splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        series:
          widget.id.includes('nap') && MOCK_DATA.medicalNapAudit
            ? [
                {
                  name: 'Valid Master NAP Links',
                  type: 'bar',
                  barMaxWidth: 24,
                  itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: colors[0],
                  },
                  data: MOCK_DATA.medicalNapAudit.validLinks,
                },
                {
                  name: 'Legacy Tracking Mismatches',
                  type: 'bar',
                  barMaxWidth: 24,
                  itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: '#ef4444',
                  },
                  data: MOCK_DATA.medicalNapAudit.staleTracking,
                },
              ]
            : [
                {
                  name: 'Planned Target ($k)',
                  type: 'bar',
                  barMaxWidth: 28,
                  itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: colors[0],
                  },
                  data: MOCK_DATA.bar.planned,
                },
                {
                  name: 'Actual Attained ($k)',
                  type: 'bar',
                  barMaxWidth: 28,
                  itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: colors[1],
                  },
                  data: MOCK_DATA.bar.actual,
                },
              ],
      };
    }

    case 'stacked-bar': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          show: widget.showLegend !== false,
          top: 0,
          textStyle: { color: textSecondary, fontSize: 11 },
        },
        grid: baseGrid,
        xAxis: {
          type: 'category',
          data: MOCK_DATA.stackedBar.months,
          axisLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        series: [
          {
            name: 'Compute (EC2/GKE)',
            type: 'bar',
            stack: 'total',
            data: MOCK_DATA.stackedBar.compute,
          },
          {
            name: 'Database (RDS/CloudSQL)',
            type: 'bar',
            stack: 'total',
            data: MOCK_DATA.stackedBar.database,
          },
          {
            name: 'Object Storage (S3/GCS)',
            type: 'bar',
            stack: 'total',
            data: MOCK_DATA.stackedBar.storage,
          },
          {
            name: 'Network Egress',
            type: 'bar',
            stack: 'total',
            data: MOCK_DATA.stackedBar.network,
          },
        ],
      };
    }

    case 'horizontal-bar': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          top: 15,
          left: 120,
          right: 30,
          bottom: 25,
        },
        xAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        yAxis: {
          type: 'category',
          data: MOCK_DATA.horizontalBar.names,
          axisLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        series: [
          {
            name: 'Closed Deals ($k)',
            type: 'bar',
            barMaxWidth: 18,
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] || colors[0] },
              ]),
            },
            data: MOCK_DATA.horizontalBar.values,
          },
        ],
      };
    }

    case 'heatmap-calendar': {
      return {
        backgroundColor: 'transparent',
        tooltip: {
          ...baseTooltip,
          position: 'top',
          formatter: (params: any) => {
            const [hour, dayIndex, val] = params.value;
            const day = MOCK_DATA.heatmapCalendar.days[dayIndex];
            return `<b>${day} ${hour}:00</b><br/>Load / Requests: <b>${val} QPS</b>`;
          },
        },
        grid: {
          top: 20,
          left: 45,
          right: 65,
          bottom: 40,
        },
        xAxis: {
          type: 'category',
          data: MOCK_DATA.heatmapCalendar.hours,
          splitArea: { show: true },
          axisLabel: { color: textSecondary, fontSize: 10 },
          axisLine: { lineStyle: { color: gridLineColor } },
        },
        yAxis: {
          type: 'category',
          data: MOCK_DATA.heatmapCalendar.days,
          splitArea: { show: true },
          axisLabel: { color: textSecondary, fontSize: 11 },
          axisLine: { lineStyle: { color: gridLineColor } },
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'vertical',
          right: 0,
          top: 'center',
          itemWidth: 10,
          itemHeight: 120,
          textStyle: { color: textSecondary, fontSize: 10 },
          inRange: {
            color: [
              cardBg,
              `${colors[0]}40`,
              `${colors[0]}90`,
              colors[0],
              colors[1] || '#ff007f',
            ],
          },
        },
        series: [
          {
            name: 'Activity',
            type: 'heatmap',
            data: MOCK_DATA.heatmapCalendar.data,
            label: { show: false },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    }

    case 'heatmap-matrix': {
      return {
        backgroundColor: 'transparent',
        tooltip: {
          ...baseTooltip,
          formatter: (params: any) => {
            const [x, y, val] = params.value;
            const f1 = MOCK_DATA.heatmapMatrix.features[x];
            const f2 = MOCK_DATA.heatmapMatrix.features[y];
            return `<b>${f1} ↔ ${f2}</b><br/>Pearson Score: <b>${val}</b>`;
          },
        },
        grid: {
          top: 20,
          left: 90,
          right: 65,
          bottom: 60,
        },
        xAxis: {
          type: 'category',
          data: MOCK_DATA.heatmapMatrix.features,
          axisLabel: { color: textSecondary, fontSize: 10, rotate: 30 },
          axisLine: { lineStyle: { color: gridLineColor } },
        },
        yAxis: {
          type: 'category',
          data: MOCK_DATA.heatmapMatrix.features,
          axisLabel: { color: textSecondary, fontSize: 10 },
          axisLine: { lineStyle: { color: gridLineColor } },
        },
        visualMap: {
          min: -1,
          max: 1,
          calculable: true,
          orient: 'vertical',
          right: 0,
          top: 'center',
          itemWidth: 10,
          itemHeight: 120,
          textStyle: { color: textSecondary, fontSize: 10 },
          inRange: {
            color: [
              colors[2] || '#ef4444',
              cardBg,
              colors[0] || '#3b82f6',
            ],
          },
        },
        series: [
          {
            name: 'Correlation',
            type: 'heatmap',
            data: MOCK_DATA.heatmapMatrix.matrix,
            label: {
              show: true,
              color: textPrimary,
              fontSize: 10,
              formatter: (params: any) => params.value[2].toFixed(2),
            },
          },
        ],
      };
    }

    case 'scatter': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          formatter: (params: any) => {
            const [cac, ltv, size, cohort] = params.value;
            return `<b>${cohort}</b><br/>CAC: $${cac}<br/>LTV: $${ltv}<br/>Accounts: ${size * 10}`;
          },
        },
        grid: baseGrid,
        xAxis: {
          type: 'value',
          name: 'CAC ($)',
          nameTextStyle: { color: textSecondary, fontSize: 10 },
          splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          name: 'LTV ($)',
          nameTextStyle: { color: textSecondary, fontSize: 10 },
          splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
          axisLabel: { color: textSecondary, fontSize: 11 },
        },
        series: [
          {
            name: 'Customer Cohorts',
            type: 'scatter',
            symbolSize: (data: any) => Math.min(48, Math.max(14, data[2])),
            data: MOCK_DATA.scatter,
            itemStyle: {
              color: (params: any) => {
                const idx = params.dataIndex % colors.length;
                return colors[idx];
              },
              shadowBlur: 8,
              shadowColor: `${colors[0]}60`,
            },
          },
        ],
      };
    }

    case 'radar': {
      const isMedical =
        widget.id.includes('medical') ||
        widget.domain === 'medical-sre' ||
        widget.targetMetricName?.toLowerCase().includes('pillar');

      const indicators =
        isMedical && MOCK_DATA.medicalSreRadar
          ? MOCK_DATA.medicalSreRadar.indicators
          : MOCK_DATA.radar.indicators;

      const seriesData =
        isMedical && MOCK_DATA.medicalSreRadar
          ? [
              {
                value: MOCK_DATA.medicalSreRadar.current,
                name: 'Measured Practice SRE Score',
                areaStyle: { color: `${colors[0]}45` },
                lineStyle: { color: colors[0], width: 2.5 },
                itemStyle: { color: colors[0] },
              },
              {
                value: MOCK_DATA.medicalSreRadar.target,
                name: 'Target SLO (100% Reliability)',
                areaStyle: { color: `${colors[1] || '#10b981'}20` },
                lineStyle: { color: colors[1] || '#10b981', type: 'dashed' as const, width: 2 },
                itemStyle: { color: colors[1] || '#10b981' },
              },
            ]
          : [
              {
                value: MOCK_DATA.radar.current,
                name: 'Current Build',
                areaStyle: { color: `${colors[0]}40` },
                lineStyle: { color: colors[0], width: 2 },
                itemStyle: { color: colors[0] },
              },
              {
                value: MOCK_DATA.radar.target,
                name: 'Quarterly Target',
                areaStyle: { color: `${colors[1]}20` },
                lineStyle: { color: colors[1], type: 'dashed' as const, width: 2 },
                itemStyle: { color: colors[1] },
              },
            ];

      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: baseTooltip,
        legend: {
          show: widget.showLegend !== false,
          bottom: '0%',
          textStyle: { color: textSecondary, fontSize: 11 },
        },
        radar: {
          indicator: indicators,
          radius: '65%',
          center: ['50%', '46%'],
          splitNumber: 4,
          axisName: {
            color: textSecondary,
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: gridLineColor,
            },
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(255,255,255,0.01)', 'rgba(255,255,255,0.03)'],
            },
          },
          axisLine: {
            lineStyle: {
              color: gridLineColor,
            },
          },
        },
        series: [
          {
            name: 'Pillar Readiness',
            type: 'radar',
            data: seriesData,
          },
        ],
      };
    }

    case 'gauge': {
      const isVoiceSla =
        widget.id.includes('intake') ||
        widget.domain === 'medical-sre' ||
        widget.targetMetricName?.includes('Voice');
      const gaugeValue = isVoiceSla ? 100.0 : MOCK_DATA.gauge.value;

      return {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'gauge',
            center: ['50%', '55%'],
            radius: '85%',
            startAngle: 200,
            endAngle: -20,
            min: isVoiceSla ? 80 : 90,
            max: 100,
            splitNumber: 5,
            itemStyle: {
              color: colors[0],
            },
            progress: {
              show: true,
              width: 14,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: colors[0] },
                  { offset: 1, color: colors[1] || colors[0] },
                ]),
              },
            },
            pointer: {
              show: true,
              length: '60%',
              width: 5,
              itemStyle: { color: textPrimary },
            },
            axisLine: {
              lineStyle: {
                width: 14,
                color: [[1, gridLineColor]],
              },
            },
            axisTick: {
              distance: -20,
              splitNumber: 5,
              lineStyle: { width: 1, color: textSecondary },
            },
            splitLine: {
              distance: -24,
              length: 8,
              lineStyle: { width: 2, color: textSecondary },
            },
            axisLabel: {
              distance: -14,
              color: textSecondary,
              fontSize: 10,
              formatter: '{value}%',
            },
            anchor: {
              show: true,
              size: 10,
              itemStyle: {
                borderWidth: 2,
                borderColor: colors[0],
                color: cardBg,
              },
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 30,
              borderRadius: 8,
              offsetCenter: [0, '35%'],
              fontSize: 22,
              fontWeight: 'bolder',
              formatter: isVoiceSla ? '{value}% SLA' : '{value}%',
              color: textPrimary,
            },
            data: [
              {
                value: gaugeValue,
              },
            ],
          },
        ],
      };
    }

    case 'funnel': {
      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          ...baseTooltip,
          formatter: '{b}: <b>{c} users</b> ({d}%)',
        },
        legend: {
          show: widget.showLegend !== false,
          bottom: '0%',
          textStyle: { color: textSecondary, fontSize: 11 },
        },
        series: [
          {
            name: widget.title,
            type: 'funnel',
            left: '10%',
            top: 20,
            bottom: 40,
            width: '80%',
            min: 0,
            max: 100000,
            minSize: '15%',
            maxSize: '100%',
            sort: 'descending',
            gap: 4,
            label: {
              show: true,
              position: 'inside',
              formatter: '{b}: {c}',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 500,
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid',
              },
            },
            itemStyle: {
              borderColor: cardBg,
              borderWidth: 2,
            },
            emphasis: {
              label: {
                fontSize: 13,
                fontWeight: 'bold',
              },
            },
            data: MOCK_DATA.funnel,
          },
        ],
      };
    }

    case 'treemap': {
      return {
        backgroundColor: 'transparent',
        tooltip: {
          ...baseTooltip,
          formatter: '{b}: <b>{c} GB</b>',
        },
        series: [
          {
            name: widget.title,
            type: 'treemap',
            roam: false,
            nodeClick: false,
            breadcrumb: {
              show: false,
            },
            label: {
              show: true,
              formatter: '{b}\n{c} GB',
              color: textPrimary,
              fontSize: 11,
            },
            itemStyle: {
              borderColor: cardBg,
              borderWidth: 2,
              gapWidth: 2,
            },
            levels: [
              {
                itemStyle: {
                  borderColor: cardBg,
                  borderWidth: 3,
                  gapWidth: 3,
                },
                color: colors,
              },
              {
                colorSaturation: [0.35, 0.65],
                itemStyle: {
                  borderColorSaturation: 0.7,
                  gapWidth: 2,
                },
              },
            ],
            data: MOCK_DATA.treemap,
          },
        ],
      };
    }

    case 'event-timeline': {
      const data = MOCK_DATA.eventTimeline || {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        trafficHits: [1420, 5240, 3180, 2150, 6890, 7420, 2980],
        crmBookings: [12, 48, 29, 18, 62, 71, 24],
        queueMessages: [15, 168, 42, 18, 195, 235, 30],
        tracks: [
          'Host 1 (Web Gateway)',
          'Host 2 (CRM Webhook)',
          'Host 3 (Database/Queue)',
          'Email Blasts',
          'TikTok Posts',
          'Instagram Reels',
        ],
        events: [],
      };

      const scatterData = data.events.map((ev) => {
        const [dayIdx, trackIdx, title, details, colorType] = ev;
        const color =
          colorType === 'marketing'
            ? colors[1] || '#ec4899'
            : colors[0] || '#00f0ff';
        return {
          value: [dayIdx, trackIdx],
          name: title,
          details,
          track: data.tracks[trackIdx],
          itemStyle: {
            color,
            borderColor: cardBg,
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: `${color}80`,
          },
        };
      });

      return {
        backgroundColor: 'transparent',
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            link: [{ xAxisIndex: 'all' }],
            label: { backgroundColor: cardBg, color: textPrimary },
          },
          backgroundColor: cardBg,
          borderColor: colors[0],
          borderWidth: 1,
          textStyle: { color: textPrimary, fontSize: 12 },
          formatter: (params: any) => {
            const first = Array.isArray(params) ? params[0] : params;
            const dayIdx = first?.dataIndex ?? 0;
            const dayName = data.days[dayIdx];
            const hits = data.trafficHits[dayIdx]?.toLocaleString();
            const bookings = data.crmBookings[dayIdx];
            const queue = data.queueMessages[dayIdx];

            const dayEvents = data.events.filter((e) => e[0] === dayIdx);
            const eventsHtml =
              dayEvents.length > 0
                ? dayEvents
                    .map(
                      (e) =>
                        `<div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed ${gridLineColor};">
                          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${
                            e[4] === 'marketing' ? colors[1] || '#ec4899' : colors[0]
                          };margin-right:6px;"></span>
                          <b>[${data.tracks[e[1]]}]</b> ${e[2]}<br/>
                          <span style="font-size:10px;opacity:0.75;padding-left:14px;">${e[3]}</span>
                        </div>`
                    )
                    .join('')
                : '<div style="margin-top: 4px; font-size: 11px; opacity: 0.6;">No major marketing drops logged</div>';

            return `
              <div style="font-family: inherit; font-size: 11px; line-height: 1.4;">
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 4px; border-bottom: 1px solid ${gridLineColor}; padding-bottom: 2px;">
                  📅 ${dayName} Campaign & Pipeline Telemetry
                </div>
                <div>🌐 Website Traffic: <b>${hits} hits</b></div>
                <div>📋 CRM Consultations Booked: <b style="color:${colors[1] || '#10b981'}">${bookings} patients</b></div>
                <div>⚡ Intake Queue Backlog: <b style="color:${queue > 100 ? '#ef4444' : textSecondary}">${queue} msgs</b></div>
                <div style="margin-top: 6px; font-weight: bold; font-size: 10px; text-transform: uppercase; color: ${textSecondary};">
                  Timeline Events (${dayEvents.length})
                </div>
                ${eventsHtml}
              </div>
            `;
          },
        },
        legend: {
          show: widget.showLegend !== false,
          top: 0,
          right: 20,
          textStyle: { color: textSecondary, fontSize: 11 },
        },
        axisPointer: {
          link: [{ xAxisIndex: 'all' }],
        },
        grid: [
          {
            left: 140,
            right: 55,
            top: 35,
            height: '46%',
          },
          {
            left: 140,
            right: 55,
            top: '64%',
            bottom: 28,
          },
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: 'category',
            data: data.days,
            axisLine: { lineStyle: { color: gridLineColor } },
            axisTick: { show: false },
            axisLabel: { show: false },
          },
          {
            gridIndex: 1,
            type: 'category',
            data: data.days,
            position: 'bottom',
            axisLine: { lineStyle: { color: gridLineColor } },
            axisLabel: { color: textPrimary, fontSize: 11, fontWeight: 600 },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: 'value',
            name: 'Traffic / Queue',
            nameTextStyle: { color: textSecondary, fontSize: 10 },
            splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
            axisLabel: { color: textSecondary, fontSize: 10 },
          },
          {
            gridIndex: 0,
            type: 'value',
            name: 'Bookings',
            nameTextStyle: { color: textSecondary, fontSize: 10 },
            splitLine: { show: false },
            axisLabel: { color: textSecondary, fontSize: 10 },
          },
          {
            gridIndex: 1,
            type: 'category',
            data: data.tracks,
            axisLine: { lineStyle: { color: gridLineColor } },
            axisLabel: { color: textSecondary, fontSize: 10 },
            splitLine: { show: true, lineStyle: { color: gridLineColor, type: 'dotted' } },
          },
        ],
        series: [
          {
            name: 'Website Traffic Hits',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            barMaxWidth: 24,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: `${colors[0]}40` },
              ]),
            },
            data: data.trafficHits,
          },
          {
            name: 'Ingestion Queue Backlog',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            barMaxWidth: 24,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: '#ef4444',
            },
            data: data.queueMessages,
          },
          {
            name: 'CRM Consultation Bookings',
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 3, color: colors[1] || '#10b981' },
            itemStyle: { color: colors[1] || '#10b981' },
            data: data.crmBookings,
          },
          {
            name: 'Campaign & Host Events',
            type: 'scatter',
            xAxisIndex: 1,
            yAxisIndex: 2,
            symbolSize: 16,
            data: scatterData,
          },
        ],
      };
    }

    default:
      return {};
  }
};
