import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Calendar } from 'primereact/calendar'
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { Column } from 'primereact/column';
import { bindActionCreators } from 'redux';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import MasterListDataDropDownList from '../Controls/MasterListDataDropDownList';
import { ProgressBar } from 'primereact/progressbar';
import { DocumentCreateAction } from '../../store/DocumentController';
import moment from 'moment';
import { FileUpload } from 'primereact/fileupload';
import { download, HelpPermission } from '../../Utils/Helpler';
import { RegionApp } from '../Controls/RegionMaster';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { RegionActionCreate } from '../../store/RegionController';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import { InputText } from 'primereact/inputtext';
import DocumentUserDetail from './DocumentUserDetail';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import DocumentUserDialog from './DocumentUserDialog';
import Page403 from '../ErrorRoute/page403';
class DocumentUser extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            permission: {},
            removeDialog: false,
            deleteDialog: false,
            rowSelection: null,
            reCall: null,
            inputValues: {},
            datas: [],
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
        }
        this.pageId = 3136

    }
    Alert = (messager, typestyle) => {
        this.setState({ loading: false });
        this.growl.show({ severity: typestyle == null ? "success" : typestyle, summary: `${this.props.language["annoucement"] || "l_annoucement"} `, detail: messager });
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
        let value = this.state.dates;
        const data = {
            fromDate: moment(value[0]).format('YYYY-MM-DD'),
            toDate: value[1] ? moment(value[1]).format('YYYY-MM-DD') : null
        }
        await this.props.DocumentController.GetDocument(data)
        await this.setState({
            inputValues: {
                ...this.state.inputValues,
                getDocument: this.props.getDocument
            }
        })
    }
    // handle Change
    handleChange = (id, value) => {
        this.setState({ [id]: value ? value : null })
    }
    handleChangeForm = async (value, stateName, subStateName = null) => {
        console.log(value)
        if (subStateName === null) {
            this.setState({ [stateName]: value });
        } else {
            this.setState({
                [stateName]: { ...this.state[stateName], [subStateName]: value, }
            });
        }
        if (subStateName === 'dates') {
            const data = {
                fromDate: moment(value[0]).format('YYYY-MM-DD'),
                toDate: value[1] ? moment(value[1]).format('YYYY-MM-DD') : null
            }
            await this.props.DocumentController.GetDocument(data)
            await this.setState({
                inputValues: {
                    ...this.state.inputValues,
                    getDocument: this.props.getDocument
                }
            })
        }
    }
    handleChangeDropDown = async (id, value) => {
        let inputValues = this.state.inputValues;
        inputValues[id] = value ? value : null;
        await this.setState({ inputValues })
    }
    getFilter = async () => {
        const state = this.state
        const employees = await state.employeeId;
        let lstEmp = await null;
        if (employees) {
            lstEmp = await '';
            await employees.forEach(element => {
                lstEmp = lstEmp + element + ',';
            });
        }
        const province = await state.province;
        let lstProvince = await null;
        if (province) {
            lstProvince = await '';
            await province.forEach(p => {
                lstProvince += p + ",";
            });
        }
        const data = {
            customerId: state.customerId || null,
            area: state.area || null,
            province: lstProvince,
            position: state.positionId || null,
            supId: state.supId,
            employeeId: lstEmp,
            fromDate: state.dates && state.dates[0] ? +moment(state.dates[0]).format('YYYYMMDD') : null,
            toDate: state.dates && state.dates[1] ? +moment(state.dates[1]).format('YYYYMMDD') : null,
            fromdate: state.dates && state.dates[0] ? moment(state.dates[0]).format('YYYY-MM-DD') : null,
            todate: state.dates && state.dates[1] ? moment(state.dates[1]).format('YYYY-MM-DD') : null,
        }
        return data
    }
    // search 
    handleSearch = async () => {
        const data = await this.getFilter()
        await this.props.DocumentController.FilterDocumentUser(data)
        const result = this.props.filterDocumentUser
        if (result && result.length > 0) {
            await this.Alert('Tìm kiếm thành công', 'info')
            await this.setState({ datas: this.props.filterDocumentUser })
        } else await this.Alert('Không có dữ liệu', 'error')

    }
    /// download 
    downloadFile = async (data) => {
        await this.setState({ loading: true })
        if (data.url) {
            await download(data.url)
            await this.Alert('Tải thành công', 'info')
        } else await this.Alert('Tải thất bại', 'error')
        await this.setState({ loading: false })
    }
    // delete Detail
    setSelectedRow = async (value, rowData) => {
        let deleteRow = value.map((e) => e.id)
        deleteRow = deleteRow.toString()
        await this.setState({
            rowSelection: value,
            listDeteleId: deleteRow,
            deleteRow: rowData,
        })
    }
    handleDeleteDialog = (boolean, rowData, index) => {
        if (boolean) {
            this.setState({
                id: rowData.employeeId,
                deleteDialog: true
            })
        } else {
            this.setState({ deleteDialog: false })
        }
    }
    footerDeleteDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleDeleteDialog(false)} />
                }
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["delete"] || "l_delete"} className="p-button-danger" icon="pi pi-check" onClick={() => this.handleDelete()} />
                }
            </div>
        );
    }
    handleDelete = async () => {
        const state = this.state
        await this.setState({ loading: true })
        await this.props.DocumentController.DeleteDocumentUser(state.id, state.listDeteleId)
        const result = this.props.deleteDocumentUser
        if (result.status === 1) {
            await this.Alert(result.message, 'info')
            let call = this.state.reCall; call++
            await this.setState({ reCall: call })
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false, deleteDialog: false })
    }
    /// delete
    handleRemoveDialog = (boolean, rowData, index) => {
        if (boolean) {
            this.setState({
                idRow: rowData.employeeId,
                removeDialog: true,
                index: index
            })
        } else {
            this.setState({ removeDialog: false })
        }
    }
    footerRemoveDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleRemoveDialog(false)} />
                }
                {this.state.permission && this.state.permission.delete &&
                    <Button label={this.props.language["delete"] || "l_delete"} className="p-button-danger" icon="pi pi-check" onClick={() => this.handleRemove()} />
                }
            </div>
        );
    }
    handleRemove = async () => {
        const state = this.state
        await this.setState({ loading: true })
        await this.props.DocumentController.DeleteDocumentUser(state.idRow, null, state.index)
        const result = this.props.deleteDocumentUser
        if (result && result.status === 1) {
            await this.setState({ datas: this.props.filterDocumentUser })
            await this.Alert(result.message, 'info')
        } else await this.Alert('Xóa thất bại', 'error')
        await this.setState({ loading: false, removeDialog: false })
    }
    // Insert 
    handleInsertDialog = async (boolean) => {
        if (boolean) {
            await this.setState({
                insertDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    status: true
                }
            })
        } else {
            await this.setState({ insertDialog: false })
        }
    }

    footerInsertDialog = () => {
        return (
            <div>
                {this.state.permission && this.state.permission.create &&
                    <div>
                        <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-danger" onClick={() => this.handleInsertDialog(false)} />
                        <Button label={this.props.language["insert"] || "l_insert"} className="p-button-info" onClick={() => this.handleInsert()} />
                    </div>}
            </div>
        )
    }
    handleValid = async () => {
        let check = true;
        const inputValues = this.state.inputValues
        if (!inputValues.document) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDocument: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorDocument: "" } })

        if (!inputValues.employeeId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorEmployee: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorEmployee: "" } })

        if (!inputValues.dates) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "Input Required!" } })
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorDates: "" } })
        if (!check) return false
        else return true;
    }
    handleInsert = async () => {
        const inputValues = this.state.inputValues
        if (await this.handleValid()) {
            await this.setState({ loading: true })
            const employees = await inputValues.employeeId;
            const documents = await inputValues.document
            let lstEmp = await null;
            let lstDoc = [];
            if (employees) {
                lstEmp = await '';
                await employees.forEach(element => {
                    lstEmp = lstEmp + element + ',';
                });
            }
            if (documents && documents.length > 0) {
                await documents.forEach(element => {
                    lstDoc.push(element.id);
                })
            }
            const data = {
                employeeId: "" + employees + "",
                documentId: "[" + lstDoc + "]",
                fromDate: moment(inputValues.dates[0]).format('YYYY-MM-DD'),
                toDate: inputValues.dates[1] ? moment(inputValues.dates[1]).format('YYYY-MM-DD') : null
            }
            await this.props.DocumentController.InsertDocumentUser(data)
            const result = this.props.insertDocumentUser
            if (result && result.status === 1) {
                await this.Alert('Thêm thành công', 'info')
            } else await this.Alert('Thêm thất bại', 'error')
            await this.setState({ loading: false, insertDialog: false })
        }
    }
    /// render
    handleActionRow = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-mr-2" onClick={() => this.handleEditDialog(rowData)} /> */}
                {this.state.permission !== undefined && (this.state.permission.export === true && <Button icon="pi pi-download" className="p-button-rounded p-button-primary p-mr-2" onClick={() => this.downloadFile(rowData)} />)}
            </div>
        )
    }
    insertDataRow = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                {this.state.permission && this.state.permission.delete &&
                    <Button icon="pi pi-trash" className=" p-button-rounded p-button-danger"
                        onClick={() => this.state.listDeteleId ? this.handleDeleteDialog(true, rowData) : {}} />
                }
            </div>
        )
    }
    rowExpansionTemplate = (rowData) => {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-12 p-sm-12">
                    <DocumentUserDetail
                        handleActionRow={this.handleActionRow}
                        rowDataChild={rowData}
                        setSelectedRow={this.setSelectedRow}
                        rowSelection={this.state.rowSelection}
                        insertDataRow={this.insertDataRow(rowData)}
                        dataInput={rowData}
                        date={this.state.dates}
                        reCall={this.state.reCall}
                    ></DocumentUserDetail>
                </div>
            </div>
        );
    }
    actionButton = (data, event) => {
        return (
            <div>
                {this.state.permission !== undefined && (this.state.permission.export === true && <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => this.handleRemoveDialog(true, data, event.rowIndex)} />)}
            </div>
        )
    }
    showEmployee = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.employeeCode}</strong></div>
                <p>{rowData.employeeName}</p>
            </div>
        )
    }
    showSup = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <div><strong>{rowData.supCode}</strong></div>
                <p>{rowData.supName}</p>
            </div>
        )
    }
    componentDidMount() {
        this.props.RegionController.GetListRegion();
    }
    render() {
        let dialogInsert = null, dialogUpdate = null, dialogDelete = null;
        if (this.state.deleteDialog || this.state.removeDialog) {
            dialogDelete = <Dialog header="Delete" style={{ width: '30vw' }}
                visible={this.state.deleteDialog ? this.state.deleteDialog : this.state.removeDialog}
                footer={this.state.deleteDialog ? this.footerDeleteDialog() : this.footerRemoveDialog()}
                onHide={() => this.state.deleteDialog ? this.handleDeleteDialog(false) : this.handleRemoveDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>bạn có muốn xóa?</span>
                </div>
            </Dialog>
        }
        if (this.state.insertDialog) { // * INSERT DIALOG
            dialogInsert = <DocumentUserDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleChange={this.handleChange}
                handleChangeDropDown={this.handleChangeDropDown}
                //dialog
                displayDialog={this.state.insertDialog}
                footerAction={this.footerInsertDialog}
                handleActionDialog={this.handleInsertDialog}
            />
        }
        // if (this.state.updateDialog) { // * UPDATE DIALOG
        //     dialogUpdate = <DocumentUserDialog
        //         stateName={"inputValues"}
        //         actionName={"Update"}
        //         inputValues={this.state.inputValues}
        //         handleChangeForm={this.handleChangeForm}
        //         handleChange={this.handleChange}
        //         handleChangeDropDown={this.handleChangeDropDown}
        //         //dialog
        //         displayDialog={this.state.updateDialog}
        //         footerAction={this.footerUpdateDialog}
        //         handleActionDialog={this.handleUpdateDialog}
        //     />
        // }
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
                {/* {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={this.handleExport} style={{ marginRight: "15px" }} />} */}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {/* {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["template"] || "l_template"} onClick={this.handleGetTemplate} style={{ marginRight: "15px" }} />} */}
                {this.state.permission && this.state.permission.create && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleInsertDialog(true)} style={{ marginRight: "15px" }} />}
                {/* {this.state.permission && this.state.permission.import && <FileUpload chooseLabel={this.props.language["import"] || "l_import"} ref={this.fileUpload} mode="basic"
                    customUpload={true} accept=".xlsx,.xls" maxFileSize={10000000} style={{ marginRight: "15px" }}
                    onClear={this.clear} uploadHandler={this.handleImport}
                />} */}
                {/* {this.state.permission && this.state.permission.import && <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" onClick={() => {
                    this.fileUpload.current.fileInput = { "value": '' };
                    this.fileUpload.current.clear()
                }} />} */}
            </React.Fragment>
        );
        return (
            this.state.permission.view ? (<React.Fragment>
                <Toast ref={(el) => this.growl = el} />
                <Accordion activeIndex={0} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    <AccordionTab header={this.props.language["search"] || "search"}>
                        <div className="p-fluid p-formgrid p-grid">
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
                                    onChange={this.handleChange}
                                    value={this.state.customerId} />
                            </div>
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["position"] || "l_position"}</label>
                                <EmployeeTypeDropDownList
                                    id="positionId"
                                    type="PG-PGAL-GS-Leader"
                                    value={this.state.positionId}
                                    onChange={this.handleChange}
                                ></EmployeeTypeDropDownList>
                            </div>
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["manager"] || "l_manager"}</label>
                                <EmployeeDropDownList
                                    type=""
                                    typeId={this.state.positionId === null ? 0 : this.state.positionId}
                                    mode="single"
                                    id="supId"
                                    parentId={this.state.positionId}
                                    value={this.state.supId}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["employee"] || "l_employee"}</label>
                                <EmployeeDropDownList
                                    type=""
                                    typeId={0}
                                    mode=""
                                    id="employeeId"
                                    parentId={this.state.supId}
                                    value={this.state.employeeId}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <RegionApp {...this} />
                            <div className="p-field p-col-12 p-md-3 p-sm-6">
                                <label>{this.props.language["promotion_code"] || "l_promotion_code"}</label>
                                <InputText className="w-100" id="promotionCode" value={this.state.promotionCode || ""}
                                    onChange={e => this.handleChange(e.target.id, e.target.value)}></InputText>
                            </div>
                        </div>
                        {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    </AccordionTab>
                </Accordion>
                <Toolbar left={leftContents} right={rightContents} />
                <DataTable
                    value={this.state.datas} paginator
                    rows={20}
                    rowsPerPageOptions={[20, 50, 100]}
                    style={{ fontSize: "13px" }}
                    rowHover paginatorPosition={"both"}
                    dataKey="stt" rowHover
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    expandedRows={this.state.expandedRows}
                    onRowToggle={(e) => {
                        this.setState({ expandedRows: e.data })
                    }}
                    //onSelectedChange={() => this.onSelectedChange}
                    rowExpansionTemplate={this.rowExpansionTemplate} >
                    <Column expander={true} style={{ width: 50 }} />
                    <Column field="position" header={this.props.language["position"] || "l_position"} filter={true} style={{ width: 150 }} />
                    <Column body={this.showSup} filter={true} style={{ textAlign: 'center' }} header={this.props.language["sup_name"] || "l_sup_name"} />
                    <Column body={this.showEmployee} filter={true} style={{ textAlign: 'center' }} header={this.props.language["employee_name"] || "l_employee_name"} />
                    <Column field="total" header={this.props.language["total"] || "l_total"} filter={true} style={{ width: 60, textAlign: 'center' }} />
                    <Column header="#" body={(rowData, e) => this.actionButton(rowData, e)} style={{ width: 60 }} ></Column>
                </DataTable>
                {dialogInsert}
                {dialogDelete}
            </React.Fragment>) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))


        )
    }

}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        filterDocumentUser: state.documents.filterDocumentUser,
        insertDocumentUser: state.documents.insertDocumentUser,
        updateDocumentUser: state.documents.updateDocumentUser,
        deleteDocumentUser: state.documents.deleteDocumentUser,
        getDocument: state.documents.getDocument,
        regions: state.regions.regions,
        usearea: true,
        useprovince: true,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        DocumentController: bindActionCreators(DocumentCreateAction, dispatch),
        RegionController: bindActionCreators(RegionActionCreate, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentUser);