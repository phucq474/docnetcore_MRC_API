import React, { Component } from 'react'
import { actionCreatorsShop } from '../../store/ShopController';
import { download, HelpPermission } from '../../Utils/Helpler';
import Page403 from '../ErrorRoute/page403';
import CustomerDropDownList from '../Controls/CustomerDropDownList';
import ChannelDropDownList from '../Controls/ChannelDropDownList';
import { RegionApp } from '../Controls/RegionMaster';
import { Accordion } from 'primereact/accordion';
import { AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Toolbar } from 'primereact/toolbar';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { RegionActionCreate } from '../../store/RegionController';
import { data } from 'jquery';
class ShopInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      permission: {
        view: true,
        edit: true,
        delete: true,
        import: true,
        export: true
      },
      datas: [],
      inputValues: {},
      statusCode: true,
      updateDialog: false,
    }
    this.pageId = 11
  }
  async componentWillMount() {
    // let permission = await HelpPermission(this.pageId);
    // await this.setState({ permission })
  }
  componentDidMount() {
    this.props.RegionController.GetListRegion();
  }
  getFilter = () => {
    const shopCode = this.state.shopCode || null;
    const shopName = this.state.shopName || null;
    const area = this.state.area ? this.state.area : null;
    const provinceId = this.state.province ? this.state.province.toString() : null;
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
      customerId
    };
    return filter;
  }
  handleSearch = async () => {
    await this.setState({ isLoading: true });
    const filter = await this.getFilter();
    await this.props.ShopController.GetListRawByReport(filter)
    const result = this.props.getListRawByReport
    if (result.status === 200) {
      this.setState({
        datas: result.data,
      })
      this.Alert(result.message, 'info')
    }
    else {
      this.Alert(result.message, 'error')
      this.setState({ datas: [] })
    }
    this.setState({ isLoading: false });
  }
  Alert = (messager, typestyle) => {
    this.toast.show({ severity: typestyle == null ? "success" : typestyle, summary: `${this.props.language["annoucement"] || "l_annoucement"}`, detail: messager });
  }
  handleChange = (id, value, statename) => {
    this.setState({
      [id]: value === null ? "" : value,
      inputValues: { ...this.state.inputValues, [id]: value === null ? "" : value },
    });
  }
  handleExport = async () => {
    await this.setState({ isLoading: true });
    const filter = await this.getFilter();
    await this.props.ShopController.ExportRawByReport(filter)
    const result = this.props.exportRawByReport
    if (result.status === 200) {
      download(result.fileUrl)
      this.Alert(result.message, 'info')
    }
    else {
      this.Alert(result.message, 'error')
    }

    this.setState({ isLoading: false });
  }
  actionButtons = (rowData, event) => {
    return (
      <div>
        {this.state.permission.edit &&
          <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-outlined p-mr-2 p-mb-2 btn__hover"
            onClick={() => this.handleUpdateRowDialog(true, rowData, event.rowIndex)} />}
      </div>
    )
  }
  handleUpdateRowDialog = async (boolean, rowData, index) => {
    if (boolean) {
      var json = []
      json.push(JSON.parse(rowData.jsonData))
      await this.setState({
        updateDialog: true,
        inputValues: {
          ...this.state.inputValues,
          index: index,
          rowData: rowData,
          json: json
        }
      })
    } else {
      this.setState({ updateDialog: false, inputValues: {} })
    }
  }
  footerUpdateRowDialog = () => {
    return (
      <div>
        {this.state.permission && this.state.permission.edit &&
          <div>
            <Button label={this.props.language["cancel"] || "l_cancel"} className="p-button-danger" onClick={() => this.handleUpdateRowDialog(false)} />
            <Button label={this.props.language["update"] || "l_update"} className="p-button-info" onClick={() => this.handleUpdate()} />
          </div>}
      </div>
    )
  }
  handleUpdate = async () => {
    await this.setState({ isLoading: true })
    let Id = this.state.inputValues.rowData.id
    await this.props.ShopController.UpdateShopByReport(Id)
    const result = this.props.updateShopByReport
    if (result.status === 200) {
      var newDataRow = result.data
      let datas = this.state.datas

      newDataRow.forEach(r => {
        let ind = datas.findIndex(d => d.id = r.id)
        if (ind > -1) {
          datas[ind].area = r.area
          datas[ind].region = r.region
          datas[ind].customer = r.customer
          datas[ind].channel = r.channel
          datas[ind].shopCode = r.shopCode
          datas[ind].address = r.address
          datas[ind].jsonData = r.jsonData
          datas[ind].jsonPhoto = r.jsonPhoto
          datas[ind].status = r.status
        }
      })
      await this.setState({
        datas: datas
      })
      await this.Alert(result.message, 'info')
    } else {
      await this.Alert(result.message, 'error')
    }
    await this.handleUpdateRowDialog(false)
    await this.setState({ isLoading: false, inputValues: {} })
  }
  render() {
    let leftSearch = []
    if (this.state.permission) {
      if (this.state.permission.view === true) {
        leftSearch.push(<Button label={this.props.language["search"] || "l_search"} icon="pi pi-search" style={{ marginRight: 10 }} className="p-button-success" onClick={this.handleSearch} ></Button>);
      }
      if (this.state.permission.export === true && this.state.permission.view === true) {
        leftSearch.push(<Button icon="pi pi-file" label={this.props.language["export"] || "l_export"} style={{ marginRight: 10 }} className="p-button-primary" onClick={this.handleExport}></Button>)
      }
    }
    let dialogUpdate = []
    if (this.state.updateDialog) {
      dialogUpdate = <Dialog header="Update" style={{ width: '70%' }}
        visible={this.state.updateDialog}
        footer={this.footerUpdateRowDialog()}
        onHide={() => this.handleUpdateRowDialog(false)}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', color: 'red' }} />
          <span style={{ color: 'red' }}>Bạn có muốn thay đổi?</span>
          <br />
          <DataTable value={this.state.inputValues.json}>
            <Column field="shopCode" style={{ width: "10%", textAlign: 'center' }} header={this.props.language["shop_code"] || "l_shop_code"} />
            <Column field="shopName" style={{ width: "10%" }} header={this.props.language["shop_name"] || "l_shop_name"} />
            <Column field="address" style={{ width: "15%" }} header={this.props.language["address"] || "l_address"} />
            <Column field="province" header={this.props.language["province"] || "l_province"} style={{ width: "10%" }} />
            <Column field="latitude" style={{ width: "10%" }} header={this.props.language["latitude"] || "l_latitude"} />
            <Column field="longitude" header={this.props.language["longitude"] || "l_longitude"} style={{ width: "10%" }} />
            <Column field="channelName" header={this.props.language["channel_name"] || "l_channel_name"} style={{ width: "10%" }} />
          </DataTable>
        </div>
      </Dialog>
    }
    return (
      this.state.permission.view ? (
        <Card title={this.props.language["storelist"] || "l_storelist"}>
          <Toast ref={(el) => this.toast = el} baseZIndex={1000000} />
          <Accordion activeIndex={0} style={{ marginTop: '10px' }}>
            <AccordionTab header={this.props.language["search"] || "l_search"}>
              <div className="p-grid">
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["customer"] || "l_customer"}</label>
                  <CustomerDropDownList
                    id='customerId'
                    mode='single'
                    onChange={this.handleChange}
                    value={this.state.customerId} />
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label>{this.props.language["channel"] || "l_channel"}</label>
                  <ChannelDropDownList
                    id='channelId'
                    onChange={this.handleChange}
                    value={this.state.channelId} />
                </div>
                <RegionApp {...this} />
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label htmlFor="ShopCode">{this.props.language["storelist.shopcode"] || "storelist.shopcode"}</label>
                  <span className="p-float-label">
                    <InputText id="shopCode" value={this.state.shopCode} onChange={e => this.setState({ shopCode: e.target.value })} style={{ width: '100% ' }} />
                  </span>
                </div>
                <div className="p-field p-col-12 p-md-6 p-lg-3">
                  <label htmlFor="ShopName">{this.props.language["storelist.shopname"] || "storelist.shopname"}</label>
                  <span className="p-float-label">
                    <InputText style={{ width: '100%' }}
                      id="shopName"
                      value={this.state.shopName}
                      onChange={e =>
                        this.setState({ shopName: e.target.value })
                      }
                    />
                  </span>
                </div>
                <div className="p-col-3 p-md-1 p-sm-6">
                  <label>{this.props.language["status"] || "l_status"} : </label>
                  <br />
                  <div style={{ paddingTop: 6 }}>
                    <Checkbox inputId="statusCode" checked={this.state.statusCode} onChange={e => this.setState({ statusCode: e.checked })} />
                    <small htmlFor="statusCode">{this.state.statusCode ? ' Active' : ' InActive'}</small>
                  </div>
                </div>
              </div>
            </AccordionTab>
          </Accordion>
          {dialogUpdate}
          <Toolbar left={leftSearch} />
          {this.state.isLoading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
          <br />
          <DataTable value={this.state.datas}
            paginator={true} rows={20}
            rowsPerPageOptions={[20, 50, 100]} style={{ fontSize: "13px" }}
            expandedRows={this.state.expandedRows}
            onRowToggle={(e) => this.onSelectedChange(e.data)}
            dataKey="rowNum" rowHover
            paginatorPosition={"both"}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          >
            <Column field="rowNum" style={{ width: "5%", textAlign: 'center' }} header={this.props.language["no"] || "l_no"} />
            <Column field="area" style={{ width: "8%" }} filter={true} header={this.props.language["area"] || "l_area"} />
            <Column field="region" style={{ width: "8%" }} filter={true} header={this.props.language["region"] || "l_region"} />
            <Column field="customer" style={{ width: "8%" }} filter={true} header={this.props.language["customer"] || "l_customer"} />
            <Column field="channel" style={{ width: "8%", textAlign: 'center' }} filter={true} header={this.props.language["channel"] || "l_channel"} />
            <Column field="shopCode" header={this.props.language["shop_code"] || "l_shop_code"} style={{ width: "10%" }} filter={true} />
            <Column field="shopName" header={this.props.language["shop_name"] || "l_shop_name"} style={{ width: "10%" }} filter={true} />
            <Column field="address" filter={true} header={this.props.language["address"] || "l_address"} style={{ width: "15%" }} />
            <Column field="province" filter={true} header={this.props.language["province"] || "l_province"} style={{ width: "15%" }} />
            <Column field="auditDate" filter={true} header={this.props.language["audit_date"] || "l_audit_date"} style={{ width: "7%" }} />
            <Column field="status" filter={true} header={this.props.language["status"] || "l_status"} style={{ width: "5%", textAlign: 'center' }} />
            <Column body={this.actionButtons} header="#" style={{ width: '5%', textAlign: "center" }} ></Column>
          </DataTable>
        </Card>
      ) : (this.state.permission.view !== undefined && (
        <Page403 />
      ))
    )
  }
}
function mapStateToProps(state) {
  return {
    language: state.languageList.language,
    usearea: true,
    useprovince: true,
    regions: state.regions.regions,

    getListRawByReport: state.shops.getListRawByReport,
    exportRawByReport: state.shops.exportRawByReport,
    updateShopByReport: state.shops.updateShopByReport
  };
}
function mapDispatchToProps(dispatch) {
  return {
    ShopController: bindActionCreators(actionCreatorsShop, dispatch),
    RegionController: bindActionCreators(RegionActionCreate, dispatch)

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShopInfo);
