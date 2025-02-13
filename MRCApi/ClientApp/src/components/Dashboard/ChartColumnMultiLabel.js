import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts, { color } from "highcharts/highstock";
const lstColorAL = ["#4287f5", "#28a745", "#f35232", "#f03c93", "#e32d32",]
const lstColorMT = ["#045DEC", "#FFCC00", "#434444", "#e32d32", "#21a30d", "#f03c93"]
const user = JSON.parse(localStorage.getItem("USER"));
export const ChartColumnMultiLabel = ({ datachart, groupColumn, stacking, chartHeight, lineWidth, textColumn, grouping, typeYAxis, multiLabel, dash, colors }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        let chartOption = {
            chart: {
                type: 'column',
                height: chartHeight || 400,
                plotBackgroundColor: null,
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Combination chart',
                style: {
                    //color: lstColor[2],
                    fontWeight: 'bold',
                }
            },
            xAxis: [],
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
                    // lineWidth: lineWidth
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
            let data = [], dataLable = [], tooltip = [], cate1 = [], cate2 = [], color = null, dashStyle = '', lineW = 2;
            let lstColor = colors || lstColorAL;
            if (user.accountId === 1)
                lstColor = colors || lstColorMT;
            groupColumn.forEach(col => {
                let seriesData = [];
                let seriesName;
                let charttype = 'column';
                let yAxis = 0;
                datachart.forEach(item => {//row
                    if (!col.toString().includes('line')) {
                        chartOption.title.text = item.title
                        //Xlable
                        // chartOption.xAxis.categories.push(item.xLable);
                        seriesData.push(item[col])

                        cate1.push(item.xLable);
                        // if (!cate2.includes(item.xLable2))
                        cate2.push(item.xLable2);
                        dataLable = {
                            enabled: true,
                            inside: grouping && col === "1" ? true : false,
                            format: '{point.y}',
                        }

                        tooltip = {
                            valueSuffix: ''
                        }
                        color = lstColor[col]
                        seriesName = item['ly' + col]
                    }
                    else {
                        seriesData.push(item[col])
                        charttype = typeYAxis || 'spline'
                        yAxis = 1
                        seriesName = item['ly' + col]
                        dataLable = {
                            enabled: true,
                            format: '{point.y} %',
                        };
                        if (dash === col) {
                            dashStyle = 'dash';
                            lineW = 2;
                        }
                        else {
                            lineW = lineWidth;
                        }
                        tooltip = {
                            valueSuffix: ' %'
                        };
                        color = lstColor[col.replace('line', '')]
                    }
                })
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
                            xAxis: parseInt(col, 0)
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
                            xAxis: parseInt(col, 0)
                        });
                }
                else {
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
            chartOption.xAxis = [{
                visible: true,
                labels: {
                    enabled: true,
                    step: 1
                },
                categories: cate1
            },
            {

                categories: cate2,
                visible: multiLabel === false ? false : true
            }];
            setData(chartOption);
        }
    }, [])
    return (
        <div className="p-shadow-5">
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