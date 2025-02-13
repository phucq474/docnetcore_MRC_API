import React, { PureComponent } from "react";
import Highcharts from "highcharts";
export default class LineChart extends PureComponent {
  instance;
  options = {
    chart: {
      type: "column",
      backgroundColor: 'transparent'
    },
    title: {
      text: "Bar Chart"
    },
    series: [
      {
        name: "hai",
        data: [10, 3, 4, 10, 9, 11]
      },
      {
        name: "actual",
        data: [11, 1, 44, 30, 12, 41]
      },
      {
        name: "percent",
        data: [10, 3, 4, 10, 9, 11]
      }
    ]
  };
 
  componentDidMount() {
    this.instance = Highcharts.chart("chart-id", this.options);
  }
  render() {
    return (
      <div id="chart-id" />
    );
  }
}
