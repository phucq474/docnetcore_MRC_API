import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
let lstColor = ["#e32d32", "#f03c93", "#f35232", "#28a745", "#4287f5",]
//  ["#4287f5", "#28a745", "#f35232", "#f03c93", "#e32d32",]
export const ChartBar = ({ datachart, groupBar, chartHeight }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        let chartOption = {
            chart: {
                type: 'bar',
                plotBackgroundColor: null,
                backgroundColor: 'transparent',
                height: chartHeight || 400
            },
            title: {
                text: 'Stacked column chart',
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
            yAxis: {
                min: 0,
                title: {
                    text: 'Số lượng'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            legend: {
                // align: 'right',
                // x: -30,
                verticalAlign: 'bottom',
                reversed: true,
                y: 15,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                // {
                //     type: 'spline',
                //     name: 'Average',
                //     data: [3, 2.67, 3, 6.33, 3.33],
                //     marker: {
                //         lineWidth: 2,
                //         lineColor: Highcharts.getOptions().colors[3],
                //         fillColor: 'white'
                //     }
                // },
            ]
        }
        if (datachart?.length > 0) {
            let data = [];
            groupBar.forEach(col => {
                let seriesData = [];
                let seriesName;
                let charttype = "column"
                datachart.forEach(item => {//row
                    if (!col.toString().includes('line')) {
                        chartOption.title.text = item.title
                        //Xlable
                        chartOption.xAxis.categories.push(item.xLable);
                        seriesData.push(item[col])
                        seriesName = item['ly' + col]
                    } else {
                        seriesData.push(item[col])
                        charttype = 'spline'
                        seriesName = item['ly' + col]
                    }
                })
                data.push({ data: seriesData, name: seriesName, color: lstColor[col], type: charttype });
            });
            //show line
            chartOption.series = data;
            setData(chartOption);
        }
    }, datachart)
    return (
        <div style={{ marginTop: 5, paddingBottom: 20 }} className="p-shadow-5">
            <HighchartsReact
                highcharts={Highcharts}
                options={data}
            />
        </div>
    )
}