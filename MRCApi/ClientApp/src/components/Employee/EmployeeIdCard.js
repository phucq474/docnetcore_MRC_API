import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
import React, { PureComponent } from "react";
import { Card } from 'primereact/card';
import { Button } from "primereact/button";
import { connect } from 'react-redux';
import { InputMask } from 'primereact/inputmask';
import { InputSwitch } from 'primereact/inputswitch';

const lstGender = [
    { value: 1, name: 'Female' },
    { value: 2, name: 'Male' }
]
const lstmarital = [
    { value: 1, name: 'Single' },
    { value: 2, name: 'Married' }
]
const w100 = { width: '100%' };


class EmployeeIdCard extends PureComponent {
    constructor(props) {
        super(props);
        this.onClickImage = this.onClickImage.bind(this);
        this.state = {
            CCCD: false
        }
    }
    onClickImage() {
        this.inputElement.click();
    }
    render() {
        const info = this.props.EmployeeInfo;
        return (
            <Card className="p-shadow-10" title="Thông tin chứng minh thư" style={{ height: '100%', }}>
                <div style={{ display: 'flex', alignItems: 'center', }}>
                    <div style={{ marginRight: 10 }}>
                        <InputSwitch checked={this.props.CCCD} onChange={(e) => this.props.handleChangeModeID('CCCD', e.value)} />
                    </div>
                    <label style={{ whiteSpace: 'nowrap', }}>{this.props.CCCD ? "Căn Cước Công Dân" : "Chứng Minh Nhân Dân"}</label>
                </div>
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-6 p-sm-6">
                        {!this.props.CCCD && <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["employee.identitycardnumber"] || "employee.identitycardnumber"}</label>}
                        {/* {!this.props.CCCD && <InputMask mask={"999999999"} id="identityCardNumber"
                            value={info.identityCardNumber || ""} maxlength={9}
                            onChange={this.props.handerchangeInput} />} */}
                        {!this.props.CCCD && <InputText id="identityCardNumber"
                            value={info.identityCardNumber || ""} maxlength={9}
                            onChange={this.props.handerchangeInput} />}
                        {this.props.CCCD && <label style={{ whiteSpace: 'nowrap', }}>Số CCCD</label>}
                        {/* {this.props.CCCD && <InputMask mask="999999999999" className="w-100" id="identityCardNumber"
                            value={info.identityCardNumber || ""} maxlength={12}
                            onChange={this.props.handerchangeInput} />} */}
                        {this.props.CCCD && <InputText className="w-100" id="identityCardNumber"
                            value={info.identityCardNumber || ""} maxlength={12}
                            onChange={this.props.handerchangeInput} />}
                    </div>
                    <div className="p-field p-col-12 p-md-6 p-sm-6">
                        {!this.props.CCCD && <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["employee.identitycarddate"] || "employee.identitycarddate"}</label>}
                        {this.props.CCCD && <label style={{ whiteSpace: 'nowrap', }}>Ngày cấp CCCD</label>}
                        <Calendar monthNavigator yearNavigator yearRange="2010:2030"
                            style={w100}
                            inputStyle={w100}
                            dateFormat="yy-mm-dd"
                            id="identityCardDate"
                            value={info.identityCardDate ? new Date(info.identityCardDate) : info.identityCardDate}
                            onChange={this.props.handerchangeInput} />
                    </div>
                    <div className="p-field p-col-12 p-md-6 p-sm-6">
                        <label style={{ whiteSpace: 'nowrap', }}>{this.props.language["employee_id_card_issue_by"] || "employee_id_card_issue_by"}</label>
                        <InputText className="w-100" id="identityCardBy"
                            value={info.identityCardBy || ""} onChange={this.props.handerchangeInput} />
                    </div>
                    {/* <div className="p-col-12 p-md-6 p-sm-6" style={{ textAlign: 'center', }}>
                        <div style={{ paddingTop: '1.3rem' }}>
                            <Button className="p-button-success" icon="pi pi-search" label='View ID Card info' onClick={() => this.props.handleDialogViewID(true, info)} />
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around', }}>
                        <img style={{ width: '40%', objectFit: 'cover', }}
                            src={info.cmndBefore ? info.cmndBefore : 'https://cdn1.iconfinder.com/data/icons/symbol-color-common-5/32/gallery-add-512.png'}
                        />
                        <img style={{ width: '40%', objectFit: 'cover', }}
                            src={info.cmndAfter ? info.cmndAfter : 'https://cdn1.iconfinder.com/data/icons/symbol-color-common-5/32/gallery-add-512.png'}
                        />
                    </div> */}
                </div>
            </Card>
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeIdCard);