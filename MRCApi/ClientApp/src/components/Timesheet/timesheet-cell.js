import React, { Component } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
// import { SelectButton } from 'primereact/selectbutton';
// import ShiftDropDownList from '../Controls/ShiftDropDownList';
import { connect } from 'react-redux';
import { Button } from "primereact/button";
import { ProgressSpinner } from 'primereact/progressspinner';
import { bindActionCreators } from "redux";
import { actionCreatorsTimesheet } from '../../store/TimesheetController';
// import { ShiftListsActionCreate } from '../../store/ShiftListsController';
import PhotoGalary from '../Controls/PhotoGalary';
import { getToken, URL, getAccountId } from "../../Utils/Helpler";
import { FileUpload } from 'primereact/fileupload';
import { PhotoCreateAction } from '../../store/PhotoController';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import moment from 'moment';
const lstOT = [
    { value: 0, name: '0' },
    { value: 1, name: '1' },
    { value: 1.5, name: '1.5' },
    { value: 2, name: '2' },
    { value: 2.5, name: '2.5' },
    { value: 3, name: '3' },
    { value: 3.5, name: '3.5' },
    { value: 4, name: '4' },
    { value: 4.5, name: '4.5' },
    { value: 5, name: '5' },
    { value: 5.5, name: '5.5' },
    { value: 6, name: '6' },
    { value: 6.5, name: '6.5' },
    { value: 7, name: '7' },
    { value: 7.5, name: '7.5' },
    { value: 8, name: '8' },
    { value: 8.5, name: '8.5' },
    { value: 9, name: '9' },
    { value: 9.5, name: '9.5' },
    { value: 10, name: '10' },
    { value: 10.5, name: '10.5' },
    { value: 11, name: '11' },
    { value: 11.5, name: '11.5' },
    { value: 12, name: '12' }
]
const lstConfirm = [
    { value: 1, name: 'Confirm công' },
    { value: 0, name: 'Reject' },
]
const user = JSON.parse(localStorage.getItem("USER"));

class TimesheetCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            note: null,
            shift: null,
            ot: null,
            otpg: null,
            confirmed: null,
            loading: true,
            photos: [],
            showBNTUnlock: true,
            shiftLists: null,
            details: []

        }
        this._child = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.hanldeBindData = this.hanldeBindData.bind(this);
        this.hanldeBindPhoto = this.hanldeBindPhoto.bind(this);
        this.hanldeSave = this.hanldeSave.bind(this);
        this.handleSendNotify = this.handleSendNotify.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
    }
    showError(value) {
        this.toast.show({ life: 5000, severity: 'error', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: value });
    }
    handleChange(id, value) {
        this.setState({ [id]: value });
    }
    handleChangeForm(e) {
        this.setState({ [e.target.id]: e.target.value });
    }
    hanldeSave() {
        if (this.state.note === null || this.state.note === undefined) {
            this.showError(`${this.props.language["please_input_note"] || "l_please_input_note"}`);
            return;
        }
        else if (this.state.note.trim().length < 2) {
            this.showError(`${this.props.language["note_must_be_longer_than_2"] || "l_note_must_be_longer_than_2"}`);
            return;
        }
        else {
            let data = {};
            if (getAccountId() === 1006) {
                if (this.state.shift === undefined || this.state.shift === null) {
                    this.showError("Vui lòng chọn Ca làm việc");
                    return;
                }
                else {
                    data = {
                        employeeId: this.props.data.employeeId,
                        workDate: this.props.workDate,
                        shift: this.state.shift,
                        totalTime: this.state.totalTime,
                        confirmed: this.state.shift === "0" ? 0 : 1,
                        ot: this.state.ot,
                        otpg: this.state.otpg,
                        note: this.state.note,
                        type: 'SUP'
                    }
                }
            }
            else {
                if (this.state.shift === undefined || this.state.shift === null) {
                    this.showError("Vui lòng chọn Ca làm việc");
                    return;
                }
                else {
                    data = {
                        employeeId: this.props.data.employeeId,
                        workDate: this.props.workDate,
                        shift: this.state.shift,
                        totalTime: this.state.totalTime,
                        confirmed: this.state.shift === "O" ? 0 : 1,
                        ot: this.state.ot,
                        otpg: this.state.otpg,
                        note: this.state.note,
                        type: 'SUP'
                    }
                }
            }
            this.Confirm(JSON.stringify(data));
        }
    }
    handleSendNotify() {
        // this.showSuccess("Test");
        let data = {
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate
        }
        this.props.TimesheetController.SendNotify(data)
            .then(() => {
                if (this.props.result.result === 1) {
                    this.props.parentMethod();
                    //this.showSuccess("Gửi thông  báo thành công");
                }
                else {
                    this.showError(this.props.result.messenger);
                }
            });
    }
    hanldeBindData() {
        this.setState({
            data: this.props.data,
            workDate: this.props.workDate
        });
        if (this.props.data.employeeId > 0 && this.props.workDate > 0) {
            let data = {
                employeeId: this.props.data.employeeId,
                shopId: 0,
                workDate: this.props.workDate
            }
            this.props.TimesheetController.GetDetail(data)
                .then(() => {
                    this.setState({
                        loading: false,
                        shift: this.props.details[0].shift ? this.props.details[0].shift : this.props.details[0].shiftType !== undefined ? this.props.details[0].shiftType : null,
                        totalTime: this.props.details[0].totalTime,
                        confirmed: this.props.details[0].confirmed,
                        ot: this.props.details[0].ot_default && this.props.details[0].ot == null ? this.props.details[0].ot_default : this.props.details[0].ot,
                        otpg: this.props.details[0].otpg,
                        note: this.props.details[0].timeSheetNote,
                        dataInput: data,
                        details: this.props.details[0]
                    })
                });
            this.hanldeBindPhoto();
        }
        //console.log(this.state)
    }
    async hanldeBindPhoto() {
        if (this.props.data.employeeId > 0 && this.props.workDate > 0) {
            let data = {
                employeeId: this.props.data.employeeId,
                shopId: 0,
                workDate: this.props.workDate
            }
            await this.props.PhotoController.GetPhotoByShop(data)
            const list = await this.props.list;
            let photos = await list.filter(item => item.photoType === "ISSUE_FILE");
            await this.setState({ photos: photos })
        }

    }
    uploadFileImage = (e) => {
        if (e.files === null && e.files.length === 0) {
            this.showError(`${this.props.language["please_select_image_to_upload"] || "l_please_select_image_to_upload"}`);
            return;
        }
        this.setState({ photos: [] });
        const data = {
            shopId: 0,
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate,
            files: e.files,
            photoType: "ISSUE_FILE"
        }
        this.props.TimesheetController.TimeSheetDeleteImage(data)
        this.props.TimesheetController.UploadFiles(data).then(() => {
            if (this.props.result.result === 1) {
                this.hanldeBindPhoto();
                this.showSuccess(`${this.props.language["upload_successful"] || "l_upload_successful"}`);
                this._child.current.clear();
            }
            else {
                this.showError(this.props.messenger);
            }
        });
    }
    async componentDidMount() {
        // if (this.state.shiftLists === null) {
        //     await this.props.ShiftListsController.SL_GetShift_TS();
        //     const result = await this.props.shiftList_TS;
        //     if (result?.status === 200) {
        //         this.setState({ shiftLists: result?.data })
        //     }
        // }
        this.hanldeBindData();
    }

    async Confirm(data) {
        const url = URL + 'Timesheet/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: data
        };

        try {
            const request = new Request(url, requestOptions);
            const response = await fetch(request);
            const result = await response.json();
            if (response.status === 200)
                if (result.result === 1) {
                    this.showSuccess(`${this.props.language["save_successful"] || "l_save_successful"}`);
                }
                else {
                    this.showError(result.messenger)
                }
        }
        catch (error) {
            this.showError("Error")
        }
    }

    dateTemplate = (rowData) => {
        let timeShift = [];
        if (rowData.Shift !== null) {
            timeShift.push(<br></br>);
            timeShift.push(<label>{rowData.ShiftName}</label>);
        }
        return (
            <div>
                <label>{rowData.Date}</label>
                <br></br>
                {timeShift}
            </div>
        );
    }
    showTotalTime = (rowData) => {
        return (
            <div>
                {rowData.TimeInStore !== null && rowData.TimeInStore !== undefined
                    ? rowData.TimeInStore
                    : ""}
            </div>
        );
    };
    showTotal = (rowData) => {
        return (
            <div>
                <strong style={{ fontSize: 15 }}>
                    {rowData.Total !== null && rowData.Total !== undefined
                        ? rowData.Total
                        : ""}
                </strong>
                <br />
                <strong style={{ fontSize: 15 }}>
                    {rowData.TotalInStore !== null && rowData.TotalInStore !== undefined
                        ? rowData.TotalInStore
                        : ""}
                </strong>
            </div>
        );
    };
    showTimeLate = (rowData) => {
        if (rowData.TimeLate)
            return (
                <div>
                    <strong>{rowData.TimeLate} phút</strong>
                    <br></br>
                    <label>{rowData.NoteLate}</label>
                </div>
            );
        else return null;
    };
    showTimeEarlier = (rowData) => {
        if (rowData.TimeEarlier)
            return (
                <div>
                    <strong>{rowData.TimeEarlier} phút</strong>
                    <br></br>
                    <label>{rowData.NoteEarlier}</label>
                </div>
            );
        else return null;
    };
    shopNameTemplate = (rowData) => {
        return (
            <div style={{ textAlign: "center" }}>
                <strong>{rowData.ShopCode}</strong> <br></br>
                <strong>{rowData.ShopName} </strong> <br></br>
                <label>{rowData.Address} </label> <br></br>
            </div>
        );
    }
    imageTemplate = (rowData) => {
        let checkIn = null,
            checkOut = null;
        if (rowData.CheckIn !== null && rowData.CheckIn !== undefined) {
            checkIn = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoIn}
                            alt="Check In"
                            width="60"
                        />
                    </div>
                </div>
            );
        } else if (
            rowData.CheckOut !== null &&
            rowData.CheckIn === null &&
            rowData.CheckOut !== undefined
        ) {
            checkIn = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn}
                        />
                    </div>
                    <div>
                        <img src="/images/no_in.png" alt="Check In" width="60" />
                    </div>
                </div>
            );
        }
        if (rowData.CheckOut !== null && rowData.CheckOut !== undefined) {
            checkOut = (
                <div style={{ paddingLeft: "10px" }}>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteOut || ""}
                            label={rowData.CheckOut}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoOut}
                            alt="Check Out"
                            width="60"
                        />
                    </div>
                </div>
            );
        }
        return (
            <div
                onClick={() => this.setState({ showImage: true, rowSelected: rowData })}
                style={{ display: "inline-flex", float: "left" }}
            >
                {checkIn}
                {checkOut}
            </div>
        );
    }

    imageTemplate2 = (rowData) => {
        let checkIn2 = null,
            checkOut2 = null;
        if (rowData.CheckIn2 !== null && rowData.CheckIn2 !== undefined) {
            checkIn2 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn2}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoIn2}
                            alt="Check In"
                            width="60"
                        />
                    </div>
                </div>
            );
        } else if (
            rowData.CheckOut2 !== null &&
            rowData.CheckIn2 === null &&
            rowData.CheckOut2 !== undefined
        ) {
            checkIn2 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn2}
                        />
                    </div>
                    <div>
                        <img src="/images/no_in.png" alt="Check In" width="60" />
                    </div>
                </div>
            );
        }
        if (rowData.CheckOut2 !== null && rowData.CheckOut2 !== undefined) {
            checkOut2 = (
                <div style={{ paddingLeft: "10px" }}>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteOut || ""}
                            label={rowData.CheckOut2}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoOut2}
                            alt="Check Out"
                            width="60"
                        />
                    </div>
                </div>
            );
        }
        return (
            <div
                onClick={() => this.setState({ showImage: true, rowSelected: rowData })}
                style={{ display: "inline-flex", float: "left" }}
            >
                {checkIn2}
                {checkOut2}
            </div>
        );
    }

    imageTemplate3 = (rowData) => {
        let checkIn3 = null,
            checkOut3 = null;
        if (rowData.CheckIn3 !== null && rowData.CheckIn3 !== undefined) {
            checkIn3 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn3}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoIn3}
                            alt="Check In"
                            width="60"
                        />
                    </div>
                </div>
            );
        } else if (
            rowData.CheckOut3 !== null &&
            rowData.CheckIn3 === null &&
            rowData.CheckOut3 !== undefined
        ) {
            checkIn3 = (
                <div>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteIn}
                            label={rowData.CheckIn3}
                        />
                    </div>
                    <div>
                        <img src="/images/no_in.png" alt="Check In" width="60" />
                    </div>
                </div>
            );
        }
        if (rowData.CheckOut3 !== null && rowData.CheckOut3 !== undefined) {
            checkOut3 = (
                <div style={{ paddingLeft: "10px" }}>
                    <div>
                        <Button
                            style={{ padding: "0px 8px", fontWeight: 700 }}
                            // tooltip={rowData.noteOut || ""}
                            label={rowData.CheckOut3}
                        />
                    </div>
                    <div>
                        <img
                            src={rowData.PhotoOut3}
                            alt="Check Out"
                            width="60"
                        />
                    </div>
                </div>
            );
        }
        return (
            <div
                onClick={() => this.setState({ showImage: true, rowSelected: rowData })}
                style={{ display: "inline-flex", float: "left" }}
            >
                {checkIn3}
                {checkOut3}
            </div>
        );
    }

    renderActual = () => {
        let data = this.state.details;
        if (data !== null && data.actual !== null) {
            const items = JSON.parse(data.actual);
            return (
                <DataTable
                    value={items}
                    scrollable
                    scrollHeight="380px"
                    rowHover
                    rowGroupMode="rowspan"
                    groupField="Total"
                    sortField="Total"
                    style={{ fontSize: "13px", marginTop: "10px" }}
                    dataKey="rowNum"
                >
                    <Column field="RowNum" style={{ width: "50px" }} header="STT" />
                    <Column
                        field="ShopName"
                        body={this.shopNameTemplate}
                        header={this.props.language["storelist_shopname"] || "storelist_shopname"}
                        style={{ textAlign: "center" }}
                    />
                    <Column
                        body={this.dateTemplate}
                        header={this.props.language["shift"] || "shift"}
                        style={{ width: "10%", textAlign: "center" }}
                    />
                    <Column
                        body={this.imageTemplate}
                        header={this.props.language["check_in_out"] || "l_check_in_out"}
                        style={{ width: '10%', textAlign: "center" }}
                    />
                    <Column
                        body={this.imageTemplate2}
                        header={this.props.language["check_in_out2"] || "l_check_in_out2"}
                        style={{ width: '10%', textAlign: "center" }}
                    />
                    <Column
                        body={this.imageTemplate3}
                        header={this.props.language["check_in_out3"] || "l_check_in_out3"}
                        style={{ width: '10%', textAlign: "center" }}
                    />
                    <Column
                        field="TimeInStore"
                        body={this.showTotalTime}
                        header={this.props.language["time_in_store"] || "time_in_store"}
                        style={{ width: "10%", textAlign: "center" }}
                    />
                    <Column
                        field="Total"
                        body={this.showTotal}
                        header={this.props.language["total_day"] || "total_day"}
                        style={{ width: "10%", textAlign: "center" }}
                    />
                </DataTable>
            );
        } else return <strong>Không có dữ liệu</strong>;
    }

    imageTemplateLog = () => {
        let imageList = []
        if (this.props.details.length > 0) {
            let data = JSON.parse(this.state.details.logDetail ? this.state.details.logDetail : null)
            if (data !== null) {
                data.forEach(e => {
                    imageList.push(<div >
                        <a href={e.PhotoPath ? e.PhotoPath : null} target="_blank">{e.PhotoType ? e.PhotoType : null}</a>
                    </div>)
                })
            }
        }
        return (
            <div>
                {imageList}
            </div>

        );
    }

    renderDetail() {
        const data = this.state.details;
        let actual = this.renderActual();
        let timesheets = null;
        if (data !== null && data.timesheets !== null) {
            timesheets = JSON.parse(data.timesheets);
        }

        return (
            <Accordion multiple activeIndex={[0, 1]} style={{ width: "100%" }}>
                <AccordionTab header="Chấm công">
                    {actual}
                </AccordionTab>
                <AccordionTab header="Xác nhận công">
                    <DataTable value={timesheets} responsiveLayout="scroll">
                        <Column field="SubmitTime" header="Thời điểm đề xuất" headerStyle={{ textAlign: 'center', backgroundColor: '#9BC2E6', width: '10%', color: 'black' }} bodyStyle={{ textAlign: 'center' }}> </Column>
                        <Column field="SubmitNote" header="Ghi chú đề xuất" headerStyle={{ textAlign: 'center', backgroundColor: '#9BC2E6', color: 'black' }}></Column>
                        <Column field="ConfirmTime" header="Thời điểm xác nhận" headerStyle={{ textAlign: 'center', backgroundColor: '#FFE699', width: '10%', color: 'black' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="ConfirmBy" header="Người xác nhận" headerStyle={{ textAlign: 'center', backgroundColor: '#FFE699', width: '15%', color: 'black' }}></Column>
                        <Column field="ConfirmNote" header="Ghi chú xác nhận" headerStyle={{ textAlign: 'center', backgroundColor: '#FFE699', color: 'black' }}></Column>
                        <Column field="Confirm" header="Trạng thái xác nhận" headerStyle={{ textAlign: 'center', backgroundColor: '#FFE699', width: '10%', color: 'black' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        <Column field="StatusName" header="Trạng thái thực tế" headerStyle={{ textAlign: 'center', backgroundColor: '#A9D08E', width: '10%', color: 'black' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        {user?.isAdmin && <Column header="#" style={{ textAlign: 'center', width: '4%' }} body={this.templateLock}  ></Column>}
                    </DataTable>
                </AccordionTab>
            </Accordion>
        );
    }
    renderPhoto() {
        const data = {
            shopId: 0,
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate,
        }
        if (this.state.photos.length > 0)
            return <PhotoGalary
                dataInput={data}
                photoType='ISSUE_FILE'
                listPhoto={this.state.photos}
                handleDeleteImageIssue={this.handleDeleteImageIssue}
            />
    }
    handleDeleteImageIssue = async (item) => {
        if (item !== null && item !== undefined && getAccountId() === 1006) {
            if (item.photoType === "ISSUE_FILE") {
                await this.setState({ loading: true })
                await this.props.PhotoController.DeletePhoto(item.photoID)
                await this.setState({ loading: false })
            }
        }

    }
    handleUnLock = async () => {
        let data = {
            employeeId: this.props.data.employeeId,
            workDate: this.props.workDate
        }
        await this.props.TimesheetController.UnLock(data);
        const result = await this.props.unLock;
        if (result.status === 200) {
            await this.showSuccess(result.message);
            await this.hanldeBindData();
        }
        else {
            this.showError(result.message);
        }
    }

    accept = () => {
        this.handleUnLock();
    }

    reject = () => {
        this.toast.show({ severity: 'warn', summary: 'Cancel', detail: 'You have cancel', life: 1000 });
    }

    popupUnlock = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Bạn có muốn mở khóa thêm 1 ngày?',
            icon: 'pi pi-key',
            accept: this.accept,
            reject: this.reject
        });
    }


    templateLock = (rowData) => {
        if (rowData.StatusId === 5) {
            return (
                <Button onClick={this.popupUnlock} icon="pi pi-lock-open" className="p-button-danger p-button-outlined"></Button>
            )
        }
        else {
            return (<></>)
        }
    }


    render() {
        if (this.state.loading) {
            return (
                <Dialog header='Loading...'
                    visible
                    style={{ width: '80vw' }}
                    modal={true}
                    onHide={this.props.parentMethod}>
                    <ProgressSpinner style={{ height: '50px', width: '100%' }} />
                </Dialog>
            );
        }

        const result = this.state.details;
        let details = this.renderDetail();
        let footer = [];
        if (result) {
            // if ((result?.lock > 0 && user.isSysAdmin === true && this.state.showBNTUnlock && this.props.permission.edit) || (result?.lock > 0 && user.groupPosition.toUpperCase() === 'BM' && this.props.permission.edit)) {
            //     footer.push(<Button className='p-button-warning' label={this.props.language["unlock_timesheet"] || "l_unlock_timesheet"} icon="pi pi-unlock" onClick={this.handleUnLock} />)
            // }

            // if (result.lockByUser !== 1 && this.props.permission.edit)
            //     footer.push(<Button className='p-button-success' label="Save" icon="pi pi-check" onClick={this.hanldeSave} />);
            footer.push(<Button
                className='p-button-danger'
                label={result.lockByUser === 1 ? "Close" : "Cancel"}
                icon="pi pi-times"
                onClick={this.props.parentMethod} />);
            return (
                <div>
                    <Toast ref={(el) => this.toast = el} />

                    <Dialog header={moment(this.props.workDate?.toString()).format('YYYY-MM-DD') + ' | ' + this.props.data.employeeCode + ' - ' + this.props.data.fullName + ' (' + this.props.data.position + ')'}
                        footer={footer}
                        visible
                        maximized modal={true}
                        onHide={this.props.parentMethod}>
                        {details}
                    </Dialog>
                </div >
            );
        }
        else {
            return (
                <div>
                    <Dialog header="Timesheet detail"
                        maximized modal={true}
                        onHide={this.props.parentMethod}>
                        <div className="p-grid" style={{ minHeight: '400px' }}>
                            <div className="p-col-12 p-md-6 p-sm-6">
                                {this.props.language["no_date"] || "l_no_date"}
                            </div>
                        </div>
                    </Dialog>
                </div>
            );
        }
    }
}
function mapStateToProps(state) {
    return {
        list: state.photos.photo,
        deletePhoto: state.photos.deletePhoto,
        details: state.timesheets.details,
        result: state.timesheets.result,
        unLock: state.timesheets.unLock,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        TimesheetController: bindActionCreators(actionCreatorsTimesheet, dispatch),
        PhotoController: bindActionCreators(PhotoCreateAction, dispatch),
        // ShiftListsController: bindActionCreators(ShiftListsActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TimesheetCell);