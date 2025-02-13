import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { LanguageAPI } from '../../store/LanguageController';
import { Button } from "primereact/button";
import { connect } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { getAccountId, download, HelpPermission } from '../../Utils/Helpler';
import { Toast } from 'primereact/toast';
import LanguageFilter from '../Language/LanguageFilter';
import LanguageDialog from '../Language/LanguageDialog';

class LanguageResources extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            displayEditDialog: false,
            displayInsertDialog: false,
            displayDeleteDialog: false,
            languagelist: [],
            statename: '',
            searchEnglish: '',
            searchReSource: '',
            searchVietNam: '',
            isloading: false,
            deletedata: [],
            event: true,
            inputValues: {},
            permission: {},
        }

        this.pageId = 35
        this._child = React.createRef();
        this.handleInput = this.handleInput.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        // Action
        this.handleLink = this.handleLink.bind(this);
        this.importFile = this.importFile.bind(this);
        this.displayActionButton = this.displayActionButton.bind(this);
        this.displayToastMessage = this.displayToastMessage.bind(this);
        // Edit
        this.handleDisplayEditDialog = this.handleDisplayEditDialog.bind(this);
        this.renderFooterEditAction = this.renderFooterEditAction.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        // Insert
        this.handleDisplayInsertDialog = this.handleDisplayInsertDialog.bind(this);
        this.renderFooterInsertAction = this.renderFooterInsertAction.bind(this);
        this.handleInsert = this.handleInsert.bind(this);
        // Delete
        this.renderFooterDeleteAction = this.renderFooterDeleteAction.bind(this);
        this.handleDisplayDeleteDialog = this.handleDisplayDeleteDialog.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }


    displayToastMessage(severity, toastMessage, actionState) {
        // 1:succeess
        // -1: failed
        let detail = ""
        if (actionState === 1) detail = "1 row affected"
        else if (actionState === -1) detail = "0 row affected"
        else detail = `Result ${actionState}`
        this.toast.show({ severity: severity, summary: toastMessage, detail: detail, life: 3000 });

    }
    Alert = (mess, style) => {
        if (style === undefined) style = 'success';
        this.toast.show({
            severity: style,
            summary: `${this.props.language['annoucement'] || 'l_annoucement'}`,
            detail: mess,
        });
    };

    // Action
    displayActionButton(rowData, event) {
        return (
            <div>
                {this.state.permission.edit && <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-mr-2" onClick={() => this.handleDisplayEditDialog('true', rowData, event.rowIndex)} />}
                {this.state.permission.delete && <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => this.handleDisplayDeleteDialog('true', rowData, event.rowIndex)} />}
            </div>
        )
    }
    async handleLink() {
        await this.props.LanguagelistController.Getlink(this.state.accId)
        await download(this.props.languagelistexport[0].fileUrl)
    }
    async importFile(e) {
        await this.props.LanguagelistController.Importfile(e.files[0], this.state.accId)
        const results = this.props.languagelistimport[0].status
        if (results === 1) {
            await this.Alert('Nhập vào thành công', 'success')
            await this._child.current.clear()
        } else {
            await this.Alert('Nhập vào thất bại', 'error')
            await this._child.current.clear()
        }
    }

    // Insert Language
    renderFooterInsertAction() {
        return (
            <div>
                <Button label={this.props.language["cancel"] || "l_cancel"} icon="pi pi-times" className="p-button-info" onClick={() => this.handleDisplayInsertDialog('false')} />
                <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-check" className="p-button-success" onClick={() => this.handleInsert()} />
            </div>
        );
    }
    async handleInsert() {
        let check = true;
        if (!this.state.inputValues.resourceName) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorResourceName: 'Required', } })
            check = false;
        } else if (!isNaN(this.state.inputValues.resourceName)) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorResourceName: 'It is not a NUMBER' } })
            check = false;
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorResourceName: '' } })

        if (!this.state.inputValues.vietNam) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorVietNam: 'Required' } })
            check = false;
        } else if (!isNaN(this.state.inputValues.vietNam)) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorVietNam: 'It is not a NUMBER' } })
            check = false;
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorVietNam: '' } })

        if (!this.state.inputValues.english) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorEnglish: 'Required', } })
            check = false;
        } else if (!isNaN(this.state.inputValues.english)) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorEnglish: 'It is not a NUMBER' } })
        }
        else await this.setState({ inputValues: { ...this.state.inputValues, errorEnglish: '' } })
        if (!check) {
            await this.Alert('Input Required', 'warn')
            return
        }
        await this.setState({ isloading: true })
        await this.props.LanguagelistController.Insertdata(
            this.state.inputValues.resourceName,
            this.state.inputValues.vietNam,
            this.state.inputValues.english,
            this.state.accId,
        )
        await this.setState({ displayInsertDialog: false })
        const result = this.props.responseInsert
        if (result && result[0] && result[0].alert === '1') {
            await this.setState({
                inputValues: {},
                languagelist: this.props.languagelist
            })
            await this.Alert('Thêm thành công', 'success')
        } else {
            await this.Alert('Thêm thất bại', 'error')
        }
        await this.setState({ isloading: false })
    }
    handleDisplayInsertDialog(boolean) {
        if (boolean === 'true') {
            this.setState({ displayInsertDialog: true })
        } else {
            this.setState({
                displayInsertDialog: false,
            })
        }
    }
    // Edit Language
    renderFooterEditAction() {
        return (
            <div>
                <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleDisplayEditDialog("false")} />
                <Button label={this.props.language["update"] || "l_update"} className="p-button-success" icon="pi pi-check" onClick={() => this.handleUpdate()} />
            </div>
        );
    }
    handleDisplayEditDialog(boolean, rowData, index) {
        if (boolean === 'true') {
            this.setState({
                displayEditDialog: true,
                inputValues: {
                    ...this.state.inputValues,
                    resourceName: rowData.resourceName,
                    vietNam: rowData.vietNam,
                    english: rowData.english,
                    idVN: rowData.idVn,
                    languageId_VN: rowData.languageId_Vn,
                    idEn: rowData.idEn,
                    languageId_En: rowData.languageId_En,
                    index: index,
                },
            })

        } else {
            this.setState({
                displayEditDialog: false,
                inputValues: {}
            })
        }

    }
    async handleUpdate() {
        await this.setState({ isloading: true })
        await this.props.LanguagelistController.Updatedata(
            this.state.inputValues.resourceName,
            this.state.inputValues.vietNam,
            this.state.inputValues.english,
            this.state.accId,
            this.state.inputValues.idVN,
            this.state.inputValues.languageId_VN,
            this.state.inputValues.idEn,
            this.state.inputValues.languageId_En,
            this.state.inputValues.index

        );
        const result = this.props.responseUpdate
        if (result && result[0] && result[0].alert === '1') {
            await this.highlightParentRow(this.state.inputValues.index)
            await this.setState({
                languagelist: this.props.languagelist,
                displayEditDialog: false,
                inputValues: {}
            })
            await this.Alert('Cập nhập thành công', 'success')
        } else {
            await this.Alert('Cập nhập thất bại', 'error')
        }
        await this.setState({ isloading: false })
    }

    // Delete Language
    renderFooterDeleteAction() {
        return (
            <div>

                <Button hidden={this.state.delete} label={this.props.language["cancel"] || "l_cancel"} className="p-button-info" icon="pi pi-times" onClick={() => this.handleDisplayDeleteDialog('false')} />
                <Button hidden={this.state.delete} label={this.props.language["delete"] || "l_delete"} className="p-button-danger" icon="pi pi-check" onClick={() => this.handleDelete()} />
            </div>
        );
    }
    async handleDelete() {
        await this.setState({ isloading: true })
        await this.props.LanguagelistController.Deletedata(
            this.state.deletedata.resourceName,
            this.state.deletedata.vietnam,
            this.state.deletedata.english,
            this.state.accId,
            this.state.deletedata.idVn,
            this.state.deletedata.languageId_Vn,
            this.state.deletedata.idEn,
            this.state.deletedata.languageId_En,
            this.state.index
        )
        const result = await this.props.responseDelete[0].result
        if (result == 1) {
            await this.setState({
                displayDeleteDialog: false,
                deletedata: {},
                languagelist: this.props.languagelist
            })
            await this.Alert('Xóa thành công', 'success')
        } else {
            await this.Alert('Xóa thất bại', 'error')
        }
        await this.setState({ isloading: false })
    }

    handleDisplayDeleteDialog(boolean, rowData, index) {
        if (boolean === 'true') {
            // this.handleDelete()
            this.setState({
                displayDeleteDialog: true,
                deletedata: rowData,
                index: index
            })

        } else {
            this.setState({
                displayDeleteDialog: false,
                deletedata: {},
            })
        }
    }

    // Inputtext Language
    handleInput(value, statename = '', id) {
        if (statename.length !== 0) {
            this.setState({
                [statename]: {
                    ...this.state[statename],
                    [id]: value == null ? '' : value,
                }
            })
        } else {
            this.setState({
                [id]: value == null ? '' : value,
            })
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
        } catch (e) {
            console.log(e)
        }
    }
    async handleSearch(Search = true) {
        await this.props.LanguagelistController.Getdatalanguage(this.state.searchEnglish, this.state.accId);
        await this.setState({ languagelist: this.props.languagelist })
        if (Search) await this.displayToastMessage("success", "Succeed", this.state.languagelist.length)
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }


    handleChangeDropdown = (id, value) => {
        this.setState({ [id]: value === null ? "" : value });

    }

    render() {

        return (

            <div>
                {(this.state.permission) !== undefined &&
                    <LanguageFilter
                        handleInput={this.handleInput}
                        handleSearch={this.handleSearch}
                        isloading={this.state.isloading}
                        handleInsertDisplay={this.handleDisplayInsertDialog}
                        handleLink={this.handleLink}
                        importFile={this.importFile}
                        clear={this._child}
                        permission={this.state.permission}
                        accId={this.state.accId}
                        handleChangeDropdown={this.handleChangeDropdown}
                    />
                }

                <LanguageDialog
                    header={'Edit Language'}
                    statename={'inputValues'}
                    inputValues={this.state.inputValues}
                    displayDialog={this.state.displayEditDialog}
                    handleInput={this.handleInput}
                    footerAction={this.renderFooterEditAction}
                    displayOnHide={this.handleDisplayEditDialog}
                />
                <LanguageDialog
                    header={'Insert Language'}
                    statename={'inputValues'}
                    inputValues={this.state.inputValues}
                    displayDialog={this.state.displayInsertDialog}
                    handleInput={this.handleInput}
                    footerAction={this.renderFooterInsertAction}
                    displayOnHide={this.handleDisplayInsertDialog}
                />
                <Dialog header={this.props.language["delete"] || "l_delete"} visible={this.state.displayDeleteDialog} style={{ width: '50vw' }} footer={this.renderFooterDeleteAction()} onHide={() => this.handleDisplayDeleteDialog('false')}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}</span>
                    </div>
                </Dialog>
                <Toast ref={(el) => this.toast = el} />
                <Card className="card">
                    <DataTable value={this.state.languagelist} paginator rowHover
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]}>
                        <Column filter field="resourceName" header={this.props.language["resource_name"] || "l_resource_name"}></Column>
                        <Column filter field="vietNam" header={this.props.language["vietnam"] || "l_vietnam"}></Column>
                        <Column filter field="english" header={this.props.language["english"] || "l_english"}></Column>
                        <Column body={this.displayActionButton} header={this.props.language["action"] || "l_action"} style={{ width: 130 }}></Column>
                    </DataTable>
                </Card>
            </div>
        )

    }
}
function mapStateToProps(state) {
    return {
        languagelist: state.languageList.languagelist,
        responseUpdate: state.languageList.responseUpdate,
        responseDelete: state.languageList.responseDelete,
        responseInsert: state.languageList.responseInsert,
        languagelistexport: state.languageList.languagelistexport,
        languagelistimport: state.languageList.languagelistimport,
        employeePermission: state.permission.employeePermission,
        language: state.languageList.language,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        LanguagelistController: bindActionCreators(LanguageAPI, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageResources);
