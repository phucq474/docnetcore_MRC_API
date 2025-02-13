import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { getImages, postImages, updatePhotos } from '../../../store/QCController';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputMask } from 'primereact/inputmask';
// import 'bootstrap/dist/css/bootstrap.min.css';

class DialogImages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            lstImage: this.props.kpiImages,
            brandId: 0,
            categoryId: 0,
            posmId: 0,
            photoType: '',
            photoTime: '',
            type: '',
            files: []
        };
        this.onClick = this.onClick.bind(this);
        this.onHide = this.onHide.bind(this);
        this.bindPhoto = this.bindPhoto.bind(this);
        this.deletePhoto = this.deletePhoto.bind(this);
        this.insertPhoto = this.insertPhoto.bind(this);
        this.postImages = this.postImages.bind(this);
    }

    onClick() {
        this.setState({ visible: true });
    }
    onHide() {
        this.setState({ visible: false });
        this.setState({ files: [] });
    }
    postImages(e) {
        if (e.target.files.length > 0) {
            this.setState({ files: e.target.files });
            this.props.postImageActions.PostImages(e.target.files);
        }
    }
    deletePhoto(id, photoType, type) {
        let data = {
            Id: id,
            Type: "DELETE",
            PhotoType: photoType
        }
        this.props.updatePhotosActions.UpdatePhotos(data)
        this.bindPhoto(type);
    }
    insertPhoto() {
        const lstImageUpload = [...this.props.lstImages];
        const para = this.props.dataInput;
        let photoType = '';
        let type='';
        //const fileP= this.state.files;
        let photo = [];
        if (this.state.files.length > 0) {
            for (let index = 0; index < lstImageUpload.length; index++) {
                photo.push(lstImageUpload[index].fileUrl);
            }
        }
        else {
            alert(`${this.props.language["no_image"] || "l_no_image"}`);
            return;
        }
        switch (this.props.kpi) {
            case 'QC-Attentdant':
                if (this.state.photoType.value === '' || this.state.photoType === '') {
                    alert(`${this.props.language["please_choose_a_type_image"] || "l_please_choose_a_type_image"}`);
                    return;
                }
                type="QC-Attentdant";
                photoType = this.state.photoType.value;
                break;
            case "QC-Display":
                if (this.state.brandId.value === 0 || this.state.brandId === 0) {
                    alert(`${this.props.language["please_choose_a_brand"] || "l_please_choose_a_brand"}`);
                    return;
                }
                if (this.state.categoryId.value === 0 || this.state.categoryId === 0) {
                    alert(`${this.props.language["please_choose_a_category"] || "l_please_choose_a_category"}`);
                    return;
                }
                type="DISPLAY";
                photoType = "DISPLAY_" + this.state.brandId.value.toString() + "_" + this.state.categoryId.value.toString();
                break;
            case 'QC-Promotion':
                if (this.state.brandId.value === 0 || this.state.brandId === 0) {
                    alert(`${this.props.language["please_choose_a_brand"] || "l_please_choose_a_brand"}`);
                    return;
                }
                type="PROMOTION";
                photoType = "PROMOTION_" + this.state.brandId.value.toString();
                break;
            case 'QC-DisplayPackage':
                if (this.state.photoType.value === '' || this.state.photoType === '') {
                    alert(`${this.props.language["please_choose_a_type_image"] || "l_please_choose_a_type_image"}`);
                    return;
                }
                type="DISPLAYPACKAGE_";
                photoType = "IMAGE_" + this.state.photoType.value + "_DISPLAY_";
                break;
            case 'QC-POSM':
                if (this.state.photoType.value === '' || this.state.photoType === '') {
                    alert(`${this.props.language["please_choose_a_type_image"] || "l_please_choose_a_type_image"}`);
                    return;
                }
                if (this.state.type.posmId === 0 || this.state.posmId === 0) {
                    alert(`${this.props.language["please_choose_a_POSM"] || "l_please_choose_a_POSM"}`);
                    return;
                }
                type="POSM";
                photoType = "IMAGE_" + this.state.photoType.value + "_POSM_" + this.state.posmId.value.toString();
                break;
            case 'QC-PXN':
                type="PXN";
                photoType = "IMAGE_PXN_DISPLAY_";
                break;
            case 'QC-DisplayIssue':
                type="DISPLAY_ISSUE";
                photoType = "DISPLAY_ISSUE_";
                break;
            default:
                alert(`${this.props.language["error"] || "l_error"}`);
                break;
        }
        if (photoType === "" || photoType === undefined) {
            alert(`${this.props.language["photo_type_is_not_empty"] || "l_photo_type_is_not_empty"}`);
            this.setState({ files: [] });
            return;
        }
        let data = {
            Id: -1,
            EmployeeId: para.employeeId,
            ShopId: para.shopId,
            WorkDate: para.workDate,
            Type: "INSERT",
            PhotoType: photoType,
            PhotoPath: JSON.stringify(photo),
            PhotoTime: this.state.photoTime,

        }
        this.props.updatePhotosActions.UpdatePhotos(data)
        this.bindPhoto(type);
        this.setState({ files: [] });
        this.setState({brandId:0});
        this.setState({categoryId:0});
        this.setState({type:''});
        this.setState({photoType:''});
        this.setState({posmId:0});

    }
    bindPhoto(type) {
        const para = this.props.dataInput;
        var data = {
            EmployeeId: para.employeeId,
            ShopId: para.shopId,
            WDate: para.workDate,
            ImageType: type
        }
        this.props.getImageActions.GetImages(data);
    }
    // componentDidMount(){
    //     let type='';
    //     switch (this.props.kpi) {
    //         case 'QC-Attentdant':
    //             type="QC-Attentdant";
    //             break;
    //         case "QC-Display":
    //             type="DISPLAY";
    //             break;
    //         case 'QC-Promotion':
    //             type="PROMOTION";
    //             break;
    //         case 'QC-DisplayPackage':
    //             type="DISPLAYPACKAGE_";
    //             break;
    //         case 'QC-POSM':
    //             type="POSM";
    //             break;
    //         case 'QC-PXN':
    //             type="PXN";
    //             break;
    //         case 'QC-DisplayIssue':
    //             type="DISPLAY_ISSUE";
    //             break;
    //         default:
    //             break;
    //     }
    //     this.bindPhoto(type);
    // }
    render() {
        const data = [...this.props.kpiImages];
        const lstImageUpload = [...this.props.lstImages];
        const lstAttentdantType = [
        //    { value: '', name: 'None' },
            { value: '0', name: `${this.props.language["checkin"] || "checkin"}` },
            { value: '1', name: `${this.props.language["checkout"] || "checkout"}` },
            { value: 'Overview', name: `${this.props.language["overview"] || "l_overview"}` }
        ];
        let ddlAttendantType = (
            <div className="col-md-6">
                <div className="row">
                    <div className="col-md-6">
                        <h6>Attendant type</h6>
                        <Dropdown key={lstAttentdantType.value} style={{ width: '100%' }} value={this.state.photoType}
                            options={lstAttentdantType} onChange={(e) => this.setState({ photoType: e.value })}
                            placeholder={this.props.language["select_a_attendant_type"] || "l_select_a_attendant_type"} optionLabel="name" />
                    </div>
                    <div className="col-md-6">
                        <h6>Photo time</h6>
                        <InputMask
                            mask="9999-99-99 99:99:99" value={this.state.photoTime} slotChar="yyyy-mm-dd HH:mm:ss" style={{ width: '100%' }}
                            onChange={(e) => this.setState({ photoTime: e.value })} >
                        </InputMask>
                    </div>
                </div></div>
        );
        const lstType = [
        //    { value: '', name: 'None' },
            { value: 'BEFORE', name: `${this.props.language["before"] || "l_before"}` },
            { value: 'AFTER', name: `${this.props.language["after"] || "l_after"}` },

        ];
        let ddlType = (
            <div className="col-md-3">
                <h6>Photo type</h6>
                <Dropdown key={lstType.value} style={{ width: '100%' }} value={this.state.photoType}
                    options={lstType} onChange={(e) => this.setState({ photoType: e.value })}
                    placeholder={this.props.language["select_a_photo_type"] || "l_select_a_photo_type"} optionLabel="name" />
            </div>
        );
        const lstBrand = [
         //   { value: 0, name: 'None' },
            { value: 74, name: 'Xiaomi' },
            { value: 75, name: 'Samsung' },
            { value: 76, name: 'ViVo' },
            { value: 77, name: 'Huawei' },
            { value: 78, name: 'Oppo' },
            { value: 79, name: 'Realme' },
        ];
        let ddlBrand = (
            <div className="col-md-3">
                <h6>Brand</h6>
                <Dropdown key={lstBrand.value} style={{ width: '100%' }} value={this.state.brandId}
                    options={lstBrand} onChange={(e) => this.setState({ brandId: e.value })}
                    placeholder={this.props.language["select_a_brand"] || "l_select_a_brand"} optionLabel="name" />
            </div>
        );
        const lstPOSM = [
         //   { value: 0, name: 'None' },
            { value: 1, name: 'Bàn trải nghiệm + thiết bị đi kèm' },
            { value: 2, name: 'Sản phẩm mica' },
            { value: 3, name: 'Sản phẩm in ấn' },
            { value: 4, name: 'Others' }
        ];
        let ddlPOSM = (
            <div className="col-md-3">
                <h6>POSM</h6>
                <Dropdown key={lstPOSM.value} style={{ width: '100%' }} value={this.state.posmId}
                    options={lstPOSM} onChange={(e) => this.setState({ posmId: e.value })}
                    placeholder={this.props.language["select_a_posm"] || "l_select_a_posm"} optionLabel="name" />
            </div>
        );
        const lstCategory = [
        //    { value: 0, name: 'None' },
            { value: 300, name: 'MI' },
            { value: 400, name: 'POCO' },
            { value: 500, name: 'REDMI' },
            { value: 600, name: 'S' },
            { value: 700, name: 'V' },
            { value: 800, name: 'Y' },
            { value: 900, name: 'A' },
            { value: 1000, name: 'M' },
            { value: 1100, name: 'C2' },
            { value: 1200, name: '3' },
            { value: 1300, name: '5' },
            { value: 1400, name: 'F' },
            { value: 1500, name: 'K' },
            { value: 1600, name: 'Nova' },
            { value: 1700, name: 'P' },
        ];
        let ddlCategory = (
            <div className="col-md-3">
                <h6>Category</h6>
                <Dropdown key={lstCategory.value} style={{ width: '100%' }} value={this.state.categoryId}
                    options={lstCategory} onChange={(e) => this.setState({ categoryId: e.value })}
                    placeholder={this.props.language["select_a_category"] || "l_select_a_category"} optionLabel="name" />
            </div>
        );
        switch (this.props.kpi) {
            case 'QC-Attentdant':
                ddlPOSM = null;
                ddlBrand = null;
                ddlCategory = null;
                ddlType = null;
                break;
            case "QC-Display":
                ddlPOSM = null;
                ddlAttendantType = null;
                ddlType = null;
                break;
            case 'QC-Promotion':
                ddlPOSM = null;
                ddlCategory = null;
                ddlAttendantType = null;
                ddlType = null;
                break;
            case 'QC-DisplayPackage':
                ddlBrand = null;
                ddlPOSM = null;
                ddlCategory = null;
                ddlAttendantType = null;
                ddlCategory = null;
                break;
            case 'QC-POSM':
                ddlCategory = null;
                ddlAttendantType = null;
                ddlBrand = null;
                break;
            default:
                ddlPOSM = null;
                ddlBrand = null;
                ddlCategory = null;
                ddlType = null;
                ddlAttendantType = null;
                ddlType = null;
                break;
        }
        let itemsDelete = [];
        if (data.length > 0) {
            itemsDelete = data.map((item) => {
                return (
                    <div key={item.photoID} style={{ textAlign: "center", border: "2px solid dodgerblue", margin: "5px", width: "32%" }}>
                        <img alt={item.photoType} src={item.photoPath} height={180} />
                        <label style={{ display: 'block' }} >
                            {item.photoType === "0" ? `${this.props.language["checkin"] || "checkin"}` : item.photoType === "1" ? `${this.props.language["checkout"] || "checkout"}` : item.photoType}
                        </label>
                        <Button
                            label={this.props.language["delete"] || "l_delete"} icon="pi pi-times"
                            style={{ marginRight: '.25em', display: 'block', float: 'right' }}
                            className="p-button-danger"
                            onClick={() => this.deletePhoto(item.photoID, item.photoType, item.type)}
                        />
                    </div>
                );
            })
        }
        let itemsUpload = [];
        if (this.state.files.length > 0) {
            itemsUpload = lstImageUpload.map((item) => {
                return (
                    <div key={item.fileId} style={{ textAlign: "center", border: "2px solid dodgerblue", margin: "5px", width: "32%" }}>
                        <img alt={item.fileId} src={item.fileUrl} height={180} />
                    </div>
                );
            })
        }
        const result = this.props.result;
        if (result.length > 0) {
            if (result[0].result === 1)
                alert(result[0].messenger);
            else if (result[0].result === -1 && result[0].error === null)
                alert(result[0].messenger);
            else if (result[0].result === -1 && result[0].error !== null)
                alert(result[0].messenger + ' ' + result[0].error);
            this.props.result[0].result = 0;
        }
        return (
            <div >
                <div className="content-section implementation" >
                    <Dialog
                        header={this.props.language["edit_image"] || "l_edit_image"} contentStyle={{ height: '600px' }} style={{ width: '1000px' }}
                        visible={this.state.visible} onHide={this.onHide} >
                        <TabView renderActiveOnly={true} activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                            <TabPanel header={this.props.language["delete"] || "l_delete"}>
                                <div style={{ height: '510px', overflow: 'auto' }}>
                                    <div className="row" style={{ margin: 'auto' }}>
                                        {itemsDelete}
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel header={this.props.language["insert"] || "l_insert"}>
                                <div >
                                    <div className="row" >
                                        {ddlAttendantType}{ddlType}{ddlBrand}{ddlCategory}{ddlPOSM}
                                    </div>
                                    <div className="row" style={{ margin: "10px 3px" }} >
                                        <div style={{ width: "50%" }}>
                                            <input type="file" multiple onChange={e => this.postImages(e)} />
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <Button
                                                label={this.props.language["upload"] || "l_upload"} icon="pi pi-check" iconPos="right"
                                                style={{ marginRight: '.25em', display: 'block', float: 'right' }}
                                                onClick={this.insertPhoto}
                                                className="p-button-success" />
                                        </div>
                                    </div>
                                    <div className="row" style={{ maxHeight: '390px', overflow: 'auto' }}>
                                        {itemsUpload}
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </Dialog>
                    <Button style={{ float: 'right' }} label={this.props.language["show"] || "l_show"} icon="pi pi-external-link" onClick={this.onClick} />
                </div>
            </div >
        )
    }
}
function mapStateToProps(state) {
    return {
        result: state.qcDetail.result,
        lstImages: state.kpiImages.lstImages,
        kpiImages: state.kpiImages.kpiImages,
        loading: state.kpiImages.loading,
        errors: state.kpiImages.errors,
        forceReload: state.kpiImages.forceReload,
        language: state.languageList.language
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getImageActions: bindActionCreators(getImages, dispatch),
        postImageActions: bindActionCreators(postImages, dispatch),
        updatePhotosActions: bindActionCreators(updatePhotos, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DialogImages);