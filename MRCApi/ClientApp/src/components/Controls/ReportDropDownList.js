import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ReportCreateAction } from '../../store/ReportController';
import PropTypes from 'prop-types';

class ReportDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { reportList: [] }
        this.handleChange = this.handleChange.bind(this);
    }
    static propTypes = {
        positionId: PropTypes.number.isRequired,
    };
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }

    componentDidMount() {
        let data = {
            positionId: this.props.positionId,
        }
        this.props.ReportController.GetListReport(data, null)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.accId !== this.props.accId) {
            let data = {
                positionId: this.props.positionId,
            }
            this.props.ReportController.GetListReport(data, nextProps.accId)
        }
    }

    render() {
        const reportList = this.props.reportList ? this.props.reportList : [];
        let result = [];
        if (reportList.length > 0) {
            reportList.forEach(element => {
                result.push({ name: element.reportName, value: element.reportCode });
            });
        }
        return (
            <Dropdown
                key={result.id}
                style={{ width: '100%' }}
                options={result}
                onChange={this.handleChange}
                value={this.props.value}
                placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                optionLabel="name"
                filter={true}
                filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                filterBy="name"
                showClear={true}
            />

        );
    }
}
function mapStateToProps(state) {
    return {
        reportList: state.reportList.reportList,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ReportController: bindActionCreators(ReportCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReportDropDownList);