import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
const lstColor = ["#045DEC", "#FFCC00", "#434444", "#e32d32", "#21a30d", "#f03c93"]


export const ChartColumnSingle = ({ datachart }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        let chartOption = {
            chart: {
                type: 'column',
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
            legend: {
                enabled: false
            },
            xAxis: {
                categories: [],
                crosshair: true,
                labels: {
                    style: {
                        fontSize: '13px'
                    }
                }
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: datachart[0].yLable || 'Số lượng'
                },
                dataLabels: {
                    enabled: true
                }
            },
            // series: series,
            plotOptions: {
                column: {
                    dataLabels: {
                        enable: true
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b>',
                pointFormat: '{series.name}: {point.y}',
                formatter: function () {
                    return '<b>' + this.x + '</>' +
                        this.series.name + ': ' + this.y;
                }
            },
        }


        if (datachart?.length > 0) {
            let data = [];
            let seriesData = [];
            let seriesName;
            datachart.forEach(item => {//row
                chartOption.title.text = item.title
                //Xlable
                chartOption.xAxis.categories.push(item?.xLable);
                seriesData.push(item.yValue)
                seriesName = ''
            })
            data.push({
                data: seriesData,
                name: seriesName,
                color: lstColor[0],
                dataLabels: {
                    enabled: true
                }
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
            />
        </div>
    )
}