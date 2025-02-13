
import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { Galleria } from 'primereact/galleria';
import { bindActionCreators } from 'redux';
import { PhotoCreateAction } from '../../../store/PhotoController';
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import '../../../css/MenuStyle.css';
import ActionImage from './ActionImage';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import Lightbox from 'react-image-lightbox';
import { getImageUpdateName } from '../../../Utils/Helpler';
import { HelpPermission } from '../../../Utils/Helpler';
class PhotoGalary extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            photos: [],
            itemPhotoGallery: [],
            permission: {},

            isLoading: false,
            isOpen: false,
            photoIndex: 0,
            activeIndex: 0,

            inputValues: {},
            imageUrl: null,
            insertImageDisplay: false,
            updateImageDisplay: false,
            editImageDisplaySidebar: false,
            deleteImageDisplay: false,

        }
        this.pageId = this.props.pageId;

        this.styleSpinner = {
            width: "50px",
            height: "50px",
            position: "fixed",
            zIndex: 1400000,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }

        this.handleBindData = this.handleBindData.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.itemTemplateThumb = this.itemTemplateThumb.bind(this);
        this.handleImageDisplay = this.handleImageDisplay.bind(this);
        this.handleInsertImageDisplay = this.handleInsertImageDisplay.bind(this)
        this.handleDisplayImageEditor = this.handleDisplayImageEditor.bind(this)
        this.handleDeleteImageDisplay = this.handleDeleteImageDisplay.bind(this)
        this.renderDeleteFooterDialog = this.renderDeleteFooterDialog.bind(this)
    }
    componentDidMount() {
        this.handleBindData();
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({ permission })
    }
    Alert = (mess, style) => {
        if (style === undefined)
            style = "success";
        this.toast.show({ severity: style, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: mess });
    }
    handleBindData() {
        const data = this.props.dataInput;
        this.props.PhotoController.GetPhotoByShop(data)
            .then(() => {
                if (!this.props.ReportId)
                    this.setState({ photos: this.props.list })

                else {
                    this.setState({ photos: this.props.list.filter(item => item.reportId === this.props.ReportId) })
                }
            });
    }
    async handleInsertImageDisplay(boolean, dataInput, itemGallery, list, loadImage = {}) {
        let photoTime = {};
        let dateObj = new Date();
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        let seconds = dateObj.getSeconds()
        if (hours < 10)
            hours = '0' + hours
        if (minutes < 10)
            minutes = '0' + minutes
        if (seconds < 10)
            seconds = '0' + seconds
        photoTime = hours + ':' + minutes + ':' + seconds
        if (boolean) {
            await this.setState({
                insertImageDisplay: true,
                inputValues: {
                    ...this.state.inputValues,
                    employeeId: dataInput.employeeId,
                    shopId: dataInput.shopId,
                    photoDate: dataInput.workDate,
                    photoTime: photoTime,
                    reportId: dataInput.reportId,
                    loadImage: loadImage,
                },
            })
            if (this.state.inputValues?.reportId) {
                await this.props.DisplayController.PhotoType(
                    this.state.inputValues?.reportId
                )
            }
            if (loadImage && loadImage.imageBase64 !== undefined) {
                await this.setState({ isLoading: true })
                fetch(loadImage.imageBase64)
                    .then(res => res.blob())
                    .then(blob => {
                        const imageFile = new File([blob], "Filename.jpg", { type: "image/jpg" })
                        this.setState({
                            inputValues: {
                                ...this.state.inputValues,
                                ifile: imageFile ? imageFile : null,
                            },
                            isLoading: false,
                        })
                    })

            }
        } else {
            await this.setState({
                insertImageDisplay: false,
                inputValues: {},
                isLoading: false
            })
        }
    }

    urlToObject = async (path) => {
        const response = await fetch(path);
        // here image is url/location of image
        const index = path.lastIndexOf("/") + 1;
        const filename = path.substr(index);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type });
        await this.setState({
            inputValues: {
                ...this.state.inputValues,
                ifile: file ? file : null,
                photoName: filename ? filename : null,
            }
        })
    }
    insertImageGalary = async () => {
        if (await this.handlePhotoValid() === true) {
            await this.setState({ isLoading: true })
            await this.props.DisplayController.InsertPhotoDisplay(
                this.state.inputValues.ifile,
                this.state.inputValues.reportId,
                this.state.inputValues.shopId,
                this.state.inputValues.employeeId,
                this.state.inputValues.photoDate,
                this.state.inputValues.photoTime,
                this.state.inputValues.photoNote || '',
                this.state.inputValues.photoType ? this.state.inputValues.photoType.photoType : '',
                this.state.inputValues.promotionId || '',
            )
            let result = await this.props.insertPhotoDisplay[0]
            if (result.alert === '1') {
                if (this.props.list) {
                    await this.props.list.push(result)
                }
                await this.Alert("Thêm thành công", "info");
                await this.setState({ isLoading: false, insertImageDisplay: false, inputValues: {}, imageUrl: null })
            } else {
                await this.setState({ isLoading: false })
                await this.Alert('Thêm thất bại', 'error')
            }
        }
    }
    updateImageGalary = async () => {
        if (!this.state.inputValues.photoNew)
            this.urlToObject(this.state.inputValues.photoPath)
        await this.setState({ isLoading: true })
        await this.props.DisplayController.UpdatePhotoDisplay(
            this.state.inputValues.ifile,
            this.state.inputValues.shopId,
            this.state.inputValues.employeeId,
            this.state.inputValues.photoId,
            this.state.inputValues.photoNote,
            this.state.inputValues.photoType.photoType,
            this.state.inputValues.promotionId || '',
            this.state.inputValues.photoPath,
            this.state.inputValues.photoNew || '',
        )
        const result = this.props.updatePhotoDisplay
        if (result[0].alert === '1') {
            if (this.props.list) {
                let arr = this.props.list.filter(e => e.photoID === this.state.itemPhotoGallery.photoID)
                arr[0].photoPath = result[0].photoPath
                arr[0].photoNote = result[0].photoNote
                arr[0].photoType = result[0].photoType
            }
            await this.Alert("Cập nhập thành công", "info");
            await this.setState({ editImageDisplaySidebar: false, inputValues: {}, imageUrl: null, isLoading: false })
        } else {
            await this.setState({ isLoading: false })
            await this.Alert('Cập nhập thất bại', 'error')
        }
    }
    async handleDisplayImageEditor(boolean = false, dataInput = null, itemGallery, list, loadImage = {}) {
        if (boolean === true) {
            if (dataInput !== null) {
                await this.setState({
                    inputValues: {
                        ...this.state.inputValues,
                        employeeId: dataInput.employeeId,
                        shopId: dataInput.shopId,
                        photoNote: itemGallery.photoNote,
                        photoPath: itemGallery.photoPath,
                        photoType: { photoType: itemGallery.photoType },
                        promotionId: itemGallery.promotionId,
                        photoId: itemGallery.photoID,
                        reportId: itemGallery.reportId ? itemGallery.reportId : dataInput.reportId,
                    },
                    loadImage: loadImage,
                    imageUrl: itemGallery.photoPath,
                })
                await this.urlToObject(this.state.inputValues.photoPath)
                if (this.state.inputValues?.reportId) {
                    await this.props.DisplayController.PhotoType(this.state.inputValues?.reportId)
                }
            }

            if (loadImage && loadImage.imageBase64 !== undefined) {
                fetch(loadImage.imageBase64)
                    .then(res => res.blob())
                    .then(async blob => {
                        let photoName = await getImageUpdateName(this.state.inputValues.photoName)
                        await this.setState({
                            inputValues: {
                                ...this.state.inputValues,
                                photoNew: photoName ? photoName : '',
                            },
                            isLoading: true,
                        })
                        const imageFile = new File([blob], photoName, { type: "image/jpg" })
                        await this.setState({
                            inputValues: {
                                ...this.state.inputValues,
                                ifile: imageFile ? imageFile : null,
                            },
                            isLoading: false,
                        })
                    });
            }
            await this.setState({ editImageDisplaySidebar: true })
        } else {
            await this.setState({
                editImageDisplaySidebar: false,
                imageUrl: null,
                inputValues: {},
                isLoading: false
            })
        }
    }
    handleImageDisplay(boolean, list) {
        if (boolean === true) {
            this.setState({
                imageDisplay: true,
                list: list
            })
        } else {
            this.setState({
                imageDisplay: false
            })
        }
    }
    handlePhotoValid = async () => {
        let check = true;
        if (!this.state.inputValues.ifile) {
            await this.Alert('Xin chọn thư mục cần lưu', 'error')
            check = false
        } else await this.setState({ inputValues: { ...this.state.inputValues, errorIfile: "" } })

        if (!this.state.inputValues.photoType) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorPhotoType: "Input Required" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorPhotoType: "" } })

        if (!this.state.inputValues?.reportId) {
            await this.setState({ inputValues: { ...this.state.inputValues, errorReportId: "Input Required" } })
            check = false
        } else this.setState({ inputValues: { ...this.state.inputValues, errorReportId: "" } })
        if (!check) return false
        else return true;
    }
    handleChangeForm = async (value, stateName = "", subStateName) => {
        if (subStateName === "ifile") {
            await this.setState({
                imageUrl: URL.createObjectURL(value)
            })
        }
        await this.setState({
            [stateName]: {
                ...this.state[stateName],
                [subStateName]: value == null ? "" : value,
            },
        });
    }
    handleChange = (id, value) => {
        this.setState({ inputValues: { ...this.state.inputValues, [id]: value === null ? "" : value } });
    }
    onChange = async (e, value) => {
        await this.setState({
            inputValues: {
                ...this.state.inputValues,
                [e]: value === null ? "" : value
            }
        })
    }
    handleDeleteImageDisplay(boolean, itemGallery) {
        if (boolean === true) {
            this.setState({
                deleteImageDisplay: true,
                inputValues: {
                    ...this.state.inputValues,
                    photoId: itemGallery.photoID,
                },
            })
        } else {
            this.setState({
                deleteImageDisplay: false
            })
        }
    }
    renderDeleteFooterDialog() {
        return (
            <div>
                <Button hidden={this.state.delete} label="Cancel" className="p-button-info" icon="pi pi-times" onClick={() => this.handleDeleteImageDisplay(false)} />
                <Button hidden={this.state.delete} label="Delete" className="p-button-danger" icon="pi pi-check" onClick={() => this.deleteImageGalary()} />
            </div>
        )
    }
    deleteImageGalary = async () => {
        await this.setState({ isLoading: true })
        await this.props.DisplayController.DeletePhotoDisplay(this.state.inputValues.photoId || '')
        const result = this.props.deletePhotoDisplay
        if (result === 1) {
            await this.Alert("Xóa thành công", "info");
            if (this.state.photos) {

                await this.handleBindData()
            }
            await this.setState({ isLoading: false, deleteImageDisplay: false, inputValues: {} })

        } else {
            await this.setState({ deleteImageDisplay: false })
            await this.Alert('Xóa thất bại', 'error')
        }
    }
    handleViewImage = async (item) => {
        let photos = []
        let photoTitle = []
        if (this.props.list) {
            for (let i = 0; i < this.props.list.length; i++) {
                photos.push(this.props.list[i].photoPath)
                photoTitle.push(this.props.list[i].photoType)
            }
            await this.setState({ photoItems: photos, photoTitle: photoTitle })
        }
        let index = this.state.photoItems.indexOf(item.photoPath)
        await this.setState({
            isOpen: true,
            photoIndex: index,
        })
    }
    itemTemplate(item) {
        this.setState({ itemPhotoGallery: item })
        return <img src={item ? item.photoPath : ''} alt={item ? item.photoDesc : ''} style={{ maxHeight: 432, display: 'block', minHeight: 431 }} />
    }
    itemTemplateThumb(item) {
        return <img src={item ? item.photoPath : ''} alt={item ? item.photoDesc : ''} style={{ maxHeight: 88, display: 'block' }} />;
    }
    onItemChange = (event) => {
        this.setState({ activeIndex: event.index });
    }
    footer = () => {
        const activeIndex = "(" + (this.state.activeIndex + 1) + '/' + this.state.photos.length + ")" + "  "
        return activeIndex
    }
    render() {
        const dataInput = this.props
        const footer = this.footer()
        return (
            <React.Fragment key={dataInput.list.shopId}>
                <Toast ref={(el) => this.toast = el} baseZIndex={1300000} />
                {this.state.isLoading && (<ProgressSpinner style={this.styleSpinner} strokeWidth="8" fill="none" animationDuration=".5s" />)}
                <div style={{ height: 540, position: 'relative' }} className="p-shadow-8">
                    <div style={{ width: "180px", position: 'absolute', right: 3, zIndex: 10, display: 'flex', top: 2 }}>
                        {this.state.permission && this.state.permission.view &&
                            <Button icon="pi pi-eye" className="p-button-success  view_gallery" style={{ marginRight: '10px' }}
                                onClick={() => this.handleViewImage(this.state.itemPhotoGallery)} />}
                        {this.state.permission && this.state.permission.create &&
                            <Button icon="pi pi-plus" className="p-button-info  insert_gallery" style={{ marginRight: '10px' }}
                                onClick={() => this.handleInsertImageDisplay(true, dataInput, this.props.list, this.state.itemPhotoGallery)} />}
                        {this.state.permission && this.state.permission.edit &&
                            <Button icon="pi pi-image" className="p-button-warning  update_gallery" style={{ marginRight: '10px' }}
                                onClick={() => this.handleDisplayImageEditor(true, dataInput, this.state.itemPhotoGallery, this.props.list)}
                                disabled={this.props.list.length === 0 ? true : false} />}
                        {this.state.permission && this.state.permission.delete &&
                            <Button icon="pi pi-trash" className="p-button-danger  delete_gallery"
                                onClick={() => this.handleDeleteImageDisplay(true, this.state.itemPhotoGallery)} />}
                    </div>
                    <Galleria value={this.state.photos}
                        showItemNavigators
                        showItemNavigatorsOnHover
                        numVisible={5}
                        thumbnailsPosition="bottom"
                        activeIndex={this.state.activeIndex}
                        caption={(e) => e ? footer + e.photoType : ''}
                        style={{ height: '100%' }}
                        onItemChange={this.onItemChange}
                        item={this.itemTemplate}
                        thumbnail={this.itemTemplateThumb} />
                </div>
                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.photoItems[this.state.photoIndex]}
                        imageTitle={this.state.photoTitle[this.state.photoIndex]}
                        nextSrc={this.state.photoItems[(this.state.photoIndex + 1) % this.state.photoItems.length]}
                        prevSrc={this.state.photoItems[(this.state.photoIndex + this.state.photoItems.length - 1) % this.state.photoItems.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (this.state.photoIndex + this.state.photoItems.length - 1) % this.state.photoItems.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (this.state.photoIndex + 1) % this.state.photoItems.length,
                            })
                        }
                    />
                )}
                <ActionImage
                    inputValues={this.state.inputValues}
                    imageForEdit={this.state.imageUrl}
                    handleChange={this.handleChange}
                    onChange={this.onChange}
                    handleChangeForm={this.handleChangeForm}
                    displaySideBar={this.state.editImageDisplaySidebar}
                    handleDisplayImageEditor={this.handleDisplayImageEditor}
                    actionImageGalary={this.updateImageGalary}
                    item={this.props.dataInput}
                    itemGallery={this.state.itemPhotoGallery}
                    list={this.props.list}
                    isLoading={this.state.isLoading}
                    name='Update'
                />
                <ActionImage
                    inputValues={this.state.inputValues}
                    imageForEdit={this.state.imageUrl}
                    handleChange={this.handleChange}
                    onChange={this.onChange}
                    handleChangeForm={this.handleChangeForm}
                    displaySideBar={this.state.insertImageDisplay}
                    handleDisplayImageEditor={this.handleInsertImageDisplay}
                    actionImageGalary={this.insertImageGalary}
                    item={this.props.dataInput}
                    itemGallery={this.state.itemPhotoGallery}
                    list={this.props.list}
                    isLoading={this.state.isLoading}
                    name='Insert'
                />
                <Dialog header="Confirmation" visible={this.state.deleteImageDisplay} modal style={{ width: '350px' }} footer={this.renderDeleteFooterDialog('displayConfirmation')} onHide={() => this.handleDeleteImageDisplay(false, this.state.itemPhotoGallery)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                </Dialog>
            </React.Fragment>
        )
    }
}
PhotoGalary.defaultProps = {
    photoType: null
}
function mapstateToProps(state) {
    return {
        language: state.languageList.language,
        loading: state.photos.loading,
        errors: state.photos.errors,
        list: state.photos.photo,
        // getPhotoTypeDisplay: state.displays.getPhotoTypeDisplay,
        // insertPhotoDisplay: state.displays.insertPhotoDisplay,
        // updatePhotoDisplay: state.displays.updatePhotoDisplay,
        // deletePhotoDisplay: state.displays.deletePhotoDisplay,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        PhotoController: bindActionCreators(PhotoCreateAction, dispatch),
    }
}
export default connect(mapstateToProps, mapDispatchToProps)(PhotoGalary);