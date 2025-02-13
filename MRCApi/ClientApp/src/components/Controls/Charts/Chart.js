import React,{Component} from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {Toast} from 'primereact/toast';
require('highcharts/modules/exporting')(Highcharts)

const propTypes = {
    title: PropTypes.object,
    chart: PropTypes.object,
    title: PropTypes.object,
    subtitle: PropTypes.object,
    caption: PropTypes.object,
    tooltip: PropTypes.object,
    legend: PropTypes.object,
    plotOptions: PropTypes.object,
    annotations: PropTypes.array,
    xAxis: PropTypes.array,
    yAxis: PropTypes.array,
    series: PropTypes.array,
};
const defaultProps = {
};

class Chart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: {},
            isError: false,
            chart: {
                zoomType: 'xy',
                showAxes: true,
            },
            title: {
                text: 'Title',
                align: "center",
                x: 0,
                style: {},
            },
            subtitle: {
                text: 'SubTitle',
                align: "center",
                x: 0,
                style: {},
            },
            caption: {
                text: "",
                style: {},
            },
            legend: {},
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: false
                    }
                },
            },
            annotations: [],
            tooltip: {
                shared: true
            },
            xAxis: [{
                categories: ['Jan','Feb','Mar','Apr','May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec'],
                crosshair: true,
            }],
            yAxis: [{
                labels: {
                    format: '',
                    style: {},
                },
                title: {
                    text: 'Temperature',
                    style: {},
                },
                crosshair: true,
            }],
            series: [{
                type: 'column',
                name: 'Jane',
                data: [49.9,71.5,106.4,129.2,144.0,176.0,135.6,148.5,216.4,194.1,95.6,54.4],
            },],
        }
    }
    Alert = (mess,style) => {
        if(style === undefined)
            style = "success";
        this.toast.show({severity: style,summary: `${this.props.language["annoucement"] || "l_annoucement"}`,detail: mess});
    }
    componentWillReceiveProps(nextProps) {
        const init = async () => {
            if(nextProps !== this.props) {
                const {
                    title = {},subtitle = {},caption = {},legend = {},tooltip = {},
                    annotations = [],xAxis = [],yAxis = [],typeOfChart = "",
                    useHalfPieChart = false,datas = [],
                } = await nextProps
                const options = await {
                    chart: {
                        zoomType: 'xy',
                        showAxes: true,
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            yAxis: 1,
                            dataLabels: {
                                enabled: true,
                            },
                            tooltip: {},
                        },
                        series: {
                            label: {
                                connectorAllowed: true
                            },
                        },
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0,
                            stacking: 'normal',
                        },
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                    },
                }
                let seriesObject = await []
                await datas.map(e => seriesObject.push(e))
                if(seriesObject.length === 0) {
                    seriesObject = await this.state.series
                }
                if(useHalfPieChart && typeOfChart === "pie") {
                    options.plotOptions = await Object.assign(
                        options.plotOptions,
                        Object.assign(options.plotOptions.pie,{startAngle: -90,endAngle: 90,})
                    )
                }
                switch(typeOfChart) {
                    case "pie":
                        break;
                    default:
                        break;
                }
                options.chart = await Object.assign(options.chart,{type: typeOfChart})
                options.series = await seriesObject
                options.title = await this.truthyObject(title) ? title : this.state.title
                options.subtitle = await this.truthyObject(subtitle) ? subtitle : this.state.subtitle
                options.caption = await this.truthyObject(caption) ? caption : this.state.caption
                options.legend = await this.truthyObject(legend) ? legend : this.state.legend
                options.tooltip = await this.truthyObject(tooltip) ? tooltip : this.state.tooltip
                options.annotations = await annotations.length > 0 ? annotations : this.state.annotations
                options.xAxis = await xAxis.length > 0 ? xAxis : this.state.xAxis
                options.yAxis = await yAxis.length > 0 ? yAxis : this.state.yAxis
                await this.setState({
                    options: options
                })
            }
        }
        init()
    }
    truthyObject = (obj) => {
        return Object.getOwnPropertyNames(obj).length > 0
    }
    render() {
        return (
            <React.Fragment>
                <Toast ref={(el) => this.toast = el} />
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.options}
                />
            </React.Fragment>
        )
    }
}
Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Chart);