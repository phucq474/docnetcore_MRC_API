import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
const lstColorAL = ["#4287f5", "#28a745", "#f35232", "#f03c93", "#e32d32",]
const lstColor = ["#045DEC", "#FFCC00", "#434444", "#e32d32", "#21a30d", "#f03c93"]

export const ChartLine = ({ datachart, groupLine, chartHeight }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        let chartOption = {
            chart: {
                type: 'line',
                height: chartHeight || 400,
                plotBackgroundColor: null,
                backgroundColor: 'transparent',
            },
            title: {
                verticalAlign: 'top',
                marginTop: 10,
                floating: true,
                text: datachart[0].title,
                style: {
                    //color: lstColor[2],
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                categories: [],
                labels: {
                    style: {
                        fontSize: '13px'
                    }
                },
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Số lượng'
                },
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true,
                        padding: 8,
                        position: 'right'
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.key}</b><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            series: [
                { data: [], name: 'Qty' },
            ]
        }

        if (datachart?.length > 0) {
            let data = [];
            groupLine.forEach(col => {
                let seriesData = [];
                let seriesName;
                datachart.forEach(item => {//row
                    //Xlable
                    chartOption.xAxis.categories.push(item.xLable);
                    seriesData.push(item[col])
                    seriesName = item['ly' + col]
                })
                data.push({ data: seriesData, name: seriesName, color: lstColor[col] });
            });
            //show line
            chartOption.series = data;
            setData(chartOption);
        }
    }, datachart)
    return (
        <div style={{ marginTop: 5 }} className="p-shadow-5">
            <HighchartsReact
                highcharts={Highcharts}
                options={data}
            />
        </div>
    )
}