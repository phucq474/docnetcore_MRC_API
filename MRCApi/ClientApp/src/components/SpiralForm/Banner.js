import { Button } from 'primereact/button';
import React, { PureComponent } from 'react';
import Cropper from 'react-easy-crop'
import getCroppedImg from './cropImage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const cropContainer = {
    position: 'relative',
    width: '100%',
    height: 230,
    background: '#333'
}
class Banner extends PureComponent {
    state = {
        imgSource:this.props.banner!==null? this.props.banner:'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000',
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 4 / 3,
    }
    onCropChange = crop => {
        this.setState({ crop })
    }
    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({ cropNew: croppedAreaPixels });
    }
    onChooseImage() {
        this.inputElement.click();
    }
    onZoomChange = zoom => {
        this.setState({ zoom })
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
            this.setState({ imgSource: imageDataUrl })
            
        }
    }
    async GetImageCrop() {
        try {
            const croppedImage = await getCroppedImg(this.state.imgSource, this.state.cropNew, 0)
            this.setState({ imgSource: croppedImage, zoom: 1 });
            this.props.handerBanner(croppedImage);
        } catch (e) {
            console.error(e)
        }
    }
    render() {
        return (
            <div>
                <div style={cropContainer}>
                    <Cropper
                        image={this.state.imgSource}
                        crop={this.state.crop}
                        zoom={this.state.zoom}
                        zoomWithScroll={true}
                        cropSize={{ height: 230, width: 1225 }}
                        aspect={this.state.aspect}
                        onCropChange={this.onCropChange}
                        onCropComplete={this.onCropComplete}
                        onZoomChange={this.onZoomChange} />
                    <div style={{ float: "right", paddingTop: 10, paddingRight: 10 }}>
                        <Button tooltip={this.props.language["select_new_banner"] || "l_select_new_banner"} onClick={() => this.onChooseImage()} className="p-button-primary p-button-outlined" icon="pi pi-pencil" />
                        <input type="file" accept="image/*" ref={input => this.inputElement = input}
                            onChange={this.handlerChangeImage} style={{ display: "none" }}></input>
                        <Button tooltip={this.props.language["remove_banner"] || "l_remove_banner"} style={{ marginLeft: 5, marginRight: 5 }} className="p-button-danger p-button-outlined" icon="pi pi-times" />
                        <Button tooltip={this.props.language["apply_crop_image"] || "l_apply_crop_image"} onClick={() => this.GetImageCrop()} className="p-button-primary p-button-outlined" icon="pi pi-images" />
                    </div>
                </div>

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