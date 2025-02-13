import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { download, HelpPermission } from '../../Utils/Helpler';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";
import { connect } from 'react-redux';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import moment from 'moment';
import OSATargetDetail from './OSATargetDetail';
import { OSATargetActionCreators } from '../../store/OSATargetController.js';
import Page403 from '../ErrorRoute/page403';
import { AccountDropDownList } from '../Controls/AccountDropDownList';

class OSATarget extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            loading: false,
            permission: {
                view: true,
                export: true,
                import: true,
                create: true,
                delete: true,
                edit: true,
            },
            data: [],
            expandedRows: null,
            selected: 0,
            accId: null
        }
        this.pageId = 1015;
        this.fileUpload = React.createRef()
    }
    Alert = (mess, style) => {
        if (style === undefined) {
            style = "success";
        }
        let life = 3000;
        if (style === 'error') {
            life = 7000;
        }
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess, life: life });
    }
    // handle Change
    handleChange = (id, value) => {
        this.setState({ [id]: value ? value : null })
    }
    handleChangeForm = (value, stateName, subStateName = null) => {
        if (subStateName === null) {
            this.setState({ [stateName]: value });
        } else {
            this.setState({
                [stateName]: { ...this.state[stateName], [subStateName]: value, }
            });
        }
    }
    // Search
    handleSearch = async () => {
        this.setState({ loading: true, expandedRows: null, data: [] })
        const state = this.state
        const data = await {
            customerId: state.customerId || null,
            fromDate: state.dates && state.dates[0] ? +moment(state.dates[0]).format('YYYYMMDD') : null,
            toDate: state.dates && state.dates[1] ? +moment(state.dates[1]).format('YYYYMMDD') : null,
            fromdate: state.dates && state.dates[0] ? moment(state.dates[0]).format('YYYY-MM-DD') : null,
            todate: state.dates && state.dates[1] ? moment(state.dates[1]).format('YYYY-MM-DD') : null,
            shopCode: state.shopCode !== "" && state.shopCode !== undefined ? state.shopCode : null
        }
        await this.props.OSATargetController.GetList(data, state.accId)
        const result = this.props.osaTargets
        if (result && result.length > 0) {
            await this.Alert("Tìm kiếm thành công", "info")
            await this.setState({ data: result })
        } else {
            await this.Alert("Không có dữ liệu", 'error')
            await this.setState({ data: result })
        }
        await this.setState({ loading: false })

    }
    // Template
    handleGetTemplate = async () => {
        await this.props.OSATargetController.Template(this.state.accId)
        const result = this.props.fileTemplate
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }
    // import 
    handleImport = async (event) => {
        await this.setState({ loading: true })
        await this.props.OSATargetController.Import(event.files[0], this.state.accId)
        const result = this.props.result
        if (result && result.status === 1)
            await this.Alert(result.message, 'info')
        else
            await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
        await this.fileUpload.current.clear()
    }
    // export 
    handleExport = async () => {
        const state = this.state
        const data = {
            shopCode: state.shopCode !== "" && state.shopCode !== undefined ? state.shopCode : null,
            customerId: state.customerId || null,
            fromDate: state.dates && state.dates[0] ? +moment(state.dates[0]).format('YYYYMMDD') : null,
            toDate: state.dates && state.dates[1] ? +moment(state.dates[1]).format('YYYYMMDD') : null,
            fromdate: state.dates && state.dates[0] ? moment(state.dates[0]).format('YYYY-MM-DD') : null,
            todate: state.dates && state.dates[1] ? moment(state.dates[1]).format('YYYY-MM-DD') : null,
        }
        await this.setState({ loading: true })
        await this.props.OSATargetController.Export(data, state.accId)
        const result = this.props.fileExport
        if (result && result.status === 1) {
            await download(result.fileUrl)
            await this.Alert(result.message, 'info')
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false })
    }

    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    showShop = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.shopCode}</strong></div>
                <p>{rowData.shopName}</p>
            </div>
        )
    }

    rowExpansionTemplate = (rowData) => {
        return (

            <OSATargetDetail
                dataInput={rowData}
                permission={this.state.permission}
                ActionRefreshData={this.ActionRefreshData}
            ></OSATargetDetail>
        );
    }

    componentDidMount() {
    }
    ActionRefreshData = (rowNum,total) =>{
        let data = this.state.data
        let ind = data.findIndex(e=> e.rowNum === rowNum)
        if(ind > -1){
            if(total > 0){
                data[ind].total = total
            }else{
                data.splice(ind,1)
            }
        }
        this.setState({
            data: data
        })
    }
    HandleChangeSelected = (rowData) => {
        this.setState({ loading: false });
        var selected = rowData;
        var lastselect = this.state.expandedRows;
        if (lastselect != null)
            for (var key in selected) {
                // skip loop if the property is from prototype
                if (!selected.hasOwnProperty(key))
                    continue;
                // var obj = selected[key];
                for (var prop in lastselect) {
                    // skip loop if the property is from prototype
                    if (selected.hasOwnProperty(prop))
                        delete selected[prop];
                    //selected[prop]=false;
                }
            }
        this.setState({ expandedRows: selected });
    }

    render() {

        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} />}
                {/* {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleInsertDialog(true)} style={{ marginRight: "15px" }} />} */}
                {this.state.permission && this.state.permission.import && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={this.fileUpload} mode="basic"
                    customUpload={true} accept=".xlsx,.xls" maxFileSize={10000000} style={{ marginRight: "15px" }}
                    onClear={this.clear} uploadHandler={this.handleImport}
                />}
                {this.state.permission && this.state.permission.import && <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                    this.fileUpload.current.fileInput = { "value": '' };
                    this.fileUpload.current.clear()
                }} />}
            </React.Fragment>
        );

        return (
            this.state.permission.view ? (
                <React.Fragment >
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                        <AccordionTab header={this.props.language["search"] || "search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <AccountDropDownList
                                    id="accId"
                                    className='p-field p-col-12 p-md-3'
                                    onChange={this.handleChange}
                                    filter={true}
                                    showClear={true}
                                    value={this.state.accId} />
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                    <Calendar fluid
                                        value={this.state.dates}
                                        onChange={(e) => this.handleChange(e.target.id, e.value)}
                                        dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                        id="dates" selectionMode="range"
                                        inputStyle={{ width: '91.5%', visible: false }}
                                        style={{ width: '100%' }} showIcon
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["customer"] || "l_customer"}</label>
                                    <CustomerDropDownList
                                        id='customerId'
                                        mode='single'
                                        accId={this.state.accId}
                                        onChange={this.handleChange}
                                        value={this.state.customerId} />
                                </div>
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["storelist_shopcode"] || "storelist_shopcode"}</label>
                                    <InputText
                                        type="text"
                                        style={{ width: '100%' }}
                                        placeholder={this.props.language["storelist_shopcode"] || "storelist_shopcode"}
                                        value={this.state.shopCode}
                                        onChange={(e) => this.handleChange('shopCode', e.target.value)}
                                        id="shopCode" />
                                </div>
                            </div>
                            <br />
                            <Toolbar left={leftContents} right={rightContents} />
                            {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                        </AccordionTab>
                    </Accordion>

                    <DataTable
                        value={this.state.data}
                        paginator
                        rows={20}
                        rowsPerPageOptions={[20, 50, 100]}
                        style={{ fontSize: "13px" }}
                        rowHover paginatorPosition={"both"}
                        dataKey="rowNum"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        expandedRows={this.state.expandedRows}
                        onRowToggle={(e) => this.HandleChangeSelected(e.data)}
                        rowExpansionTemplate={this.rowExpansionTemplate} >
                        <Column expander={true} style={{ width: '3%' }} />
                        <Column filter header='No.' field="rowNum" style={{ width: '5%', textAlign: 'center' }} />
                        <Column filter filterMatchMode="contains" field="channelName" style={{ width: '10%', textAlign: 'center' }} header={this.props.language["channel"] || "l_channel"} />
                        <Column filter filterMatchMode="contains" field="customerName" style={{ width: '20%', textAlign: 'center' }} header={this.props.language["customer"] || "l_customer"} />
                        <Column filterMatchMode="contains" field='shopName' body={this.showShop} filter header={this.props.language["shop_name"] || "l_shop_name"} style={{ textAlign: 'center' }} />
                        <Column filterMatchMode="contains" field="fromDate" body={(rowData) => <div>{moment(rowData.fromDate).format('YYYY-MM-DD')}</div>} header={this.props.language["from_date"] || "l_from_date"} style={{ width: '10%', textAlign: 'center' }} filter={true} />
                        <Column filterMatchMode="contains" field="toDate" body={(rowData) => rowData.toDate ? <div>{moment(rowData.toDate).format('YYYY-MM-DD')}</div> : null} header={this.props.language["to_date"] || "l_to_date"} style={{ width: '10%', textAlign: 'center' }} filter={true} />
                        <Column filterMatchMode="contains" field="total" header={this.props.language["total"] || "l_total"} style={{ width: '10%', textAlign: 'center' }} filter={true} />
                    </DataTable>
                </React.Fragment>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))

        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        osaTargets: state.osaTarget.osaTargets,
        fileTemplate: state.osaTarget.fileTemplate,
        fileExport: state.osaTarget.fileExport,
        result: state.osaTarget.result
    }
}
function mapDispatchToProps(dispatch) {
    return {
        OSATargetController: bindActionCreators(OSATargetActionCreators, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OSATarget)