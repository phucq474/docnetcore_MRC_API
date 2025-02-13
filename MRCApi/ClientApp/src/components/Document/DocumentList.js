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
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { download, HelpPermission } from '../../Utils/Helpler';
import { Sidebar } from 'primereact/sidebar';
import { FileUpload } from 'primereact/fileupload';
import { ToggleButton } from 'primereact/togglebutton';
import DocumentDetail from './DocumentDetail';
import { Dialog } from 'primereact/dialog';
import Page403 from '../ErrorRoute/page403';

class DocumentList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            linkExport: '',
            visible: false,
            dates: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
            newdates: [new Date()],
            imgconvert: false,
            loading: false,
            acceptFile: '*',
            permission: {},
            deleteDialog: false,
            removeDialog: false,
            rowSelection: null,
            reCall: 0,
        }
        this.pageId = 1020
        this._child = React.createRef();
        //evetn
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
    }
    Filter = () => {
        const info = this.state;
        const data = {
            fromDate: parseInt(new moment(info.dates[0]).format("YYYYMMDD")),
            toDate: info.dates[1] === undefined || info.dates[1] === null ? '' : new moment(info.dates[1]).format("YYYYMMDD"),
            documentType: info.documenttype ? info.documenttype : '',
        }
        this.props.DocumentController.GetList(data).then(
            () => {
                const result = this.props.listdoc
                if (result && result.length > 0) {
                    this.Alert('Tìm kiếm thành công', 'info')
                } else this.Alert('Không có dữ liệu', 'error')
            }
        );
    }
    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }
    handleChangeForm(e) {
        this.setState({ [e.target.id]: e.target.value === null ? "" : e.target.value });
    }
    uploadFile = (e) => {
        const sInfo = this.state;
        let messager = "";
        if (e.files === null || e.files.length === 0)
            messager += `${this.props.language["you_have_not_selected_file_to_upload"] || "l_you_have_not_selected_file_to_upload"}. <br/>`;
        if (sInfo.newdates == undefined || sInfo.newdates[0] === undefined) {
            messager += `${this.props.language["you_have_not_selected_time_to_use_document"] || "l_you_have_not_selected_time_to_use_document"}. `;
        }
        if (sInfo.title === undefined || sInfo.title === '') {
            messager += `${this.props.language["you_have_not_input_title_for_document"] || "l_you_have_not_input_title_for_document"}. `;
        }
        if (sInfo.documentnew === undefined || sInfo.documentnew < 0) {
            messager += `${this.props.language["you_have_not_selected_type_of_document"] || "l_you_have_not_selected_type_of_document"}. `;
        }
        if (messager.length > 10) {
            this.Alert(messager, "error");
        } else {
            const data = {
                fromDate: new moment(sInfo.newdates[0]).format("YYYYMMDD"),
                toDate: sInfo.newdates[1] ? new moment(sInfo.newdates[1]).format("YYYYMMDD") : null,
                title: sInfo.title,
                description: sInfo.description ? sInfo.description : null,
                documentType: sInfo.documentnew,
                IsConvert: sInfo.imgconvert ? 1 : 0,
                files: e.files,

            }
            this.setState({ loading: true });
            this.props.DocumentController.UploadFiles(data).then(
                () => {
                    const result = this.props.postfile
                    if (result) {
                        if (this._child.current != null)
                            this._child.current.clear();
                        this.Alert(result, 'info')
                    } else this.Alert('Gửi file thất bại', 'error')
                }
            );
        }
    }
    onConvertFile = (value) => {
        if (value === true) {
            this.setState({ imgconvert: value, acceptFile: '.pdf' });
        } else {
            this.setState({ imgconvert: value, acceptFile: '*' });
        }
    }
    // componentWillReceiveProps(nextprops) {
    //     if (nextprops.errors !== undefined && nextprops.errors !== '' && nextprops.errors.length > 4) {
    //         this.Alert(nextprops.errors);
    //         if (this._child.current != null)
    //             this._child.current.clear();
    //     }
    // }
    downloadFile = async (data) => {
        await this.setState({ loading: true })
        if (data.url) {
            await download(data.url)
            await this.Alert('Tải thành công', 'info')
        } else await this.Alert('Tải thất bại', 'error')
        await this.setState({ loading: false })
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    // delete
    setSelectedRow = async (value, rowData) => {
        let deleteRow = value.map((e) => e.index)
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
                id: rowData.id,
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
        await this.props.DocumentController.DeleteItem(state.id, state.listDeteleId)
        const result = this.props.deleteItem
        if (result.status === 1) {
            await this.Alert(result.message, 'info')
            let call = this.state.reCall; call++
            await this.setState({ reCall: call })
        } else await this.Alert(result.message, 'error')
        await this.setState({ loading: false, deleteDialog: false })
    }
    handleRemoveDialog = (boolean, rowData, index) => {
        if (boolean) {
            this.setState({
                idRow: rowData.id,
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
        await this.props.DocumentController.RemoveItem(state.idRow, state.index)
        const result = this.props.removeItem
        if (result) {
            await this.Alert('Xóa thành công', 'info')
        } else await this.Alert('Xóa thất bại', 'error')
        await this.setState({ loading: false, removeDialog: false })
    }
    actionButton = (data, event) => {
        return (
            <div>
                {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-mr-2" onClick={() => this.onViewDetails(data)} /> */}
                {this.state.permission !== undefined && (this.state.permission.export === true && <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => this.handleRemoveDialog(true, data, event.rowIndex)} />)}
            </div>
        )
    }
    Alert = (messager, typestyle) => {
        this.setState({ loading: false });
        this.growl.show({ severity: typestyle == null ? "success" : typestyle, summary: `${this.props.language["annoucement"] || "l_annoucement"} `, detail: messager });
    }
    rowExpansionTemplate = (rowData) => {
        return (
            <div className="p-grid">
                <div className="p-col-12 p-md-12 p-sm-12">
                    <DocumentDetail
                        handleActionRow={this.handleActionRow}
                        rowDataChild={rowData}
                        setSelectedRow={this.setSelectedRow}
                        rowSelection={this.state.rowSelection}
                        insertDataRow={this.insertDataRow(rowData)}
                        dataInput={rowData}
                        reCall={this.state.reCall}
                    ></DocumentDetail>
                </div>
            </div>
        );
    }
    insertDataRow = (rowData) => {
        return (
            <div>
                {this.state.permission && this.state.permission.delete &&
                    <Button style={{ width: '100%', marginRight: '.25em', marginTop: '10px' }} icon="pi pi-trash" className=" p-button-rounded p-button-danger"
                        onClick={() => this.state.listDeteleId ? this.handleDeleteDialog(true, rowData) : {}} />
                }
            </div>
        )
    }
    handleActionRow = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                {this.state.permission !== undefined && (this.state.permission.export === true && <Button icon="pi pi-download" className="p-button-rounded p-button-primary p-mr-2" onClick={() => this.downloadFile(rowData)} />)}
            </div>
        )
    }
    render() {
        let dialogDelete = null;
        const leftContent = ((this.state.permission !== undefined && (this.state.permission.view === true && <Button label={this.props.language["filter"] || "filter"} icon="pi pi-search" className="p-button-primary" onClick={this.Filter}></Button>)))
        const rightContext = ((this.state.permission !== undefined && (this.state.permission.view === true && this.state.permission.create === true && <Button label={this.props.language["create"] || "create"} icon="pi pi-plus" className="p-button-success" onClick={() => this.setState({ visible: true })}></Button>)));
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
        return (
            this.state.permission.view ? (
                <div className="p-fluid">
                    <Toast ref={(el) => this.growl = el} />
                    <Sidebar style={{ Background: 'transparent', height: '80%' }} position="bottom" modal={false}
                        visible={this.state.visible} onHide={() => this.setState({ visible: false })}>
                        <div className="p-fluid">
                            <Card title="New Document">
                                <div className="p-grid">
                                    <div className="p-col-12 p-md-6 p-lg-3">
                                        <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                        <Calendar fluid
                                            value={this.state.newdates}
                                            onChange={(e) => this.setState({ newdates: e.value })}
                                            dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                            id="newData" selectionMode="range"
                                            inputStyle={{ width: '91.5%', visible: false }}
                                            style={{ width: '100%' }} showIcon
                                        />
                                    </div>
                                    <div className="p-col-12 p-md-6 p-lg-3">
                                        <label>{this.props.language["document_type"] || "l_document_type"}</label>
                                        <MasterListDataDropDownList
                                            listCode="DOCGROUP"
                                            id="documentnew"
                                            value={this.state.documentnew}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="p-col-12 p-md-6 p-lg-3">
                                        <label>{this.props.language["document.title"] || "document.title"}</label>
                                        <InputText id="title" onChange={this.handleChangeForm}></InputText>
                                    </div>
                                    <div className="p-col-12 p-md-6 p-lg-3">
                                        <label>{this.props.language["document.description"] || "document.description"}</label>
                                        <InputText id="description" onChange={this.handleChangeForm}></InputText>
                                    </div>
                                    {/* <div className="p-col-12 p-md-6 p-lg-3">
                                        <label>{this.props.language["switch_to_image"] || "l_switch_to_image"}</label><br />
                                        <ToggleButton offLabel={this.props.language["default"] || "l_default"}
                                            offIcon="pi pi-file" onIcon='pi pi-images'
                                            onLabel={this.props.language["switch_to_image"] || "l_switch_to_image"}
                                            checked={this.state.imgconvert}
                                            onChange={(e) => this.onConvertFile(e.value)} />
                                    </div> */}
                                </div>
                            </Card>
                            <Card style={{ MarginTop: 10 }} title={this.props.language["file_upload"] || "l_file_upload"}>
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        {this.state.permission !== undefined && (this.state.permission.export === true && <FileUpload customUpload={true} accept={this.state.acceptFile}
                                            uploadHandler={this.uploadFile} ref={this._child}
                                            chooseLabel={this.props.language["import"] || "l_import"} />)}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Sidebar>
                    <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["from_to_date"] || "l_from_to_date"}</label>
                                    <Calendar fluid
                                        value={this.state.dates}
                                        onChange={(e) => this.setState({ dates: e.value })}
                                        dateFormat="yy-mm-dd" inputClassName='p-inputtext'
                                        id="fromDate" selectionMode="range"
                                        inputStyle={{ width: '91.5%', visible: false }}
                                        style={{ width: '100%' }} showIcon
                                    />
                                </div>
                                <div className="p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["document_type"] || "l_document_type"}</label>
                                    <MasterListDataDropDownList
                                        listCode="DOCGROUP"
                                        id="documenttype"
                                        value={this.state.documenttype}
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    <Toolbar right={rightContext} left={leftContent}>
                    </Toolbar>
                    <DataTable
                        value={this.props.listdoc} paginator
                        rows={20}
                        rowsPerPageOptions={[20, 50, 100]}
                        style={{ fontSize: "13px" }}
                        rowHover paginatorPosition={"both"}
                        dataKey="rowNum"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        expandedRows={this.state.expandedRows}
                        onRowToggle={(e) => {
                            this.setState({ expandedRows: e.data })
                        }}
                        //onSelectedChange={() => this.onSelectedChange}
                        rowExpansionTemplate={this.rowExpansionTemplate} >
                        <Column expander={true} style={{ width: 50 }} />
                        <Column field="documentName" filter={true} header={this.props.language["document.name"] || "document.name"} style={{ width: '300px' }} />
                        <Column field="description" filter={true} header={this.props.language["document.description"] || "document.description"} />
                        <Column field="typeName" header={this.props.language["document_type"] || "l_document_type"} filter={true} style={{ width: 150 }} />
                        <Column field={(e) => new moment(e.fromDate).format("YYYY-MM-DD")} header={this.props.language["fromdate"] || "fromdate"} filter={true} style={{ width: 120 }} />
                        <Column field="toDate" body={(rowData) => rowData.toDate ? <div>{moment(rowData.toDate).format('YYYY-MM-DD')}</div> : null} header={this.props.language["todate"] || "todate"} filter={true} style={{ width: 120 }} />
                        <Column field="total" header={this.props.language["total"] || "l_total"} filter={true} style={{ width: 60, textAlign: 'center' }} />
                        <Column header="#" body={(rowData, e) => this.actionButton(rowData, e)} style={{ width: 60 }} ></Column>
                    </DataTable>
                    {dialogDelete}
                </div>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        )
    }
}
function mapStateToProps(state) {
    return {
        ...state,
        listdoc: state.documents.listdoc,
        removeItem: state.documents.removeItem,
        loading: state.documents.loading,
        postfile: state.documents.postfile,
        deleteItem: state.documents.deleteItem,
        language: state.languageList.language,

    }
}
function mapDispatchToProps(dispatch) {
    return {
        DocumentController: bindActionCreators(DocumentCreateAction, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DocumentList);