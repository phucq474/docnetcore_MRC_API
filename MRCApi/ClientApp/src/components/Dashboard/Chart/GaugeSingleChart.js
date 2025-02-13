import React, { useState, useEffect } from "react";
// Import Highcharts
import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import { formatCurrency } from "../../../Utils/Helpler";

highchartsMore(Highcharts);
solidGauge(Highcharts);

const lstColor = [
  "#045DEC",
  "#FFCC00",
  "#434444",
  "#e32d32",
  "#21a30d",
  "#f03c93",
];

export const GaugeSingleChart = ({ dataChart }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    let chartOption = {
      chart: {
        type: "solidgauge",
        backgroundColor: "transparent",
      },

      title: {
        text: dataChart[0].title,
        style: {
          //color: lstColor[2],
          fontWeight: "bold",
        },
      },

      pane: {
        center: ["50%", "75%"],
        size: "100%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },

      tooltip: {
        enabled: false,
      },

      yAxis: {
        min: 0,
        max: dataChart[0].target,
        title: {
          text: dataChart[0].percent + " %",
          margin: 60,
          y: 50,
          style: {
            color: lstColor[4],
            fontWeight: "800",
            fontSize: "30px",
          },
        },
        minorTickInterval: null,
        endOnTick: false,
      },
      series: [
        {
          name: "%",
          data: [dataChart[0].actual],
          dataLabels: {
            format:
              '<div style="text-align:center">' +
              '<span style="font-size:25px">' +
              formatCurrency(dataChart[0].actual) +
              "/" +
              formatCurrency(dataChart[0].target) +
              "</span><br/>" +
              '<span style="font-size:12px;opacity:0.4">' +
              dataChart[0].cLabel +
              "</span>" +
              "</div>",
          },
          tooltip: {
            valueSuffix: dataChart[0].cLabel,
          },
        },
      ],
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },
    };
    if (dataChart?.length > 0) {
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
