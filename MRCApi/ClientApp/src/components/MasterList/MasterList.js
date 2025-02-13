import React,{Component} from 'react';
import {HelpPermission} from '../../Utils/Helpler';
import {Accordion,AccordionTab} from 'primereact/accordion';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Dropdown} from 'primereact/dropdown';
import {DataTable} from 'primereact/datatable';
import {MasterListAPI} from '../../store/MasterListController'
import {Toolbar} from 'primereact/toolbar';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Column} from 'primereact/column';
import MasterDialog from './MasterListDialog'
import {Dialog} from 'primereact/dialog';
import {ProgressSpinner} from 'primereact/progressspinner';
import Page403 from '../ErrorRoute/page403';

class MasterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            isLoading: false,
            displayEditDialog: false,
            displayInsertDialog: false,
            displayConfirmDialog: false,
            inputValues: {},
            permission: {},
        };
        this.pageId = 4097
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.handleSearch = this.handleSearch.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleInsert = this.handleInsert.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleValidInput = this.handleValidInput.bind(this)
        this.actionButtons = this.actionButtons.bind(this)
        this.displayToastMessage = this.displayToastMessage.bind(this)
        this.renderFooterAction = this.renderFooterAction.bind(this)
        this.isLockOptions = [{name: 'Yes'},{name: 'No'}];
        this.handleDisplayDialog = this.handleDisplayDialog.bind(this)
        this.styleSpinner = {
            width: "50px",
            height: "50px",
            position: "absolute",
            zIndex: 100,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }
    }
    renderFooterAction(actionName,cancel,proceed) {
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }
    handleDisplayDialog(boolean,stateName,rowData = {},rowIndex) {
        if(boolean) {
            this.setState({
                [stateName]: true,
                rowData: rowData,
                rowIndex: rowIndex,
                inputValues: {
                    ...this.state.edits,
                    listCode: rowData.listCode !== undefined ? {listCode: rowData.listCode} : "",
                    code: rowData.code,
                    id: rowData.id,
                    name: rowData.name,
                    nameVN: rowData.nameVN,
                    isLock: rowData.isLock === 1 ? {name: "Yes"} : {name: "No"},
                    ref_Code: rowData.ref_Code,
                    ref_Name: rowData.ref_Name,
                    imageItem: rowData.imageItem,
                    isEditableListCode: stateName === "displayInsertDialog" ? true : false,
                }
            })
        } else {
            this.setState({
                [stateName]: false,
                rowData: [],
                inputValues: {}
            })
        }
    }
    actionButtons(rowData,event) {
        return (
            <div className="p-d-flex p-flex-column">
                {this.state.permission.edit &&
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover" onClick={() => this.handleDisplayDialog(true,"displayEditDialog",rowData,event.rowIndex)} />}
                {this.state.permission.delete &&
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-mr-2 p-mb-2 btn__hover" onClick={() => this.handleDisplayDialog(true,"displayConfirmDialog",rowData,event.rowIndex)} />}
            </div>
        )
    }
    async handleSearch() {
        await this.setState({isLoading: true})
        const {searchByListCode,searchByName} = await this.state
        await this.props.MasterListController.FilterMasterList({
            listCode: (searchByListCode && searchByListCode.listCode !== undefined) ? searchByListCode.listCode : null,
            id: (searchByName && searchByName.id !== undefined) ? searchByName.id : null,
        });
        const datas = await this.props.filterMasterList
        await this.displayToastMessage("info","Result ",datas.length)
        await this.setState({datas,isLoading: false})
    }
    async handleInsert() {
        await this.setState({isLoading: true})
        await this.handleValidInput().then(async (valid) => {
            if(valid) {
                let {listCode,code,name,nameVN,isLock,ref_Code,ref_Name,imageItem} = await this.state.inputValues
                await this.props.MasterListController.InsertMasterList({
                    listCode: typeof listCode === "object" ? listCode.listCode || null : listCode || null,
                    code: code || null,
                    name: name || null,
                    nameVN: nameVN || null,
                    ref_Code: ref_Code || null,
                    ref_Name: ref_Name || null,
                    imageItem: imageItem || null,
                    isLock: isLock !== null ? (isLock.name === "Yes" ? 1 : 0) : 0,
                })
                const response = await this.props.insertMasterList
                if(typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.props.MasterListController.GetListCode()
                    await this.setState({
                        datas: this.props.filterMasterList,
                        listCodes: this.props.getListCodeMasterlist,
                    })
                    await this.handleDisplayDialog(false,"displayInsertDialog")
                    await this.highlightParentRow(0)
                    await this.displayToastMessage("info","Insert Successful",1)
                } else {
                    await this.displayToastMessage("error","Insert failed",-1)
                }
            }
        })
        await this.setState({isLoading: false})
    }
    async handleUpdate() {
        await this.setState({isLoading: true})
        await this.handleValidInput().then(async (response) => {
            if(response) {
                let {listCode,code,name,nameVN,isLock,ref_Code,ref_Name,imageItem} = await this.state.inputValues
                let {id} = await this.state.rowData
                await this.props.MasterListController.UpdateMasterList({
                    listCode: typeof listCode === "object" ? listCode.listCode || null : listCode || null,
                    code: code || null,
                    name: name || null,
                    nameVN: nameVN || null,
                    ref_Code: ref_Code || null,
                    ref_Name: ref_Name || null,
                    imageItem: imageItem || null,
                    isLock: isLock !== null ? (isLock.name === "Yes" ? 1 : 0) : 0,
                    id: id,
                },this.state.rowIndex)
                const response = await this.props.updateMasterList
                if(typeof response === "object" && response[0] && response[0].alert == "1") {
                    await this.setState({datas: this.props.filterMasterList})
                    await this.handleDisplayDialog(false,"displayEditDialog")
                    await this.highlightParentRow(this.state.rowIndex)
                    await this.displayToastMessage("info","Update Successful",1)
                } else {
                    await this.displayToastMessage("error","Update failed",-1)
                }
            }
        })
        await this.setState({isLoading: false})
    }
    async handleDelete() {
        await this.setState({isLoading: true})
        const {id,listCode} = await this.state.rowData
        await this.props.MasterListController.DeleteMasterList({
            listCode: listCode,
            id: id,
        },this.state.rowIndex);
        const response = await this.props.deleteMasterList
        if(typeof response === "object" && response[0] && response[0].alert == "1") {
            await this.setState({datas: this.props.filterMasterList})
            await this.handleDisplayDialog(false,"displayConfirmDialog")
            await this.displayToastMessage("info","Delete Successful",1)
        } else {
            await this.displayToastMessage("error","Delete failed",-1)
        }
        await this.setState({isLoading: false})
    }
    async handleValidInput() {
        let check = true;
        const {listCode,code,name,nameVN} = this.state.inputValues
        if(!listCode) {
            await this.setState({inputValues: {...this.state.inputValues,errorListCode: "List Code Required"}})
            check = false
        } else await this.setState({inputValues: {...this.state.inputValues,errorListCode: ""}})
        if(!code) {
            await this.setState({inputValues: {...this.state.inputValues,errorCode: "Code Required"}})
            check = false
        } else await this.setState({inputValues: {...this.state.inputValues,errorCode: ""}})
        if(!name) {
            await this.setState({inputValues: {...this.state.inputValues,errorName: "Name Required"}})
            check = false
        } else await this.setState({inputValues: {...this.state.inputValues,errorName: ""}})
        if(!nameVN) {
            await this.setState({inputValues: {...this.state.inputValues,errorNameVN: "NameVN Required"}})
            check = false
        } else await this.setState({inputValues: {...this.state.inputValues,errorNameVN: ""}})
        if(!check) return false
        else return true
    }
    handleChangeForm(value,stateName = "",subStateName = null) {
        if(subStateName) {
            this.setState({
                [stateName]: {...this.state[stateName],[subStateName]: value == null ? "" : value}
            });
        } else {
            if(stateName === "searchByListCode") {
                if(value !== null) {
                    this.setState({
                        listNames: this.props.getNameMasterlist.filter(e => e.listCode === value.listCode)
                    })
                } else {
                    this.setState({
                        listNames: this.props.getNameMasterlist
                    })
                }
            }
            this.setState({[stateName]: value === null ? "" : value});
        }
    }
    displayToastMessage(severity,toastMessage,actionState) { // 1:succeess  -1:failed
        let detail = ""
        if(actionState === 1) detail = "1 row affected"
        else if(actionState === -1) detail = "0 row affected"
        else detail = `Result ${actionState}`
        this.toast.show({severity: severity,summary: toastMessage,detail: detail,life: 3000});
    }
    highlightParentRow = async (rowIndex) => {
        try {
            const seconds = await 3000,outstanding = await "highlightText"
            let rowUpdated = await document.querySelectorAll(".p-datatable-tbody")[0]
            if(rowUpdated && !rowUpdated.children[rowIndex].classList.contains(outstanding)) {
                rowUpdated.children[rowIndex].classList.add(outstanding)
                setTimeout(() => {
                    if(rowUpdated.children[rowIndex].classList.contains(outstanding)) {
                        rowUpdated.children[rowIndex].classList.remove(outstanding)
                    }
                },seconds)
            }
        } catch(e) {}
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.props.MasterListController.GetListCode()
        await this.props.MasterListController.GetName()
        await this.setState({
            permission,
            listCodes: this.props.getListCodeMasterlist,
            listNames: this.props.getNameMasterlist,
        })
    }
    render() {
        let dataTable = null,insertDialog = null,updateDialog = null,confirmDialog = null
        const leftContents = (this.state.permission &&
            <React.Fragment>
                {(this.state.permission.view) &&
                    <Button label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{marginRight: "15px"}} />}
            </React.Fragment>
        );
        const rightContents = (this.state.permission &&
            <React.Fragment>
                {(this.state.permission.create) &&
                    <Button label={this.props.language["insert"] || "l_insert"} style={{marginRight: "15px"}} onClick={() => this.handleDisplayDialog(true,"displayInsertDialog")} />}
            </React.Fragment>
        );
        if(this.state.datas.length > 0) { // * DATATABLE
            dataTable = <DataTable
                value={this.state.datas} resizableColumns columnResizeMode="expand"
                paginatorPosition={"both"} paginator rows={20} rowHover>
                <Column filter header="No." body={(rowData,event) => <span>{event.rowIndex + 1}</span>} style={{width: '5%',textAlign: 'center'}}></Column>
                <Column filter field="listCode" header={this.props.language["list_code"] || "l_list_code"} style={{width: '',textAlign: 'center'}}></Column>
                <Column filter field="code" header={this.props.language["code"] || "l_code"} style={{width: '',textAlign: 'center'}}></Column>
                <Column filter field="name" header={this.props.language["name"] || "l_name"} style={{width: '',textAlign: 'center'}}></Column>
                <Column filter field="nameVN" header={this.props.language["name_vn"] || "l_name_vn"} style={{width: '21%',textAlign: 'center'}}></Column>
                <Column filter field="ref_Code" header={this.props.language["ref_code"] || "l_ref_code"} style={{width: '',textAlign: 'center'}}></Column>
                <Column filter field="ref_Name" header={this.props.language["ref_name"] || "l_ref_name"} style={{width: '',textAlign: 'center'}}></Column>
                <Column filter field="imageItem" header={this.props.language["image_item"] || "l_image_item"} style={{width: '',textAlign: 'center'}}></Column>
                <Column body={this.actionButtons} header="#" style={{width: '5%',textAlign: 'center'}}></Column>
            </DataTable>
        }
        if(this.state.displayInsertDialog) { // * INSERT DIALOG
            insertDialog = <MasterDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                dialogStateName={"displayInsertDialog"}
                displayDialog={this.state.displayInsertDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleInsert}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                isLockOptions={this.isLockOptions}
                handleDisplayDialog={this.handleDisplayDialog} />
        }
        if(this.state.displayEditDialog) { // * UPDATE DIALOG
            updateDialog = <MasterDialog
                stateName={"inputValues"}
                actionName={"Update"}
                dialogStateName={"displayEditDialog"}
                displayDialog={this.state.displayEditDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleUpdate}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                isLockOptions={this.isLockOptions}
                handleDisplayDialog={this.handleDisplayDialog} />
        }
        if(this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            confirmDialog = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{width: '350px'}} footer={this.renderFooterAction("Delete",() => this.handleDisplayDialog(false,"displayConfirmDialog"),this.handleDelete)} onHide={() => this.handleDisplayDialog(false,"displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}} />
                    <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</span>
                </div>
            </Dialog>
        }
        return (
            this.state.permission.view ? (
                <React.Fragment>
                    <Toast ref={(el) => this.toast = el} />
                    {
                        this.state.isLoading && (
                            <ProgressSpinner style={this.styleSpinner} strokeWidth="8" fill="none" animationDuration=".5s" />
                        )
                    }
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["code"] || "l_code"}</label>
                                    <Dropdown value={this.state.searchByListCode} options={this.state.listCodes} onChange={(e) => this.handleChangeForm(e.value,"searchByListCode")}
                                        optionLabel="listCode" filter showClear filterBy="listCode" placeholder={this.props.language["input_list_code"] || "l_input_list_code"} />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label>{this.props.language["name"] || "l_name"}</label>
                                    <Dropdown value={this.state.searchByName} options={this.state.listNames} onChange={(e) => this.handleChangeForm(e.value,"searchByName")}
                                        optionLabel="nameVN" filter showClear filterBy="nameVN" placeholder={this.props.language["input_name"] || "l_input_name"} />
                                </div>
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {dataTable}
                    {insertDialog}
                    {updateDialog}
                    {confirmDialog}
                </React.Fragment>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        getListCodeMasterlist: state.masterList.getListCodeMasterlist,
        getNameMasterlist: state.masterList.getNameMasterlist,
        filterMasterList: state.masterList.filterMasterList,
        insertMasterList: state.masterList.insertMasterList,
        updateMasterList: state.masterList.updateMasterList,
        deleteMasterList: state.masterList.deleteMasterList,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        MasterListController: bindActionCreators(MasterListAPI,dispatch),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(MasterList);



