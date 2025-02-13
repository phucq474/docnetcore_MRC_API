import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CreateActionSpiralForm } from '../store/SpiralFormController';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputMask } from 'primereact/inputmask';
import { AutoComplete } from 'primereact/autocomplete';
import { createBrowserHistory } from 'history';
import { RadioButton } from 'primereact/radiobutton';
import dataFull from '../asset/filedata/dvhcvn.json';
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const parameters = createBrowserHistory({ basename: baseUrl });
const dataByDomain = parameters.location.search;
class AddressSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ward: null,
            district: null,
            province: null,
            height: window.innerHeight,
            width: window.innerWidth,
            sended: false,
            provinceData: [],
            dataDistrict: [],
            dataWard: [],
            noted: null,
            vaccine: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearLD = this.clearLD.bind(this);
        this.searchDistrict = this.searchDistrict.bind(this);
        this.searchWard = this.searchWard.bind(this);
    }
    componentDidMount() {
        this.setState({ provinceData: dataFull.data });
    }

    showError(value) {
        this.toast.show({ severity: 'error', summary: "Thông báo lỗi", detail: value });
    }

    showSuccess(value) {
        this.toast.show({ severity: 'success', summary: "Thông báo thành công", detail: value });
    }

    showLoading() {
        this.toastLD.show({
            severity: 'warn', sticky: true, content: (
                <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                    <div className="p-text-center">
                        <i className="pi-cloud-upload" style={{ fontSize: '3rem' }}></i>
                        <h4>Đang gửi dữ liệu.........</h4>
                    </div>
                    <div className="p-grid p-fluid">
                        <ProgressSpinner style={{ height: '50px', width: '100%' }} />
                    </div>
                </div>
            )
        });
    }

    clearLD() {
        this.toastLD.clear();
    }

    handleChange(e, key) {
        switch (key) {
            case 'province':
                this.setState({ province: e.value, dataDistrict: e.value.level2s });
                break;
            case 'district':
                this.setState({ district: e.value, dataWard: e.value.level3s });
                break;
            default:
                this.setState({ ward: e.value })
                break;
        }
    }

    handleSubmit() {
        let isCheck = true;
        let province = this.state.province;
        let district = this.state.district;
        let ward = this.state.ward;
        let phoneNumber = this.state.phoneNumber;
        let address = this.state.address;
        let vaccine = this.state.vaccine;
        let noted = this.state.noted;

        if (!province) {
            isCheck = false;
            this.showError("Vui lòng chọn tỉnh/thành phố");
            return;
        }
        if (!district || !district.level2_id) {
            isCheck = false;
            this.showError("Vui lòng chọn quận/huyện");
            return;
        }
        if (!ward || !ward.level3_id) {
            isCheck = false;
            this.showError("Vui lòng chọn xã/phường");
            return;
        }
        if (!phoneNumber) {
            isCheck = false;
            this.showError("Vui lòng nhập số điện thoại");
            return;
        }
        if (!address) {
            isCheck = false;
            this.showError("Vui lòng nhập địa chỉ");
            return;
        }
        if (!vaccine) {
            isCheck = false;
            this.showError("Vui lòng xác nhận thông tin tiêm chủng");
            return;
        }
        if (vaccine === 'No' && !this.state.noted) {
            isCheck = false;
            this.showError('Vui lòng nhập lí do không đồng ý tiêm chủng');
            return;
        }
        if (isCheck) {
            this.showLoading();
            let dataSubmit = {
                province: {
                    "ProvinceCode": province.level1_id,
                    "ProvinceName": province.name,
                },
                district: {
                    "DistrictCode": district.level2_id,
                    "DistrictName": district.name,
                },
                ward: {
                    "WardCode": ward.level3_id,
                    "WardName": ward.name,
                },
                phoneNumber: phoneNumber,
                address: address,
                vaccine: vaccine,
                noted: noted
            }
            console.log(dataSubmit, "")
            let dataResult = {
                formData: JSON.stringify(dataSubmit)
            }
            let data = {
                dataByDomain: dataByDomain,
                formData: dataResult
            }
            this.props.SpiralFormController.AddressSurveyInsert(data)
                .then(() => {
                    if (this.props.resultAddressSurvey !== undefined) {
                        if (this.props.resultAddressSurvey.result === 1) {
                            this.setState({ sended: true, resultId: parseInt(this.props.resultAddressSurvey.error) });
                            this.showSuccess(this.props.resultAddressSurvey.messenger);
                            this.clearLD();
                        }
                        else {
                            this.showError(this.props.resultAddressSurvey.messenger);
                            this.clearLD();
                        }
                    }
                    else this.showError("Lỗi");
                });
        }
        else {
            this.clearLD();
        }
    }


    searchDistrict(event) {
        setTimeout(() => {
            let filteredDistrict;
            if (!event.query.trim().length) {
                filteredDistrict = [...this.state.dataDistrict];
            }
            else {
                filteredDistrict = this.state.dataDistrict.filter((e) => {
                    return e.name.toLowerCase().includes(event.query.toLowerCase());
                });
            }
            this.setState({ filteredDistrict });
        }, 100);
    }

    searchWard(event) {
        setTimeout(() => {
            let filteredWard;
            if (!event.query.trim().length) {
                filteredWard = [...this.state.dataWard];
            }
            else {
                let dataWard = [...this.state.dataWard]
                filteredWard = dataWard.filter((e) => {
                    return e.name.toLowerCase().includes(event.query.toLowerCase());
                });
            }

            this.setState({ filteredWard });
        }, 100);
    }

    render() {
        return (
            <div className="p-fluid" style={{ overflowX: 'hidden' }} >
                <Toast ref={(el) => this.toast = el} />
                <Toast ref={(el) => this.toastLD = el} position="top-center" />
                <div className="p-card">
                    <div className="p-grid">
                        <div className="p-col-12 p-sm-12 p-md-4 p-field-dropdownlist">
                            <lable>Tỉnh/Thành Phố</lable>
                            <Dropdown value={this.state.province}
                                style={{ width: '99%' }}
                                placeholder="Chọn tỉnh"
                                options={this.state.provinceData}
                                onChange={e => this.handleChange(e, 'province')} optionLabel="name" />
                        </div>
                        <div className="p-col-12 p-sm-12 p-md-4 p-field-dropdownlist">
                            <lable>Quận/Huyện</lable>
                            <AutoComplete
                                style={{ width: '99%' }}
                                value={this.state.district}
                                suggestions={this.state.filteredDistrict}
                                completeMethod={this.searchDistrict}
                                placeholder="Chọn quận huyện"
                                field="name" dropdown
                                onChange={e => this.handleChange(e, 'district')} />
                        </div>
                        <div className="p-col-12 p-sm-12 p-md-4 p-field-dropdownlist">
                            <lable>Phường/Xã/Thị Trấn</lable>
                            <AutoComplete
                                style={{ width: '99%' }}
                                value={this.state.ward}
                                placeholder="Chọn phường, xã, thị trấn"
                                suggestions={this.state.filteredWard}
                                completeMethod={this.searchWard}
                                field="name"
                                dropdown
                                onChange={e => this.handleChange(e, 'ward')} />
                        </div>
                        <div className="p-col-12 p-sm-12 p-md-4">
                            <label>Số điện thoại đang sử dụng(*)</label>
                            <InputMask
                                mask="(9999) 999 999"
                                className="w-100"
                                id="phoneNumber"
                                value={this.state.phoneNumber || ""}
                                onChange={(e) => { this.setState({ phoneNumber: e.value }) }}
                            ></InputMask>
                        </div>
                        <div className="p-col-12 p-sm-12 p-md-4">
                            <label>Địa chỉ (khu phố/đường/hẻm/số nhà)</label>
                            <InputText
                                id="address"
                                value={this.state.address || ''}
                                onChange={(e) => { this.setState({ address: e.target.value }) }}
                                placeholder="Địa chỉ Tạm trú (địa chỉ đang ở)"
                            />
                        </div>
                        <div className="p-sm-12">
                            <label>Bạn có đăng ký tiêm vaccine covid-19 không (nếu có đợt tiêm theo tổ chức của Vinamilk)?</label>
                        </div>
                        <div className="p-sm-6 p-field-radiobutton">
                            <RadioButton inputId="yes" name="vaccine"
                                value="Yes" onChange={(e) => this.setState({ vaccine: e.value })}
                                checked={this.state.vaccine === 'Yes'} />
                            <label htmlFor="yes">Có</label>
                        </div>
                        <div className="p-col-6 p-field-radiobutton">
                            <RadioButton inputId="no" name="vaccine"
                                value="No" onChange={(e) => this.setState({ vaccine: e.value })}
                                checked={this.state.vaccine === 'No'} />
                            <label htmlFor="no">Không</label>
                        </div>
                        <div className="p-col-12 p-sm-12 p-md-4">
                            <label>Nhập ghi chú nếu không đồng ý</label>
                            <InputText
                                id="noted"
                                value={this.state.noted || ''}
                                onChange={(e) => { this.setState({ noted: e.target.value }) }}
                                placeholder="Nhập ghi chú nếu không đồng ý?"
                            />
                        </div>
                    </div >
                    <div key='divFooter' style={{
                        borderRadius: 3, border: 'solid 1px #677777', display: 'flex', alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Button label="Gửi bản khảo sát"
                            style={{ fontWeight: 600, fontSize: 14, paddingTop: 10, paddingBottom: 10 }}
                            icon="pi pi-cloud-upload" className="p-button-info" onClick={this.handleSubmit} />
                    </div>
                </div>
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        resultAddressSurvey: state.spiralform.resultAddressSurvey,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        SpiralFormController: bindActionCreators(CreateActionSpiralForm, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddressSurvey);