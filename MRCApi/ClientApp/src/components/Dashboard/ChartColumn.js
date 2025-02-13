import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts, { color } from "highcharts/highstock";
import { applyMiddleware } from "redux";
const lstColorAL = ["#4287f5", "#28a745", "#f35232", "#f03c93", "#e32d32",]
const lstColorMT = ["#045DEC", "#FFCC00", "#434444", "#e32d32", "#21a30d", "#f03c93"]
const user = JSON.parse(localStorage.getItem("USER"));
export const ChartColum = ({ datachart, groupColumn, stacking, chartHeight, lineWidth, textColumn }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        let chartOption = {
            chart: {
                type: 'column',
                plotBackgroundColor: null,
                backgroundColor: 'transparent',
                height: chartHeight || 400
            },
            title: {
                text: 'Combination chart',
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
                }
            },
            yAxis: [{
                min: 0,
                title: {
                    text: textColumn || 'Số lượng'
                },
                stackLabels: {
                    enabled: true
                }
            },
            {
                min: 0,
                //max: 100,
                opposite: true,
                title: {
                    text: 'Phần trăm (%)'
                },
                stackLabels: {
                    enabled: true,
                }
            }],
            plotOptions: {
                column: {
                    stacking: stacking,
                    dataLabels: {
                        enabled: true,
                        verticalAlign: 'bottom',
                        allowOverlap: true,
                        padding: 8,
                        format: '{point.y:,.0f}',
                    }
                },
                spline: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.y} %',

                    },
                    lineWidth: lineWidth >= 0 ? 0 : 2
                },

            },
            tooltip: stacking === 'normal' ? {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            } : {
                    headerFormat: '<b style="font-size:10px">{point.key}</b><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
            series: []
        }
        if (datachart?.length > 0) {
            let data = [], color = null;
            let lstColor = lstColorAL;
            if (user.accountId === 1) lstColor = lstColorMT;
            groupColumn.forEach(col => {
                let seriesData = [];
                let seriesName;
                let charttype = 'column';
                let yAxis = 0;
                let color;
                datachart.forEach(item => {//row
                    if (!col.toString().includes('line')) {
                        chartOption.title.text = item.title
                        //Xlable
                        chartOption.xAxis.categories.push(item.xLable);
                        seriesData.push(item[col])
                        seriesName = item['ly' + col]
                        color = lstColor[col]
                    } else {
                        seriesData.push(item[col])
                        charttype = 'spline'
                        yAxis = 1
                        seriesName = item['ly' + col]
                        color = lstColor[col.replace('line', '')]
                    }
                })
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
    }, [])
    return (
        <div style={{ marginTop: 5 }} className="p-shadow-5">
            <HighchartsReact
                highcharts={Highcharts}
                options={data}
                lang={{
                    decimalPoint: ',',
                    thousandsSep: '.'
                }}
            />
        </div>
    )
}