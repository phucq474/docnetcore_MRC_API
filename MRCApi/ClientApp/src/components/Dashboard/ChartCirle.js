import React, { useState, useEffect } from 'react'
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
const lstColor = ["#28a745", "#f35232", "#e32d32", "#4287f5", "#f03c93",]

export const ChartCirle = ({ datachart }) => {
    const [data, setData] = useState({});
    const [chartTitle, setTitle] = useState('');
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
                        // format: '{point.name}: {point.percentage:.1f} %',
                        format: '{point.name} <br/> {point.y:.0f}'
                    },
                    innerSize: '80%'
                }
            }, legend: {
                layout: 'vertical',
                align: 'bottom',
                // verticalAlign: 'middle',
                itemMarginTop: 10,
                itemMarginBottom: 10
            },
            "title": {
                verticalAlign: 'middle',
                marginTop: 10,
                style: { color: lstColor[3] },
                floating: true,
                text: ''
            },
            "series": [{ "data": [] }]
        }
        let seriesdata = []
        if (datachart?.length > 0) {
            let index = 0;
            let total = 0;
            let chart_title = ''
            datachart.forEach(item => {
                total += item?.yValue
                chart_title = item?.title
                seriesdata.push({ y: item?.yValue, color: lstColor[index], name: item?.yLable })
                index++
            });
            chartOption.title.text = datachart[0]?.cLable + "<br/>" + total.toLocaleString();
            chartOption.series = [{ name: "", data: seriesdata, showInLegend: false, }];
            setData(chartOption);
            setTitle(chart_title);
        }
    }, datachart);
    return (
        <div style={{ marginTop: 5 }} className="p-shadow-5">
            <div style={{ top: 5, position: 'relative', top: 10 }}>{chartTitle}</div>
            <HighchartsReact
                highcharts={Highcharts}
                options={data}
            />
        </div>
    );
}