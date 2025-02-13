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
//const lstColor = ["#4287f5", "#28a745", "#f35232", "darkviolet", "#e32d32", "#FFCC00"]
export const ColumnMultiLabelChart = ({
  dataChart,
  groupColumn,
  stacking,
  chartHeight,
  lineWidth,
  titleXLeft,
  titleXRight,
  grouping,
  typeYAxis,
  multiLabel,
  dash,
  colors,
  onClick,
  id,
  arrColor = [],
}) => {
  const [data, setData] = useState({});
  useEffect(() => {
    let chartOption = {
      chart: {
        type: "column",
        height: chartHeight || 400,
        plotBackgroundColor: null,
        backgroundColor: "transparent",
      },
      lang: {
        decimalPoint: ",",
        thousandsSep: ".",
      },
      title: {
        text: "Combination chart",
        style: {
          //color: lstColor[2],
          fontWeight: "bold",
        },
      },
      xAxis: [],
      yAxis: [
        {
          min: 0,
          title: {
            text: titleXLeft || "value",
          },
          stackLabels: {
            enabled: true,
          },
        },
        {
          min: 0,
          //max: 100,
          opposite: true,
          title: {
            text: titleXRight || "%",
          },
          stackLabels: {
            enabled: true,
          },
        },
      ],
      plotOptions: {
        column: {
          stacking: stacking,
          dataLabels: {
            enabled: true,
            verticalAlign: "bottom",
            inside: true,
            //allowOverlap: true,
            format: "{point.y:,.0f}",
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
            format: "{point.y}",
          },
          // lineWidth: lineWidth
        },
        series: {
          point: {
            events: {
              click() {
                return onClick ? onClick(this.category, id) : null;
              },
            },
          },
        },
      },
      tooltip: {
        headerFormat: '<b style="font-size:14px">{point.key}</b><table>',
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
        dataLable = [],
        tooltip = [],
        cate1 = [],
        cate2 = [],
        color = null,
        dashStyle = "",
        lineW = 2;
      //let lstColor =  lstColor;
      groupColumn.forEach((col) => {
        let seriesData = [];
        let seriesName;
        let charttype = "column";
        let yAxis = 0;
        dataChart.forEach((item) => {
          //row
          if (!col.toString().includes("line")) {
            chartOption.title.text = item.title;
            //Xlable
            // chartOption.xAxis.categories.push(item.xLable);
            seriesData.push(item[col]);

            cate1.push(item.xLabel);
            // if (!cate2.includes(item.xLable2))
            cate2.push(item.xLabel2);
            dataLable = {
              enabled: true,
              inside: grouping && col === "1" ? true : false,
              format: "{point.y:,.0f}",
            };

            tooltip = {
              valueSuffix: "",
            };
            color = arrColor.length > 0 ? arrColor[col] : lstColor[col];
            seriesName = item["ly" + col];
          } else {
            seriesData.push(item[col]);
            charttype = typeYAxis || "spline";
            yAxis = 1;
            seriesName = item["ly" + col];
            dataLable = {
              enabled: true,
              format: "{point.y}",
            };
            if (dash === col) {
              dashStyle = "dash";
              lineW = 2;
            } else {
              dashStyle = "";
              lineW = lineWidth;
            }
            tooltip = {
              valueSuffix: "",
            };
            color =
              arrColor.length > 0
                ? arrColor[col.replace("line", "")]
                : lstColor[col.replace("line", "")];
          }
        });
        if (parseInt(col, 0) < 2) {
          if (grouping)
            data.push({
              grouping: false,
              zIndex: 10,
              data: seriesData,
              name: seriesName,
              dataLabels: dataLable,
              tooltip: tooltip,
              color: color,
              type: charttype,
              yAxis,
              xAxis: parseInt(col, 0),
            });
          else
            data.push({
              data: seriesData,
              name: seriesName,
              dataLabels: dataLable,
              tooltip: tooltip,
              color: color,
              type: charttype,
              yAxis,
              xAxis: parseInt(col, 0),
            });
        } else {
          if (grouping)
            data.push({
              grouping: false,
              zIndex: 10,
              data: seriesData,
              dataLabels: dataLable,
              tooltip: tooltip,
              name: seriesName,
              color: color,
              type: charttype,
              lineWidth: lineW,
              dashStyle: dashStyle,
              yAxis,
            });
          else
            data.push({
              data: seriesData,
              name: seriesName,
              dataLabels: dataLable,
              tooltip: tooltip,
              color: color,
              type: charttype,
              lineWidth: lineW,
              dashStyle: dashStyle,
              yAxis,
            });
        }
      });
      chartOption.series = data;
      chartOption.xAxis = [
        {
          visible: true,
          labels: {
            enabled: true,
            step: 1,
          },
          categories: cate1,
        },
        {
          categories: cate2,
          visible: multiLabel === false ? false : true,
        },
      ];
      setData(chartOption);
    }
  }, [dataChart]);
  return <HighchartsReact highcharts={Highcharts} options={data} />;
};
