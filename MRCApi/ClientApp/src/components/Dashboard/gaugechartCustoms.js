import React from "react";
// Import Highcharts
import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
highchartsMore(Highcharts);
solidGauge(Highcharts);
class GaugeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          type: "solidgauge",
          backgroundColor: 'transparent'
        },
        pane: {
          center: ["25%", "50%"],
          size: "100%",
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || "#EEE",
            innerRadius: "80%",
            outerRadius: "100%",
            shape: "arc"
          }
        },
        title: "Sellout",
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: -10,
              borderWidth: 0,
              useHTML: true
            }
          }
        },
        // the value axis
        yAxis: {
          stops: [
            //[0.2, "#DF5353"], // green
            //[0.8, "#DDDF0D"], // yellow
            [0.1, "#55BF3B"] // red
          ],
          lineWidth: 0,
          tickWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          min: 0,
          max: 100,
          labels: {
            y: 16
          }
        },
        series: [
          {
            name: "Sellout Summary ",
            data: [Math.round(29 / 100 * 100)],
            innerRadius: "80%",
            dataLabels: {
              format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">%</span>' +
                "</div>"
            },
            tooltip: {
              valueSuffix: " %"
            }
          }
        ]
      }
    }
  }
  // componentWillReceiveProps(nextprops){
  //   if(nextprops.serial!=this.props.serial){
  //       this.setState({option:{serial:nextprops.serial}});
  //   }
  // }
  render() {
    return (
      <div style={{ height: 260, display: "flex" }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={this.state.options}
          ref="chartComponent1"
        />
      </div>
    );
  }
}
export default GaugeChart;
