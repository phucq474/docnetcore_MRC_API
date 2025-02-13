import React, { useState, useEffect } from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts, { color } from "highcharts/highstock";

const lstColor= ["#045DEC", "#FFCC00", "#9154CD", "#e32d32", "#21a30d", "darkviolet"]

export const ChartColumn = ({ datachart,  chartHeight }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        let chartOption = {
            chart: {
                type: 'column',
                plotBackgroundColor: null,
                backgroundColor: 'transparent',
                height: chartHeight || 300,
                style: {
                    fontFamily: 'Arial'
                },
            },
            title: {
                text: 'title chart',
                style: {
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
            yAxis: [{
                min: 0,
                title: {
                    text:  'Số lượng'
                },
                stackLabels: {
                    enabled: true
                }
            }],
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        verticalAlign: 'bottom',
                        allowOverlap: true,
                        padding: 8,
                        format: '{point.y:,.0f}',
                    }
                },
            },
            tooltip:  {
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
            let data = [];

            let groupColumn=JSON.parse(datachart[0].colName);
            groupColumn.forEach(col => {
                let seriesData = [];
                let seriesName;
                let yAxis = 0;
                let color;

                datachart.forEach(item => {//row
                    chartOption.title.text = item.title
                    chartOption.xAxis.categories.push(item.xLable);

                        seriesData.push(item[col.colId])
                        seriesName = col.colName
                        color = lstColor[col.colId]

                        
                })
                if (!!seriesName) {
                    data.push({
                        data: seriesData,
                        name: seriesName,
                        yAxis,
                        color: color,
                    });
                }
            });

            chartOption.series = data;
            setData(chartOption);
        }
    }, datachart)
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
