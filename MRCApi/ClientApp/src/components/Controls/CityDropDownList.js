import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RegionActionCreate } from '../../store/RegionController';
import PropTypes from 'prop-types';

class CityDropDownList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    static propTypes = {
        regionType: PropTypes.string.isRequired,
        parent: PropTypes.string.isRequired
    };
    handleChange(e) {
        this.props.onChange(this.props.id, e.target.value);
    }
    componentDidMount() {
        const regions = [...this.props.regions];
        if (regions.length === 0)
            this.props.RegionController.GetListRegion();
    }
    render() {
        const regions = [...this.props.regions];
        let result = [], lstItem = [];
        if (regions.length > 0 && result.length === 0) {
            switch (this.props.regionType) {
                case "Area":
                    regions.forEach(element => {
                        lstItem.push({ name: element.areaName, value: element.areaName });
                    });
                    result = lstItem.reduce((unique, o) => {
                        if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    break;
                case "Region":
                    regions.forEach(element => {
                        if (this.props.parent !== "") {
                            if (element.area === this.props.parent)
                                lstItem.push({ name: element.regionName, value: element.regionName });
                        }
                        else
                            lstItem.push({ name: element.regionName, value: element.regionName });
                    });
                    result = lstItem.reduce((unique, o) => {
                        if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    break;
                case "Province":
                    regions.forEach(element => {
                        if (this.props.parent !== "") {
                            if (this.props.parentType === "Region") {
                                if (element.region === this.props.parent)
                                    if(lstItem.findIndex(e => e.provinceName === element.provinceName) <0)
                                        lstItem.push({ name: element.provinceName, value: element.provinceId });
                            }
                            else {
                                if (element.areaName === this.props.parent || element.region === this.props.parent)
                                    if(lstItem.findIndex(e => e.provinceName === element.provinceName) <0)
                                        lstItem.push({ name: element.provinceName, value: element.provinceId });
                            }
                        }
                        else
                            if(lstItem.findIndex(e => e.provinceName === element.provinceName) <0)
                                lstItem.push({ name: element.provinceName, value: element.provinceId });
                    });
                    result = lstItem.reduce((unique, o) => {
                        if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    break;
                case "District":
                    regions.forEach(element => {
                        if (element.districtId) {
                            if (this.props.parent !== null) {
                                if (element.provinceId === this.props.parent)
                                    if(lstItem.findIndex(e => e.districtName === element.districtName) <0)
                                        lstItem.push({ name: element.districtName, value: element.districtId });
                            }
                            else
                                if(lstItem.findIndex(e => e.districtName === element.districtName) <0)
                                    lstItem.push({ name: element.districtName, value: element.districtId});
                        }
                    });
                    result = lstItem.reduce((unique, o) => {
                        if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    break;
                case "Town":
                    regions.forEach(element => {
                        if (element.townId) {
                            if (this.props.parent !== null) {
                                if (element.districtId === this.props.parent)
                                    if(lstItem.findIndex(e => e.townName === element.townName) <0)
                                        lstItem.push({ name: element.townName, value: element.townId });
                            }
                            else
                                if(lstItem.findIndex(e => e.townName === element.townName) <0)
                                    lstItem.push({ name: element.townName, value: element.townId });
                        }
                    });
                    result = lstItem.reduce((unique, o) => {
                        if (!unique.some(obj => obj.name === o.name && obj.value === o.value)) {
                            unique.push(o);
                        }
                        return unique;
                    }, []);
                    break;
                default:
            }
        }
        return (
            <Dropdown
                key={result.value}
                style={this.props.style ? this.props.style : { width: '100%' }}
                options={result}
                onChange={this.handleChange}
                value={this.props.value}
                placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                optionLabel="name" autoWidth={true}
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
        regions: state.regions.regions,
        loading: state.regions.loading,
        errors: state.regions.errors,
        forceReload: state.regions.forceReload,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        RegionController: bindActionCreators(RegionActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CityDropDownList);