import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { color } from "highcharts/highstock";
import drilldown from "highcharts/modules/drilldown";

drilldown(Highcharts);
// dataModule(Highcharts);
// accessibility(Highcharts);
//const lst = ["#045DEC", "#FFCC00", "#434444", "#e32d32", "#21a30d", "#f03c93"];
const lstColorAL = ["#4287f5", "#28a745", "#f35232", "#f03c93", "#e32d32"];
const lstColorMT = ["#e32d32", "#045DEC", "#f38a1f", "#a6a6a6", "#f6ef4c"];
const user = JSON.parse(localStorage.getItem("USER"));
export const ChartColumnWithDrillDown = ({ datachart, chartHeight }) => {
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
        style: {
          //color: lstColor[2],
          fontWeight: "bold",
        },
      },
      subtitle: {
        text: "Click vào Cột để xem chi tiêt theo TV. ",
      },
      accessibility: {
        enabled: false,
      },
      // accessibility: {
      //     announceNewData: {
      //         enabled: true
      //     }
      // },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: "category",
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
      ],
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y}",
          },
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
      },
      series: [],
    };
    if (datachart?.length > 0) {
      let data = [],
        seriesData = [],
        seriesName = "";
      let lstColor = lstColorAL;
      if (user.accountId === 1) lstColor = lstColorMT;
      let drilldownSeries = [];
      datachart.forEach((item) => {
        //row
        chartOption.title.text = item.title;
        seriesData.push({
          name: item.xLable,
          y: item.yValue,
          color:
            item.xLable === "Không có LLV"
              ? lstColor[0]
              : item.xLable === "Không CI, Không CO"
              ? lstColor[4]
              : lstColor[1],
          drilldown: item.xLable,
        });
        const detail = JSON.parse(item.detail);
        let drilldownData = [];
        detail.forEach((element) => {
          drilldownData.push([element.Name, element.Value]);
        });
        drilldownSeries.push({
          name: item.xLable,
          id: item.xLable,
          data: drilldownData,
        });
      });
      data.push({
        data: seriesData,
        name: seriesName,
        colorByPoint: true,
      });
      chartOption.series = data;
      chartOption.drilldown = {
        series: drilldownSeries,
      };
      setData(chartOption);
    }
  }, []);
  return (
    <div style={{ marginTop: 5 }} className="p-shadow-5">
      <HighchartsReact highcharts={Highcharts} options={data} />
    </div>
  );
};
