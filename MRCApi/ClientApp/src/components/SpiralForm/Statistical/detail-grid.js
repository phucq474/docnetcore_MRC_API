import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CreateActionSpiralFormStatistical } from '../../../store/SpiralFormStatisticalController.js';
import { ChartColumn } from "./chart-column.js";

class DetailGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            detail: null
        }
        //this.renderDetail=this.renderChart.bind(this);
        // this.renderChart=this.renderChart.bind(this);
    }
    componentDidMount() {

        this.props.SpiralFormStatisticalController.GetByQuestion(this.props.dataInput)
            .then(() => {
                const result = this.props.questionData;
                this.setState({
                    detail: result,
                })
            });
    }
    render() {
        if (this.state.detail === null)
            return <ProgressSpinner style={{ left: '47%' }}></ProgressSpinner>

        return (
            <>
                <ChartColumn datachart={this.state.detail} />
            </>
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        questionData: state.spiralFormStatistical.questionData
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormStatisticalController: bindActionCreators(CreateActionSpiralFormStatistical, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailGrid);