import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ColorTheme, WidgetConfig } from '../../types/dashboard';
import { buildEChartsOption } from './chartOptions';

interface EChartRendererProps {
  widget: WidgetConfig;
  theme: ColorTheme;
}

export const EChartRenderer: React.FC<EChartRendererProps> = ({ widget, theme }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize ECharts instance if not already initialized
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas',
      });
    }

    const option = buildEChartsOption(widget, theme);
    chartInstance.current.setOption(option, true);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(chartRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [widget, theme]);

  // Clean up instance on unmount
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className="w-full h-full min-h-[160px] transition-all duration-300"
      data-chart-id={widget.id}
    />
  );
};
