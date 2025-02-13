import React,{Component} from "react";
import Highcharts from "highcharts";
import {connect} from "react-redux";
import Chart from '../Controls/Charts/Chart'
class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        let datas = await []
        for(let i = 0;i < 26;i++) {
            await datas.push({
                name: String.fromCharCode(i + 65),
                data: (Math.random() * (100 - 1) + 1) | 0,
                y: (Math.random() * (100 - 1) + 1) | 0,
            })
        }
        await this.setState({
            title: {
                text: 'Chart TEST'
            },
            xAxis: [{
                categories: datas.map(e => e.name),
                title: {
                    text: null
                },
                crosshair: true,
            }],
            yAxis: [{
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Numbers of'
                },
                crosshair: true,
            }],
            annotations: [],
            tooltip: {
            },
            legend: {
                shadow: true
            },
            dataStackColumns: [{
                name: 'John',
                type: 'column',
                data: [5,3,4,7,2],
                stack: 'male'
            }],
            datas: [{
                type: 'pie',
                // name: 'ok',
                // data: datas.map(e => e.data),
                data: datas,
                showInLegend: true,
                dataLabels: {
                    enabled: true,
                },
                // center: [150,80],
                // size: 100,
            },],
        })
    }
    render() {
        return (
            <React.Fragment>
                <Chart
                    title={this.state.title}
                    subtitle={this.state.subtitle}
                    caption={this.state.caption}
                    chart={this.state.chart}
                    legend={this.state.legend}
                    annotations={this.state.annotations}
                    xAxis={this.state.xAxis}
                    yAxis={this.state.yAxis}
                    tooltip={this.state.tooltip}
                    typeOfChart={"pie"} // * column/pie/spline/series/stack/bar
                    useHalfPieChart={false}
                    useConbination={false}
                    datas={this.state.datas}
                />
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);