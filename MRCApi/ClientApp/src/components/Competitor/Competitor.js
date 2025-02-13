import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import CompetitorDialog from './CompetitorDialog';
import { Toolbar } from 'primereact/toolbar';
import { download } from '../../Utils/Helpler'
import { FileUpload } from 'primereact/fileupload';
import { HelpPermission, toSetArray } from '../../Utils/Helpler'
import CompetitorDropDownList from '../Controls/CompetitorDropDownList';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CompetitorCreateAction } from '../../store/CompetitorController';
import { ProductCreateAction } from '../../store/ProductController';
import '../../css/highlight.css'
import Page403 from '../ErrorRoute/page403';

class Competitor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            displayUpdateDialog: false,
            displayInsertDialog: false,
            rowData: {},
            inputValues: {},
            isLoading: false,
            isFetchedData: false,
            fetchedMasterList: false,
            permission: {},
        }
        this.pageId = 26
        this.handleDialog = this.handleDialog.bind(this)
        this.fileUpload = React.createRef();
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    handleSearch = async () => {
        await this.setState({ isLoading: true })
        const { typeId } = await this.state
        await this.props.CompetitorController.FilterCompetitor(typeId || "")
        await this.Alert(`Results ${this.props.filterCompetitor.length}`, "info")
        await this.setState({
            datas: this.props.filterCompetitor,
            isLoading: false
        })
    }
    handleInsert = async () => {
        await this.setState({ isLoading: true })
        const { brandCode, brandName, competitor, listCates, order } = await this.state.inputValues
        await this.handleValidInput().then(async (valid) => {
            if (valid) {
                await this.props.CompetitorController.InsertCompetitor({
                    BrandCode: brandCode || null,
                    BrandName: brandName || null,
                    Competitor: competitor || null,
                    ListCate: (listCates && listCates.length > 0) ? listCates.map(e => e.categoryId).join(",") : null,
                    Order: order || null,
                })
                let response = await this.props.insertCompetitor
                if (typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.setState({ datas: this.props.filterCompetitor })
                    await this.handleDialog(false, "displayInsertDialog")
                    await this.highlightParentRow(0)
                    await this.Alert("Thêm thành công", "info")
                } else {
                    await this.Alert("Thêm thất bại", "error")
                }
            }
        })
        await this.setState({ isLoading: false })
    }
    handleUpdate = async () => {
        await this.setState({ isLoading: true })
        const { brandCode, brandName, competitor, listCates, order} = await this.state.inputValues
        const { id } = await this.state.rowData
        await this.handleValidInput().then(async (valid) => {
            if (valid) {
                await this.props.CompetitorController.UpdateCompetitor({
                    brandCode: brandCode || null,
                    brandName: brandName || null,
                    competitor: competitor || null,
                    listCate: (listCates && listCates.length > 0) ? listCates.map(e => e.categoryId).join(",") : null,
                    order: order || null,
                    id: id || null,
                }, this.state.rowIndex)
                let response = await this.props.updateCompetitor
                if (typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.setState({ datas: this.props.filterCompetitor })
                    await this.handleDialog(false, "displayUpdateDialog")
                    await this.highlightParentRow(this.state.rowIndex)
                    await this.Alert("Cập nhập thành công", "info")
                } else {
                    await this.Alert("Cập nhập thất bại", "error")
                }
            }
        })
        await this.setState({ isLoading: false })
    }
    handleExport = async () => {
        await this.setState({ isLoading: true })
        const { typeId } = await this.state
        await this.props.CompetitorController.ExportCompetitor(typeId || "")
        let response = await this.props.exportCompetitor
        if (response && response.status === 1) {
            await download(response.fileUrl)
            await this.Alert(response.message, "info")
        } else {
            await this.Alert(response.message, "error")
        }
        await this.setState({ isLoading: false })
    }
    handleImport = async (event) => {
        await this.setState({ isLoading: true })
        await this.props.CompetitorController.ImportCompetitor(event.files[0])
        let response = await this.props.importCompetitor
        if (response && response.status === 1) {
            await this.Alert(response.message, "info")
        } else {
            await this.Alert(response.message, "error")
        }
        this.fileUpload.current.fileInput = await { "value": '' };
        await this.fileUpload.current.clear()
        await this.setState({ isLoading: false })
    }
    handleValidInput = async () => {
        let check = await true;
        const { brandCode, brandName,competitor } = await this.state.inputValues
        // if (!competitorName) {
        //     await this.setState({ inputValues: { ...this.state.inputValues, errorCompetitor: "Competitor Required" } })
        //     check = await false
        // } else await this.setState({ inputValues: { ...this.state.inputValues, errorCompetitor: "" } })
        // if (!competitorNameVN) {
        //     await this.setState({ inputValues: { ...this.state.inputValues, errorCompetitorVN: "CompetitorName Required" } })
        //     check = await false
        // } else await this.setState({ inputValues: { ...this.state.inputValues, errorCompetitorVN: "" } })
        if (!brandCode) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorBrandCode: "BrandCode Required" } })
            check = await false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorBrandCode: "" } })
        if (!brandName) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorBrandName: "BrandName Required" } })
            check = await false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorBrandName: "" } })
        if (!competitor) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorCompetitor: "Competitor Required" } })
            check = await false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorCompetitor: "" } })
        
        if (!check) return false
        else return true
    }
    actionButtons = (rowData, event) => {
        return (
            <div className="p-d-flex p-flex-column">
                {this.state.permission.edit &&
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
                        onClick={() => this.handleDialog(true, "displayUpdateDialog", rowData, event.rowIndex)} />}
            </div>
        )
    }
    renderFooterAction = (actionName, cancel, proceed) => {
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }
    async handleDialog(boolean, stateName, rowData = {}, rowIndex = -1) {
        try {
            if (boolean) {
                await this.setState({ isLoading: true })
                if (!this.state.isFetchedData) {
                    await this.props.ProductController.GetCategory();
                    await this.setState({ listCates: toSetArray(this.props.categories, "categoryId") })
                }
                if (stateName === "displayUpdateDialog") { // * Update
                    const { brandCode, brandName, competitor, listCate, order } = await rowData
                    const filterRefId = await listCate ? this.filter(this.state.listCates, "categoryId", listCate) : []
                    await this.setState({
                        inputValues: {
                            ...this.state.inputValues,
                            brandCode, brandName, competitor,
                            listCates: filterRefId,
                            order
                        },
                    })
                }
                await this.setState({
                    [stateName]: true,
                    rowData: rowData,
                    rowIndex: rowIndex,
                    isFetchedData: true,
                    isLoading: false,
                })
            } else {
                await this.setState({
                    [stateName]: false,
                    rowData: {},
                    inputValues: {},
                    isLoading: false
                })
            }
        } catch (e) { }
    }
    filter = (arr, key, listId) => {
        if (!listId) return []
        let ret = []
        for (let i = 0, lenArr = arr.length; i < lenArr; i++) {
            if (listId.includes(arr[i][key].toString())) ret.push(arr[i])
        }
        return ret
    }
    handleChange = (id, value) => {
        this.setState({
            [id]: value === null ? "" : value,
        });
        if (id === 'position' || id === 'supId') this.setState({ employee: 0 });
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
    highlightParentRow = async (rowIndex) => {
        try {
            const seconds = await 3000, outstanding = await "highlightText"
            let rowUpdated = await document.querySelectorAll(".p-datatable-tbody")[0]
            if (rowUpdated && !rowUpdated.children[rowIndex].classList.contains(outstanding)) {
                rowUpdated.children[rowIndex].classList.add(outstanding)
                setTimeout(() => {
                    if (rowUpdated.children[rowIndex].classList.contains(outstanding)) {
                        rowUpdated.children[rowIndex].classList.remove(outstanding)
                    }
                }, seconds)
            }
        } catch (e) { }
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    render() {
        let dataTable = null, dialogInsert = null, dialogUpdate = null
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch(false)} style={{ marginRight: "15px" }} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.import && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={this.fileUpload} mode="basic" onClear={this.clear} uploadHandler={this.handleImport} customUpload={true} accept=".xlsx,.xls" maxFileSize={10000000} style={{ marginRight: "15px" }} />}
                {this.state.permission && this.state.permission.import && <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                    this.fileUpload.current.fileInput = { "value": '' };
                    this.fileUpload.current.clear()
                }} />}
                {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleDialog(true, "displayInsertDialog")} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        if (this.state.datas.length > 0) { // * Datatable
            dataTable = <DataTable
                value={this.state.datas} paginator rows={20}
                resizableColumns columnResizeMode="expand"
                rowsPerPageOptions={[10, 20, 50]}
                paginatorPosition={"both"}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowHover>
                <Column field="no" header="No." body={(rowData, event) => <span>{event.rowIndex + 1}</span>} style={{ width: '4%', textAlign: "center" }}></Column>
                <Column filter field="brandCode" header={this.props.language["brand_code"] || "l_brand_code"} style={{ width: '10%', textAlign: "center" }} ></Column>
                <Column filter field="brandName" header={this.props.language["brand_name"] || "l_brand_name"} style={{ width: '10%', textAlign: "center" }} ></Column>
                <Column filter field="competitor" header={this.props.language["competitor"] || "l_competitor"} style={{ width: '10%', textAlign: "center" }} ></Column>
                <Column filter field="refName" header={this.props.language["list_category"] || "l_list_category"} style={{ width: '', textAlign: "left" }} ></Column>
                <Column filter field="refNameVN" header={this.props.language["list_category_vn"] || "l_list_category_vn"} style={{ width: '', textAlign: "left" }} ></Column>
                <Column body={this.actionButtons} header="#" style={{ width: '80px', textAlign: "center" }} ></Column>
            </DataTable>
        }
        if (this.state.displayInsertDialog) { // * INSERT DIALOG
            dialogInsert = <CompetitorDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                dialogStateName={"displayInsertDialog"}
                displayDialog={this.state.displayInsertDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleInsert}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                handleDialog={this.handleDialog}
                listCates={this.state.listCates}
            />
        }
        if (this.state.displayUpdateDialog) { // * UPDATE DIALOG
            dialogUpdate = <CompetitorDialog
                stateName={"inputValues"}
                actionName={"Update"}
                dialogStateName={"displayUpdateDialog"}
                displayDialog={this.state.displayUpdateDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleUpdate}
                handleChange={this.handleChange}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleDialog={this.handleDialog}
                listCates={this.state.listCates}
            />
        }
        return (
            this.state.permission.view ? (
                <React.Fragment>
                    <Toast ref={(el) => this.toast = el} />
                    {this.state.isLoading &&
                        <div className="loading_container">
                            <ProgressSpinner className="loading_spinner" strokeWidth="8" fill="none" animationDuration=".5s" />
                        </div>
                    }
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["competitor"] || "l_competitor"}</label>
                                    <CompetitorDropDownList
                                        value={this.state.typeId || ''}
                                        onChange={this.handleChange}
                                        id="typeId"
                                        refName="competitor" />
                                </div>
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {dataTable}
                    {dialogInsert}
                    {dialogUpdate}
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
        filterCompetitor: state.competitor.filterCompetitor,
        insertCompetitor: state.competitor.insertCompetitor,
        updateCompetitor: state.competitor.updateCompetitor,
        deleteCompetitor: state.competitor.deleteCompetitor,
        exportCompetitor: state.competitor.exportCompetitor,
        importCompetitor: state.competitor.importCompetitor,
        categories: state.products.categories,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        CompetitorController: bindActionCreators(CompetitorCreateAction, dispatch),
        ProductController: bindActionCreators(ProductCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Competitor);