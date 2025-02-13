import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import MasterListDataDropDownList from '../MasterListDataDropDownList';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { download } from '../../../Utils/Helpler'

class ImageTools extends Component {
    constructor(props) {
        super(props)
        this.el = createRef()
        this.fileInput = createRef()

    }
    handleLoad = () => {
        this.fileInput.current.click();
    }
    handleSave = async () => {
        if (this.props.name == "Insert") {
            await this.props.handleDisplayImageEditor(true, this.props.item, this.props.itemGallery, this.props.list, { imageBase64: this.el.current.getInstance().toDataURL() })
        } else {
            await this.props.handleDisplayImageEditor(true, null, null, null, { imageBase64: this.el.current.getInstance().toDataURL() })
        }
    }
    handleCopy = () => {
    }
    handleDownload = () => {
        download(this.el.current.getInstance().toDataURL())
    }
    handleFileInputChange = async (e) => {
        await this.el.current.getInstance().loadImageFromFile(e.target.files[0])
    }
    render() {
        const { imageForEdit, displaySideBar, dialogStateName, handleDisplayImageEditor, onChange, inputValues, handleChangeForm,
            actionImageGalary, isLoading, name } = this.props
        console.log('listPhotoType', this.props.listPhotoType)
        return (
            <React.Fragment>
                <Sidebar visible={displaySideBar} modal={false} fullScreen baseZIndex={1200000} onHide={() => handleDisplayImageEditor(false, dialogStateName)}>
                    <div style={{ display: 'flex' }} className='p-d-flex'>
                        <div style={{ position: "absolute", zIndex: 200, top: '15px', right: '30%' }}>
                            <Button icon="pi pi-save" className="p-button-info p-button-outlined p-mr-2" onClick={this.handleSave} tooltip="Save" />
                            {/* <Button icon="pi pi-download" className="p-button-danger p-button-outlined p-mr-2" onClick={this.handleDownload} tooltip="Download" /> */}
                            <Button icon="pi pi-upload" className="p-button-help p-button-outlined p-mr-2" onClick={this.handleLoad} tooltip="Load" />
                        </div>
                        <div className="image_editor">
                            <ImageEditor
                                includeUI={{
                                    loadImage: {
                                        path: imageForEdit ? imageForEdit : 'https://cdn2.iconfinder.com/data/icons/multimedia-5-4/48/239-512.png',
                                        name: 'image'
                                    },
                                    menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
                                    uiSize: {
                                        width: '70vw',
                                        height: '90vh',
                                    },
                                    menuBarPosition: 'bottom'
                                }}
                                selectionStyle={{
                                    cornerSize: 20,
                                    rotatingPointOffset: 70

                                }}
                                usageStatistics={true}
                                ref={this.el}
                            />
                        </div>
                        <input type="file" accept="image/*" ref={this.fileInput} style={{ display: "none" }} onChange={this.handleFileInputChange} />
                        <div style={{ marginLeft: 10, width: '30vw' }} >
                            <div className="p-fluid p-formgrid p-grid" >
                                <div className=" p-col-12 p-md-12" style={{ marginBottom: "10px", width: '100%', padding: 'none' }}>
                                    <label>Photo Type</label>
                                    <Dropdown
                                        style={{ width: '100%', }}
                                        options={this.props.listPhotoType}
                                        onChange={(e) => handleChangeForm(e.value, 'inputValues', 'photoType')}
                                        value={inputValues.photoType || ''}
                                        placeholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                        optionLabel="type"
                                        filter={true}
                                        filterPlaceholder={this.props.language["select_an_option"] || "l_select_an_option"}
                                        filterBy="type"
                                        showClear={true}
                                    />
                                    <small className="p-invalid p-d-block">{inputValues.errorPhotoType || ""}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-fluid p-formgrid p-grid" style={{ float: 'right', marginTop: '-35px' }} >
                        <Button label="Cancel" icon="pi pi-times" onClick={() => handleDisplayImageEditor(false)} className="p-button-danger p-mr-2"
                            style={{ width: "100px" }} disabled={isLoading}
                        />
                        <Button label={name} icon="pi pi-check" onClick={() => actionImageGalary()} autoFocus
                            style={{ width: "100px" }} className="p-button-info p-mr-2" disabled={isLoading}
                        />
                    </div>
                </Sidebar>
            </React.Fragment >
        )
    }
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        // getPhotoTypeDisplay: state.displays.getPhotoTypeDisplay,
    }
}
function mapDispatchToProps(dispatch) {
    return {

    }
}
export default connect(mapstateToProps, mapDispatchToProps)(ImageTools);
