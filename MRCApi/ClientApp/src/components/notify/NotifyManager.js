import React, { PureComponent } from 'react';
import { actionCreatorsNotify } from '../../store/NotifyController';
import { EmployeeActionCreate } from '../../store/EmployeeController';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { download, HelpPermission } from '../../Utils/Helpler';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import EmployeeDropDownList from '../Controls/EmployeeDropDownList';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { Card } from 'primereact/card';
import Page403 from '../ErrorRoute/page403';
import moment from 'moment';
const itemStatus = [
    { id: 0, itemName: 'Chưa gửi' },
    { id: 1, itemName: 'Đã gửi' },
]
class NotifyManager extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            activeIndex: 0,
            removeList: [],
            visibleModal: false,
            EmpSelected: [],
            monthYear: new Date(),
            permission: {
                view: true,
                edit: true,
                export: true,
                delete: true,
                import: true,
                create: true
            },
        }
        this.pageId = 3047
        this._child = React.createRef();
        //event
        this.handleChange = this.handleChange.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.getFilter = this.getFilter.bind(this);
        this.Alert = this.Alert.bind(this);
        this.actionButton = this.actionButton.bind(this);
        this.actionNotifyRemove = this.actionNotifyRemove.bind(this);
        this.hanlderUploadFile = this.hanlderUploadFile.bind(this);
        this.onSend = this.onSend.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: false, visibleModal: false });
        if (nextProps.errors !== this.props.errors)
            this.Alert(nextProps.errors);
    }
    Alert(messager, typestyle) {
        this.toast.show({ severity: typestyle == null ? "success" : typestyle, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: messager });
    }
    onSend() {
        const data = this.getFilter();
        data.selectedNotify = JSON.stringify(this.state.selectedNotify)
        if (data.notifyType === '') {
            this.Alert(`${this.props.language["please_select_announcement"] || "l_please_select_announcement"}`, "error");
            return;
        } else {
            this.setState({ loading: true, errors: '' });
            this.props.NotifyController.SendNotify(data);
        }
    }
    getFilter() {
        const infoS = this.state;
        const monthYear = infoS.monthYear;
        if (monthYear === undefined || monthYear === null) {
            this.Alert(`${this.props.language["please_select_month_and_year"] || "l_please_select_month_and_year"}`, "error");
            return null;
        } else {
            return {
                "Month": monthYear.getMonth() + 1,
                "Year": monthYear.getFullYear(),
                "EmployeeId": infoS.employeeId !== undefined ? infoS.employeeId.toString() : '',
                "Status": (infoS.notifyStatus === undefined || infoS.notifyStatus === null) ? '' : infoS.notifyStatus.id,
                "notifyType": (infoS.notifyType === undefined || infoS.notifyType === null) ? '' : infoS.notifyType.typeReport,
                'Position': infoS.position ? infoS.position : '',
                "notifyTitle": (infoS.notifyTitle === undefined || infoS.notifyTitle === null) ? '' : infoS.notifyTitle
            }
        }
    }
    handleChange(id, value) {
        this.setState({ [id]: value === null ? "" : value });
    }
    actionNotifyRemove(data) {
        let idList = [];
        idList.push(data.id);
        this.setState({ visibleModal: true, removeList: data.id });
    }
    async componentWillMount() {
        // let permission = await HelpPermission(this.pageId);
        // await this.setState({ permission })
    }
    async componentDidMount() {
        await this.props.NotifyController.GetGroup();
        await this.props.NotifyController.GetTitle();
        const employeeDDL = [...this.props.employeeDDL];
        if (employeeDDL.length === 0)
            await this.props.EmployeeController.GetEmployeeDDL(null);

    }
    renderFooterDialog(id) {
        return (
            <div>
                {this.state.permission !== undefined && (this.state.permission.view === true && this.state.permission.delete === true && <Button
                    label={this.props.language["delete"] || "l_delete"} className="p-button-danger"
                    onClick={() => this.handleDeleteList()}
                    icon="pi pi-trash" />)}
                {this.state.permission !== undefined && (this.state.permission.view === true && this.state.permission.delete === true && <Button label={this.props.language["cancel"] || "cancel"} icon="pi pi-times"
                    onClick={(e) => this.setState({ visibleModal: false })} className="p-button-secondary" />)}
            </div>
        );
    }
    actionButton(data) {
        return (
            <i onClick={() => this.actionNotifyRemove(data)} tooltip={this.props.language["delete"] || "l_delete"} className="pi pi-times-circle"></i>
        );
    }
    async hanlderUploadFile(e) {
        const sinfo = this.state;
        if (sinfo.monthYear === undefined || sinfo.monthYear === null) {
            await this.Alert(`${this.props.language["please_select_month_and_year"] || "l_please_select_month_and_year"}`);
            return;
        }
        const data = await {
            file: e.files[0],
            'Year': sinfo.monthYear.getFullYear(),
            'Month': sinfo.monthYear.getMonth() + 1,
        }
        await this.setState({ loading: true });
        await this.props.NotifyController.PostFile(data);
        await this._child.current.clear()
        //
    }
    onDeleted = () => {
        if (this.state.selectedNotify === undefined || this.state.selectedNotify.length === 0) {
            this.Alert(`${this.props.language["please_select_announcement_to_delete"] || "l_please_select_announcement_to_delete"}`);
            return;
        } else {
            let idList = []
            this.state.selectedNotify.forEach(item => {
                idList.push(item.id);
            });
            this.setState({ visibleModal: true, removeList: idList })
        }
    }
    handleDeleteList = async () => {
        await this.setState({ loading: true })
        const data = this.getFilter();
        await this.props.NotifyController.RemoveNotify(this.state.removeList)
        await this.props.NotifyController.GetNotify(data);
        await this.setState({ loading: false, selectedNotify: [] })
    }
    onFilter() {
        const data = this.getFilter();
        if (data != null) {
            this.props.NotifyController.GetNotify(data);
            this.setState({ loading: true, removeList: [] });
        }
    }
    Alert = (mess, style) => {
        if (style === undefined) style = 'success';
        this.toast.show({
            severity: style,
            summary: `${this.props.language['annoucement'] || 'l_annoucement'}`,
            detail: mess,
        });
    };
    exportCSV = async () => {
        await this.setState({ loading: true })
        const data = await this.getFilter();
        await this.props.NotifyController.Export(data)
        const result = this.props.ExportNotifyList
        try {
            if (result.status === 1) {
                await download(result.fileUrl)
                await this.Alert(result.message, 'info')
            } else {
                await this.Alert(result.message, 'error')
            }
            await this.setState({ loading: false })
        }
        catch (e) {
            console.log(e)
        }
    }
    SendByContent = () => {
        const iState = this.state;
        if (iState.sendType === undefined || iState.sendType === null) {
            this.Alert(`${this.props.language["please_select_announcement"] || "l_please_select_announcement"}`, "error");
            return;
        }
        if (iState.EmpSelected === null || iState.EmpSelected.length < 1) {
            this.Alert(`${this.props.language["please_select_employee"] || "l_please_select_employee"}`, "error");
            return;
        }
        if (iState.title === undefined || iState.title === null || iState.title.length < 5) {
            this.Alert(`${this.props.language["please_input_title_(length_min_5)"] || "l_please_input_title_(length_min_5)"}`, "error");
            return;
        }
        if (iState.content === undefined || iState.content === null || iState.content.length < 20) {
            this.Alert(`${this.props.language["please_input_error_content_(length_min_20)"] || "l_please_input_error_content_(length_min_20)"}`, "error");
            return;
        }
        //Send 
        let employees = []
        iState.EmpSelected.forEach(item => {
            employees.push(item.id);
        });
        const data = {
            'sendType': iState.sendType.typeReport === undefined ? iState.sendType : iState.sendType.typeReport,
            'title': iState.title,
            'hyperlinks': iState.hidenlink !== undefined ? iState.hidenlink : '',
            'imageurl': iState.imageurl !== undefined ? iState.imageurl : '',
            'content': iState.content,
            'employees': employees.toString(),
        }
        this.props.NotifyController.SendByContent(data);
    }
    handleChangeForm = (e) => {
        this.setState({ [e.target.id]: e.target.value === null ? "" : e.target.value });
    }
    showCalendar = (rowData) => {
        return (
            <div>
                <div>
                    <lable>{moment(rowData.activeDate).format('YYYY-MM-DD')}</lable>
                </div>
                <div>
                    <label>{moment(rowData.activeDate).format('HH:mm:ss')}</label>
                </div>
            </div>
        )
    }
    render() {
        const leftSearch = []
        const rightSearch = []
        if (this.state.permission) {
            if (this.state.permission.view) {
                leftSearch.push(<Button onClick={() => this.onFilter()}
                    label={this.props.language["search"] || "search"} icon="pi pi-search" style={{ width: 'auto', marginRight: '.25em' }} />);
                if (this.state.permission.edit === true)
                    leftSearch.push(<Button label={this.props.language["send"] || "l_send"}
                        onClick={() => this.onSend()} icon="pi pi-share-alt" className="p-button-success" style={{ width: 'auto', marginRight: '.25em' }} />)
            }
            if (this.state.permission !== undefined && this.state.permission.view === true && this.state.permission.export === true)
                leftSearch.push(<Button type="button" icon="pi pi-download" style={{ width: 'auto', marginRight: '.25em' }}
                    label={this.props.language["menu.export_report"] || "menu.export_report"} onClick={this.exportCSV} />)
            if (this.state.permission !== undefined && this.state.permission.view === true && this.state.permission.create === true)
                rightSearch.push(<Button className="p-button-success" icon="pi pi-plus" style={{ width: 'auto', marginRight: '.25em' }}
                    label={this.props.language["create"] || "create"} onClick={() => this.setState({ showAdd: true })} />)
            if (this.state.permission.delete === true && this.state.permission.view === true) {
                rightSearch.push(<Button label={this.props.language["delete"] || "l_delete"} style={{ width: 'auto', marginRight: '.25em' }}
                    onClick={() => this.onDeleted()} icon="pi pi-trash" className="p-button-danger" />)
            }
            if (this.state.permission.import === true && this.state.permission.view === true) {
                rightSearch.push(<FileUpload chooseLabel={this.props.language["import"] || "l_import"} accept=".xlsx" uploadHandler={this.hanlderUploadFile}
                    ref={this._child} multiple={false} customUpload={true} mode="basic" ></FileUpload>)
                rightSearch.push(<Button icon="pi pi-download" style={{ width: 'auto', marginLeft: '.25em' }}
                    label={this.props.language["download_template"] || "l_download_template"}
                    className="p-button-danger" onClick={() => download('/export/TemplateExcel/notify_template.xlsx')}></Button>)
            }
        }
        return (
            this.state.permission.view ? (
                <Card className="p-fluid">
                    <Dialog
                        header={this.props.language["annoucement"] || "l_annoucement"}
                        visible={this.state.visibleModal}
                        modal={true}
                        onHide={() => this.setState({ visibleModal: false })}
                        blockScroll
                        footer={this.renderFooterDialog(this.state.selectedItem)}><p>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}</p></Dialog>
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-grid">
                                <div className="p-field p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["month_and_year"] || "l_month_and_year"}</label><br />
                                    <Calendar value={this.state.monthYear}
                                        showIcon style={{ width: '100%' }}
                                        onChange={(e) => this.setState({ monthYear: e.value })} view="month"
                                        dateFormat="mm/yy" yearNavigator={true} yearRange="2010:2030" />
                                </div>
                                <div className="p-field p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["notify_group"] || "l_notify_group"}</label><br />
                                    <Dropdown optionLabel="typeReport"
                                        value={this.state.notifyType}
                                        options={this.props.notifygroup} showClear
                                        id="notifyType" style={{ width: '100%' }}
                                        onChange={(e) => { this.setState({ notifyType: e.value }) }}
                                        placeholder={this.props.language["group"] || "l_group"} />
                                </div>
                                <div className="p-field p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["notify_title"] || "l_notify_title"}</label><br />
                                    <Dropdown optionLabel="name"
                                        value={this.state.notifyTitle}
                                        options={this.props.notifyTitle} showClear
                                        id="notifyTitle" style={{ width: '100%' }}
                                        onChange={(e) => { this.setState({ notifyTitle: e.value }) }}
                                        placeholder={this.props.language["title"] || "l_title"}
                                        filter={true}
                                        filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                        filterBy="name" />
                                </div>
                                <div className="p-field p-col-12 p-lg-3">
                                    <label>{this.props.language["position"] || "position"}</label>
                                    <EmployeeTypeDropDownList
                                        id="position"
                                        type={this.state.position}
                                        onChange={this.handleChange}
                                        value={this.state.position} />
                                </div>
                                <div className="p-field p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["employee"] || "l_employee"}</label>
                                    <EmployeeDropDownList
                                        onChange={this.handleChange}
                                        typeId={this.state.position === '' ? 0 : this.state.position}
                                        value={this.state.employeeId}
                                        parentId={0}
                                        id="employeeId"
                                        mode="multi">
                                    </EmployeeDropDownList>
                                </div>
                                <div className="p-field p-col-12 p-md-6 p-lg-3">
                                    <label>{this.props.language["notify_status"] || "l_notify_status"}</label><br />
                                    <Dropdown optionLabel="itemName"
                                        value={this.state.notifyStatus}
                                        options={itemStatus} showClear
                                        id="notifyStatus" style={{ width: '100%' }}
                                        onChange={(e) => { this.setState({ notifyStatus: e.value }) }}
                                        placeholder={this.props.language["status"] || "status"} />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>
                    <Toolbar left={leftSearch} right={rightSearch} />
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    <div className="p-row">
                        <div className="p-row" style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>{this.props.language["found"] || "l_found"} {this.props.notifylist.length}</div>

                        <DataTable value={this.props.notifylist} ref={(el) => { this.dt = el; }}
                            paginator rows={50} className="p-datatable-responsive" paginatorPosition={"both"}
                            rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "12px", width: '100%' }}
                            expandedRows={this.state.expandedRows}
                            selection={this.state.selectedNotify}
                            onSelectionChange={e => this.setState({ selectedNotify: e.value })}
                            dataKey="rowIndex" responsive>
                            <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                            <Column style={{ width: 50 }} header="No" field="rowIndex"></Column>
                            <Column filter filterMatchMode="contains" style={{ width: 150 }} header={this.props.language["employee_code"] || "l_employee_code"} field="employeeCode"></Column>
                            <Column filter style={{ width: 150 }} filterMatchMode="contains" header={this.props.language["employee.name"] || "employee.name"} field="employeeName"></Column>
                            <Column filter style={{ width: 80 }} filterMatchMode="contains" header={this.props.language["position"] || "l_position"} field="position"></Column>
                            <Column filter style={{ width: 250 }} filterMatchMode="contains" header={this.props.language["document.title"] || "document.title"} field="title"></Column>
                            <Column filter filterMatchMode="contains" header={this.props.language["body"] || "l_body"} field="body"></Column>
                            <Column filter filterMatchMode="contains" style={{ width: 90 }} header={this.props.language["date"] || "l_date"} body={(rowData) => this.showCalendar(rowData)} ></Column>
                            <Column filter filterMatchMode="contains" style={{ width: 90 }} header={this.props.language["group"] || "l_group"} field="notifyGroup"></Column>
                            <Column filter filterMatchMode="contains" style={{ width: 70 }} header={this.props.language["status"] || "status"} field="statusName"></Column>
                            <Column body={this.actionButton} style={{ textAlign: 'center', width: 60 }} header="#" field="id"></Column>
                        </DataTable>
                    </div>
                    <Dialog visible={this.state.showAdd} style={{ width: '80vw' }}
                        onHide={() => this.setState({ showAdd: false })} header={this.props.language["create_notification"] || "l_create_notification"} >
                        <div className="p-grid">
                            <div className="p-col-12 p-md-6 p-sm-12">
                                <label>{this.props.language["notify_group"] || "l_notify_group"}</label><br />
                                <Dropdown optionLabel="typeReport"
                                    value={this.state.sendType}
                                    options={this.props.notifygroup}
                                    showClear editable
                                    id="sendType" style={{ width: '100%' }}
                                    onChange={(e) => { this.setState({ sendType: e.value }) }}
                                    placeholder={this.props.language["group"] || "l_group"} />
                                <label>{this.props.language["title"] || "l_title"}</label>
                                <InputText onChange={this.handleChangeForm}
                                    value={this.state.title}
                                    id="title" />
                                <label>{this.props.language["hidenlink"] || "l_hidenlink"}</label>
                                <InputText onChange={this.handleChangeForm}
                                    value={this.state.hidenlink}
                                    id="hidenlink" />
                                <label>{this.props.language["content"] || "l_content"}</label>
                                <InputTextarea onChange={this.handleChangeForm}
                                    value={this.state.content}
                                    style={{ minHeight: 300, resize: 'block' }} id="content" />
                                <Button style={{ width: 100 }} label={this.props.language["save"] || "save"} onClick={() => this.SendByContent()}
                                    className="p-button-info" icon="pi pi-save" />
                            </div>
                            <div className="p-col-12 p-md-6 p-sm-12">
                                <label>{this.props.language["selected"] || "l_selected"}: {this.state.EmpSelected.length}</label>
                                <DataTable
                                    selection={this.state.EmpSelected} paginator
                                    rowsPerPageOptions={[50, 100]} rows={50}
                                    scrollable scrollHeight="350px" className="p-datatable-sm"
                                    onSelectionChange={e => this.setState({ EmpSelected: e.value })}
                                    value={this.props.employeeDDL} dataKey="id">
                                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                                    <Column filter field="typeName" />
                                    <Column filterMatchMode="contains" filter field="employeeName" />
                                </DataTable>
                            </div>
                        </div>
                    </Dialog>
                </Card>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        )
    }
}
function mapStateToProps(state) {
    return {
        notifylist: state.notifyStore.notifylist,
        loading: state.notifyStore.loading,
        errors: state.notifyStore.errors,
        notifygroup: state.notifyStore.notifygroup,
        notifyTitle: state.notifyStore.notifyTitle,
        employeeDDL: state.employees.employeeDDL,
        language: state.languageList.language,
        ExportNotifyList: state.notifyStore.ExportNotifyList,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        NotifyController: bindActionCreators(actionCreatorsNotify, dispatch),
        EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NotifyManager);