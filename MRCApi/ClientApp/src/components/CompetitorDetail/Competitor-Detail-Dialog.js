import React, { Component } from 'react'
import { Dialog } from 'primereact/dialog';
import { connect } from 'react-redux';
import { InputText } from "primereact/inputtext";
import { bindActionCreators } from 'redux';
import { ProductCreateAction } from '../../store/ProductController';
import { RegionActionCreate } from '../../store/RegionController'
import { CategoryApp } from '../Controls/CategoryMaster'
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CompetitorCreateAction } from '../../store/CompetitorController';
import { Dropdown } from 'primereact/dropdown';
class CompetitorDetailDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account_Id: null,
            divisionId: 0,
            brandId: 0,
            categoryId: 0,
            subCatId: 0,
            variantId: 0,
            giftList: [],
            giftName: null
        }
    }
    handleChange = (id, value) => {
        this.setState({ [id]: value === null ? "" : value });
        this.props.handleChangeDropDown(id, value)
    }
    async componentWillReceiveProps(nextProps) {
        await this.setState({
            divisionId: nextProps.inputValues.divisionId ? nextProps.inputValues.divisionId : 0,
            account_Id: nextProps.inputValues.account_Id ? nextProps.inputValues.account_Id : null
        })
    }
    async componentDidMount() {
        await this.props.CompetitorController.GetListCate()
    }

    handleChangeText = (value, stateName, id) => {
        this.setState({
            [id]: value
        })
    }
    handleAddGiftName = async () => {
        let giftName = await this.state.giftName
        let giftList = await this.state.giftList
        if (giftName && giftName !== '') {
            let data = {
                GiftId: giftList.length + 1,
                GiftName: giftName
            }
            giftList.push(data)
            await this.setState({
                giftList: giftList,
                giftName: null
            })
            await this.props.handleChangeForm(this.state.giftList, this.props.stateName, 'giftList')
        }
    }
    templateTools = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                    onClick={() => this.handleRemoveGiftItem(rowData)} />
            </div>
        )
    }
    handleRemoveGiftItem = (rowData) => {
        let giftList = this.state.giftList
        if (giftList && giftList.length > 0) {
            let index = giftList.findIndex(e => e.giftId === rowData.giftId)
            if (index > -1) {
                giftList.splice(index, 1)
            }
            this.setState({
                giftList: giftList,
            })
            this.props.handleChangeForm(this.state.giftList, this.props.stateName, 'giftList')
        }
    }
    render() {
        const { actionName, displayDialog, inputValues, handleChangeForm, handleActionDialog, stateName, footerAction, handleChange
        } = this.props
        console.log("this.props.getListCate",this.props.getListCate)
        console.log("inputValues",inputValues)
        return (
            <Dialog style={{ width: '30%' }}
                header={actionName}
                visible={displayDialog}
                footer={footerAction(false)}
                onHide={() => handleActionDialog(false)}>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-12">
                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                        <Calendar fluid
                            value={inputValues.dates} onChange={e => handleChangeForm(e.target.value, stateName, 'dates')}
                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                            id="dates" selectionMode="range"
                            inputStyle={{ width: '91.5%', visible: false }}
                            style={{ width: '100%' }} showIcon />
                        <small className="p-invalid p-d-block">{inputValues.errorDates || ""}</small>

                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <Dropdown value={inputValues.categoryId ? inputValues.categoryId : null}
                                options={this.props.getListCate ? this.props.getListCate.data : null} onChange={(e) => handleChangeForm(e.value, stateName, "categoryId")}
                                optionLabel="name" filter showClear filterBy="name" style={{ width: '100%' }}
                                placeholder={this.props.language["select_shift_code"] || "l_select_shift_code"} />
                        <small className="p-invalid p-d-block">{inputValues.errorCategoryId || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label>{this.props.language["content_name"] || "content_name"}</label>
                        <InputText id="contentName" value={inputValues.contentName || ''}
                            onChange={(e) => handleChangeForm(e.target.value, stateName, 'contentName')}></InputText>
                        <small className="p-invalid p-d-block">{inputValues.errorContentName || ""}</small>
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label>{this.props.language["gift_name"] || "gift_name"}</label>
                        <InputText id="gifName" value={this.state.giftName || ''}
                            onChange={(e) => this.handleChangeText(e.target.value, stateName, 'giftName')}></InputText>
                        <Button icon="pi pi-plus" className="p-button-rounded p-button-warning" onClick={() => this.handleAddGiftName()} />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label>{this.props.language["gift_list"] || "gift_list"}</label>
                        <DataTable
                            value={inputValues.giftList}
                        >
                            <Column field="GiftId" header={this.props.language["gift_id"] || "l_gift_id"} style={{ width: '3%', textAlign: 'center' }} />
                            <Column field="GiftName" header={this.props.language["gift_name"] || "l_gift_name"} style={{ width: '15%' }} />
                            <Column body={this.templateTools} header={this.props.language["tool"] || "l_tool"} style={{ textAlign: 'center', width: "5%" }} />
                        </DataTable>
                        <small className="p-invalid p-d-block">{inputValues.errorGiftList || ""}</small>
                    </div>
                </div>
            </Dialog>
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        usedivision: false,
        usebrand: false,
        usecate: true,
        usesubcate: false,
        usevariant: false,
        getListCate: state.competitor.getListCate
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CompetitorController: bindActionCreators(CompetitorCreateAction, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(CompetitorDetailDialog);