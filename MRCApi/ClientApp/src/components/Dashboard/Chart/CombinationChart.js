import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { color } from "highcharts/highstock";

const lstColor = [
  "#045DEC",
  "#FFCC00",
  "#434444",
  "#e32d32",
  "#21a30d",
  "#f03c93",
];

export const CombinationChart = ({ dataChart, groupColumn, chartHeight }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    let chartOption = {
      chart: {
        type: "column",
        plotBackgroundColor: null,
        backgroundColor: "transparent",
        height: chartHeight || 400,
      },
      title: {
        text: "Combination chart",
        style: {
          //color: lstColor[2],
          fontWeight: "bold",
        },
      },
      xAxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "13px",
          },
        },
      },
      yAxis: [
        {
          min: 0,
          title: {
            text: "Số lượng",
          },
          stackLabels: {
            enabled: true,
          },
        },
        {
          min: 0,
          title: {
            text: "%",
          },
          stackLabels: {
            enabled: true,
          },
          opposite: true,
        },
      ],
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            verticalAlign: "bottom",
            allowOverlap: true,
            padding: 8,
            format: "{point.y:,.0f}",
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
            format: "{point.y:,.0f}",
          },
        },
      },
      tooltip: {
        headerFormat: '<b style="font-size:10px">{point.key}</b><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      series: [],
    };
    if (dataChart?.length > 0) {
      let data = [],
        color = null;
      groupColumn.forEach((col) => {
        let seriesData = [];
        let seriesName;
        let charttype = "column";
        let yAxis = 0;
        let color;
        dataChart.forEach((item) => {
          //row
          if (!col.toString().includes("line")) {
            chartOption.title.text = item.title;
            //cLabel
            chartOption.xAxis.categories.push(item.xLabel);
            seriesData.push(item[col]);
            seriesName = item["ly" + col];
            color = lstColor[col];
          } else {
            seriesData.push(item[col]);
            charttype = "spline";
            seriesName = item["ly" + col];
            color = lstColor[col.replace("line", "")];
          }
        });
        data.push({
          data: seriesData,
          name: seriesName,
          type: charttype,
          yAxis,
          color: color,
        });
      });

      chartOption.series = data;
      setData(chartOption);
    }
  }, [dataChart]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={data}
      lang={{
        decimalPoint: ",",
        thousandsSep: ".",
      }}
    />
  );
};
