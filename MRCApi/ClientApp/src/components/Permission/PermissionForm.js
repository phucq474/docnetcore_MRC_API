import React, { Component } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox } from 'primereact/checkbox';
import { PermissionAPI } from "../../store/PermissionController"
import EmployeeDropDownList from "../Controls/EmployeeDropDownList"
import EmployeeTypeDropDownList from "../Controls/EmployeeTypeDropDownList"
import PermissionDialog from './PermissionDialog'
import { ProgressSpinner } from 'primereact/progressspinner';
import { getAccountId, searchIndex, HelpPermission, getEmployeeId } from '../../Utils/Helpler';
import { Toolbar } from 'primereact/toolbar';
import '../../css/highlight.css'
import Page403 from '../ErrorRoute/page403';
import Emitter from '../EventEmitter';

const login = JSON.parse(localStorage.getItem("USER"));
class PermissionForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            childrenID: {},
            specificColumn: {},
            headerColumn: {},
            allCheckBoxes: false,
            inputValues: {},
            rowData: {},
            position: 0,
            employee: 0,
            positionByAccount: getAccountId() === 10 ? "PG-SR-MER" : "PG-SR-MER-SUP",
            displayDialogInsert: false,
            displayDialogDelete: false,
            displayDialogUpdate: false,
            isFetchedParentAccountMenu: false,
            isLoading: false,
            permission: {
                create: true,
                edit: true,
                delete: true,
                view: true,
                import: true,
                export: true
            },
        }
        this.pageId = 1016;
        this.showConfirmToast = this.showConfirmToast.bind(this)
        this.handleChangeForm = this.handleChangeForm.bind(this)
    }
    /// CheckBox Action
    displayCheckBox = (rowData, type = null, stateName = "", additionState = null) => {
        return (
            <Checkbox onChange={(e) => this.onCheckBoxChange(e, type, rowData, stateName, additionState)}
                checked={rowData[stateName] ? rowData[stateName] : false} disabled={this.state.datas.length > 0 ? false : true} />
        )
    }
    onCheckBoxChange = async (event, type, rowData, stateName = "", additionState = null) => {
        await this.setState({ isLoading: true })
        let validType = await false
        switch (type) {
            case "allCheckBoxes":
                if (event.checked) {
                    await this.setState({
                        allCheckBoxes: true // itself
                    })
                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        const data = { view: true, create: true, edit: true, delete: true, export: true, import: true }
                        await Object.assign(this.state.datas[i], data)
                    }
                } else {
                    await this.setState({
                        allCheckBoxes: false,
                        headerColumn: {}
                    })
                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        const data = { view: false, create: false, edit: false, delete: false, export: false, import: false }
                        await Object.assign(this.state.datas[i], data)
                    }
                }
                break
            case "headerColumn":
                if (event.checked) {
                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        this.state.datas[i][stateName] = await true
                    }
                    this.state.headerColumn[stateName] = true // itself
                } else {
                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        this.state.datas[i][stateName] = await false
                    }
                    this.state.headerColumn[stateName] = false // itself
                }
                break
            case "parentRow":
                if (event.checked) {
                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        if (this.state.datas[i].parentId === additionState) {
                            const data = { view: true, create: true, edit: true, delete: true, export: true, import: true }
                            await Object.assign(this.state.datas[i], data)
                        }
                    }
                    this.state.specificColumn[additionState] = {
                        ...this.state.specificColumn[additionState],
                        [stateName]: true
                    }
                } else {
                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        if (this.state.datas[i].parentId === additionState) {
                            const data = await { view: false, create: false, edit: false, delete: false, export: false, import: false }
                            await Object.assign(this.state.datas[i], data)
                        }
                    }
                    this.state.specificColumn[additionState] = {
                        ...this.state.specificColumn[additionState],
                        [stateName]: false
                    }
                }
                break
            case "specificRow":
                if (event.checked) {
                    const data = { view: true, create: true, edit: true, delete: true, export: true, import: true }
                    Object.assign(this.state.datas[rowData.index], data)
                } else {
                    const data = { view: false, create: false, edit: false, delete: false, export: false, import: false }
                    Object.assign(this.state.datas[rowData.index], data)
                }
                validType = await true
                break
            case "specificColumn":
                if (event.checked) {

                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        if (this.state.datas[i].parentId === additionState) {
                            this.state.datas[i][stateName] = await true
                        }
                    }
                    this.state.specificColumn[additionState] = {
                        ...this.state.specificColumn[additionState],
                        [stateName]: true
                    }
                } else {
                    for (let i = 0, len = this.state.datas.length; i < len; i++) {
                        if (this.state.datas[i].parentId === additionState) {
                            this.state.datas[i][stateName] = await false
                        }
                    }
                    this.state.specificColumn[additionState] = {
                        ...this.state.specificColumn[additionState],
                        [stateName]: false
                    }
                }
                break
            default:
                validType = await true
        }
        if (validType) {
            switch (event.checked) {
                case true:
                    this.state.datas[rowData.index][stateName] = await true
                    break;
                case false:
                    this.state.datas[rowData.index][stateName] = await false
                    break;
                default:
                    break;
            }
        }
        await this.checkEntireCheckBoxes()
    }
    checkEntireCheckBoxes = async () => {
        const checkBoxColumns = await ["view", "create", "edit", "delete", "export", "import"]
        let dictChildren = await { view: 0, create: 0, edit: 0, delete: 0, export: 0, import: 0 }
        let dictParent = await {}
        let countParentRow = await {}
        let dictHeaderColumn = await {}
        for (let index = 0, lenData = this.state.datas.length; index < lenData; index++) {
            let countColumnAppear = await 0
            const isParent = await this.state.datas[index].parentId
            for (let column = 0, lenColumn = checkBoxColumns.length; column < lenColumn; column++) {
                /**
                 * Count countColumnAppear.
                 */
                if (this.state.datas[index][checkBoxColumns[column]]) {
                    countColumnAppear = await countColumnAppear + 1
                }
                /**
                 * Count countRowAppear.
                 */
                if (dictParent[isParent] !== undefined) {
                    if (this.state.datas[index][checkBoxColumns[column]]) {
                        let countColumn = await dictChildren[checkBoxColumns[column]] + 1
                        dictChildren = await {
                            ...dictChildren,
                            [checkBoxColumns[column]]: countColumn
                        }
                    }
                } else {
                    dictParent[isParent] = await true
                    dictChildren = await {
                        view: this.state.datas[index][checkBoxColumns[column]] ? 1 : 0,
                        create: 0, edit: 0, delete: 0, export: 0, import: 0
                    }
                }
                /**
                 * Handle specificColumn.
                 */
                if (dictChildren[checkBoxColumns[column]] === this.state.childrenID[isParent]) {
                    this.state.specificColumn[isParent] = {
                        ...this.state.specificColumn[isParent],
                        [checkBoxColumns[column]]: true
                    }
                } else {
                    this.state.specificColumn[isParent] = {
                        ...this.state.specificColumn[isParent],
                        [checkBoxColumns[column]]: false
                    }
                }
                /**
                 * Count headerColumn.
                 */
                if (dictHeaderColumn[`${isParent}:${checkBoxColumns[column]}`]) {
                    if (this.state.datas[index][checkBoxColumns[column]]) {
                        dictHeaderColumn[`${isParent}:${checkBoxColumns[column]}`] += 1
                    }
                } else {
                    if (this.state.datas[index][checkBoxColumns[column]]) {
                        dictHeaderColumn[`${isParent}:${checkBoxColumns[column]}`] = 1
                    }
                }
            }
            /**
             * Handle specificRow.
             */
            if (countColumnAppear === checkBoxColumns.length) {
                this.state.datas[index] = await {
                    ...this.state.datas[index],
                    specificRow: true
                }
                /**
                 * Count countParentRow appear.
                 */
                if (countParentRow[isParent]) {
                    countParentRow[isParent] += 1
                } else {
                    countParentRow[isParent] = 1
                }
            } else {
                this.state.datas[index] = await {
                    ...this.state.datas[index],
                    specificRow: false
                }
            }
            /**
             * Handle parentRow .
             */
            if (countParentRow[isParent] === this.state.childrenID[isParent]) {
                this.state.specificColumn[isParent] = {
                    ...this.state.specificColumn[isParent],
                    parentRow: true
                }
            } else if (countParentRow[isParent] !== this.state.childrenID[isParent]) {
                this.state.specificColumn[isParent] = {
                    ...this.state.specificColumn[isParent],
                    parentRow: false
                }
            }
        }
        /**
         * Handle headerColumn.
         */
        let totalRowEachColumn = await Object.values(this.state.childrenID).reduce((accum, current) => current + accum)
        let dictCountRowEachColumn = await {}
        let countHeaderColumn = await 0
        Object.entries(dictHeaderColumn).forEach(([key, value]) => {
            if (dictCountRowEachColumn[key.split(":")[1]]) {
                dictCountRowEachColumn[key.split(":")[1]] += value
            } else {
                dictCountRowEachColumn[key.split(":")[1]] = value
            }
            if (dictCountRowEachColumn[key.split(":")[1]] === totalRowEachColumn) {
                this.state.headerColumn[key.split(":")[1]] = true
                /**
                 * Count allCheckBoxes.
                 */
                countHeaderColumn += 1

            } else {
                this.state.headerColumn[key.split(":")[1]] = false
            }
        })
        /**
         * Handle allCheckBoxes.
         */
        if (countHeaderColumn === checkBoxColumns.length) {
            this.state.allCheckBoxes = true
        } else {
            this.state.allCheckBoxes = false
        }
        await this.setState({ isLoading: false })
    }
    /// Search
    handleSearch = async (otherAction = true) => {
        if (!otherAction) {
            if (!this.state.employee && !this.state.position) {
                await this.displayToastMessage("error", `${this.props.language["please_select_employee"] || "l_please_select_employee"}`, -1)
                return
            }
            await this.setState({ isLoading: true })
        }
        await this.setState({ datas: [] })
        if (!this.state.employee && !this.state.position) return
        await this.props.PermissionController.GetEmployeePermission(this.state.employee || 0, this.state.position || 0)
        const datas = await this.props.employeePermission.slice(0)
        await this.filterDatas(datas)
        await this.checkEntireCheckBoxes()
        if (!otherAction) {
            await this.displayToastMessage("info", "Result", datas.length)
            await this.setState({ isLoading: false })
        }
    }
    filterDatas = async (datas) => {
        await datas.sort((a, b) => a.parentId - b.parentId)
        const data2 = await []
        let childrenID = await {}
        let specificColumn = await {}
        for (let i = 0, lenDatas = datas.length; i < lenDatas; i++) {
            const isParent = datas[i].parentId
            const obj = await {
                menuId: datas[i].menuId,
                parentId: datas[i].parentId,
                menuTitle: datas[i].menuTitle,
                view: datas[i].view,
                create: datas[i].create,
                edit: datas[i].edit,
                delete: datas[i].delete,
                export: datas[i].export,
                import: datas[i].import,
                index: i,
                menuTitleVN: datas[i].menuTitleVN,
                menuTranslate: datas[i].menuTitleVN !== "#" && datas[i].menuTitleVN !== "" ? datas[i].menuTitleVN : datas[i].menuTitle,
                menuTitleParent: datas[i].menuTitleParent !== "#" && datas[i].menuTitleParent !== "" ? datas[i].menuTitleParent : datas[i].menuTitleParent,
                isParent: false,
                menuUrl: datas[i].menuUrl,
                virtualUrl: datas[i].virtualUrl,
                menuIcon: datas[i].menuIcon,
                displayOrder: datas[i].displayOrder,
                menuTitleParentVN: datas[i].menuTitleParentVN,
                menuIconParent: datas[i].menuIconParent,
                parent: datas[i].parent,
                virtualUrlParent: datas[i].virtualUrlParent,
                menuUrlParent: datas[i].menuUrlParent,
                id: datas[i].id
            }
            if (childrenID[isParent]) {
                childrenID[isParent] = await childrenID[isParent] + 1
            } else {
                childrenID[isParent] = await 1
                specificColumn[isParent] = await {
                    ...specificColumn[isParent],
                    view: false, create: false, edit: false, delete: false, export: false, import: false,
                }
            }
            if (datas[i].menuTitle === datas[i].menuTitleParent) {
                obj.isParent = await true
            }
            await data2.push(obj)
        }
        await this.setState({ datas: data2, childrenID: childrenID, specificColumn: specificColumn, headerColumn: {} })
        await this.checkEntireCheckBoxes()
    }
    /// Update Permission
    handleUpdate = async () => {
        await this.setState({ isLoading: true })
        let datas = await this.state.datas
        let newDatas = await []
        if (!this.state.employee && !this.state.position) {
            return await this.Alert('Please complete employee or position', 'error')
        }
        for (let i = 0, lenDatas = datas.length; i < lenDatas; i++) {
            let obj = {
                menuId: datas[i].menuId,
                parentId: datas[i].parentId,
                menuTitle: datas[i].menuTitle,
                menuTitleParent: datas[i].menuTitleParent,
                view: datas[i].view ? 1 : 0,
                create: datas[i].create ? 1 : 0,
                edit: datas[i].edit ? 1 : 0,
                delete: datas[i].delete ? 1 : 0,
                export: datas[i].export ? 1 : 0,
                import: datas[i].import ? 1 : 0,
                menuUrl: datas[i].menuUrl,
                virtualUrl: datas[i].virtualUrl,
                displayOrder: datas[i].displayOrder,
                menuIcon: datas[i].menuIcon,
                menuIconParent: datas[i].menuIconParent,
                menuTitleParentVN: datas[i].menuTitleParentVN,
                menuTitleVN: datas[i].menuTitleVN
            }
            await newDatas.push(obj)
        }
        await this.props.PermissionController.UpdateEmployeePermission(this.state.employee, this.state.position, newDatas)
        let response = await this.props.updatePermission
        if (response && response[0] && response[0].result === 1) {
            await this.handeEmitRenderTopMenu()
            await this.Alert(response[0].messenger, 'info')
        } else {
            await this.Alert(response[0].messenger, 'error')
        }
        await this.setState({ isLoading: false })
    }
    handleUpdateMenu = async () => {
        await this.setState({ isLoading: true })
        let { menuTitleVN, menuTitle, menuIcon, parentId, displayOrder, menuId, virtualUrl, isParentMenu, id, virtualUrl_a } = await this.state.rowData
        await this.handleValidInput("rowData").then(async (valid) => {
            if (valid) {
                const data = {
                    menuTitle: menuTitle,
                    menuTitleVN: menuTitleVN,
                    virtualUrl: virtualUrl,
                    virtualUrl_a: virtualUrl_a,
                    menuIcon: menuIcon,
                    displayOrder: displayOrder,
                    parentId: parentId,
                    menuId: menuId,
                    id: id
                }
                await this.props.PermissionController.UpdateMenu(data)
                const response = await this.props.updateMenu
                if (response && response.result === 1) {
                    await this.Alert(response.messenger, 'info')
                    await this.handleSearch()
                    await this.handeEmitRenderTopMenu()
                    await this.highlightParentRow(menuId)
                    await this.handleDialog(false, "displayDialogUpdate")
                } else {
                    await this.Alert(response.messenger, 'error')
                }
                await this.setState({ isLoading: false })
            }
        })
        await this.setState({ isLoading: false })
    }
    /// Delete
    handleDelete = async (rowData, isParentMenu) => {
        await this.setState({ isLoading: true })
        await this.props.PermissionController.DeleteMenu(rowData.id)
        let response = await this.props.deleteMenu
        if (response && response.result === 1) {
            await this.Alert(response.messenger, 'info')
            await this.handleSearch()
            await this.handeEmitRenderTopMenu()
        } else {
            await this.Alert(response.messenger, 'error')
        }
        await this.toastBC.clear()
        await this.setState({ isLoading: false })
    }
    /// Insert
    handleValidInput = async (stateName) => {
        let check = await true
        if (!this.state[stateName].menuTitle) {
            await this.setState({ [stateName]: { ...this.state[stateName], errorMenuTitle: "Input Required" } });
            check = await false
        } else {
            await this.setState({ [stateName]: { ...this.state[stateName], errorMenuTitle: "" } });
        }
        if (!this.state[stateName].virtualUrl) {
            await this.setState({ [stateName]: { ...this.state[stateName], errorMenuUrl: "Input Required" } });
            check = await false
        } else {
            await this.setState({ [stateName]: { ...this.state[stateName], errorMenuUrl: "" } });
        }
        if (this.state[stateName].displayOrder === null || this.state[stateName].displayOrder === undefined) {
            await this.setState({ [stateName]: { ...this.state[stateName], errorDisplayOrder: "Input Required" } });
            check = await false
        } else {
            await this.setState({ [stateName]: { ...this.state[stateName], errorDisplayOrder: "" } });
        }
        if (!check) return false
        else return true
    }
    handleInsert = async () => {
        await this.setState({ isLoading: true })
        const { menuTitle, virtualUrl_a, displayOrder, parentId, menuTitleVN, menuIcon, virtualUrl } = await this.state.inputValues
        await this.handleValidInput("inputValues").then(async (valid) => {
            if (valid) {
                const data = {
                    menuTitle: typeof menuTitle == 'object' ? menuTitle.menuTitle : menuTitle || null,
                    menuId: typeof menuTitle == 'object' ? menuTitle.id : null,
                    virtualUrl_a: virtualUrl_a || "#",
                    virtualUrl: virtualUrl || '#',
                    displayOrder: displayOrder || 0,
                    menuTitleVN: menuTitleVN || null,
                    menuIcon: menuIcon || null,
                    parentId: parentId || null,
                }
                await this.props.PermissionController.InsertMenu(data)
                let response = this.props.insertMenu
                await this.handleDialog(false, "displayDialogInsert")
                if (response.result === 1) {
                    await this.Alert(response.messenger, 'info')
                    await this.setState({ isFetchedParentAccountMenu: false })
                    await this.handleSearch()
                    await this.handeEmitRenderTopMenu()
                } else {
                    await this.Alert(response.messenger, 'error')
                }
            }
        })
        await this.setState({ isLoading: false })
    }
    /// Dialog Action
    renderFooterDialog = (handleFunction, stateName) => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.handleDialog(false, stateName)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={handleFunction} autoFocus />
            </div>
        );
    }
    handleDialog = async (boolean, stateName, rowData, isParentMenu = false, index = -1) => {
        if (boolean) {
            await this.setState({ isLoading: true })
            if (stateName === "displayDialogInsert") {
                if (!this.state.isFetchedParentAccountMenu) {
                    await this.props.PermissionController.GetParentAccountMenus()
                }
                await this.props.PermissionController.GetListMenus()
                await this.setState({
                    isFetchedParentAccountMenu: true,
                    inputValues: {
                        ...this.state.inputValues,
                        menuTitles: this.props.getListMenus,
                    }
                })
            }
            if (stateName === "displayDialogUpdate") {
                if (!this.state.isFetchedParentAccountMenu) {
                    await this.props.PermissionController.GetParentAccountMenus()
                }
                await this.props.PermissionController.GetAccountMenu(isParentMenu ? rowData.parentId : rowData.id)
                const data = this.props.getAccountMenu
                await this.setState({
                    isFetchedParentAccountMenu: true,
                    rowData: {
                        ...this.state.rowData,
                        parentId: data.parentId,
                        parentId: data && data[0] ? data[0].parentId : null,
                        menuTitle: data && data[0] ? data[0].menuTitle : null,
                        menuTitleVN: data && data[0] ? data[0].menuTitleVN : null,
                        virtualUrl_a: data && data[0] ? data[0].virtualUrl_a : null,
                        virtualUrl: data && data[0] ? data[0].virtualUrl : null,
                        menuIcon: data && data[0] ? data[0].menuIcon : null,
                        id: data && data[0] ? data[0].id : null,
                        isParentMenu: isParentMenu,
                        index: index,
                        menuId: data && data[0] ? data[0].menuId : 0,
                        displayOrder: data && data[0] ? data[0].displayOrder : 0
                    },
                })
            }
            if (stateName === "displayDialogDelete") {
                await console.log(isParentMenu)
                await this.setState({ rowData: rowData, isParentMenu: isParentMenu })
            }
            await this.setState({ [stateName]: true, isLoading: false })
        } else {
            this.setState({ [stateName]: false, rowData: {}, inputValues: {}, isLoading: false })
        }
    }
    /// Handle change
    async handleChangeForm(value, stateName, subStateName = null, subStateName_2 = null, subStateName_3 = null) {
        if (subStateName === null) {
            await this.setState({ [stateName]: value });
        } else {
            if (typeof value === "object") {
                if (subStateName === "menuTitle" && value !== null) {
                    this.state[stateName].virtualUrl = await value.virtualUrl
                    this.state[stateName].menuIcon = await value.menuIcon
                    this.state[stateName].virtualUrl_a = await value.virtualUrl
                    this.state[stateName].displayOrder = await value.displayOrder
                }
                if (subStateName === "menuTitle" && value === null) {
                    await this.setState({
                        [stateName]: { ...this.state[stateName], virtualUrl: "" }
                    })
                }
                await this.setState({
                    [stateName]: {
                        ...this.state[stateName],
                        [subStateName]: value,
                        [subStateName_2]: subStateName_2 !== null && value !== null ? (this.props.getListMenus[searchIndex(this.props.getListMenus, value)].menuUrl !== undefined ?
                            this.props.getListMenus[searchIndex(this.props.getListMenus, value)].menuUrl : "") : "",
                        [subStateName_3]: subStateName_3 !== null && value !== null ? (this.props.getListMenus[searchIndex(this.props.getListMenus, value)].displayOrder !== undefined ?
                            this.props.getListMenus[searchIndex(this.props.getListMenus, value)].displayOrder : "") : "",
                    }
                });
            } else {
                await this.setState({
                    [stateName]: {
                        ...this.state[stateName],
                        [subStateName]: value,
                    }
                });
            }

        }
    }
    handleChange = async (id, value) => {
        this.setState({
            [id]: value === null ? "" : value,

            datas: [],
            childrenID: {},
            specificColumn: {},
            headerColumn: {},
            allCheckBoxes: false,
        });
        if (id === 'position' || id === 'supId') this.setState({ employee: 0 });
    }
    handeEmitRenderTopMenu = () => {
        sessionStorage.removeItem("permission")
        Emitter.emit("update_top_menu", null);
    }
    /// Toast Acion
    async showConfirmToast(rowData, isParent) {
        if (this.toastBC.state.messages.length === 0) {
            await this.setState({ rowData: rowData })
            await this.toastBC.show({
                severity: 'warn', sticky: true, content: (
                    <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                        <div className="p-text-center">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                            <p>Confirm to delete?</p>
                        </div>
                        <div className="p-grid p-fluid">
                            <div className="p-col-6">
                                <Button label="Yes" onClick={() => {
                                    this.handleDelete(rowData, isParent)
                                    this.toastBC.clear();
                                }} className="p-button-success" />
                            </div>
                            <div className="p-col-6">
                                <Button label="No" onClick={() => {
                                    this.setState({ rowData: {} })
                                    this.toastBC.clear();
                                }} className="p-button-secondary" />
                            </div>
                        </div>
                    </div>
                )
            });
        }
    }
    highlightParentRow = async (menuId) => {
        try {
            const seconds = await 3000, outstanding = await "highlightText"
            let rowUpdated = await document.querySelector(`.id_${menuId}`)
            if (rowUpdated && !rowUpdated.classList.contains(outstanding)) {
                rowUpdated.classList.add(outstanding)
                setTimeout(() => {
                    if (rowUpdated.classList.contains(outstanding)) {
                        rowUpdated.classList.remove(outstanding)
                    }
                }, seconds)
            }
        } catch (e) { }
    }
    displayToastMessage = (severity, toastMessage, actionState, isDeleteParent = false) => {
        let detail = ""
        if (isDeleteParent) detail = `${actionState} rows affected`
        else if (actionState === 1) detail = "1 row affected"
        else if (actionState === -1) detail = "0 row affected"
        else detail = `Result ${actionState}`
        this.toast.show({ severity: severity, summary: toastMessage, detail: detail, life: 4000 });
    }
    Alert = (mess, style) => {
        if (style === undefined) style = 'success';
        this.toast.show({
            severity: style,
            summary: `${this.props.language['annoucement'] || 'l_annoucement'}`,
            detail: mess,
        });
    };
    /// render Action
    displayTitle = (rowData) => {
        return (
            <span className={`id_${rowData.menuID}`}>
                <i className={`${rowData.isParent ? rowData.menuIconParent : rowData.iconChild}`}></i>
                {"   " + rowData.menuTranslate}
            </span>
        )
    }
    displayHeaderTable = (header, columnName) => {
        return (
            <div className="p-grid p-dir-col">
                <div className="p-col">{header}</div>
                <div className="p-col">{this.displayCheckBox(this.state.headerColumn, "headerColumn", columnName)}</div>
            </div>
        )
    }
    actionButtons = (rowData, event) => {
        return (
            <div>
                {(this.state.permission.edit || login.isSysAdmin) &&
                    <Button icon="pi pi-pencil" onClick={() => this.handleDialog(true, "displayDialogUpdate", rowData, rowData.isParent, event.rowIndex)}
                        className={`p-button-rounded btn__hover ${!rowData.isParent ? 'p-button-outlined' : ''} p-button-info p-mr-2 p-mb-2`} />}
                {(this.state.permission.delete || login.isSysAdmin) &&
                    <Button icon="pi pi-trash" onClick={() => this.showConfirmToast(rowData, event.rowIndex)}
                        className={`p-button-rounded btn__hover ${!rowData.isParent ? 'p-button-outlined' : ''} p-button-danger p-mr-2 p-mb-2`} />}
            </div>
        )
    }
    // async componentWillMount() {
    //     let permission = await HelpPermission(this.pageId);
    //     await this.setState({permission})
    // }
    render() {
        let dataTable = null, insertDialog = null, updateDialog = null, confirmDialog = null
        const leftContents = (
            <React.Fragment>
                {((this.state.permission && this.state.permission.view) || login.isSysAdmin) && <Button label={this.props.language["search"] || "l_search"} icon="pi pi-search" onClick={() => this.handleSearch(false)} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {((this.state.permission && this.state.permission.edit) || login.isSysAdmin) && <Button label={this.props.language["save"] || "l_save"} icon="pi pi-save" onClick={this.handleUpdate} style={{ marginRight: "15px" }} />}
                {((this.state.permission && this.state.permission.create) || login.isSysAdmin) && <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleDialog(true, "displayDialogInsert")} style={{ marginRight: "15px" }} />}
            </React.Fragment>
        );
        if (this.state.datas.length > 0) { // * DATATABLE
            dataTable = <DataTable value={this.state.datas} rowGroupMode="subheader"
                groupField="menuTitleParent"
                rowGroupHeaderTemplate={(rowData) => {
                    const isParent = rowData.parentId !== null ? rowData.parentId : rowData.menuId
                    return (
                        rowData.parentId && !rowData.parent ? (

                            <div className="p-grid" style={{ width: "inherit", paddingTop: "1.5%" }}>
                                <div style={{ width: "5.7%", textAlign: 'center' }}>{this.displayCheckBox(this.state.specificColumn[isParent], "parentRow", "parentRow", isParent)}</div>
                                <div style={{ width: '46.4%', height: 'inherit', paddingLeft: "1%", color: "coral", fontWeight: 700 }}>
                                    <i className={rowData.menuIconParent}></i>{"   " + rowData.menuTitleParentVN}
                                </div>
                                <div style={{ width: "6%", textAlign: 'center' }}>{this.displayCheckBox(this.state.specificColumn[isParent], "specificColumn", "view", isParent)}</div>
                                <div style={{ width: "6%", textAlign: 'center' }}>{this.displayCheckBox(this.state.specificColumn[isParent], "specificColumn", "create", isParent)}</div>
                                <div style={{ width: "6%", textAlign: 'center' }}>{this.displayCheckBox(this.state.specificColumn[isParent], "specificColumn", "edit", isParent)}</div>
                                <div style={{ width: "6%", textAlign: 'center' }}>{this.displayCheckBox(this.state.specificColumn[isParent], "specificColumn", "delete", isParent)}</div>
                                <div style={{ width: "6%", textAlign: 'center' }}>{this.displayCheckBox(this.state.specificColumn[isParent], "specificColumn", "export", isParent)}</div>
                                <div style={{ width: "6%", textAlign: 'center' }}>{this.displayCheckBox(this.state.specificColumn[isParent], "specificColumn", "import", isParent)}</div>

                                <div style={{ width: "11.9%", textAlign: 'center' }}>
                                    <Button icon="pi pi-pencil" onClick={async () => {
                                        rowData.menuId = await rowData.parentId
                                        await this.handleDialog(true, "displayDialogUpdate", rowData, true)
                                    }} className="p-button-rounded p-button-info p-mr-2" />
                                    <Button icon="pi pi-trash" onClick={async () => {
                                        rowData.menuId = await rowData.parentId
                                        await this.showConfirmToast(rowData, true)
                                    }} className="p-button-rounded p-button-danger" />
                                </div>
                            </div >
                        ) : (
                            <div className="p-grid" style={{ width: "inherit", paddingTop: "1.5%" }}>
                                <div style={{ width: "5.7%", textAlign: 'center' }}></div>
                                <div style={{ width: '46.4%', height: 'inherit', paddingLeft: "1%", color: "coral", fontWeight: 700 }}>
                                    <i className={rowData.menuIconParent}></i>{"   " + rowData.menuTitleParent}
                                </div>
                            </div >
                        )
                    )
                }}
                rowGroupFooterTemplate={() => <div></div>}>
                <Column field="select" body={(rowData) => this.displayCheckBox(rowData, "specificRow", "specificRow")} header={this.displayCheckBox({ "allCheckBoxes": this.state.allCheckBoxes }, "allCheckBoxes", "allCheckBoxes")} style={{ width: '6%', textAlign: 'center' }}></Column>
                <Column field="menuTranslate" style={{ width: '46%' }} header="Menu" body={this.displayTitle} ></Column>
                <Column field="view" header={this.displayHeaderTable("View", "view")} body={(rowData) => this.displayCheckBox(rowData, null, "view")} style={{ width: '6%', textAlign: 'center' }}></Column>
                <Column field="create" header={this.displayHeaderTable("Create", "create")} body={(rowData) => this.displayCheckBox(rowData, null, "create")} style={{ width: '6%', textAlign: 'center' }}></Column>
                <Column field="edit" header={this.displayHeaderTable("Edit", "edit")} body={(rowData) => this.displayCheckBox(rowData, null, "edit")} style={{ width: '6%', textAlign: 'center' }}></Column>
                <Column field="delete" header={this.displayHeaderTable("Delete", "delete")} body={(rowData) => this.displayCheckBox(rowData, null, "delete")} style={{ width: '6%', textAlign: 'center' }}></Column>
                <Column field="export" header={this.displayHeaderTable("Export", "export")} body={(rowData) => this.displayCheckBox(rowData, null, "export")} style={{ width: '6%', textAlign: 'center' }}></Column>
                <Column field="import" header={this.displayHeaderTable("Import", "import")} body={(rowData) => this.displayCheckBox(rowData, null, "import")} style={{ width: '6%', textAlign: 'center' }}></Column>
                <Column body={this.actionButtons} header="#" style={{ width: "12%", textAlign: 'center' }}></Column>
            </DataTable>
        }
        if (this.state.displayDialogInsert) {  // * INSERT DIALOG
            insertDialog = <PermissionDialog
                header={"Insert Form"}
                handleChangeForm={this.handleChangeForm}
                displayDialogStateName={"displayDialogInsert"}
                inputValues={this.state.inputValues}
                dialogState={this.state.displayDialogInsert}
                renderFooterDialog={this.renderFooterDialog}
                handleAction={this.handleInsert}
                handleDialog={this.handleDialog}
                stateName={"inputValues"}
                valueStates={this.state.inputValues}
            />
        }
        if (this.state.displayDialogUpdate) { // * UPDATE DIALOG
            updateDialog = <PermissionDialog
                header={"Update Form"}
                handleChangeForm={this.handleChangeForm}
                displayDialogStateName={"displayDialogUpdate"}
                dialogState={this.state.displayDialogUpdate}
                renderFooterDialog={this.renderFooterDialog}
                handleAction={this.handleUpdateMenu}
                handleDialog={this.handleDialog}
                stateName={"rowData"}
                valueStates={this.state.rowData}
            />
        }
        if (this.state.displayDialogDelete) { // * CONFIRM DIALOG
            confirmDialog = <Dialog header="Confirmation" visible={this.state.displayDialogDelete} modal
                style={{ width: '350px' }} footer={this.renderFooterDialog(this.handleDelete(), "displayDialogDelete")}
                onHide={() => this.handleDialog(false, "displayDialogDelete")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</span>
                </div>
            </Dialog>
        }
        return (
            (this.state.permission.view || login.isSysAdmin) ? (
                <React.Fragment>
                    <Toast ref={(el) => this.toast = el} />
                    <Toast ref={(el) => this.toastBC = el} position="center" />
                    {this.state.isLoading &&
                        <div className="loading_container">
                            <ProgressSpinner className="loading_spinner" strokeWidth="8" fill="none" animationDuration=".5s" />
                        </div>
                    }
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-4">
                                    <label htmlFor="basic">Position</label>
                                    <EmployeeTypeDropDownList
                                        id="position"
                                        type={""}
                                        onChange={this.handleChange}
                                        value={this.state.position}
                                    />
                                </div>
                                <div className="p-field p-col-12 p-md-4">
                                    <label htmlFor="basic">Employee</label>
                                    <EmployeeDropDownList
                                        type={this.state.positionByAccount}
                                        id="employee" mode="single"
                                        typeId={this.state.position}
                                        parentId={0}
                                        onChange={this.handleChange}
                                        value={this.state.employee}
                                    />
                                </div>
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {dataTable}
                    {insertDialog}
                    {updateDialog}
                    {confirmDialog}
                </React.Fragment >
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        )
    }
}
function mapStateToProps(state) {
    return {
        employeePermission: state.permission.employeePermission,
        updatePermission: state.permission.updatePermission,
        getParentAccountMenus: state.permission.getParentAccountMenus,
        getListMenus: state.permission.getListMenus,
        filterAccountMenu: state.permission.filterAccountMenu,
        insertMenu: state.permission.insertMenu,
        deleteMenu: state.permission.deleteMenu,
        updateMenu: state.permission.updateMenu,
        language: state.languageList.language,
        getAccountMenu: state.permission.getAccountMenu,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        PermissionController: bindActionCreators(PermissionAPI, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PermissionForm);

