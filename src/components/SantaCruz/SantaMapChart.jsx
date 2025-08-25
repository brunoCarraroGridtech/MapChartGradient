import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as echarts from 'echarts';
import $ from 'jquery';
import { getPieDataForLocation, categoryColors, mapConfig } from './transformValues';

const SantMapChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(categoryColors).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  const createGradientColorStops = useCallback((data, selectedCategories) => {
    const filteredData = data.filter(item => selectedCategories[item.name]);
    const total = filteredData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];

    let offset = 0;
    return filteredData.map(item => {
      const start = offset / total;
      offset += item.value;
      const end = offset / total;
      const color = item.itemStyle?.color || '#A9A9A9';
      return [
        { offset: start, color },
        { offset: end, color }
      ];
    }).flat();
  }, []);

  const processCityData = useCallback((feature, selectedCategories) => {
    const name = feature.properties.name;
    const data = getPieDataForLocation(name);
    const filteredData = data.filter(item => selectedCategories[item.name]);
    const total = filteredData.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
      return {
        name,
        value: 0,
        itemStyle: {
          areaColor: mapConfig.style.noDataColor,
          borderColor: mapConfig.style.borderColor,
          borderWidth: mapConfig.style.borderWidth,
        },
      };
    }

    const colorStops = createGradientColorStops(data, selectedCategories);
    return {
      name,
      value: total,
      itemStyle: {
        areaColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops,
          global: false,
        },
        borderColor: mapConfig.style.borderColor,
        borderWidth: mapConfig.style.borderWidth,
      },
    };
  }, [createGradientColorStops]);

  const createTooltipFormatter = useCallback((params, selectedCategories) => {
    const data = getPieDataForLocation(params.name);
    const filteredData = data.filter(item => selectedCategories[item.name]);
    const tooltipItems = filteredData.map(item => `${item.name}: ${item.value}`).join('<br/>');
    return `<b>${params.name}</b><br/>${tooltipItems}`;
  }, []);

  const createChartOptions = useCallback((cityData, selectedCategories) => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: mapConfig.tooltip.backgroundColor,
      borderColor: mapConfig.tooltip.borderColor,
      borderWidth: mapConfig.tooltip.borderWidth,
      textStyle: mapConfig.tooltip.textStyle,
      padding: mapConfig.tooltip.padding,
      formatter: (params) => params.seriesType === 'map'
        ? createTooltipFormatter(params, selectedCategories)
        : false,
    },
    legend: {
      show: mapConfig.legend.show,
      orient: mapConfig.legend.orient,
      left: mapConfig.legend.position.left,
      top: mapConfig.legend.position.top,
      padding: mapConfig.legend.padding,
      itemGap: mapConfig.legend.itemGap,
      itemWidth: mapConfig.legend.itemWidth,
      itemHeight: mapConfig.legend.itemHeight,
      textStyle: mapConfig.legend.textStyle,
      selectedMode: mapConfig.legend.selectedMode,
      selected: selectedCategories,
      data: Object.keys(categoryColors),
      backgroundColor: mapConfig.legend.backgroundColor,
      borderWidth: mapConfig.legend.borderWidth,
    },
    color: Object.values(categoryColors),
    series: [
      {
        type: 'pie',
        radius: 0,
        center: ['50%', '50%'],
        data: Object.keys(categoryColors).map(key => ({ name: key, value: 1, itemStyle: { color: categoryColors[key] } })),
        silent: true,
        label: { show: false },
        labelLine: { show: false },
      },
      {
        type: 'map',
        map: 'SantaCruz',
        roam: mapConfig.interaction.roam,
        scaleLimit: mapConfig.interaction.scaleLimit,
        selectedMode: false,
        labelLayout: {
            hideOverlap: true,   // automatically hides overlapping labels, or should idk
            moveOverlap: 'shiftX' // move them left/right if they overlap
          },
        label: {
          show: mapConfig.labels.show,
          color: mapConfig.labels.color,
          fontSize: mapConfig.labels.fontSize,
          fontWeight: mapConfig.labels.fontWeight,
        },
        emphasis: {
          label: { 
            show: mapConfig.labels.show, 
            color: mapConfig.labels.hoverColor,
            fontSize: mapConfig.labels.hoverFontSize,
            fontWeight: mapConfig.labels.hoverFontWeight,
          },
          itemStyle: {
            borderColor: mapConfig.style.hoverBorderColor,
            borderWidth: mapConfig.style.hoverBorderWidth,
            areaColor: mapConfig.style.keepOriginalColorOnHover ? null : undefined,
          },
        },
        select: { disabled: true, itemStyle: { areaColor: null } },
        itemStyle: { borderColor: mapConfig.style.borderColor, borderWidth: mapConfig.style.borderWidth },
        data: cityData,
      },
    ],
  }), [createTooltipFormatter]);

  const initializeChart = useCallback((geoJSON, selectedCategories) => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    if (chartInstanceRef.current) chartInstanceRef.current.dispose();
    const chart = echarts.init(chartDom);
    chartInstanceRef.current = chart;

    echarts.registerMap('SantaCruz', geoJSON);
    const cityData = geoJSON.features.map(feature => processCityData(feature, selectedCategories));
    chart.setOption(createChartOptions(cityData, selectedCategories));

    chart.on('georoam', () => {
  const option = chart.getOption();
  const mapSeriesIndex = option.series.findIndex(s => s.type === 'map');
  const mapSeries = option.series[mapSeriesIndex];
  const zoom = mapSeries.zoom || 1;

  // Update just the label formatter dynamically
  option.series[mapSeriesIndex].label.formatter = (params) => {
    const data = getPieDataForLocation(params.name);
    const filteredData = data.filter(item => selectedCategories[item.name]);

    if (zoom < mapConfig.legendZoom.activateLegends) {
      return params.name;
    } else {
      const categoryLines = filteredData
        .map(item => `${item.name}: ${item.value}`)
        .join('\n');
      return `${params.name}\n${categoryLines}`;
    }
  };

  chart.setOption(option);
});

    if (mapConfig.legend.show) {
      chart.on('legendselectchanged', (params) => {
        const newSelection = params.selected;
        setSelectedCategories(newSelection);
        const updatedCityData = geoJSON.features.map(feature => processCityData(feature, newSelection));
        chart.setOption({
          series: [
            chart.getOption().series[0],
            { ...chart.getOption().series[1], data: updatedCityData }
          ]
        });
      });
    }

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [processCityData, createChartOptions]);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    if (!chartInstanceRef.current) chartInstanceRef.current = echarts.init(chartDom);
    chartInstanceRef.current.showLoading();

    $.get('/assets/SantaCruz.json')
      .done((geoJSON) => {
        chartInstanceRef.current.hideLoading();
        initializeChart(geoJSON, selectedCategories);
      })
      .fail(() => {
        chartInstanceRef.current.hideLoading();
      });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [initializeChart, selectedCategories]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default SantMapChart;
