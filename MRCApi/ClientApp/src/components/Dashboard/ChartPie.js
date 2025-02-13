import React, { useState, useEffect } from 'react'
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
const lstColor = ["#28a745", "#f35232", "#e32d32", "#4287f5", "#f03c93",]

export const ChartPie = ({ datachart, chartoption }) => {
    const [data, setData] = useState({});

    useEffect(() => {
        let chartOption = {
            "chart": {
                "type": "pie",
                plotBackgroundColor: null,
                backgroundColor: 'transparent',
                plotBorderWidth: null,
                plotShadow: false,
            },
            "tooltip": {
                pointFormat: '{point.percentage:.1f}%'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        format: chartoption?.format || '{point.name}: {point.percentage:.1f} %',
                    },
                    innerSize: '0%'
                }
            }, legend: {
                layout: 'vertical',
                align: chartoption?.align || 'right',
                verticalAlign: 'middle',
                fontSize: 10,
                itemMarginTop: 10,
                itemMarginBottom: 10
            },
            "title": { "text": "" },
            "series": [{ "data": [] }]
        }
        let seriesdata = []
        if (datachart?.length > 0) {
            let index = 0;
            datachart.forEach(item => {
                chartOption.title.text = item.title
                seriesdata.push({ y: item.yValue, color: lstColor[index], name: item.yLable })
                index++
            });
            chartOption.series = [{ name: "", data: seriesdata, showInLegend: chartoption?.showlegend, }];
            setData(chartOption);
        }
    }, datachart);
    return (
        <div style={{ marginTop: 5 }} className="p-shadow-5">
            <HighchartsReact
                highcharts={Highcharts}
                options={data}
            />
        </div>
    );
}