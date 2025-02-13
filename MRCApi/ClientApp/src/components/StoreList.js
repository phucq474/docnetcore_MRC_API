
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ProgressBar } from 'primereact/progressbar';
import { Toolbar } from "primereact/toolbar";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
//React-redux
import { bindActionCreators } from "redux";
import { actionCreators } from "../store/ShopController";
import { getToken, URL } from "../Utils/Helpler";
import DealerDDL from './Controls/DealerDropDownList';
import RegionDDL from './Controls/RegionDropDownList';
import ShopDetail from './Shop/ShopDetail';
import WarehouseDropDownList from '../components/Controls/WarehouseDropDownList';

class StoreList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
      alert: {
        title: "",
        text: ""
      }
    };
    this.LoadList = this.LoadList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onHide = this.onHide.bind(this);
    this._child = React.createRef();
  }
  getFilter = () => {
    const ShopCode = this.state.ShopCode || "";
    const ShopName = this.state.ShopName || "";
    const Area = this.state.Area ? this.state.Area.value : "";
    const Province = this.state.Province ? this.state.Province.value : "";
    const District = this.state.District ? this.state.District.value : "";
    const DealerId = this.state.Dealer ? this.state.Dealer.value : "";
    const filter = {
      ShopCode,
      ShopName,
      Area,
      Province,
      District,
      DealerId,
    };
    return filter;
  }
  LoadList() {
    this.setState({ loading: true });
    const token = getToken();
    const filter = this.getFilter();
    this.props.GetList(token, filter);
  }
  componentWillMount() {
    this.LoadList();
  }
  componentWillReceiveProps() {
    this.setState({ loading: false });
  }
  handleChange(id, value) {
    this.setState({ [id]: value === null ? "" : value });
  }
  closeModel = (ShopDetailData) => {
    this.setState({ showDetail: ShopDetailData.show })
  }
  actionTemplate(rowData, column) {
    return <div>
      <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: "20px" }} onClick={() => this.OnEdit(rowData)} ></Button>
      <Button type="button" icon="pi pi-times" className="p-button-danger" onClick={this.OnDelete} ></Button>
    </div>;
  }
  OnEdit = (data) => {
    this.setState({ showDetail: true, isEdit: true, shop: data });
  }
  OnDelete = () => {
    this.setState({ visibleConfirm: true })
  }
  onHide() {
    this.setState({ visibleConfirm: false });
  }
  OnConfirmDelete = () => {
    this.props.Delete(this.state.selectedShop.shopId);
    this.setState({ visibleConfirm: false });
  }
  OnCreateTemplate = async () => {
    this.setState({ loading: true });
    const token = getToken();
    const url = URL + `api/shops/template`;
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch(url, requestOptions);
      const link = await response.json();
      this.setState({ linkTemplate: URL + link })
    }
    catch (err) {
    }
    finally {
      this.setState({ loading: false });
    }
  }
  OnExport = async () => {
    this.setState({ loading: true });
    const token = getToken();
    const url = URL + `api/shops/export`;
    const filter = this.getFilter();
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': token,
        ...filter,
      }
    }
    try {
      const response = await fetch(url, requestOptions);
      const link = await response.json();
      this.setState({ linkExport: URL + link });
    }
    catch (err) {
    }
    finally {
      this.setState({ loading: false });
    }
  }
  Import = async (e) => {
    const url = URL + `api/shops/import`;
    const formData = new FormData();
    formData.append('fileUpload', e.files[0]);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': getToken(),
        //  'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };

    try {
      const request = new Request(url, requestOptions);
      const response = await fetch(request);
      if (response.status === 200)
        this.setState({ AlertVisible: true, alert: { title: "Notification", text: `${this.props.language["import_successful"] || "l_import_successful"}` } });
    }
    catch (error) {
      this.setState({ AlertVisible: true, alert: { title: "Error", text: error.response.data } });
    }
    finally {
      this.setState({ loading: false });
      this._child.current.clear()
    }
  }
  render() {
    const footer = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.OnConfirmDelete} />
        <Button label="No" icon="pi pi-times" onClick={this.onHide} className="p-button-secondary" />
      </div>
    );
    let leftSearch = [], rightSearch = [];
    leftSearch.push(<Button label={this.props.language["filter"] || "l_filter"} icon="pi pi-search" style={{ marginRight: 10 }} className="p-button-success" onClick={this.LoadList} ></Button>);
    leftSearch.push(<Button label={this.props.language["export"] || "l_export"} className="p-button-primary ml-2" onClick={this.OnExport}></Button>)
    leftSearch.push(<a href={this.state.linkExport} download>{this.state.linkExport ? "download" : ""}</a>);
    rightSearch.push(<Button label={this.props.language["create_template"] || "l_create_template"} style={{ marginRight: 10 }} className="p-button-primary" onClick={this.OnCreateTemplate}></Button>)
    rightSearch.push(<a href={this.state.linkTemplate} style={{ marginRight: 10 }} download>{this.state.linkTemplate ? "download" : ""}</a>)
    rightSearch.push(<FileUpload ref={this._child} name="myfile[]" mode="basic" chooseLabel={this.props.language["import"] || "l_import"} accept=".xlsx,.xls" customUpload={true} multiple={false} uploadHandler={this.Import} />)
    return (
      <div className="p-fluid">
        <Dialog header={this.state.alert.title} baseZIndex={100} visible={this.state.AlertVisible} style={{ width: '50vw' }} modal={true} onHide={() => this.setState({ AlertVisible: false })}>
          {this.state.alert.text}
        </Dialog>
        <Dialog header="Confirm Delete" visible={this.state.visibleConfirm} style={{ width: '50vw' }} modal={true} footer={footer} onHide={() => this.setState({ visibleConfirm: false })}>
          {this.props.language["confirm_delete_shop"] || "l_confirm_delete_shop"} {this.state.selectedShop ? this.state.selectedShop.shopName : ""}
        </Dialog>
        <Accordion activeIndex={0} style={{ marginTop: '10px' }}>
          <AccordionTab header={this.props.language["search"] || "l_search"}>
            <div className="p-grid">
              <div className="p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["region"] || "l_region"}</label>
                <RegionDDL regionType="Area" parent="" id="Area" value={this.state.Area} onChange={this.handleChange} />
              </div>
              <div className="p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["city"] || "l_citg"}</label>
                <RegionDDL regionType="Province" parent={this.state.Area ? this.state.Area.value : ""} id="Province" value={this.state.Province} onChange={this.handleChange} />
              </div>
              <div className="p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["province"] || "l_province"}</label>
                <RegionDDL regionType="District" parent={this.state.Province ? this.state.Province.value : ""} id="District" value={this.state.District} onChange={this.handleChange} />
              </div>
              <div className="p-col-12 p-md-6 p-lg-3">
                <label>{this.props.language["dealer"] || "l_dealer"}*</label>
                <DealerDDL id="Dealer" value={this.state.Dealer} onChange={this.handleChange}></DealerDDL>
              </div>
              <div className="p-col-12 p-md-6 p-lg-3">
                <label htmlFor="Scode">{this.props.language["shop_code"] || "l_shop_code"}</label>
                <span className="p-float-label">
                  <InputText id="Scode" value={this.state.ShopCode} onChange={e => this.setState({ ShopCode: e.target.value })} style={{ width: '100% ' }} />
                </span>
              </div>
              <div className="p-col-12 p-md-6 p-lg-3">
                <label htmlFor="ShopName">{this.props.language["shop_name"] || "l_shop_name"}</label>
                <span className="p-float-label">
                  <InputText style={{ width: '100%' }}
                    id="ShopName"
                    value={this.state.ShopName}
                    onChange={e =>
                      this.setState({ ShopName: e.target.value })
                    }
                  />
                </span>
              </div>

            </div>
          </AccordionTab>
        </Accordion>
        <Toolbar left={leftSearch} right={rightSearch} />
        {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
        <br />
        <DataTable value={this.props.shoplists}
          paginator={true} rows={50} rep
          rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }}
          expandedRows={this.state.expandedRows}
          onRowToggle={(e) => this.onSelectedChange(e.data)}
          dataKey="rowNum"
          onSelectionChange={e => this.setState({ selectedShop: e.value })}>
          <Column field="rowNum" style={{ width: "80px" }} header="No." />
          <Column field="dealerName" style={{ width: "120px" }} filter={true} header={this.props.language["dealername"] || "l_dealername"} />
          <Column field="shopCode" style={{ width: "120px" }} filter={true} header={this.props.language["shop_code"] || "l_shop_code"} />
          <Column field="shopName" header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: "350px" }} filter={true} />
          <Column field="address" filter={true} header={this.props.language["address"] || "l_address"} />
          <Column field="phone" header={this.props.language["phone"] || "l_phone"} style={{ width: "150px" }} filter={true} />
          <Column field="email" header={this.props.language["email"] || "l_email"} style={{ width: "150px" }} filter={true} />
          <Column body={this.actionTemplate.bind(this)} header={<Button label={this.props.language["create"] || "l_create"} className="p-button-primary" onClick={() => { this.setState({ showDetail: !this.state.showDetail, isEdit: false, selectedShop: { statusCode: 1 } }) }}></Button>} style={{ width: "150px" }}>
          </Column>
        </DataTable>
        <ShopDetail

          isEdit={this.state.isEdit}
          show={this.state.showDetail}
          shop={this.state.shop} closeModel={this.closeModel} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    shoplists: state.shops.shoplists,
    loading: state.shops.loading,
    errors: state.shops.errors,
    forceReload: state.shops.forceReload,
    language: state.languageList.language
  };
}
export default connect(mapStateToProps, dispatch =>
  bindActionCreators(actionCreators, dispatch)
)(StoreList);
