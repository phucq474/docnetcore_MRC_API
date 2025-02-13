import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MasterListActionCreate } from '../../store/MasterListDataController';

class CompetitorDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    componentDidMount() {
        const competitor = [...this.props.competitor];
        if (competitor.length === 0)
            this.props.MasterListDataController.GetCompetitor();
    }
    render() {
        const competitor = [...this.props.competitor];
        let result = [];
        if (competitor.length > 0) {
            // competitor.forEach(element => {

            //     if (this.props.refName !== undefined && this.props.refName !== null && this.props.refName !== '')
            //         if (this.props.refName.toLowerCase() === 'competitor' && element.sortList > 1 && this.props.refName.toLowerCase() !== element.competitorName.toLowerCase())
            //             result.push({ name: element.competitorName, value: element.id });
            //         else {
            //             if (this.props.refName.toLowerCase() !== 'competitor' && element.sortList === 1)
            //                 result.push({ name: element.competitorName, value: element.id });
            //         }
            //     else
            //         result.push({ name: element.competitorName, value: element.id });
            // });
            competitor.forEach(element => {
                if (this.props.refName !== undefined && this.props.refName !== null && this.props.refName !== '')
                    if (this.props.refName.toLowerCase() === 'competitor' && element.order > 1 && this.props.refName.toLowerCase() !== element.competitor.toLowerCase())
                        result.push({ name: element.competitor +' - '+ element.brandCode, value: element.id });
                    else {
                        if (this.props.refName.toLowerCase() !== 'competitor' && element.order === 1)
                            result.push({ name: element.competitor +' - '+ element.brandCode, value: element.id });
                    }
                else
                    result.push({ name: element.competitor +' - '+ element.brandCode, value: element.id });
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
        competitor: state.masterListDatas.competitor,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        MasterListDataController: bindActionCreators(MasterListActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CompetitorDropDownList);