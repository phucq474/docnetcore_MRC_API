import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from "primereact/button";
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import MasterListDataDropDownList from '../MasterListDataDropDownList';
import { InputText } from 'primereact/inputtext';
import EditorTools from '../Tools/ImageEditor';

const user = JSON.parse(localStorage.getItem("USER"));

class ActionGallery extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            positionByAccount: user.accountId === 10 ? "PG-SR-MER" : "PG-SR-MER-SUP",
        }
    }
    render() {
        const { actionImageDisplay, actionImageGalary, handleChange, imageUrl, editImageDisplaySidebar,
            onChange, inputValues, handleActionImageDisplay, actionName, name, handleDisplayImageEditor, handleChangeForm } = this.props
        return (
            <div>
                <Sidebar visible={actionImageDisplay} modal={false} baseZIndex={1010000} fullScreen onHide={() => handleActionImageDisplay(false)}>
                    <div className="p-fluid p-formgrid p-grid"><h1>{actionName}</h1></div>
                    <div className="p-d-flex p-jc-center p-ai-center" style={{ width: "80vw", margin: "auto" }} >
                        <div className="" style={{ width: "65vw" }}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className=" p-col-12 p-md-12" style={{ marginBottom: "10px" }}>
                                    <label>Report</label>
                                    <MasterListDataDropDownList
                                        {...this}
                                        id='reportId'
                                        handleChange={handleChange}
                                        onChange={onChange}
                                        listCode='KPI'
                                        value={inputValues.reportId || ''}
                                    />
                                    <small className="p-invalid p-d-block">{inputValues.errorReportId || ""}</small>
                                </div>
                            </div>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className=" p-col-12 p-md-12" style={{ marginBottom: "10px" }}>
                                    <label>Photo Type</label>
                                    <Dropdown
                                        style={{ width: '100%' }}
                                        options={this.props.getPhotoTypeDisplay}
                                        onChange={(e) => handleChangeForm(e.value, 'inputValues', 'photoType')}
                                        value={inputValues.photoType || ''}
                                        placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                        optionLabel="photoType"
                                        filter={true}
                                        filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                        filterBy="name"
                                        showClear={true}
                                    />
                                    <small className="p-invalid p-d-block">{inputValues.errorPhotoType || ""}</small>
                                </div>
                            </div>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className=" p-col-12 p-md-12">
                                    <label>Photo Note</label>
                                    <InputText value={inputValues.photoNote || ''} onChange={(e) => handleChangeForm(e.target.value, 'inputValues', 'photoNote')} placeholder={this.props.language["select_photo_note"] || "l_select_photo_note"} />
                                    <small className="p-invalid p-d-block">{inputValues.errorPhotoNote || ""}</small>
                                </div>
                            </div>
                        </div>
                        <div className="" style={{ width: "45vw" }}>
                            <div className="attendant_container gallery_insert" style={{ top: "5%" }} >
                                <img src={imageUrl || null} style={{ marginLeft: '30px', height: "50vh", top: 0 }} />
                                <input type="file" accept="image/*" className={''} onChange={(e) => handleChangeForm(e.target.files[0], 'inputValues', 'ifile')}
                                    style={{ width: "100%", height: "100%", opacity: 0, cursor: "pointer", position: 'absolute', marginLeft: '30px' }} />
                            </div>
                            <small className="p-invalid p-d-block" style={{ textAlign: 'center' }}>{inputValues.errorIfile || ""}</small>
                        </div>
                    </div>
                    <div style={{ width: '100vw', height: '50vh', position: "absolute", top: "83vh" }}>
                        <hr />
                        <div style={{ marginRight: "5%", float: "right" }}>
                            <Button label="Cancel" icon="pi pi-times" onClick={() => handleActionImageDisplay(false)} className="p-button-danger p-mr-2"
                                style={{ width: "100px" }}
                            />
                            <Button label={name} icon="pi pi-check" onClick={() => actionImageGalary()} autoFocus
                                style={{ width: "100px" }} className="p-button-info p-mr-2"
                            />
                        </div>
                    </div>
                </Sidebar>
                {/* <EditorTools
                    imageForEdit={imageUrl}
                    displaySideBar={editImageDisplaySidebar}
                    handleDisplayImageEditor={handleDisplayImageEditor}
                /> */}
            </div>
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        getPhotoTypeDisplay: state.displays.getPhotoTypeDisplay,
    }
}
function mapDispatchToProps(dispatch) {
    return {

    }
}
export default connect(mapstateToProps, mapDispatchToProps)(ActionGallery);