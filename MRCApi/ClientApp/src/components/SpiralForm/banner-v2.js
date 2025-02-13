import React, { PureComponent } from "react";
import Cropper from "react-cropper";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import "cropperjs/dist/cropper.css";
import { Button } from "primereact/button";

class Banner extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isCrop: false,
        }
        this.cropperRef = React.createRef();
        // this.getCropData=this.getCropData.bind(this);
        // this.handlerChangeImage=this.handlerChangeImage.bind(this);
    }

    getCropData() {
        // console.log(this.cropperRef.cropper.getCroppedCanvas().toDataURL());
        // console.log(this.cropperRef.cropper.cropBoxData.height);
        this.setState({
            // imageData: this.cropperRef.cropper.getCroppedCanvas().toDataURL(),
            // imageHeight: this.cropperRef.cropper.cropBoxData.height,
            isCrop: false
        })
        this.props.handlerBanner({
            imageURL: "",
            imageData: this.cropperRef.cropper.getCroppedCanvas().toDataURL(),
            imageHeight: parseInt(this.cropperRef.cropper.cropBoxData.height, 0),
        });
    }
    onChooseImage() {
        this.inputElement.click();
    }
    async readFile(file) {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }
    handlerChangeImage = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await this.readFile(file)
            //this.setState({ imageURL: imageDataUrl })
            this.props.handlerBanner({
                imageURL: "",
                imageData: imageDataUrl,
                imageHeight: 400,
            });
        }
    }
    render() {

        const banner =this.props.banner !== null && this.props.banner!=="" ? JSON.parse(this.props.banner):null;
        let imageURL = null;
        if (banner!==null && banner?.imageURL !== null && banner?.imageURL !== "")
            imageURL = banner.imageURL;
        else if (banner!==null && banner?.imageData !== null)
            imageURL = banner.imageData

        return (
            <div style={{ display: 'flex', height: banner?.imageHeight || 400 }} className='p-d-flex'>
                <div style={{ position: "absolute", zIndex: 200, top: '160px', right: '18%' }}>
                    {!this.state.isCrop ? <Button icon="pi pi-pencil" className="p-button-info p-button-outlined p-mr-2" onClick={() =>  this.setState({ isCrop: true }) } tooltip="Edit banner" /> : null}
                    {this.state.isCrop ?
                        <>  <Button onClick={() => this.onChooseImage()} className="p-button-info p-button-outlined p-mr-2" icon="pi pi-image" tooltip="Choose Image" />
                            <input type="file" accept="image/*" ref={input => this.inputElement = input}
                                onChange={this.handlerChangeImage} style={{ display: "none" }}></input>
                            <Button icon="pi pi-save" className="p-button-success p-button-outlined p-mr-2" tooltip="Save" onClick={() => this.getCropData()} />
                            <Button icon="pi pi-times" className="p-button-danger p-button-outlined p-mr-2" tooltip="Cancel" onClick={() =>  this.setState({ isCrop: false }) } />
                        </> : null}
                </div>
                {this.state.isCrop ? <Cropper
                    src={imageURL !== null ? imageURL : "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"}
                    style={{ height: 400, width: "100%" }}
                    // Cropper.js options
                    initialAspectRatio={16 / 9}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                    guides={false}
                    // crop={this.onCrop}
                    ref={input => this.cropperRef = input}
                />
                    : null}
                {!this.state.isCrop && imageURL !== null ?
                    <img alt="banner" style={{ height: banner?.imageHeight || 400, width: "100%" }} src={imageURL}></img>
                    : null}
            </div>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(Banner);