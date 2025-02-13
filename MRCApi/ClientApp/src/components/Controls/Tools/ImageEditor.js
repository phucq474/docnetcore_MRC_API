import React,{Component,createRef} from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import {Button} from 'primereact/button';
import {download} from '../../../Utils/Helpler'
import '../../../css/highlight.css'
import { Dialog } from 'primereact/dialog';
class EditorTools extends Component {
    constructor(props) {
        super(props)
        this.el = createRef()
        this.fileInput = createRef()
    }
    handleLoad = () => {
        this.fileInput.current.click();
    }
    handleSave = async () => {
        await this.props.handleDisplayImageEditor(this.props.isVisible,this.props.dialogStateName,{imageBase64: this.el.current.getInstance().toDataURL()})
    }
    handleDownload = () => {
        download(this.el.current.getInstance().toDataURL())
    }
    handleFileInputChange = async (e) => {
        await this.el.current.getInstance().loadImageFromFile(e.target.files[0])
    }
    render() {
        const {imageForEdit,displaySideBar,dialogStateName,handleDisplayImageEditor} = this.props
        return (
            <React.Fragment>
                <Dialog visible={displaySideBar} fullScreen maximized baseZIndex={9999999} onHide={() => handleDisplayImageEditor(false,dialogStateName)}>
                    <div style={{position: "relative",display: "flex",justifyContent: 'center'}}>
                        <div style={{position: "absolute",zIndex: 200,top: '15px',right: '10%'}}>
                            <Button icon="pi pi-save" className="p-button-info p-button-outlined p-mr-2 btn__hover" onClick={this.handleSave} tooltip="Save" />
                            <Button icon="pi pi-download" className="p-button-help p-button-outlined p-mr-2 btn__hover" onClick={this.handleDownload} tooltip="Download" />
                            <Button icon="pi pi-upload" className="p-button-warning p-button-outlined p-mr-2 btn__hover" onClick={this.handleLoad} tooltip="Load" />
                        </div>
                        <div style={{position: "absolute"}} className="image_editor">
                            <ImageEditor
                                includeUI={{
                                    loadImage: {
                                        path: imageForEdit || "https://i.ibb.co/qCQ6RZW/c23498b124bf.png",
                                        name: 'image'
                                    },
                                    menu: ['crop','flip','rotate','draw','shape','icon','text','mask','filter'],
                                    uiSize: {
                                        width: '80vw',
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
                    </div>
                    <input type="file" accept="image/*" ref={this.fileInput} style={{display: "none"}} onChange={this.handleFileInputChange} />
                </Dialog>
            </React.Fragment>
        )
    }
}
export default EditorTools;
