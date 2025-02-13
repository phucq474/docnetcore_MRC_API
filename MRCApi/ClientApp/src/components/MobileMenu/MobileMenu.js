import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { connect } from 'react-redux';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { HelpPermission, download, getLogin, getAccountId } from '../../Utils/Helpler';
import { Toast } from 'primereact/toast';
import { MobileMenuCreateAction } from '../../store/MobileMenuController';
import { ProgressBar } from 'primereact/progressbar';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { bindActionCreators } from 'redux';
import { Dialog } from 'primereact/dialog';
import Page403 from '../ErrorRoute/page403';
import EmployeeTypeDropDownList from '../Controls/EmployeeTypeDropDownList';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { EmployeeActionCreate } from '../../store/EmployeeController';
import { AccountDropDownList } from '../Controls/AccountDropDownList';

const optionByShop = [
    { value: 0, name: "Có" },
    { value: 1, name: "Không" }
]
const optionTaskDone = [
    { value: 0, name: "Bắt buộc" },
    { value: 2, name: "Cảnh báo" }
]
const optionFirstTask = [
    { value: 0, name: "Không cần chấm công" },
    { value: 1, name: "Cần chấm công" }
]

class MobileMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            permission: {},
            rowData: [],
            loading: false,
            position: null,// null,
            menuId: null,
            listMenuDefault: [],
            indRow: '',
            isDelete: false,
            dataUpdate: null,
            dataInsert: [],
            isUpdate: false,
            isInsert: false,
            listMenuByPosition: [],
            insert_position: null,
            insert_menu: [],
            employeeTypes: [],
            typeAction: 'update',
            accId: null
        }
        this.pageId = 3075;
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        if (!permission?.view) {
            permission = await HelpPermission(3166);
        }
        const listMenuDefault = await this.handleGetListMenu();
        await this.props.EmployeeController.GetEmployeeType(null);
        const employeeTypes = await this.props.employeeTypes;
        this.setState({ permission, listMenuDefault: listMenuDefault, employeeTypes: employeeTypes })
    }

    displayToastMessage = (severity, toastMessage) => {
        try {
            this.toast?.show({ severity: severity, summary: 'Thông báo', detail: toastMessage, life: 3000 });
        } catch (e) { }
    }

    handleChangePosition = async (id, value) => {
        if (value > 0) {
            const listMenuDefault = await this.handleGetListMenu(value);
            this.setState({ insert_position: value, listMenuByPosition: listMenuDefault, insert_menu: [] });
        }
        else {
            this.setState({ insert_position: value, listMenuByPosition: [], insert_menu: [] });
        }
    }

    handleChange = (id, value, type) => {
        if (type === 'update') {
            this.setState({ dataUpdate: { ...this.state.dataUpdate, [id]: value } });
        }
        else {
            this.setState({ [id]: value });
        }
    }
    handleChangeDRD = (id, value) => {
        this.setState({ [id]: value });
    }
    handleChangeForm = (e, type) => {
        if (type === 'update') {
            this.setState({ dataUpdate: { ...this.state.dataUpdate, [e.target.id]: e.target.value } });
        }
        else {
            this.setState({ [e.target.id]: e.target.value });
        }
    }

    handleGetListMenu = async (position) => {
        await this.props.MobileMenuController.MM_GetListMenu(position);
        const rs = await this.props.mm_GetListMenu;
        if (rs?.length > 0) {
            return rs;
        }
        else {
            return [];
        }
    }

    handleSearch = async () => {
        this.setState({ loading: true, datas: [] })
        const data = await {
            position: this.state.position,
            menuId: this.state.menuId ? this.state.menuId.menuId : null
        }
        await this.props.MobileMenuController.MM_Filter(data, this.state.accId);
        const rs = await this.props.mm_Filter;
        if (rs.status === 200) {
            this.setState({ datas: rs.data, loading: false })
            this.displayToastMessage('success', rs.message)
        }
        else {
            this.displayToastMessage('error', rs.message)
            this.setState({
                loading: false
            })
        }
    }

    handleInsert = async () => {
        this.setState({ loading: true })
        const data = await this.state.dataInsert ? this.state.dataInsert : null;
        if (data?.length > 0) {
            await this.props.MobileMenuController.MM_Insert(data, this.state.accId);
            const rs = await this.props.mm_Insert;
            if (rs.status === 200) {
                this.setState({ datas: rs.data, loading: false, isInsert: false, typeAction: 'update', dataInsert: null })
                this.displayToastMessage('success', rs.message)
            }
            else {
                this.displayToastMessage('error', rs.message)
                this.setState({ loading: false })
            }
        }
        else {
            this.displayToastMessage('error', "Không có dữ liệu để thêm")
            this.setState({ loading: false })
        }
    }

    handleUpdate = async (data) => {
        this.setState({ loading: true })
        await this.props.MobileMenuController.MM_Update(data, this.state.accId);
        const rs = await this.props.mm_Update;
        if (rs.status === 200) {
            let datas = await this.state.datas;
            let rsData = await rs.data[0];
            const ind = await datas.findIndex(p => p.id === data.id);
            rsData.rowNum = await datas[ind].rowNum;
            datas[ind] = await rsData;
            this.setState({ datas: datas, loading: false, isUpdate: false, dataUpdate: null })
            this.displayToastMessage('success', rs.message)
        }
        else {
            this.displayToastMessage('error', rs.message)
            this.setState({ loading: false, isUpdate: false, dataUpdate: null })
        }
    }

    handleDelete = async () => {
        const rowData = await this.state.rowData;
        this.setState({ loading: true })
        await this.props.MobileMenuController.MM_Delete(rowData.id, this.state.accId);
        const rs = await this.props.mm_Delete;
        if (rs.status === 200) {
            let datas = await this.state.datas;
            const ind = await datas.findIndex(p => p.id === rowData.id);
            datas.splice(ind, 1);
            this.setState({ datas: datas, loading: false, rowData: null, indRow: '' })
            this.displayToastMessage('success', rs.message)
        }
        else {
            this.displayToastMessage('error', rs.message)
            this.setState({ loading: false })
        }
    }

    templatePosition = (rowData) => {
        const nameTmp = this.state.employeeTypes.find(p => p.id === rowData.typeId);
        return (
            <div>
                {nameTmp ? nameTmp.typeName : null}
            </div>
        )
    }

    templateByShop = (rowData) => {
        const nameTmp = optionByShop.find(p => p.value === rowData.byShop);
        return (
            <div>
                {nameTmp ? nameTmp.name : null}
            </div>
        )
    }
    templateTaskDone = (rowData) => {
        const nameTmp = optionTaskDone.find(p => p.value === rowData.taskDone);
        return (
            <div>
                {nameTmp ? nameTmp.name : null}
            </div>
        )
    }
    templateFirstTask = (rowData) => {
        const nameTmp = optionFirstTask.find(p => p.value === rowData.fistTask);
        return (
            <div>
                {nameTmp ? nameTmp.name : null}
            </div>
        )
    }

    handleUpdateRow = async (rowData) => {
        let datas = await this.state.dataInsert;
        const ind = await datas.findIndex(p => p.menuId === rowData.menuId && p.typeId === rowData.typeId);
        datas[ind] = await rowData;
        this.setState({ dataInsert: datas, loading: false, isUpdate: false, dataUpdate: null })
    }

    handleDeleteRow = async (rowData) => {
        let datas = await this.state.dataInsert;
        const ind = await datas.findIndex(p => p.menuId === rowData?.menuId && p.typeId === rowData?.typeId);
        datas.splice(ind, 1);
        this.setState({ dataInsert: datas, loading: false, indRow: '' })
    }

    actionTool = (rowData) => {
        const typeAction = this.state.typeAction ? this.state.typeAction : 'update';
        if (typeAction === 'insert') {
            return (
                <div>
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2 p-button-outlined" onClick={() => this.setState({ dataUpdate: rowData, isUpdate: true })} />
                    <Button id={"bnt_delete_insert_" + rowData.menuId + '-' + rowData.typeId}
                        onClick={() => this.handleDeleteRow(rowData)}
                        icon="pi pi-trash" className="p-button-rounded p-button-danger p-mr-2 p-button-outlined"></Button>
                </div>
            )
        }
        else {
            return (
                <div>
                    {this.state.permission.edit &&
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2 p-button-outlined" onClick={() => this.setState({ dataUpdate: rowData, isUpdate: true })} />
                    }
                    {this.state.permission.delete &&
                        <Button id={"bnt_delete_" + rowData.id} onClick={() => this.setState({ rowData: rowData, isDelete: true, indRow: rowData.id })}
                            icon="pi pi-trash" className="p-button-rounded p-button-danger p-mr-2 p-button-outlined"></Button>
                    }
                </div>
            )
        }

    }

    onHide = () => {
        this.setState({ isUpdate: false, dataUpdate: null })
    }

    renderFooterInsert = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.setState({ isInsert: false, dataInsert: null, insert_menu: null, insert_position: null, typeAction: 'update' })} className="p-button-text p-button-danger" />
                <Button label="Save" icon="pi pi-save" onClick={() => this.handleInsert()} autoFocus className="p-button-text p-button-success" />
            </div>
        );
    }
    renderFooterUpdate = (type) => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.onHide()} className="p-button-text p-button-danger" />
                <Button label="Save" icon="pi pi-save" onClick={() => this.checkDataUpdate(type)} autoFocus className="p-button-text p-button-success" />
            </div>
        );
    }

    checkDataUpdate = async (type) => {
        let dataUpdate = await this.state.dataUpdate;
        let check = await true;
        if (dataUpdate.menuName === undefined || dataUpdate.menuName === null || dataUpdate.menuName === "") {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_menuName: "Value is not available." } })
            check = await false;
        }
        else {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_menuName: "" } })
        }
        if (dataUpdate.byShop === undefined || dataUpdate.byShop === null || dataUpdate.byShop === "") {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_byShop: "Value is not available." } })
            check = await false;
        }
        else {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_byShop: "" } })
        }
        if (dataUpdate.fistTask === undefined || dataUpdate.fistTask === null || dataUpdate.fistTask === "") {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_fistTask: "Value is not available." } })
            check = await false;
        }
        else {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_fistTask: "" } })
        }
        if (dataUpdate.taskDone === undefined || dataUpdate.taskDone === null || dataUpdate.taskDone === "") {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_taskDone: "Value is not available." } })
            check = await false;
        }
        else {
            await this.setState({ dataUpdate: { ...this.state.dataUpdate, error_taskDone: "" } })
        }

        if (check === await true) {
            if (type === 'insert') {
                await this.handleUpdateRow(dataUpdate);
            }
            else {
                await this.handleUpdate(dataUpdate);
            }
        }
        else {
            return;
        }
    }

    handleAddDataInsert = async () => {
        const insert_menu = await this.state.insert_menu;
        const insert_position = await this.state.insert_position;
        let dataInsert = await this.state.dataInsert ? this.state.dataInsert : [];

        if (insert_menu.length > 0 && insert_position > 0) {
            await insert_menu.forEach((item) => {
                const itemData = {
                    byShop: item.byShop,
                    fistTask: item.fistTask,
                    menuId: item.menuId,
                    menuName: item.menuName,
                    orderBy: item.orderBy,
                    taskDone: item.taskDone,
                    typeId: insert_position,
                    pageName: item.pageName
                }
                const tmpInd = dataInsert.findIndex(p => p.menuId === itemData.menuId && p.typeId === itemData.typeId);
                if (tmpInd === -1 || dataInsert === []) {
                    dataInsert.push(itemData);
                }
            })
            await this.setState({ dataInsert: dataInsert })
        }
    }

    dialogUpdate = () => {
        const typeAction = this.state.typeAction ? this.state.typeAction : 'update';
        let dataUpdate = this.state.dataUpdate;
        return (
            <Dialog header="Update" visible={this.state.isUpdate} style={{ width: '90vw' }} footer={this.renderFooterUpdate(typeAction)} onHide={() => this.onHide('update')}>
                <div className="p-grid" >
                    <div className="p-col-12 p-md-2 p-sm-6">
                        <label>{this.props.language["position"] || "position"}</label>
                        <EmployeeTypeDropDownList
                            id="typeId"
                            onChange={(id, value) => this.handleChange(id, value, 'update')}
                            filter={true}
                            disabled={true}
                            accId={this.state.accId}
                            value={dataUpdate?.typeId} />
                    </div>
                    <div className="p-col-12 p-md-2 p-sm-6">
                        <label>{this.props.language["menu_name"] || "menu_name"}</label>
                        <InputText value={dataUpdate?.menuName}
                            id="menuName"
                            onChange={(e) => this.handleChangeForm(e, 'update')}
                            placeholder={this.props.language["menu_name"] || "menu_name"} />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{dataUpdate?.error_menuName || ''}</small>
                    </div>
                    <div className="p-col-12 p-md-2 p-sm-6">
                        <label>{this.props.language["by_shop"] || "by_shop"}</label>
                        <Dropdown
                            id='byShop'
                            style={{ width: '100%' }}
                            options={optionByShop}
                            onChange={(e) => this.handleChangeForm(e, 'update')}
                            value={dataUpdate?.byShop}
                            placeholder={this.props.language["select_a_position"] || "l_select_a_position"}
                            optionLabel="name"
                            filter={true}
                            disabled={true}
                            filterPlaceholder={this.props.language["select_a_position"] || "l_select_a_position"}
                            filterBy="name"
                        />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{dataUpdate?.error_byShop || ''}</small>
                    </div>
                    <div className="p-col-12 p-md-2 p-sm-6">
                        <label>{this.props.language["first_task"] || "first_task"}</label>
                        <Dropdown
                            id='fistTask'
                            style={{ width: '100%' }}
                            options={optionFirstTask}
                            onChange={(e) => this.handleChangeForm(e, 'update')}
                            value={dataUpdate?.fistTask}
                            placeholder={this.props.language["select_a_position"] || "l_select_a_position"}
                            optionLabel="name"
                            filter={true}
                            filterPlaceholder={this.props.language["select_a_position"] || "l_select_a_position"}
                            filterBy="name"
                        />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{dataUpdate?.error_fistTask || ''}</small>
                    </div>
                    <div className="p-col-12 p-md-2 p-sm-6">
                        <label>{this.props.language["task_done"] || "task_done"}</label>
                        <Dropdown
                            id='taskDone'
                            style={{ width: '100%' }}
                            options={optionTaskDone}
                            onChange={(e) => this.handleChangeForm(e, 'update')}
                            value={dataUpdate?.taskDone}
                            placeholder={this.props.language["select_a_position"] || "l_select_a_position"}
                            optionLabel="name"
                            filter={true}
                            filterPlaceholder={this.props.language["select_a_position"] || "l_select_a_position"}
                            filterBy="name"
                        />
                        <small style={{ color: 'red' }} className="p-invalid p-d-block">{dataUpdate?.error_taskDone || ''}</small>
                    </div>
                    <div className="p-col-12 p-md-2 p-sm-6">
                        <label>{this.props.language["order"] || "order"}</label>
                        <InputNumber
                            id='orderBy'
                            inputId="minmax-buttons"
                            style={{ width: '100%' }}
                            value={dataUpdate?.orderBy}
                            onValueChange={(e) => this.handleChangeForm(e, 'update')}
                            mode="decimal" showButtons min={0} max={1000} />
                    </div>
                </div>
            </Dialog>
        )
    }

    dialogInsert = () => {
        return (
            <Dialog header="Insert" visible={this.state.isInsert}
                style={{ width: '80vw' }}
                footer={this.renderFooterInsert}
                onHide={() => this.setState({ isInsert: false, dataInsert: null, insert_menu: null, insert_position: null, typeAction: 'update' })}>
                <Accordion activeIndex={0}>
                    <AccordionTab header="Insert option">
                        <div className="p-grid" >
                            <div className="p-col-12 p-md-4 p-sm-6">
                                <label>{this.props.language["position"] || "position"}</label>
                                <EmployeeTypeDropDownList
                                    id="insert_position"
                                    onChange={(id, value) => this.handleChangePosition(id, value)}
                                    filter={true}
                                    accId={this.state.accId}
                                    value={this.state.insert_position} />
                            </div>
                            <div className="p-col-12 p-md-4 p-sm-6">
                                <label>{this.props.language["menu"] || "menu"}</label>
                                <MultiSelect
                                    id="insert_menu"
                                    value={this.state.insert_menu}
                                    style={{ width: '100%' }}
                                    options={this.state.listMenuByPosition}
                                    onChange={this.handleChangeForm}
                                    optionLabel={"menuName"}
                                    showClear={true}
                                    filter={true}
                                    placeholder="Select a menu" />
                            </div>
                            <div className="p-col-12 p-md-4 p-sm-6">
                                <label>{"."}</label>
                                <Button style={{ width: '100%' }} onClick={() => this.handleAddDataInsert()} label="Add"
                                    icon="pi pi-download" className="p-button-rounded p-button-warning p-mr-2 p-button-outlined"></Button>
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
                <Card>
                    <DataTable
                        value={this.state.dataInsert}
                        paginator
                        rows={20}
                        style={{ fontSize: "13px" }}
                        rowHover
                        removableSort
                    >
                        <Column sortable field="typeId" body={this.templatePosition} header={this.props.language["position"] || "l_position"} style={{ width: "12%", textAlign: 'center' }} />
                        <Column sortable field="menuName" header={this.props.language["menu_name"] || "l_menu_name"} style={{ width: "15%", textAlign: 'center' }} />
                        <Column sortable field="pageName" header={this.props.language["page_name"] || "l_page_name"} style={{ width: "12%", textAlign: 'center' }} />
                        <Column sortable field='byShop' body={this.templateByShop} header={this.props.language["by_shop"] || "l_by_shop"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column sortable field='fistTask' body={this.templateFirstTask} header={this.props.language["first_task"] || "l_first_task"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column sortable field='taskDone' body={this.templateTaskDone} header={this.props.language["task_done"] || "l_task_done"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column sortable field="orderBy" header={this.props.language["order"] || "l_order"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column body={this.actionTool} header="Tool" style={{ width: '8%', textAlign: 'center' }} ></Column>
                    </DataTable>
                </Card>
                {this.dialogUpdate()}
            </Dialog>
        )
    }


    render() {
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
            </React.Fragment>
        );

        const rightContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.create && <Button icon="pi pi-plus" label={this.props.language["insert"] || "l_insert"} onClick={() => this.setState({ isInsert: true, typeAction: 'insert' })} style={{ marginRight: "15px" }} className="p-button-danger" />}
            </React.Fragment>

        )

        return (
            this.state.permission.view ? (
                <Card>
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-grid" >
                                <AccountDropDownList
                                    id="accId"
                                    className='p-field p-col-12 p-md-3 p-sm-6'
                                    onChange={this.handleChangeDRD}
                                    filter={true}
                                    showClear={true}
                                    value={this.state.accId} />
                                <div className="p-field p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["position"] || "position"}</label>
                                    <EmployeeTypeDropDownList
                                        id="position"
                                        onChange={(id, value) => this.handleChange(id, value, '')}
                                        filter={true}
                                        accId={this.state.accId}
                                        value={this.state.position || ''} />
                                </div>
                                <div className="p-field p-col-12 p-md-6 p-sm-6">
                                    <label>{this.props.language["menu"] || "l_menu"}</label>
                                    <div>
                                        <Dropdown
                                            id="menuId"
                                            value={this.state.menuId}
                                            style={{ width: '100%' }}
                                            options={this.state.listMenuDefault}
                                            onChange={this.handleChangeForm}
                                            optionLabel={"menuName"}
                                            showClear={true}
                                            filter={true}
                                            placeholder="Select a menu" />
                                    </div>
                                </div>

                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    <DataTable
                        value={this.state.datas}
                        paginator
                        rows={20}
                        rowsPerPageOptions={[20, 50, 100]}
                        style={{ fontSize: "13px" }}
                        rowHover paginatorPosition={"both"}
                        dataKey="rowNum"
                        removableSort
                    >
                        <Column filter field='rowNum' style={{ width: "4%", textAlign: 'center' }} header="No." />
                        <Column filter sortable filterMatchMode="contains" field="typeName" header={this.props.language["position"] || "l_position"} style={{ width: "12%", textAlign: 'center' }} />
                        <Column filter sortable filterMatchMode="contains" field="menuName" header={this.props.language["menu_name"] || "l_menu_name"} style={{ width: "15%", textAlign: 'center' }} />
                        <Column filter sortable filterMatchMode="contains" field="pageName" header={this.props.language["page_name"] || "l_page_name"} style={{ width: "12%", textAlign: 'center' }} />
                        <Column filter sortable field='byShop' body={this.templateByShop} header={this.props.language["by_shop"] || "l_by_shop"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column filter sortable field='fistTask' body={this.templateFirstTask} header={this.props.language["first_task"] || "l_first_task"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column filter sortable field='taskDone' body={this.templateTaskDone} header={this.props.language["task_done"] || "l_task_done"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column filter sortable filterMatchMode="contains" field="orderBy" header={this.props.language["order"] || "l_order"} style={{ width: "10%", textAlign: 'center' }} />
                        {(this.state.permission.edit || this.state.permission.delete) && <Column body={this.actionTool} header="Tool" style={{ width: '8%', textAlign: 'center' }} ></Column>}
                    </DataTable>
                    <ConfirmPopup target={document.getElementById("bnt_delete_" + this.state.indRow)} visible={this.state.isDelete} onHide={() => this.setState({ isDelete: false, rowData: null, indRow: '' })} message="Do you want to DELETE this entry?"
                        icon="pi pi-trash" accept={this.handleDelete} />
                    {this.dialogUpdate()}
                    {this.dialogInsert()}
                </Card>

            ) : (this.state.permission.view !== undefined && <Page403 />)

        );
    }
}

function mapStateToProps(state) {
    return {
        mm_Filter: state.mobilemenu.mm_Filter,
        mm_GetListMenu: state.mobilemenu.mm_GetListMenu,
        mm_Insert: state.mobilemenu.mm_Insert,
        mm_Update: state.mobilemenu.mm_Update,
        mm_Delete: state.mobilemenu.mm_Delete,
        language: state.languageList.language,
        employeeTypes: state.employees.employeeTypes,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        MobileMenuController: bindActionCreators(MobileMenuCreateAction, dispatch),
        EmployeeController: bindActionCreators(EmployeeActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu);