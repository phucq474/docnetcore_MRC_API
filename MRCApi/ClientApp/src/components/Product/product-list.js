import React, { PureComponent } from "react";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
import { CategoryApp } from "../Controls/CategoryMaster";
import { bindActionCreators } from "redux";
import { ProductCreateAction } from "../../store/ProductController";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { connect } from "react-redux";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { download, HelpPermission } from "../../Utils/Helpler";
import ProductListDialog from "../Product/product-list-dialog";
import { Galleria } from "primereact/galleria";
import EditorTools from "../Controls/Tools/ImageEditor";
import {
  getImageUpdateName,
  getFolderImagePath,
  removeVietnameseTones,
} from "../../Utils/Helpler";
import Page403 from "../ErrorRoute/page403";
import productPrice from "./product-price";

class ProductList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      expandedRows: null,
      loading: false,
      isLoading: false,
      divisionId: 0,
      categoryId: 0,
      subCateId: "",
      showEdit: false,
      productId: 0,
      selectRow: null,
      isEmpty: false,
      typeIdFilter: "",
      activeIndexs: 0,
      status: { typeOption: "Active", status: 1 },
      // activeIndex: 0,
      activeIndex: { index: 0 },
      confirmUpdateDialog: false,
      confirmInsertDialog: false,

      displayImageEditor: false,

      insertDislayDialog: false,
      updateDislayDialog: false,

      options: [
        { typeOption: "Active", status: 1 },
        { typeOption: "InActive", status: 0 },
        { typeOption: "Default", status: null },
      ],

      inputValues: {},
      permission: {
        view: true,
        edit: true,
        create: true,
        import: true,
        export: true,
        delete: true,
      },
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
    this._child = React.createRef();
    this.fileInput = React.createRef();
    this.fileUpload = React.createRef();
    this.fileInputInsert = React.createRef();
    this.pageId = 6;
  }
  componentWillReceiveProps(nextprops) {
    if (
      nextprops.errors !== this.props.errors &&
      nextprops.errors !== undefined
    ) {
      this.Alert(nextprops.errors.toString());
    }
    if (
      nextprops.linkfile !== "" &&
      nextprops.linkfile !== this.props.linkfile
    ) {
      download(nextprops.linkfile);
    }
    this.setState({ loading: false });
  }
  // async componentWillMount() {
  //     let permission = await HelpPermission(this.pageId);
  //     await this.setState({ permission })
  // }
  async componentDidMount() {
    await this.props.ProductController.GetCategory();
    await this.props.ProductController.GetListProductType();
  }
  hanlderUploadFile = async (e) => {
    const data = {
      file: e.files[0],
    };
    await this.setState({ loading: true });
    await this.props.ProductController.PostImportFile(data);
    const result = this.props.importProduct;
    if (result && result.status === 1) {
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
    await this._child.current.clear();
    //
  };
  handlerChangeInput = (e) => {
    this.setState({
      [e.target.id]: e.target.value === null ? "" : e.target.value,
    });
  };
  Alert = (messager, typestyle) => {
    this.toast.show({
      severity: typestyle == null ? "success" : typestyle,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: messager,
    });
  };
  onSearch = async () => {
    const item = this.state;
    const data = {
      divisionId: item.divisionId ? item.divisionId : null,
      brandId: item.brandId ? item.brandId : null,
      categoryId: item.categoryId ? item.categoryId : null,
      subCateId: item.subCateId ? item.subCateId.toString() : null,
      variantId: item.variantId ? item.variantId : null,
      status: item.status ? item.status.status : null,
      productCode: item.productCode !== undefined ? item.productCode : null,
      productName: item.productName !== undefined ? item.productName : null,
    };
    await this.setState({ loading: true });
    await this.props.ProductController.GetProduct(data);
    await this.setState({ datas: this.props.list });
  };
  footDialog = () => {
    return (
      <div className="p-fluid">
        {this.state.permission !== undefined && this.state.permission.edit && (
          <Button
            icon="pi pi-save"
            label={
              this.state.productId > 0
                ? `${this.props.language["update"] || "l_update"}`
                : `${this.props.language["save"] || "save"}`
            }
            onClick={() => this.OnSaveProduct()}
            className="p-button-success"
          ></Button>
        )}
      </div>
    );
  };
  onEditButton = (e) => {
    this.setState({
      showEdit: true,
      selectRow: e,
      division: e.division,
      categoryId: e.cateId,
      subCateId: e.subCateId,
      productCode: e.productCode,
      productName: e.productName,
      productNameVN: e.productNameVN,
      productLine: e.productLine,
      class: e.class,
      dates: [
        new Date(e.fromDate),
        e.toDate !== null ? new Date(e.toDate) : null,
      ],
      newstatus: e.status,
      keymodel: e.report,
      productId: e.productId,
      typeId: e.typeId,
      unit: e.unit,
    });
  };
  itemTemplate = (item) => {
    return (
      <img
        src={
          item && item.imageBase64 ? item.imageBase64 : item ? item.Url : null
        }
        alt={(item && item.Index) || null}
        style={{
          maxHeight: 500,
          display: "block",
          width: "inherit",
          height: "inherit",
          minWidth: "300px",
          minHeight: 500,
          opacity: `${item ? 1 : 0}`,
        }}
      />
    );
  };
  thumbnailTemplate = (item) => {
    return (
      <img
        src={
          item && item.imageBase64 ? item.imageBase64 : item ? item.Url : null
        }
        alt={(item && item.Index) || null}
        style={{ height: "70px", width: "70px", display: "block" }}
      />
    );
  };
  rowExpansionTemplate = (rowData) => {
    let { photo, id } = rowData;
    try {
      if (photo) {
        photo = JSON.parse(photo);
        this.setState({ isEmpty: false });
      } else {
        photo = [
          {
            Index: 0,
            Url: "https://i.ibb.co/qCQ6RZW/c23498b124bf.png",
            isEmpty: true,
          },
        ];
        this.setState({ isEmpty: true });
        this.fileInputInsert = React.createRef();
      }
      return (
        <React.Fragment>
          {this.state.isLoading && (
            <ProgressSpinner
              style={this.styleSpinner}
              strokeWidth="8"
              fill="none"
              animationDuration=".5s"
            />
          )}
          <div
            style={{
              position: "relative",
              width: "fit-content",
              height: "100%",
              margin: "auto",
            }}
          >
            <Galleria
              value={
                photo === []
                  ? "https://i.ibb.co/qCQ6RZW/c23498b124bf.png"
                  : photo
              }
              numVisible={5}
              style={{ maxWidth: "700px", height: "100%" }}
              className="galleria_posm"
              item={this.itemTemplate}
              thumbnail={this.thumbnailTemplate}
              showItemNavigators
              circular
              showItemNavigatorsOnHover
              activeIndex={
                this.state.activeIndex ? this.state.activeIndex.index : 0
              }
              onItemChange={(e) => {
                this.setState({
                  activeIndex: {
                    ...this.state.activeIndex,
                    index: e.index,
                  },
                });
              }}
            />
            <div style={{ position: "absolute", top: "1%", right: "1%" }}>
              {this.state.permission && this.state.permission.delete && (
                <Button
                  icon="pi pi-trash"
                  className="p-button-danger p-button-outlined p-mr-2 btn_posm"
                  disabled={photo[0].isEmpty === true ? true : false}
                  onClick={() =>
                    this.handleDeleteDialogConfirm(true, photo, rowData)
                  }
                  tooltip="Delete"
                />
              )}
              {this.state.permission && this.state.permission.edit && (
                <Button
                  icon="pi pi-image"
                  className="p-button-warning p-button-outlined p-mr-2 btn_posm"
                  tooltip="Edit"
                  disabled={photo[0].isEmpty === true ? true : false}
                  onClick={() => {
                    this.handleDisplayImageEditor(
                      true,
                      "displayImageEditor",
                      {
                        imageForEdit:
                          photo[this.state.activeIndex.index || 0].Url,
                      },
                      photo,
                      rowData
                    );
                  }}
                />
              )}
              {this.state.permission && this.state.permission.create && (
                <Button
                  icon="pi pi-plus"
                  iconPos="right"
                  label={""}
                  className="p-button-outlined p-mr-2 btn_posm"
                  style={{ color: "lightgreen" }}
                  onClick={() =>
                    !this.fileInputInsert.current
                      ? console.log("error")
                      : this.fileInputInsert.current.click()
                  }
                  tooltip="Insert"
                />
              )}
              <input
                type="file"
                accept="image/*"
                ref={this.fileInputInsert}
                style={{ display: "none" }}
                onChange={async (e) =>
                  this.handleFileInputInsert(
                    e,
                    photo,
                    rowData,
                    photo[0].isEmpty === true ? true : false
                  )
                }
                multiple
              />
            </div>
          </div>
          <EditorTools
            isVisible={true}
            displaySideBar={this.state.displayImageEditor}
            imageForEdit={this.state.imageFile}
            dialogStateName={this.state.confirmUpdate}
            handleDisplayImageEditor={this.handleDisplayImageEditor}
          />

          <Dialog
            header="Confirmation"
            baseZIndex={14000000}
            modal
            style={{ width: "350px" }}
            visible={
              this.state.confirmUpdateDialog
                ? this.state.confirmUpdateDialog
                : this.state.confirmInsertDialog
            }
            footer={
              this.state.confirmUpdateDialog
                ? this.renderFooterUpdateConfirm("displayConfirmation")
                : this.renderFooterInsertConfirm("displayConfirmation")
            }
            onHide={() =>
              this.state.confirmUpdateDialog
                ? this.handleUpdateDialogConfirm(false)
                : this.handleInsertDialogConfirm(false)
            }
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: "2rem" }}
              />
              {this.state.confirmUpdateDialog ? (
                <span>Are you sure you want to UPDATE?</span>
              ) : (
                <span>Are you sure you want to INSERT?</span>
              )}
            </div>
          </Dialog>

          <Dialog
            header="Confirmation"
            baseZIndex={14000000}
            modal
            style={{ width: "350px" }}
            visible={this.state.confirmDeleteDialog}
            footer={this.renderFooterDeleteConfirm("displayConfirmation")}
            onHide={() => this.handleDeleteDialogConfirm(false)}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: "2rem" }}
              />
              <span>Are you sure you want to proceed?</span>
            </div>
          </Dialog>
        </React.Fragment>
      );
    } catch {
      console.log(rowData, "catch");
    }
  };
  //edit image
  handleDisplayImageEditor = async (
    boolean,
    stateName,
    imageFile,
    photo,
    rowData
  ) => {
    if (boolean) {
      if (imageFile && imageFile.imageForEdit !== undefined)
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            photoName: imageFile.imageForEdit,
            productId: rowData ? rowData.productId : "",
          },
          photo: photo,
        });
      if (imageFile && imageFile.imageBase64) {
        await fetch(imageFile.imageBase64)
          .then((res) => res.blob())
          .then(async (blob) => {
            let photoName = await getImageUpdateName(
              this.state.inputValues.photoName
            );
            const folderPath = await getFolderImagePath(
              this.state.inputValues.photoName
            );
            const iFile = new File([blob], photoName, { type: "image/jpg" });
            await this.setState({
              inputValues: {
                ...this.state.inputValues,
                ifile: iFile ? iFile : null,
                photoNew: photoName ? photoName : "",
                folderName: folderPath ? folderPath : "",
              },
              isLoading: false,
              confirmUpdateDialog: true,
            });
          });
        await this.handleUpdateDialogConfirm(this.state.confirmUpdateDialog);
      }
      await this.setState({
        displayImageEditor: true,
        imageFile: imageFile.imageForEdit,
      });
    } else {
      this.setState({
        displayImageEditor: false,
      });
    }
  };
  handleUpdateDialogConfirm = async (boolean) => {
    if (boolean === true) {
      await this.setState({
        confirmUpdateDialog: true,
      });

      let arr = this.state.photo.filter(
        (e) => e.Index === this.state.activeIndex.index
      );
      try {
        arr[0].Url =
          this.state.inputValues.folderName + this.state.inputValues.photoNew;
      } catch (e) {}
    } else {
      await this.setState({
        confirmUpdateDialog: false,
      });
    }
  };
  renderFooterUpdateConfirm = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              icon="pi pi-times"
              className="p-button-info"
              onClick={() => this.handleUpdateDialogConfirm(false)}
            />
            <Button
              label={this.props.language["update"] || "l_update"}
              icon="pi pi-check"
              className="p-button-success"
              onClick={() => this.handleUpdateImage()}
            />
          </div>
        )}
      </div>
    );
  };
  handleUpdateImage = async () => {
    await this.setState({ isLoading: true, loading: true });
    let photoSource = JSON.stringify(this.state.photo);
    let arr = this.state.photo.map((e) => e.Index);
    let indexMax = Math.max(...arr);
    await this.setState({
      inputValues: {
        ...this.state.inputValues,
        indexMax: indexMax,
        photoSource: photoSource,
      },
    });
    await this.props.ProductController.UpdatePhoToProduct(
      this.state.inputValues.ifile,
      this.state.inputValues.productId,
      this.state.inputValues.photoSource,
      this.state.inputValues.photoNew,
      this.state.inputValues.indexMax,
      this.state.inputValues.folderName,
      "update"
    );
    const result = this.props.updatePhotoProduct;
    if (result) {
      if (result[0].alert === "1") {
        let arr = this.state.datas.filter(
          (e) => e.productId === this.state.inputValues.productId
        );
        arr[0].photo = result[0].photo;
        await this.Alert("Cập nhập thành công", "info");
        this.setState({
          displayImageEditor: false,
          confirmUpdateDialog: false,
          loading: false,
          isLoading: false,
          inputValues: {},
        });
      }
    } else await this.Alert("Cập nhập thất bại", "error");
  };
  // delete image
  handleDeleteDialogConfirm = async (boolean, photo, rowData) => {
    if (boolean) {
      await photo.splice(this.state.activeIndex.index, 1);
      await this.setState({
        confirmDeleteDialog: true,
        inputValues: {
          ...this.state.inputValues,
          photoSource: photo.length === 0 ? "" : JSON.stringify(photo),
          productId: rowData ? rowData.productId : "",
        },
      });
    } else {
      await this.setState({
        confirmDeleteDialog: false,
      });
    }
  };
  renderFooterDeleteConfirm = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.delete && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              icon="pi pi-times"
              className="p-button-info"
              onClick={() => this.handleDeleteDialogConfirm(false)}
            />
            <Button
              label={this.props.language["delete"] || "l_delete"}
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => this.handleDeleteImage()}
            />
          </div>
        )}
      </div>
    );
  };
  handleDeleteImage = async () => {
    await this.setState({ isLoading: true });
    await this.props.ProductController.UpdatePhoToProduct(
      this.state.inputValues.ifile || "",
      this.state.inputValues.productId,
      this.state.inputValues.photoSource || "",
      this.state.inputValues.photoNew || "",
      this.state.inputValues.indexMax || "",
      this.state.inputValues.folderName || ""
    );
    const result = this.props.updatePhotoProduct;
    if (result) {
      if (result[0].alert === "1") {
        let arr = this.state.datas.filter(
          (e) => e.productId === this.state.inputValues.productId
        );
        arr[0].photo = result[0].photo;
        await this.Alert("Thêm thành công", "info");
        this.setState({
          confirmDeleteDialog: false,
          loading: false,
          isLoading: false,
          inputValues: {},
        });
      }
    } else await this.Alert("Thêm thất bại", "error");
  };
  handleFileInputInsert = async (e, photo, rowData, isEmpty) => {
    let arr = [];
    let indexMax = "";
    if (photo !== [] && isEmpty === false) {
      arr = photo.map((e) => e.Index);
      indexMax = Math.max(...arr);
    }
    await this.setState({
      inputValues: {
        ...this.state.inputValues,
        productId: rowData ? rowData.productId : "",
        photoSource: rowData ? rowData.photo : "",
        indexMax: indexMax ? indexMax : indexMax === 0 ? 0 : "",
        ifile: e.target.files ? e.target.files : "",
      },
    });
    if (e.target.files.length > 0) {
      this.setState({
        confirmInsertDialog: true,
      });
    }
  };
  renderFooterInsertConfirm = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.create && (
          <div>
            <Button
              label={this.props.language["cancel"] || "l_cancel"}
              icon="pi pi-times"
              className="p-button-info"
              onClick={() => this.handleInsertDialogConfirm(false)}
            />
            <Button
              label={this.props.language["insert"] || "l_insert"}
              icon="pi pi-check"
              className="p-button-success"
              onClick={() => this.handleInsertImage()}
            />
          </div>
        )}
      </div>
    );
  };
  handleInsertDialogConfirm = (boolean) => {
    if (boolean) {
      this.setState({
        confirmInsertDialog: true,
      });
    } else {
      this.setState({
        confirmInsertDialog: false,
      });
    }
  };
  //insert image
  handleInsertImage = async () => {
    await this.setState({ isLoading: true });
    await this.props.ProductController.UpdatePhoToProduct(
      this.state.inputValues.ifile,
      this.state.inputValues.productId,
      this.state.inputValues.photoSource || "",
      this.state.inputValues.photoNew || "",
      this.state.inputValues.indexMax === 0 ? 0 : "",
      this.state.inputValues.folderName || "",
      "insert"
    );
    const result = this.props.updatePhotoProduct;
    if (result[0].alert === "1") {
      let arr = this.state.datas.filter(
        (e) => e.productId === this.state.inputValues.productId
      );
      arr[0].photo = result[0].photo;
      await this.Alert("Thêm thành công", "info");
      this.setState({
        confirmInsertDialog: false,
        loading: false,
        inputValues: {},
        isLoading: false,
      });
    } else await this.Alert("Thêm thất bại", "error");
  };
  // edit
  handleAction = (rowData, e) => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <Button
            icon="pi pi-pencil"
            onClick={() => this.handleUpdateDialog(true, rowData)}
            className="p-button-outlined p-button-danger"
          />
        )}
      </div>
    );
  };
  handleUpdateDialog = async (boolean, rowData) => {
    if (boolean === true) {
      await this.setState({
        updateDislayDialog: true,
        inputValues: {
          ...this.state.inputValues,
          subCatId: rowData ? rowData.subCatId : 0,
          categoryId: rowData ? rowData.categoryId : 0,
          divisionId: rowData ? rowData.divisionId : "",
          brandId: rowData ? rowData.brandId : 0,
          variantId: rowData ? rowData.variantId : 0,
          productName: rowData ? rowData.productName : "",
          productNameVN: rowData ? rowData.productNameVN : "",
          typeId: rowData ? rowData.typeId : "",
          productCode: rowData ? rowData.productCode : "",
          unit: rowData ? rowData.unit : "",
          status: rowData.status === 1 ? true : false,
          top: rowData.top === 1 ? true : false,
          barcode: rowData.barcode || "",
          barrelBarcode: rowData.barrelBarcode || "",
          barrelPrice: rowData.barrelPrice || "",
          barrelSize: rowData.barrelSize || "",
          id: rowData.id,
          orderBy: rowData.orderBy || "",
          packsize: rowData.packsize || "",
          price: rowData.price || "",
        },
      });
    } else {
      await this.setState({
        updateDislayDialog: false,
        inputValues: {},
        loading: false,
      });
    }
  };
  updateFooterAction = () => {
    return (
      <div className="p-fluid">
        {
          <Button
            style={{ marginRight: "10px" }}
            label={this.props.language["cancel"] || "l_cancel"}
            className="p-button-info"
            icon="pi pi-times"
            onClick={() => this.handleUpdateDialog(false)}
          />
        }
        {this.state.permission !== undefined && this.state.permission.edit && (
          <Button
            icon="pi pi-save"
            label={
              this.state.productId > 0
                ? `${this.props.language["update"] || "l_update"}`
                : `${this.props.language["save"] || "save"}`
            }
            onClick={() => this.updateProduct()}
            className="p-button-success"
          ></Button>
        )}
      </div>
    );
  };
  updateProduct = async () => {
    let {
      categoryId,
      divisionId,
      brandId,
      variantId,
      subCatId,
      productCode,
      unit,
      productName,
      typeId,
      price,
      barcode,
      barrelPrice,
      barrelSize,
      barrelBarcode,
      packsize,
      orderBy,
      top,
      status,
      id,
      productNameVN,
    } = this.state.inputValues;
    if (await this.handleValid()) {
      const obj = {
        categoryId: categoryId || null,
        divisionId: divisionId || null,
        brandId: brandId || null,
        variantId: variantId || null,
        subCatId: subCatId || null,
        productCode: productCode,
        productName: removeVietnameseTones(productName),
        productNameVN:
          productNameVN && productNameVN !== "" ? productNameVN : productName,
        typeId: typeId ? parseInt(typeId.code) : null,
        unit: unit || null,
        price: price || null,
        barcode: barcode || null,
        barrelPrice: barrelPrice || null,
        barrelSize: barrelSize || null,
        barrelBarcode: barrelBarcode || null,
        packsize: packsize || null,
        orderBy: orderBy || null,
        top: top ? 1 : 0,
        status: status === true ? 1 : 0,
        id: id,
      };
      await this.props.ProductController.UpdateProduct(obj);
      const result = this.props.updateProduct;
      if (result && result[0] && result[0].alert === "1") {
        await this.setState({
          loading: false,
          updateDislayDialog: false,
          inputValues: {},
          datas: this.props.list,
        });
        await this.Alert("Cập nhập thành công", "info");
      } else {
        await this.Alert("Cập nhập thất bại", "error");
        await this.setState({ loading: false });
      }
    }
  };
  // handle
  handleChangeInput = (value, statename, id) => {
    this.setState({
      [statename]: {
        ...this.state[statename],
        [id]: value ? value : "",
      },
    });
  };
  handleChange = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
      [id]: value === null ? "" : value,
    });
  };
  handleChangeDropDown = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
    });
  };
  handleCalendar = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        dates: value ? value : "",
      },
    });
  };
  //insert
  handleInsertDialog = (boolean) => {
    if (boolean) {
      this.setState({
        insertDislayDialog: true,
        inputValues: {
          ...this.state.inputValues,
          status: true,
        },
      });
    } else {
      this.setState({
        insertDislayDialog: false,
        inputValues: {
          clearFile: this.state.inputValues.images ? true : false,
        },
        loading: false,
      });
    }
  };
  insertFooterAction = () => {
    return (
      <div className="p-fluid">
        {this.state.permission !== undefined &&
          this.state.permission.create && (
            <Button
              style={{ marginRight: "10px" }}
              label={this.props.language["cancel"] || "l_cancel"}
              className="p-button-info"
              icon="pi pi-times"
              onClick={() => this.handleInsertDialog(false)}
            />
          )}
        {this.state.permission !== undefined &&
          this.state.permission.create && (
            <Button
              icon="pi pi-save"
              label={
                this.state.productId > 0
                  ? `${this.props.language["update"] || "l_update"}`
                  : `${this.props.language["save"] || "save"}`
              }
              onClick={() => this.insertProduct()}
              className="p-button-success"
            ></Button>
          )}
      </div>
    );
  };
  handleValid = async () => {
    let check = true;

    if (!this.state.inputValues.productCode) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorProductCode: "Input Required!",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorProductCode: "" },
      });

    if (!this.state.inputValues.productName) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorProductName: "Input Required!",
        },
      });
      check = false;
    } else
      this.setState({
        inputValues: { ...this.state.inputValues, errorProductName: "" },
      });

    if (!check) return false;
    else return true;
  };
  insertProduct = async () => {
    await this.setState({ isLoading: true });
    if (await this.handleValid()) {
      let {
        subCatId,
        typeId,
        divisionId,
        unit,
        categoryId,
        productCode,
        productName,
        price,
        barcode,
        barrelPrice,
        barrelSize,
        packsize,
        orderBy,
        top,
        variantId,
        brandId,
        barrelBarcode,
        productNameVN,
      } = this.state.inputValues;
      const obj = {
        categoryId: categoryId || null,
        divisionId: divisionId || null,
        brandId: brandId || null,
        variantId: variantId || null,
        subCatId: subCatId || null,
        productCode: productCode,
        productName: removeVietnameseTones(productName),
        productNameVN:
          productNameVN && productNameVN !== "" ? productNameVN : productName,
        typeId: typeId ? parseInt(typeId.code) : null,
        unit: unit || null,
        price: price || null,
        barcode: barcode || null,
        barrelPrice: barrelPrice || null,
        barrelSize: barrelSize || null,
        barrelBarcode: barrelBarcode || null,
        packsize: packsize || null,
        orderBy: orderBy || null,
        top: top ? 1 : 0,
      };
      await this.props.ProductController.InsertProduct(obj);
      const result = this.props.insertProduct;
      if (result && result[0] && result[0].alert === "1") {
        await this.Alert("Thêm thành công", "info");
        await this.setState({
          datas: this.props.list,
          insertDislayDialog: false,
          inputValues: {},
          loading: false,
        });
      } else if (result && result[0] && result[0].alert === "-1") {
        await this.Alert(result[0].messenger, "error");
      } else await this.Alert("Thêm thất bại", "error");
      await this.setState({ loading: false });
    }
  };
  /// template
  handleGetTemp = async () => {
    await this.setState({ loading: true });
    await this.props.ProductController.GetTemplate();
    const result = this.props.getTemplate;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  /// export
  handleExport = async () => {
    const item = this.state;
    const data = {
      divisionId: item.divisionId ? item.divisionId : null,
      brandId: item.brandId ? item.brandId : null,
      categoryId: item.categoryId ? item.categoryId : null,
      subCateId: item.subCateId ? item.subCateId.toString() : null,
      variantId: item.variantId ? item.variantId : null,
      status:
        item.status && item.status.status !== undefined
          ? item.status.status
          : null,
      productCode: item.product !== undefined ? item.product : null,
      productName: item.productName !== undefined ? item.productName : null,
    };
    await this.setState({ loading: true });
    await this.props.ProductController.ExportProduct(data);
    const result = this.props.exportProduct;
    if (result && result.status === 1) {
      await download(result.fileUrl);
      await this.Alert(result.message, "info");
    } else await this.Alert(result.message, "error");
    await this.setState({ loading: false });
  };
  render() {
    let leftSearch = [],
      rightSearch = [],
      UpdateDialog = [],
      InsertDialog = null;
    if (this.state.permission) {
      if (this.state.permission.view) {
        leftSearch.push(
          <Button
            onClick={() => this.onSearch()}
            label={this.props.language["search"] || "search"}
            className="p-button-success"
            icon="pi pi-search"
          ></Button>
        );
      }
      if (this.state.permission.export && this.state.permission.view === true) {
        leftSearch.push(
          <Button
            label={this.props.language["export"] || "l_export"}
            style={{ marginLeft: 10, marginRight: 10 }}
            className="p-button-info"
            icon="pi pi-download"
            onClick={() => this.handleExport()}
          />
        );
      }
      // leftSearch.push(
      //   <Button
      //     variant="btn btn-success"
      //     onClick={() => (window.location.href = "Product/ProductPrice")}
      //   >
      //     Price
      //   </Button>
      // );
      if (this.state.permission.import && this.state.permission.view === true) {
        rightSearch.push(
          <Button
            label={this.props.language["template"] || "l_template"}
            style={{ marginLeft: 10, marginRight: 10, width: "full" }}
            className="p-button-danger"
            icon="pi pi-download"
            onClick={() => this.handleGetTemp()}
          />
        );

        rightSearch.push(
          <FileUpload
            chooseLabel={this.props.language["import"] || "l_import"}
            accept=".xlsx"
            uploadHandler={this.hanlderUploadFile}
            ref={this._child}
            multiple={false}
            customUpload={true}
            mode="basic"
            className="p-button-primary"
          />
        );
        rightSearch.push(
          <Button
            icon="pi pi-times"
            style={{ marginLeft: 10 }}
            className="p-button-danger p-button-text"
            onClick={() => {
              this._child.current.fileInput = { value: "" };
              this._child.current.clear();
            }}
          />
        );
      }
      if (
        this.state.permission.create === true &&
        this.state.permission.view === true
      ) {
        rightSearch.push(
          <Button
            label={this.props.language["create"] || "create"}
            style={{ marginRight: 10 }}
            icon="pi pi-plus"
            onClick={() => this.handleInsertDialog(true)}
          />
        );
      }
    }
    return this.state.permission.view ? (
      <>
        <Toast ref={(el) => (this.toast = el)} />
        <Accordion
          activeIndex={this.state.activeIndexs}
          onTabChange={(e) => this.setState({ activeIndexs: e.index })}
        >
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div className="p-grid">
              {<CategoryApp id="appcate" {...this} />}
              <div className="p-field p-col-12 p-md-3">
                <label>
                  {this.props.language["product_code"] || "l_product_code"}
                </label>
                <InputText
                  placeholder={
                    this.props.language["product_code"] || "l_product_code"
                  }
                  className="w-100"
                  id="productCode"
                  value={this.state.productCode || ""}
                  onChange={this.handlerChangeInput}
                ></InputText>
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>
                  {this.props.language["product_name"] || "l_product_name"}
                </label>
                <InputText
                  placeholder={
                    this.props.language["product_name"] || "l_product_name"
                  }
                  className="w-100"
                  id="productName"
                  value={this.state.productName || ""}
                  onChange={this.handlerChangeInput}
                ></InputText>
              </div>
              <div className="p-field p-col-12 p-md-3">
                <label>{this.props.language["status"] || "status"}</label>
                <br />
                <Dropdown
                  style={{ width: "100%" }}
                  value={this.state.status}
                  options={this.state.options}
                  onChange={(e) => this.setState({ status: e.value })}
                  optionLabel="typeOption"
                />
              </div>
              {/* <div className="p-col-12 p-md-3 p-sm-6">
                                    <label>{this.props.language["deleted"] || "l_deleted"}</label><br />
                                    <RadioButton value={1} name="delete" inputId="radDel"
                                        onChange={(e) => this.setState({ isDelete: e.value })}
                                        checked={this.state.isDelete === 1} />
                                    <label htmlFor="radDel">{this.props.language["deleted"] || "l_deleted"}</label>
                                    <RadioButton id="radUdel" value={0} name="delete"
                                        onChange={(e) => this.setState({ isDelete: e.value })}
                                        checked={this.state.isDelete === 0} />
                                    <label htmlFor="radUdel">{this.props.language["on_system"] || "l_on_system"}</label>
                                </div> */}
            </div>
            <Toolbar left={leftSearch} right={rightSearch} />
            {this.state.loading ? (
              <ProgressBar
                mode="indeterminate"
                style={{ height: "5px" }}
              ></ProgressBar>
            ) : null}
          </AccordionTab>
        </Accordion>
        <DataTable
          value={this.state.datas}
          paginator
          rows={20}
          rowsPerPageOptions={[20, 50, 100]}
          expandedRows={this.state.expandedRows}
          onRowToggle={(e) => {
            this.setState({ expandedRows: e.data });
          }}
          // rowExpansionTemplate={this.rowExpansionTemplate}
          paginatorPosition={"both"}
          rowHover
          dataKey="rowNum"
        >
          {/* <Column expander={true} style={{ width: '3em' }} /> */}
          <Column
            filter
            style={{ width: "3%", textAlign: "center" }}
            field="rowNum"
            header="No."
          />
          <Column
            filter
            filterMatchMode="contains"
            style={{ width: "10%", textAlign: "center" }}
            field="division"
            header={this.props.language["division"] || "Cat"}
          />
          <Column
            filter
            filterMatchMode="contains"
            style={{ width: "10%", textAlign: "center" }}
            field="brand"
            header={this.props.language["category.brand"] || "SubCat"}
          />
          {/* <Column filter style={{ width: 150 }} field="category" header={this.props.language["category"] || "category"} />
                        <Column filter style={{ width: 150 }} field="subCategory" header={this.props.language["subcategory"] || "subcategory"} />
                        <Column filter style={{ width: 150 }} field="variant" header={this.props.language["variant"] || "variant"} /> */}
          <Column
            filter
            filterMatchMode="contains"
            style={{ width: "10%", textAlign: "center" }}
            field="productCode"
            header={this.props.language["product.code"] || "product.code"}
          />
          <Column
            filter
            filterMatchMode="contains"
            headerStyle={{ textAlign: "center" }}
            field="productName"
            header={this.props.language["product.name"] || "product.name"}
          />
          <Column
            filter
            filterMatchMode="contains"
            style={{ width: 150, textAlign: "center" }}
            field="price"
            header={this.props.language["price"] || "price"}
          />
          <Column
            filter
            filterMatchMode="contains"
            style={{ width: 150, textAlign: "center" }}
            field="unit"
            header={this.props.language["Unit"] || "Đóng gói"}
          />
          <Column
            filter
            filterMatchMode="contains"
            style={{ width: 150, textAlign: "center" }}
            field="barrelSize"
            header={this.props.language["BarrelSize"] || "Quy cách thùng"}
          />
          <Column
            filter
            style={{ width: 150, textAlign: "center" }}
            field="barcode"
            header={this.props.language["BarcodeProduct"] || "Barcode sản phẩm"}
          />
          <Column
            filter
            style={{ width: 150, textAlign: "center" }}
            field="barrelBarcode"
            header={this.props.language["BarrelBarcode"] || "Barcode thùng"}
          />
          <Column
            style={{ width: 80, textAlign: "center" }}
            header="#"
            body={(rowData, e) =>
              this.state.permission !== undefined &&
              this.handleAction(rowData, e)
            }
          />
        </DataTable>
        {this.state.insertDislayDialog && (
          <ProductListDialog
            inputValues={this.state.inputValues}
            nameAction="Insert"
            stateName="inputValues"
            displayDialog={this.state.insertDislayDialog}
            handleChange={this.handleChange}
            handleChangeInput={this.handleChangeInput}
            handleActionDialog={this.handleInsertDialog}
            footerAction={this.insertFooterAction}
            handleCalendar={this.handleCalendar}
            handleChangeDropDown={this.handleChangeDropDown}
            listProductType={this.props.getListProductType}
          />
        )}
        {this.state.updateDislayDialog && (
          <ProductListDialog
            inputValues={this.state.inputValues}
            nameAction="Update"
            stateName="inputValues"
            displayDialog={this.state.updateDislayDialog}
            handleChange={this.handleChange}
            handleChangeInput={this.handleChangeInput}
            handleActionDialog={this.handleUpdateDialog}
            footerAction={this.updateFooterAction}
            handleCalendar={this.handleCalendar}
            handleChangeDropDown={this.handleChangeDropDown}
            listProductType={this.props.getListProductType}
          />
        )}
        {/* {InsertDialog} */}
        {/* {UpdateDialog} */}
      </>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.products.categories,
    urlFile: state.products.urlFile,
    list: state.products.list,
    errors: state.products.errors,
    loading: state.products.loading,
    linkfile: state.products.linkfile,
    usedivision: true,
    usebrand: true,
    usecate: false,
    usesubcate: false,
    usevariant: false,
    language: state.languageList.language,
    insertProduct: state.products.insertProduct,
    updateProduct: state.products.updateProduct,
    importProduct: state.products.importProduct,
    getTemplate: state.products.getTemplate,
    exportProduct: state.products.exportProduct,
    updatePhotoProduct: state.products.updatePhotoProduct,
    getListProductType: state.products.getListProductType,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ProductController: bindActionCreators(ProductCreateAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
