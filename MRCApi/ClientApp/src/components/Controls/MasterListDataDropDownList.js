import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MasterListActionCreate } from '../../store/MasterListDataController';
import PropTypes from 'prop-types';
import { LangType } from '../../Utils/Helpler';
class MasterListDataDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            masterlist: []
        }
        this.handleChange = this.handleChange.bind(this);
    }
    static propTypes = {
        listCode: PropTypes.string.isRequired,
    };
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    async componentDidMount() {
        await this.props.MasterListController.GetMasterListData(this.props.accId).then(() => {
            this.setState({ masterlist: this.props.masterlist })
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.accId !== this.props.accId) {
            this.props.MasterListController.GetMasterListData(nextProps.accId).then(
                () => {
                    this.setState({ masterlist: this.props.masterlist })
                }
            )
        }
    }

    render() {
        const isVie = LangType();
        const masterListDatas = this.state.masterlist;
        let result = [];
        if (masterListDatas.length > 0) {
            masterListDatas.forEach(element => {
                if (element.listCode === this.props.listCode) {
                    result.push({ name: (element.nameVN ? element.nameVN : element.name), value: element.id });
                }
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
                disabled={this.props.disabled}
            />

        );
    }
}
function mapStateToProps(state) {
    return {
        masterlist: state.masterListDatas.masterlist,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        MasterListController: bindActionCreators(MasterListActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MasterListDataDropDownList);