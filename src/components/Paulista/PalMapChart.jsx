import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import * as turf from '@turf/turf';
import $ from 'jquery';


import { getPieDataForLocation } from './transformValues';

const PalMapChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (echarts.getInstanceByDom(chartDom)) {
      echarts.dispose(chartDom);
    }

    const myChart = echarts.init(chartDom);
    myChart.showLoading();

    $.get('/assets/Paulista.json', (geoJSON) => {
      myChart.hideLoading();
      echarts.registerMap('Paulista', geoJSON);

      function getOffsetCentroid(feature, offsetXPercent = 0, offsetYPercent = 0) {
              
              const anchor = turf.pointOnFeature(feature).geometry.coordinates;
      
              const bbox = turf.bbox(feature);
              const width = bbox[2] - bbox[0];
              const height = bbox[3] - bbox[1];
      
              return [
                anchor[0] - width * offsetXPercent,
                anchor[1] - height * offsetYPercent,
              ];
      }

      function createPieSeries(center, name) {

        const data = getPieDataForLocation(name);

        return {
          type: 'pie',
          coordinateSystem: 'geo',
         // tooltip: { formatter: '{b}: {c} ({d}%)' },
          label: { show: false },
          labelLine: { show: false },
          animationDuration: 0,
          radius: 12,
          center,
          data,
          name,
        };
      }

      const pieSeries = geoJSON.features.map((f) => {
        const center = getOffsetCentroid(f, -0.05, 0.15);
        return createPieSeries(center, f.properties.name);
      });

      const option = {
        tooltip: { trigger: 'item' },
        legend: {},
        geo: {
          map: 'Paulista',
          roam: true,
          itemStyle: { areaColor: '#e7e8ea', borderColor: '#b1b1b1' },
          label: {
            show: true,
            color: '#000',
            fontSize: 10,
          },
          emphasis: {
            itemStyle: { areaColor: '#b4b4b4' },
            label: { show: true, color: '#000' },
          },
        },
        series: pieSeries,
      };

      myChart.setOption(option);

      const resizeHandler = () => myChart.resize();
      window.addEventListener('resize', resizeHandler);

      return () => {
        window.removeEventListener('resize', resizeHandler);
        myChart.dispose();
      };
    });
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default PalMapChart;