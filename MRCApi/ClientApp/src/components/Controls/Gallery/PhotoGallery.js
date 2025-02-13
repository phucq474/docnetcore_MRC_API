import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Galleria } from "primereact/galleria";
import { bindActionCreators } from "redux";
import { PhotoCreateAction } from "../../../store/PhotoController";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../../../css/MenuStyle.css";
import ActionImage from "./ActionImage";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import Lightbox from "react-image-lightbox";
import { getImageUpdateName } from "../../../Utils/Helpler";
import { HelpPermission } from "../../../Utils/Helpler";

const pageIdList = [26, 2054, 2055, 2056];

class PhotoGallery extends PureComponent {
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

      listPhotoType: [],
    };
    this.styleSpinner = {
      width: "50px",
      height: "50px",
      position: "fixed",
      zIndex: 1400000,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };

    this.handleBindData = this.handleBindData.bind(this);
    this.itemTemplate = this.itemTemplate.bind(this);
    this.itemTemplateThumb = this.itemTemplateThumb.bind(this);
    this.handleImageDisplay = this.handleImageDisplay.bind(this);
    this.handleInsertImageDisplay = this.handleInsertImageDisplay.bind(this);
    this.handleDisplayImageEditor = this.handleDisplayImageEditor.bind(this);
    this.handleDeleteImageDisplay = this.handleDeleteImageDisplay.bind(this);
    this.renderDeleteFooterDialog = this.renderDeleteFooterDialog.bind(this);
  }
  componentDidMount() {
    this.handleBindData();
  }
  async componentWillMount() {
    let permission = await HelpPermission(this.props.pageId);
    await this.setState({ permission });

    await this.props.PhotoController.GetPhotoType(this.props.reportId).then(() => {
      this.setState({ listPhotoType: this.props.getPhotoType ? this.props.getPhotoType : [] })
    });
  }
  Alert = (mess, style) => {
    if (style === undefined) style = "success";
    this.toast.show({
      severity: style,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: mess,
    });
  };
  handleBindData() {
    const data = this.props.dataInput;
    this.props.PhotoController.GetPhotoByShop({
      workDate: data.workDate,
      employeeId: data.employeeId,
      shopId: data.shopId,
      photoType: this.props.photoType,
    }).then(() => {
      if (!this.props.ReportId) this.setState({ photos: this.props.list });
      else {
        this.setState({
          photos: this.props.list.filter(
            (item) => item.reportId === this.props.ReportId
          ),
        });
      }
    });
  }
  async handleInsertImageDisplay(
    boolean,
    dataInput,
    itemGallery,
    list,
    loadImage = {}
  ) {
    let photoTime = {};
    let dateObj = new Date();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    photoTime = hours + ":" + minutes + ":" + seconds;
    if (boolean) {
      await this.setState({
        insertImageDisplay: true,
        inputValues: {
          ...this.state.inputValues,
          employeeId: dataInput.employeeId,
          shopId: dataInput.shopId,
          workDate: dataInput.workDate,
          photoTime: photoTime,
          reportId: dataInput.reportId,
          loadImage: loadImage,
        },
      });

      if (loadImage && loadImage.imageBase64 !== undefined) {
        await this.setState({ isLoading: true });
        fetch(loadImage.imageBase64)
          .then((res) => res.blob())
          .then((blob) => {
            const imageFile = new File([blob], "Filename.jpg", {
              type: "image/jpg",
            });
            this.setState({
              inputValues: {
                ...this.state.inputValues,
                ifile: imageFile ? imageFile : null,
              },
              isLoading: false,
            });
          });
      }
    } else {
      await this.setState({
        insertImageDisplay: false,
        inputValues: {},
        isLoading: false,
      });
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
      },
    });
  };
  insertImageGalary = async () => {
    if ((await this.handlePhotoValid()) === true) {
      //   await this.setState({ isLoading: true })
      console.log("this.state.inputValues", this.state.inputValues);
      const inputValues = await this.state.inputValues;
      const formData = new FormData();
      await formData.append("JsonData", JSON.stringify(inputValues));
      await formData.append("IFile", inputValues.ifile || null);
      await formData.append("EmployeeId", inputValues.employeeId || null);
      await formData.append("ShopId", inputValues.shopId || null);
      await formData.append("WorkDate", inputValues.workDate || null);
      await formData.append("ReportId", inputValues.reportId || null);
      await formData.append(
        "PhotoType",
        inputValues.photoType.photoType || null
      );
      await formData.append(
        "PhotoMore",
        inputValues.photoType.photoMore || null
      );
      await this.props.PhotoController.SavePhoto(formData, this.props.accId);
      let result = await this.props.savePhoto;
      console.log("result", result);
      if (result.status === 1 || result.status === 200) {
        if (this.props.list) {
          await this.props.list.push(result);
        }
        await this.Alert(result.message, "info");
        await this.handleBindData();
        await this.setState({
          isLoading: false,
          insertImageDisplay: false,
          inputValues: {},
          imageUrl: null,
        });
      } else {
        await this.setState({ isLoading: false });
        await this.Alert(result.message, "error");
      }
    }
  };

  async handleDisplayImageEditor(
    boolean = false,
    dataInput = null,
    itemGallery,
    list,
    loadImage = {}
  ) {
    if (boolean === true) {
      if (dataInput !== null) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            employeeId: dataInput.employeeId,
            shopId: dataInput.shopId,
            photoNote: itemGallery.photoNote,
            photo: itemGallery.photo,
            photoType: { photoType: itemGallery.photoType },
            promotionId: itemGallery.promotionId,
            photoId: itemGallery.photoID,
            reportId: itemGallery.reportId
              ? itemGallery.reportId
              : dataInput.reportId,
          },
          loadImage: loadImage,
          imageUrl: itemGallery.photo,
        });
        await this.urlToObject(this.state.inputValues.photo);
      }

      if (loadImage && loadImage.imageBase64 !== undefined) {
        fetch(loadImage.imageBase64)
          .then((res) => res.blob())
          .then(async (blob) => {
            let photoName = await getImageUpdateName(
              this.state.inputValues.photoName
            );
            await this.setState({
              inputValues: {
                ...this.state.inputValues,
                photoNew: photoName ? photoName : "",
              },
              isLoading: true,
            });
            const imageFile = new File([blob], photoName, {
              type: "image/jpg",
            });
            await this.setState({
              inputValues: {
                ...this.state.inputValues,
                ifile: imageFile ? imageFile : null,
              },
              isLoading: false,
            });
          });
      }
      await this.setState({ editImageDisplaySidebar: true });
    } else {
      await this.setState({
        editImageDisplaySidebar: false,
        imageUrl: null,
        inputValues: {},
        isLoading: false,
      });
    }
  }
  handleImageDisplay(boolean, list) {
    if (boolean === true) {
      this.setState({
        imageDisplay: true,
        list: list,
      });
    } else {
      this.setState({
        imageDisplay: false,
      });
    }
  }
  handlePhotoValid = async () => {
    let check = true;
    if (!this.state.inputValues.ifile) {
      await this.Alert("Vui lòng lưu hình trước khi insert", "error");
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorIfile: "" },
      });

    if (!this.state.inputValues.photoType) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorPhotoType: "Input Required",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorPhotoType: "" },
      });

    if (!check) return false;
    else return true;
  };
  handleChangeForm = async (value, stateName = "", subStateName) => {
    console.log("value", value);
    if (subStateName === "ifile") {
      await this.setState({
        imageUrl: URL.createObjectURL(value),
      });
    }
    await this.setState({
      [stateName]: {
        ...this.state[stateName],
        [subStateName]: value == null ? "" : value,
      },
    });
  };
  handleChange = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
    });
  };
  onChange = async (e, value) => {
    await this.setState({
      inputValues: {
        ...this.state.inputValues,
        [e]: value === null ? "" : value,
      },
    });
  };
  handleDeleteImageDisplay(boolean, itemGallery) {
    if (boolean === true) {
      this.setState({
        deleteImageDisplay: true,
        inputValues: {
          ...this.state.inputValues,
          photoId: itemGallery.id,
        },
      });
    } else {
      this.setState({
        deleteImageDisplay: false,
      });
    }
  }
  renderDeleteFooterDialog() {
    return (
      <div>
        <Button
          hidden={this.state.delete}
          label="Cancel"
          className="p-button-info"
          icon="pi pi-times"
          onClick={() => this.handleDeleteImageDisplay(false)}
        />
        <Button
          hidden={this.state.delete}
          label="Delete"
          className="p-button-danger"
          icon="pi pi-check"
          onClick={() => this.deleteImageGalary()}
        />
      </div>
    );
  }
  deleteImageGalary = async () => {
    await this.setState({ isLoading: true });
    await this.props.PhotoController.DeletePhoto(
      this.state.inputValues.photoId || ""
    );
    const result = this.props.deletePhoto;
    if (result === 1) {
      await this.Alert("Xóa thành công", "info");
      await this.handleBindData();
      await this.setState({
        isLoading: false,
        deleteImageDisplay: false,
        inputValues: {},
      });
    } else {
      await this.setState({ deleteImageDisplay: false });
      await this.Alert("Xóa thất bại", "error");
    }
  };
  handleViewImage = async (item) => {
    let photos = [];
    let photoTitle = [];
    if (this.props.list) {
      for (let i = 0; i < this.props.list.length; i++) {
        photos.push(this.props.list[i].photo);
        photoTitle.push(
          this.props.list[i].photoType + " - " + this.props.list[i].division
        );
      }
      await this.setState({ photoItems: photos, photoTitle: photoTitle });
    }
    let index = this.state.photoItems.indexOf(item.photo);
    await this.setState({
      isOpen: true,
      photoIndex: index,
    });
  };
  itemTemplate(item) {
    this.setState({ itemPhotoGallery: item });
    return (
      <img
        src={item ? item.photo : ""}
        alt={item ? item.photoDesc : ""}
        style={{ maxHeight: 432, display: "block", minHeight: 431 }}
      />
    );
  }
  itemTemplateThumb(item) {
    return (
      <img
        src={item ? item.photo : ""}
        alt={item ? item.photoDesc : ""}
        style={{ maxHeight: 88, display: "block" }}
      />
    );
  }
  onItemChange = (event) => {
    this.setState({ activeIndex: event.index });
  };
  footer = () => {
    const activeIndex =
      "(" +
      (this.state.activeIndex + 1) +
      "/" +
      this.state.photos.length +
      ")" +
      "  ";
    return activeIndex;
  };
  render() {
    const dataInput = this.props;
    const footer = this.footer();
    return (
      <React.Fragment key={dataInput.list.shopId}>
        <Toast ref={(el) => (this.toast = el)} baseZIndex={1300000} />
        {this.state.isLoading && (
          <ProgressSpinner
            style={this.styleSpinner}
            strokeWidth="8"
            fill="none"
            animationDuration=".5s"
          />
        )}
        <div
          style={{ height: 540, position: "relative" }}
          className="p-shadow-8"
        >
          <div
            style={{
              width: "180px",
              position: "absolute",
              right: 3,
              zIndex: 10,
              display: "flex",
              top: 2,
            }}
          >
            {this.state.permission && this.state.permission.view && (
              <Button
                icon="pi pi-eye"
                className="p-button-success  view_gallery"
                style={{ marginRight: "10px" }}
                onClick={() =>
                  this.handleViewImage(this.state.itemPhotoGallery)
                }
              />
            )}
            {this.state.permission &&
              this.state.permission.create &&
              (this.props.insert ||
                pageIdList.filter((e) => e !== dataInput.pageId).length <=
                0) && (
                <Button
                  icon="pi pi-plus"
                  className="p-button-info  insert_gallery"
                  style={{ marginRight: "10px" }}
                  onClick={() =>
                    this.handleInsertImageDisplay(
                      true,
                      dataInput,
                      this.props.list,
                      this.state.itemPhotoGallery
                    )
                  }
                />
              )}
            {this.state.permission &&
              this.state.permission.delete &&
              (this.props.delete ||
                pageIdList.filter((e) => e !== dataInput.pageId).length <=
                0) && (
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger  delete_gallery"
                  onClick={() =>
                    this.handleDeleteImageDisplay(
                      true,
                      this.state.itemPhotoGallery
                    )
                  }
                />
              )}
          </div>
          <Galleria
            value={this.state.photos}
            showItemNavigators
            showItemNavigatorsOnHover
            numVisible={5}
            thumbnailsPosition="bottom"
            activeIndex={this.state.activeIndex}
            caption={(e) =>
              e ? footer + e.photoType + " - " + e.division : ""
            }
            style={{ height: "100%" }}
            onItemChange={this.onItemChange}
            item={this.itemTemplate}
            thumbnail={this.itemTemplateThumb}
          />
        </div>
        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.photoItems[this.state.photoIndex]}
            imageTitle={this.state.photoTitle[this.state.photoIndex]}
            nextSrc={
              this.state.photoItems[
              (this.state.photoIndex + 1) % this.state.photoItems.length
              ]
            }
            prevSrc={
              this.state.photoItems[
              (this.state.photoIndex + this.state.photoItems.length - 1) %
              this.state.photoItems.length
              ]
            }
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (this.state.photoIndex + this.state.photoItems.length - 1) %
                  this.state.photoItems.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex:
                  (this.state.photoIndex + 1) % this.state.photoItems.length,
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
          displaySideBar={this.state.insertImageDisplay}
          handleDisplayImageEditor={this.handleInsertImageDisplay}
          actionImageGalary={this.insertImageGalary}
          item={this.props.dataInput}
          itemGallery={this.state.itemPhotoGallery}
          list={this.props.list}
          isLoading={this.state.isLoading}
          listPhotoType={this.state.listPhotoType}
          name="Insert"
        />
        <Dialog
          header="Confirmation"
          visible={this.state.deleteImageDisplay}
          modal
          style={{ width: "350px" }}
          footer={this.renderDeleteFooterDialog("displayConfirmation")}
          onHide={() =>
            this.handleDeleteImageDisplay(false, this.state.itemPhotoGallery)
          }
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle p-mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>Are you sure you want to delete?</span>
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}
PhotoGallery.defaultProps = {
  photoType: null,
  insert: false,
  delete: false,
  edit: false,
};
function mapstateToProps(state) {
  return {
    language: state.languageList.language,
    loading: state.photos.loading,
    errors: state.photos.errors,
    list: state.photos.photo,
    savePhoto: state.photos.savePhoto,
    deletePhoto: state.photos.deletePhoto,
    getPhotoType: state.photos.getPhotoType,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    PhotoController: bindActionCreators(PhotoCreateAction, dispatch),
  };
}
export default connect(mapstateToProps, mapDispatchToProps)(PhotoGallery);
