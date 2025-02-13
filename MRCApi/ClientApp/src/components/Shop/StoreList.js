import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ProgressBar } from "primereact/progressbar";
import { Toolbar } from "primereact/toolbar";
import React, { Component } from "react";
import { connect } from "react-redux";
//React-redux
import { bindActionCreators } from "redux";
import { actionCreatorsShop } from "../../store/ShopController";
import {
  getToken,
  URL,
  HelpPermission,
  removeVietnameseTones,
  validInput,
  getEmployeeId,
  getAccountId,
  download,
  getLogin,
} from "../../Utils/Helpler";
import ShopDetail from "./ShopDetail";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import Page403 from "../ErrorRoute/page403";
import { ShopTargetAPI } from "../../store/ShopTargetController";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import Lightbox from "react-image-lightbox";
import CustomerDropDownList from "../Controls/CustomerDropDownList";
import ChannelDropDownList from "../Controls/ChannelDropDownList";
import { RegionApp } from "../Controls/RegionMaster";
import { RegionActionCreate } from "../../store/RegionController";
import moment from "moment";
import { AccountDropDownList } from "../Controls/AccountDropDownList";

class StoreList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      insertStorelist: false,
      updateStorelist: false,
      typeAction: "Insert",
      actionName: "Insert",
      confirmUpdateImage: false,
      insertTable: false,
      updateTable: false,
      deleteTable: false,
      isDelete: 0,
      ifile: null,
      inputValues: { dataTables: [], dataShopSupplier: [] },
      loading: false,
      isLoading: false,
      showDetail: false,
      mergeDialog: false,
      statusCode: true,
      alert: {
        title: "",
        text: "",
      },
      permission: {},
      accId: null,
    };
    this.temp = 0;
    this.pageId = 11;
    this.LoadList = this.LoadList.bind(this);
    this.onHide = this.onHide.bind(this);
    this.uploadFile = React.createRef();
    this.fileInput = React.createRef();
  }
  getFilter = () => {
    const shopCode = this.state.shopCode || null;
    const shopName = this.state.shopName || null;
    const area = this.state.area ? this.state.area : null;
    const provinceId = this.state.province
      ? this.state.province.toString()
      : null;
    const status = this.state.statusCode ? 1 : 0;
    const channelId = this.state.channelId || null;
    const customerId = this.state.customerId || null;
    const filter = {
      shopCode,
      shopName,
      area,
      provinceId,
      status,
      channelId,
      customerId,
    };
    return filter;
  };
  LoadList() {
    this.setState({ loading: true });
    const token = getToken();
    const filter = this.getFilter();
    this.setState({ loading: true });
    this.props.ShopController.GetList(filter, this.state.accId).then(() => {
      if (this.props.shoplists.length > 0) {
        this.setState({
          shoplists: this.props.shoplists,
          loading: false,
        });
        this.toast.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Results " + this.props.shoplists.length,
        });
      } else {
        this.toast.show({
          severity: "info",
          summary: "Thông báo",
          detail: "Không có dữ liệu",
        });
        this.setState({ shoplists: this.props.shoplists });
      }
    });
  }
  Alert = (messager, typestyle) => {
    this.toast.show({
      severity: typestyle == null ? "success" : typestyle,
      summary: `${this.props.language["annoucement"] || "l_annoucement"}`,
      detail: messager,
    });
  };
  componentWillMount() {
    this.LoadList();
  }

  componentWillReceiveProps() {
    this.setState({ loading: false });
  }
  closeModel = (ShopDetailData) => {
    this.setState({ showDetail: ShopDetailData.show });
  };
  actionTemplate = (rowData, column) => {
    return (
      <div style={{ textAlign: "center" }}>
        {this.state.permission &&
          this.state.permission.view &&
          this.state.permission.edit && (
            <Button
              type="button"
              icon="pi pi-pencil"
              className="p-button-warning"
              style={{ marginRight: "20px" }}
              onClick={() => this.handleUpdateStoreDialog(true, rowData)}
            ></Button>
          )}
      </div>
    );
  };
  OnEdit = (data) => {
    this.setState({ showDetail: true, isEdit: true, shop: data });
  };
  OnDelete = (rowData) => {
    this.setState({ visibleConfirm: true, shopId: rowData.shopId });
  };
  onHide() {
    this.setState({ visibleConfirm: false });
  }
  OnConfirmDelete = () => {
    // this.props.ShopController.Delete(this.state.shopId);
    // this.setState({ visibleConfirm: false });
  };
  OnCreateTemplate = async () => {
    this.setState({ loading: true });
    const token = getToken();
    const url = URL + `shops/Template`;
    let accountName = getLogin().accountName;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        accountName: accountName,
        accId: this.state.accId || "",
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      const linkTemplate = await response.json();
      if (linkTemplate.status === 1) {
        await download(linkTemplate.fileUrl);
        await this.Alert(linkTemplate.message, "info");
      } else if (linkTemplate.status !== 1)
        await this.Alert(linkTemplate.message, "error");
    } catch (err) {
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: err,
        life: 3000,
      });
    } finally {
      this.setState({ loading: false });
    }
  };
  OnExport = async () => {
    this.setState({ loading: true });
    const token = getToken();
    const url = URL + `shops/Export`;
    const filter = this.getFilter();
    let accountName = getLogin().accountName;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        accountName: accountName,
        accId: this.state.accId || "",
      },
      body: "'" + JSON.stringify(filter) + "'",
    };
    try {
      const response = await fetch(url, requestOptions);
      const link = await response.json();
      if (link.status === 1) {
        // await this.setState({ linkExport: link.fileUrl });
        await download(link.fileUrl);
        await this.Alert(link.message, "info");
      } else if (link.status !== 1) await this.Alert(link.message, "error");
    } catch (err) {
      this.toast.show({
        severity: "error",
        summary: "Thông báo",
        detail: err,
        life: 3000,
      });
    } finally {
      this.setState({ loading: false });
    }
  };
  Import = async (e) => {
    this.setState({ loading: true });
    const url = URL + `shops/Import`;
    const formData = new FormData();
    formData.append("ifile", e.files[0]);
    let accountName = getLogin().accountName;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        accountName: accountName,
        accId: this.state.accId || "",
      },
      body: formData,
    };

    try {
      const request = new Request(url, requestOptions);
      const response = await fetch(request);
      const importShop = await response.json();
      if (importShop.status === 1) {
        this.toast.show({
          severity: "success",
          summary: "Thông báo",
          detail: importShop.message,
        });
      }
      if (importShop.status !== 1) {
        this.toast.show({
          severity: "error",
          summary: "Thông báo",
          detail: importShop.message,
        });
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
      this.uploadFile.current.clear();
    }
  };
  Clear = () => {
    this.uploadFile.current.fileInput = { value: "" };
    this.uploadFile.current.clear();
  };

  // insert
  handleInsertStoreDialog = (boolean) => {
    if (boolean) {
      this.setState({
        insertStorelist: true,
        inputValues: { ...this.state.inputValues, statusCode: true },
      });
    } else {
      this.setState({
        insertStorelist: false,
        inputValues: { dataTables: [], dataShopSupplier: [] },
      });
    }
  };
  footerInsertStoreDialog = () => {
    return (
      <div>
        <Button
          style={{ marginRight: "10px" }}
          label="Cancel"
          icon="pi pi-times"
          className="p-button-info"
          onClick={() => this.handleInsertStoreDialog(false)}
        />
        <Button
          label="Insert"
          icon="pi pi-check"
          className="p-button-success"
          onClick={() => this.handleInsert()}
        />
      </div>
    );
  };
  handleValid = async () => {
    let check = true;
    if (!this.state.inputValues.shopName) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShopName: "Input Required",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorShopName: "" },
      });

    if (!this.state.inputValues.area) {
      await this.setState({
        inputValues: { ...this.state.inputValues, errorArea: "Input Required" },
      });
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorArea: "" },
      });

    if (!this.state.inputValues.provinceId) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorProvinceId: "Input Required",
        },
      });
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorProvinceId: "" },
      });

    if (!this.state.inputValues.address) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorAddress: "Input Required",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorAddress: "" },
      });

    if (!this.state.inputValues.shopCode) {
      await this.setState({
        inputValues: {
          ...this.state.inputValues,
          errorShopCode: "Input Required",
        },
      });
      check = false;
    } else
      await this.setState({
        inputValues: { ...this.state.inputValues, errorShopCode: "" },
      });

    if (!this.state.inputValues.status) {
      if (
        this.state.inputValues.closedDate === null ||
        this.state.inputValues.closedDate === undefined
      ) {
        await this.setState({
          inputValues: {
            ...this.state.inputValues,
            errorCloseDate: "Input Required",
          },
        });
        check = false;
      }
    } else {
      await this.setState({
        inputValues: { ...this.state.inputValues, errorCloseDate: "" },
      });
    }

    if (!check) return false;
    else return true;
  };
  handleInsert = async () => {
    if (await this.handleValid()) {
      await this.setState({ isLoading: true });
      let {
        channelId,
        customerId,
        shopCode,
        shopName,
        longitude,
        latitude,
        area,
        provinceId,
        address,
        frequency,
        status,
        closedDate,
        supplierId,
        storeType,
        districtId,
        townId,
        customerCode,
      } = this.state.inputValues;

      //get Id of Region
      let regionsList = [];
      regionsList = await this.props.regions;
      let provinceTemp = null;
      if (regionsList && regionsList.length > 0) {
        if (provinceId) {
          provinceTemp = regionsList.findIndex(
            (e) =>
              e.provinceId === provinceId &&
              e.districtId === null &&
              e.townId === null
          );
          if (districtId) {
            provinceTemp = regionsList.findIndex(
              (e) =>
                e.provinceId === provinceId &&
                e.districtId === districtId &&
                e.townId === null
            );
            if (townId) {
              provinceTemp = regionsList.findIndex(
                (e) =>
                  e.provinceId === provinceId &&
                  e.districtId === districtId &&
                  e.townId === townId
              );
            }
          }
        }
        if (provinceTemp && provinceTemp > 0) {
          provinceTemp = regionsList[provinceTemp];
        }
      }

      const obj = {
        shopCode: shopCode || null,
        shopName: shopName,
        longitude: longitude || null,
        latitude: latitude || null,
        area: area,
        provinceId: provinceTemp.id,
        address: address,
        frequency: frequency || null,
        status: status ? 1 : 2,
        closedDate: closedDate ? moment(closedDate).format("YYYY-MM-DD") : null,
        channelId: channelId,
        customerId: customerId,
        customerCode: customerCode || null,
        // supplierId: supplierId,
        // storeType: storeType
      };
      await this.props.ShopController.InsertStoreList(obj, this.state.accId);
      const result = this.props.insertStore;
      if (result.length > 0 && result[0].alert === "1") {
        this.Alert("Thêm thành công", "info");
        this.setState({
          inputValues: {},
          shoplists: this.props.shoplists,
          isLoading: false,
        });
      } else if (result.length > 0 && result[0].alert === "-1") {
        await this.Alert(result[0].messenger, "error");
      } else {
        await this.Alert("Thêm thất bại", "error");
        await this.setState({ isLoading: false });
      }
      await this.handleInsertStoreDialog(false);
    }
  };
  // update
  handleUpdateStoreDialog = async (boolean, rowData) => {
    if (boolean) {
      await this.setState({
        updateStorelist: true,
        inputValues: {
          ...this.state.inputValues,
          shopCode: rowData ? rowData.shopCode : "",
          shopId: rowData ? rowData.shopId : "",
          shopName: rowData ? rowData.shopName : "",
          address: rowData ? rowData.address : "",
          longitude: rowData ? rowData.longitude : "",
          latitude: rowData ? rowData.latitude : "",
          area: rowData ? rowData.areaName : "",
          provinceId: rowData ? rowData.province_Id : "",
          frequency: rowData ? rowData.frequency : "",
          customerId: rowData.customerId,
          channelId: rowData.channelId,
          status: rowData.status === 1 ? true : false,
          closedDate: rowData.closedDate ? new Date(rowData.closedDate) : null,
          id: rowData.id,
          districtId: rowData ? rowData.districtId : "",
          townId: rowData ? rowData.townId : "",
          customerCode:
            rowData && rowData.customerCode ? rowData.customerCode : null,
          // supplierId: rowData.supplierId || null,
          // storeType: rowData.storeType || null
        },
      });
    } else {
      await this.setState({
        updateStorelist: false,
        inputValues: {},
      });
    }
  };
  footerUpdateStoreDialog = () => {
    return (
      <div>
        <Button
          style={{ marginRight: "10px" }}
          label="Cancel"
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => this.handleUpdateStoreDialog(false)}
        />
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-info"
          onClick={() => this.handleUpdate()}
        />
      </div>
    );
  };
  handleUpdate = async () => {
    if (await this.handleValid()) {
      await this.setState({ isLoading: true });
      let {
        shopCode,
        id,
        shopName,
        longitude,
        latitude,
        area,
        provinceId,
        address,
        frequency,
        status,
        closedDate,
        channelId,
        customerId,
        districtId,
        townId,
        customerCode,
      } = this.state.inputValues;

      //get Id of Region
      let regionsList = [];
      regionsList = await this.props.regions;
      let provinceTemp = null;
      if (regionsList && regionsList.length > 0) {
        if (provinceId) {
          provinceTemp = regionsList.findIndex(
            (e) =>
              e.provinceId === provinceId &&
              e.districtId == null &&
              e.townId === null
          );
          if (districtId) {
            provinceTemp = regionsList.findIndex(
              (e) =>
                e.provinceId === provinceId &&
                e.districtId == districtId &&
                e.townId === null
            );
            if (townId) {
              provinceTemp = regionsList.findIndex(
                (e) =>
                  e.provinceId === provinceId &&
                  e.districtId == districtId &&
                  e.townId === townId
              );
            }
          }
        }
        if (provinceTemp && provinceTemp > 0) {
          provinceTemp = regionsList[provinceTemp];
        }
      }

      const obj = {
        shopCode: shopCode || null,
        shopName: shopName,
        longitude: longitude || null,
        latitude: latitude || null,
        area: area,
        provinceId: provinceTemp.id || null,
        address: address,
        frequency: frequency || null,
        status: status ? 1 : 2,
        closedDate: closedDate ? moment(closedDate).format("YYYY-MM-DD") : null,
        channelId: channelId,
        customerId: customerId,
        id: id,
        customerCode: customerCode || null,
      };
      await this.props.ShopController.UpdateStoreList(obj, this.state.accId);
      const result = this.props.updateStore;
      if (result.status === 200) {
        let shopList = this.state.shoplists;

        var ind = shopList.findIndex((e) => e.id === result.data[0].id);
        if (ind > -1) {
          shopList.splice(ind, 1);
          shopList.unshift(result.data[0]);
        }

        await this.Alert(result.message, "info");
        await this.setState({
          shoplists: shopList,
          isLoading: false,
          inputValues: {},
          updateStorelist: false,
        });
      } else {
        await this.Alert(result.message, "error");
        await this.setState({ isLoading: false });
      }
    }
  };
  /// Image
  handleViewImage = (rowData) => {
    if (rowData.imageUrl) {
      this.setState({ image: rowData.imageUrl, isOpen: true });
    }
  };
  imageTemplate = (rowData) => {
    if (this.fileInput.current === null) {
      this.fileInput = React.createRef();
    }
    return (
      <div style={{ height: 80, position: "relative" }}>
        <div style={{ position: "absolute", right: 0 }}>
          <Button
            icon="pi pi-search-plus"
            className="btn__hover p-button-success p-button-text"
            onClick={() => this.handleViewImage(rowData)}
            style={{ cursor: "default" }}
          />
          {this.state.permission && this.state.permission.delete && (
            <Button
              icon="pi pi-times"
              className="btn__hover p-button-danger p-button-text"
              onClick={() => this.handleDeleteImageDialog(true, rowData)}
              style={{ cursor: "default" }}
            />
          )}
        </div>
        <img
          src={rowData.imageUrl ? rowData.imageUrl : "asdasd"}
          alt="Overview"
          style={
            rowData.imageUrl
              ? {
                  minWidth: "129px",
                  maxWidth: "130px",
                  height: "100%",
                  cursor: "pointer",
                }
              : {
                  marginLeft: "20%",
                  maxWidth: "130px",
                  height: "100%",
                  cursor: "pointer",
                }
          }
          onClick={() => {
            if (this.state.permission.create) {
              if (this.fileInput.current === null) {
                this.fileInput = React.createRef();
              } else this.fileInput.current.click();
              this.setState({ rowData });
            }
          }}
          onError={(e) => {
            e.target.src = "https://i.ibb.co/dgj7cn5/1304037.png";
          }}
        />
        <input
          type="file"
          accept="image/*"
          ref={this.fileInput}
          style={{ display: "none" }}
          onChange={(e) => this.handleUpdateImageDialog(true, e)}
        />
      </div>
    );
  };
  handleUpdateImageDialog = (boolean, e) => {
    let rowData = this.state.rowData;
    if (boolean && e.target.files) {
      this.setState({
        confirmUpdateImage: true,
        shopId: rowData.shopId,
        ifile: e.target.files[0] || null,
        isDelete: 2,
      });
    } else {
      this.setState({
        confirmUpdateImage: false,
      });
    }
  };
  footerUpdateImageDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit && (
          <Button
            style={{ marginRight: "10px" }}
            label="Cancel"
            icon="pi pi-times"
            className="p-button-danger"
            onClick={() => this.handleUpdateImageDialog(false)}
          />
        )}
        {this.state.permission && this.state.permission.edit && (
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-info"
            onClick={() => this.handleUpdateImage()}
          />
        )}
      </div>
    );
  };
  handleUpdateImage = async () => {
    // if (!this.state.ifile) {
    //   await this.setState({ isLoading: false, confirmUpdateImage: false })
    //   return this.Alert('Update Failed', 'error')
    // }
    // await this.props.ShopController.UpdateImage(this.state.ifile, this.state.shopId, this.state.isDelete)
    // const result = this.props.updateImage
    // if (result) {
    //   if (result[0].alert === '1') {
    //     this.Alert('Update Successful', 'info')
    //     await this.setState({ isLoading: false, confirmUpdateImage: false, shoplists: this.props.shoplists })
    //   }
    // } else {
    //   this.Alert('Update Failed', 'error')
    //   await this.setState({ isLoading: false, confirmUpdateImage: false })
    // }
  };
  handleDeleteImageDialog = (boolean, rowData) => {
    if (boolean) {
      this.setState({
        confirmDeleteImage: true,
        shopId: rowData.shopId,
        ifile: null,
        isDelete: 1,
      });
    } else {
      this.setState({
        confirmDeleteImage: false,
      });
    }
  };
  footerDeleteImageDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.delete && (
          <Button
            label="Delete"
            icon="pi pi-check"
            className="p-button-danger"
            onClick={() => this.handleDeleteImage()}
          />
        )}
        {this.state.permission && this.state.permission.delete && (
          <Button
            style={{ marginRight: "10px" }}
            label="Cancel"
            icon="pi pi-times"
            className="p-button-info"
            onClick={() => this.handleDeleteImageDialog(false)}
          />
        )}
      </div>
    );
  };
  handleDeleteImage = async () => {
    // await this.props.ShopController.UpdateImage(this.state.ifile, this.state.shopId, this.state.isDelete)
    // const result = this.props.updateImage
    // if (result[0].alert === '1') {
    //   this.Alert('Delete Successful', 'info')
    //   await this.setState({ isLoading: false, confirmDeleteImage: false, shoplists: this.props.shoplists })
    // } else {
    //   this.Alert('Update Failed', 'error')
    //   await this.setState({ isLoading: false, confirmDeleteImage: false })
    // }
  };
  /// update merge data
  handleMergeDataDialog = (boolean) => {
    if (boolean) {
      this.setState({ mergeDialog: true });
    } else {
      this.setState({ mergeDialog: false });
    }
  };
  footerMergeData = () => {
    return (
      <div>
        <Button
          label={this.props.language["cancel"] || "l_cancel"}
          icon="pi pi-times"
          className="p-button-info"
          onClick={() => this.handleMergeDataDialog(false)}
        />
        <Button
          label={this.props.language["merge_data"] || "l_merge_data"}
          icon="pi pi-check"
          className="p-button-success"
          onClick={() => this.handleMerge()}
        />
      </div>
    );
  };
  handleMerge = async () => {
    // const data = await {
    //   fromShopId: this.state.shopIdConvert ? this.state.shopIdConvert.shopId : 0,
    //   toShopId: this.state.shopIdReceive ? this.state.shopIdReceive.shopId : 0,
    // }
    // await this.setState({ isLoading: true })
    // await this.props.ShopController.ShopMerge(data)
    // const result = this.props.shopMerge
    // if (result.result === 1) {
    //   await this.Alert(result.messenger, 'info')
    // } else {
    //   await this.Alert(result.messenger, 'error')
    // }
    // await this.setState({ isLoading: false, mergeDialog: false, shopIdConvert: 0, shopIdReceive: 0 })
  };
  // handle Change
  handleChangeDropDown = (id, value) => {
    this.setState({
      inputValues: {
        ...this.state.inputValues,
        [id]: value ? value : null,
      },
    });
  };
  handleChangeInput = (value, statename, id) => {
    this.setState({
      [statename]: {
        ...this.state[statename],
        [id]: value === null ? "" : value,
      },
    });
    if (id === "monthlyFrequency") {
      if (isNaN(value)) {
        this.setState({
          [statename]: { ...this.state[statename], monthlyFrequency: 0 },
        });
      }
    }
  };
  handleChange = (id, value, statename) => {
    this.setState({
      [id]: value === null ? "" : value,
      inputValues: {
        ...this.state.inputValues,
        [id]: value === null ? "" : value,
      },
    });

    if (id === "accId") {
      this.props.RegionController.GetListRegion(value);
    }
  };
  onChange = (id, value) => {
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
        [id]: value === null ? null : value,
      },
    });
  };
  async componentWillMount() {
    let permission = await HelpPermission(this.pageId);
    await this.setState({ permission });
  }
  componentDidMount() {
    // this.props.ShopController.ShopFormat()
    // this.props.ShopTargetController.GetStoreName()
    this.props.RegionController.GetListRegion(this.state.accId);
  }
  render() {
    const footer = (
      <div>
        {this.state.permission !== undefined &&
          this.state.permission.delete && (
            <Button
              label={this.props.language["yes"] || "l_yes"}
              icon="pi pi-check"
              onClick={this.OnConfirmDelete}
            />
          )}
        {this.state.permission !== undefined &&
          this.state.permission.delete && (
            <Button
              label={this.props.language["no"] || "l_no"}
              icon="pi pi-times"
              onClick={this.onHide}
              className="p-button-secondary"
            />
          )}
      </div>
    );
    let leftSearch = [],
      rightSearch = [],
      MergeData = null;
    if (this.state.permission) {
      if (this.state.permission.view === true) {
        leftSearch.push(
          <Button
            label={this.props.language["search"] || "l_search"}
            icon="pi pi-search"
            style={{ marginRight: 10 }}
            className="p-button-success"
            onClick={this.LoadList}
          ></Button>
        );
      }
      if (
        this.state.permission.export === true &&
        this.state.permission.view === true
      ) {
        leftSearch.push(
          <Button
            icon="pi pi-file"
            label={this.props.language["export"] || "l_export"}
            style={{ marginRight: 10 }}
            className="p-button-primary"
            onClick={this.OnExport}
          ></Button>
        );
        leftSearch.push(
          <a style={{ marginRight: 10 }} href={this.state.linkExport} download>
            {this.state.linkExport ? "download" : ""}
          </a>
        );
      }
      if (this.state.permission.edit === true && getAccountId() === 3) {
        leftSearch.push(
          <Button
            label={this.props.language["commom_merge"] || "l_commom_merge"}
            className="p-button-success"
            onClick={() => this.handleMergeDataDialog(true)}
          ></Button>
        );
      }
      if (
        this.state.permission.create === true &&
        this.state.permission.view === true
      ) {
        leftSearch.push(
          <Button
            label={
              this.props.language["create_template"] || "l_create_template"
            }
            style={{ marginRight: 10 }}
            className="p-button-primary"
            onClick={this.OnCreateTemplate}
          ></Button>
        );
        leftSearch.push(
          <a
            href={this.state.linkTemplate}
            style={{ marginRight: 10 }}
            download
          >
            {this.state.linkTemplate ? "download" : ""}
          </a>
        );
      }
      if (
        this.state.permission.import === true &&
        this.state.permission.view === true
      ) {
        rightSearch.push(
          <FileUpload
            ref={this.uploadFile}
            name="myfile[]"
            mode="basic"
            chooseLabel={this.props.language["import"] || "l_import"}
            accept=".xlsx,.xls"
            customUpload={true}
            multiple={false}
            uploadHandler={this.Import}
          />
        );
        rightSearch.push(
          <Button
            icon="pi pi-times"
            className="p-button-danger"
            style={{ width: 40, marginLeft: 10 }}
            onClick={() => this.Clear()}
          />
        );
      }
    }
    if (this.state.mergeDialog) {
      MergeData = (
        <Dialog
          header="Merge Data"
          baseZIndex={1000000}
          modal
          style={{ width: "50vw" }}
          visible={this.state.mergeDialog}
          footer={this.footerMergeData()}
          onHide={() => this.handleMergeDataDialog(false)}
        >
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12">
              <div className="p-field" style={{ textAlign: "center" }}>
                <label>
                  {this.props.language["store_name_convert"] ||
                    "l_store_name_convert"}
                </label>
              </div>
              <Dropdown
                style={{ width: "100%" }}
                id="shopIdConvert"
                options={this.props.getStoreName}
                onChange={(e) => this.handleChange(e.target.id, e.value)}
                value={this.state.shopIdConvert}
                placeholder={
                  this.props.language["select_an_option"] ||
                  "l_select_an_option"
                }
                optionLabel="shopNameVN"
                filter={true}
                filterPlaceholder={
                  this.props.language["select_an_option"] ||
                  "l_select_an_option"
                }
                filterBy="shopName"
                showClear={true}
              />
            </div>
            <div style={{ textAlign: "center", width: "100%" }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Icons8_flat_download.svg/768px-Icons8_flat_download.svg.png"
                style={{ width: "20%", marginBottom: 10 }}
              />
            </div>
            <div className="p-field p-col-12" style={{ marginBottom: 10 }}>
              <div className="p-field" style={{ textAlign: "center" }}>
                <label>
                  {this.props.language["store_name_receive"] ||
                    "l_store_name_receive"}
                </label>
              </div>
              <Dropdown
                style={{ width: "100%" }}
                id="shopIdReceive"
                options={this.props.getStoreName}
                onChange={(e) => this.handleChange(e.target.id, e.value)}
                value={this.state.shopIdReceive}
                placeholder={
                  this.props.language["select_an_option"] ||
                  "l_select_an_option"
                }
                optionLabel="shopNameVN"
                filter={true}
                filterPlaceholder={
                  this.props.language["select_an_option"] ||
                  "l_select_an_option"
                }
                filterBy="shopName"
                showClear={true}
              />
            </div>
          </div>
        </Dialog>
      );
    }
    return this.state.permission.view ? (
      <Card title={this.props.language["storelist"] || "l_storelist"}>
        <Toast ref={(el) => (this.toast = el)} baseZIndex={1000000} />
        <Dialog
          modal={true}
          header={
            this.state.confirmUpdateImage ? "Update Image" : "Delete Image"
          }
          visible={
            this.state.confirmUpdateImage
              ? this.state.confirmUpdateImage
              : this.state.confirmDeleteImage
          }
          footer={
            this.state.confirmUpdateImage
              ? this.footerUpdateImageDialog()
              : this.footerDeleteImageDialog()
          }
          onHide={() =>
            this.state.confirmUpdateImage
              ? this.handleUpdateImageDialog(false)
              : this.handleDeleteImageDialog(false)
          }
        >
          {"Are you sure you want to proceed??"}
          {/* {this.props.language["confirm_delete_shop"] || "l_confirm_delete_shop"} {this.state.selectedShop ? this.state.selectedShop.shopName : ""} */}
        </Dialog>
        {/* <Dialog header="Confirmation" baseZIndex={1000000} visible={this.state.deleteTable} modal style={{ width: '350px' }} footer={this.footerDeleteTableDialog()} onHide={() => this.handleDeleteTableDialog(false)}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
              <span>Are you sure you want to proceed?</span>
            </div>
          </Dialog> */}

        <Accordion activeIndex={0} style={{ marginTop: "10px" }}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div className="p-grid">
              <AccountDropDownList
                id="accId"
                className="p-field p-col-12 p-md-3"
                onChange={this.handleChange}
                filter={true}
                showClear={true}
                value={this.state.accId}
              />
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["customer"] || "l_customer"}</label>
                <CustomerDropDownList
                  id="customerId"
                  mode="single"
                  onChange={this.handleChange}
                  accId={this.state.accId}
                  value={this.state.customerId}
                />
              </div>
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["channel"] || "l_channel"}</label>
                <ChannelDropDownList
                  id="channelId"
                  onChange={this.handleChange}
                  accId={this.state.accId}
                  value={this.state.channelId}
                />
              </div>
              {/* <div className="p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["area"] || "l_area"}</label>
                  <RegionDDL regionType="Area" parent="" id="area" value={this.state.area} onChange={this.handleChange} />
                </div>
                <div className="p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["city"] || "city"}</label>
                  <RegionDDL regionType="Province" parent={this.state.area ? this.state.area : ""} id="provinceId" value={this.state.provinceId} onChange={this.handleChange} />
                </div> */}
              <RegionApp {...this} />
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label htmlFor="ShopCode">
                  {this.props.language["storelist.shopcode"] ||
                    "storelist.shopcode"}
                </label>
                <span className="p-float-label">
                  <InputText
                    placeholder="Mã cửa hàng"
                    id="shopCode"
                    value={this.state.shopCode}
                    onChange={(e) =>
                      this.setState({ shopCode: e.target.value })
                    }
                    style={{ width: "100% " }}
                  />
                </span>
              </div>
              <div className="p-field p-col-12 p-md-6 p-lg-3">
                <label htmlFor="ShopName">
                  {this.props.language["storelist.shopname"] ||
                    "storelist.shopname"}
                </label>
                <span className="p-float-label">
                  <InputText
                    style={{ width: "100%" }}
                    placeholder="Tên cửa hàng"
                    id="shopName"
                    value={this.state.shopName}
                    onChange={(e) =>
                      this.setState({ shopName: e.target.value })
                    }
                  />
                </span>
              </div>
              <div className="p-col-3 p-md-1 p-sm-6">
                <label>{this.props.language["status"] || "l_status"} : </label>
                <br />
                <div style={{ paddingTop: 6 }}>
                  <Checkbox
                    inputId="statusCode"
                    checked={this.state.statusCode}
                    onChange={(e) => this.setState({ statusCode: e.checked })}
                  />
                  <small htmlFor="statusCode">
                    {this.state.statusCode ? " Active" : " InActive"}
                  </small>
                </div>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
        <Toolbar left={leftSearch} right={rightSearch} />
        {this.state.loading ? (
          <ProgressBar
            mode="indeterminate"
            style={{ height: "5px" }}
          ></ProgressBar>
        ) : null}
        <br />
        <DataTable
          value={this.state.shoplists}
          paginator={true}
          rows={20}
          rowsPerPageOptions={[20, 50, 100]}
          style={{ fontSize: "13px" }}
          expandedRows={this.state.expandedRows}
          onRowToggle={(e) => this.onSelectedChange(e.data)}
          dataKey="shopId"
          rowHover
          paginatorPosition={"both"}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          onSelectionChange={(e) => this.setState({ selectedShop: e.value })}
        >
          <Column
            field="areaName"
            style={{ width: "5%", textAlign: "center" }}
            header={this.props.language["area"] || "l_area"}
          />
          <Column
            field="provinceName"
            style={{ width: "7%", textAlign: "center" }}
            header={this.props.language["province"] || "l_province"}
          />
          <Column
            field="customnerName"
            style={{ width: "10%" }}
            filter={true}
            header={this.props.language["customer_name"] || "l_customer_name"}
          />
          <Column
            field="channelName"
            style={{ width: "6%", textAlign: "center" }}
            filter={true}
            header={this.props.language["channel_name"] || "l_channel_name"}
          />
          <Column
            field="shopCode"
            style={{ width: "6%", textAlign: "center" }}
            filter={true}
            header={this.props.language["shop_code"] || "l_shop_code"}
          />
          <Column
            field="shopName"
            header={this.props.language["shop_name"] || "l_shop_name"}
            style={{ width: "12%" }}
            filter={true}
          />
          <Column
            field="address"
            filter={true}
            header={this.props.language["address"] || "l_address"}
            style={{ width: "17%" }}
          />
          <Column
            field="closedDate"
            header={this.props.language["close_date"] || "l_close_date"}
            style={{ width: "8%", textAlign: "center" }}
            filter={true}
            body={(rowData) => (
              <div>
                {rowData.closedDate
                  ? moment(rowData.closedDate).format("YYYY-MM-DD")
                  : null}
              </div>
            )}
          />
          {/* <Column field="image" style={{ width: "150px" }} body={(rowData) => this.imageTemplate(rowData)} header={this.props.language["overview"] || "l_overview"} /> */}
          <Column
            body={this.actionTemplate}
            style={{ width: "5%", textAlign: "center" }}
            header={
              this.state.permission &&
              this.state.permission.create && (
                <Button
                  label={this.props.language["create"] || "create"}
                  className="p-button-primary"
                  onClick={() => this.handleInsertStoreDialog(true)}
                ></Button>
              )
            }
          ></Column>
        </DataTable>

        <ShopDetail
          handleActionDialog={this.handleInsertStoreDialog}
          footerAction={this.footerInsertStoreDialog}
          displayAciton={this.state.insertStorelist}
          actionName="Insert"
          stateName="inputValues"
          inputValues={this.state.inputValues}
          //handleChange
          onChange={this.onChange}
          handleCalendar={this.handleCalendar}
          handleChange={this.handleChange}
          handleChangeInput={this.handleChangeInput}
          typeActionTable={this.state.typeAction}
          handleChangeDropDown={this.handleChangeDropDown}
          accId={this.state.accId}
          isEdit={this.state.isEdit}
          show={this.state.showDetail}
          shop={this.state.shop}
          closeModel={this.closeModel}
        />

        <ShopDetail
          handleActionDialog={this.handleUpdateStoreDialog}
          footerAction={this.footerUpdateStoreDialog}
          displayAciton={this.state.updateStorelist}
          accId={this.state.accId}
          actionName="Update"
          stateName="inputValues"
          inputValues={this.state.inputValues}
          //handleChange
          onChange={this.onChange}
          handleCalendar={this.handleCalendar}
          handleChange={this.handleChange}
          handleChangeInput={this.handleChangeInput}
          typeActionTable={this.state.typeAction}
          handleChangeDropDown={this.handleChangeDropDown}
        />
        {/* {MergeData}
          {this.state.isOpen && (
            <Lightbox
              mainSrc={this.state.image}
              onCloseRequest={() => this.setState({ isOpen: false })}
            />
          )} */}
      </Card>
    ) : (
      this.state.permission.view !== undefined && <Page403 />
    );
  }
}

function mapStateToProps(state) {
  return {
    shoplists: state.shops.shoplists,
    loading: state.shops.loading,
    errors: state.shops.errors,
    forceReload: state.shops.forceReload,
    language: state.languageList.language,
    usearea: true,
    useprovince: true,
    regions: state.regions.regions,
    insertStore: state.shops.insertStore,
    updateStore: state.shops.updateStore,
    // updateImage: state.shops.updateImage,
    // shopFormat: state.shops.shopFormat,
    // employeeShops: state.shops.employeeShops,
    // getStoreName: state.shoptarget.getStoreName,
    // shopMerge: state.shops.shopMerge,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ShopController: bindActionCreators(actionCreatorsShop, dispatch),
    ShopTargetController: bindActionCreators(ShopTargetAPI, dispatch),
    RegionController: bindActionCreators(RegionActionCreate, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StoreList);
