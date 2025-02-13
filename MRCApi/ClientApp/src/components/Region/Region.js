import React, { PureComponent } from 'react';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { connect } from 'react-redux';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { HelpPermission, download, getLogin } from '../../Utils/Helpler';
import { Toast } from 'primereact/toast';
import { RegionActionCreate } from '../../store/RegionController';
import { RegionApp } from '../Controls/RegionMaster';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { bindActionCreators } from 'redux';

import Page403 from '../ErrorRoute/page403';

class Region extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            permission: {},
            area: null,
            region: null,
            province: [],
            district: [],
        }
        this.pageId = 14;//4184;
        this.getFilter = this.getFilter.bind(this);
        this.displayToastMessage = this.displayToastMessage.bind(this);
        this.fileUpload = React.createRef();
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        this.setState({ permission })
    }

    componentDidMount() {
        this.props.RegionController.GetListRegion();
    }

    getFilter() {
        this.setState({ loading: true });
        const state = this.state;
        let listProvince = null;
        if (state.province) {
            listProvince = '';
            state.province.forEach(
                e => { listProvince += e + ',' }
            )
        }

        var data = {
            area: state.area ? state.area : null,
            region: state.region ? state.region : null,
            province: listProvince !== '' && listProvince ? listProvince : null,
        }
        console.log(data)
        return data;
    }
    displayToastMessage = (severity, toastMessage) => {
        try {
            this.toast?.show({ severity: severity, summary: 'Thông báo', detail: toastMessage, life: 3000 });
        } catch (e) { }
    }

    handleSearch = async () => {
        let data = this.getFilter();
        this.setState({ loading: true, datas: [] })
        await this.props.RegionController.FilterRegion(data)
        const result = await this.props.filteRegion
        if (result?.status === 200) {
            this.displayToastMessage('success', result.message)
            this.setState({
                datas: result?.data ? result?.data : [],
            })
        }
        else {
            this.displayToastMessage('error', result.message)
        }

        this.setState({ loading: false, })
    }

    handleExport = async () => {
        let data = this.getFilter();
        this.setState({ loading: true })
        await this.props.RegionController.ExportRegion(data)
        const result = await this.props.exportRegion
        if (result?.status === 200) {
            this.displayToastMessage('success', result.message)
            download(result.fileUrl)
        }
        else {
            this.displayToastMessage('error', result.message)
        }

        this.setState({ loading: false, })
    }

    handleImport = async (fileUpload) => {
        this.setState({ loading: true })
        await this.props.RegionController.ImportRegion(fileUpload)
        const result = this.props.importRegion;
        if (result?.status === 200 || result?.status === 1) {
            this.displayToastMessage('info', result?.message)
        } else {
            await download(result.fileUrl)
            this.displayToastMessage('error', result?.message)
        }
        this.fileUpload.current.fileInput = { "value": '' };
        await this.fileUpload.current.clear()
        this.setState({ loading: false, })
    }

    handleChangeInput = (e) => {
        this.setState({ [e.target.id]: e.target.value !== undefined ? e.target.value : null });
    }

    handleChange = (id, value) => {
        this.setState({ [id]: value !== undefined ? value : null });
    }

    render() {
        const leftContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.view && <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch()} style={{ marginRight: "15px" }} className="p-button-info" />}
                {this.state.permission && this.state.permission.export && <Button icon="pi pi-download" label={this.props.language["export"] || "l_export"} onClick={() => this.handleExport()} style={{ marginRight: "15px" }} className="p-button-info" />}
            </React.Fragment>
        );
        const rightContents = (
            <React.Fragment>
                {this.state.permission && this.state.permission.import &&
                    <FileUpload
                        chooseLabel={this.props.language["import"] || "l_import"}
                        ref={this.fileUpload}
                        mode="basic"
                        onClear={this.clear}
                        uploadHandler={(e) => {
                            this.handleImport(e.files[0])
                        }}
                        customUpload={true}
                        accept=".xlsx,.xls"
                        maxFileSize={10000000}
                        style={{ marginRight: "15px" }
                        } />}
            </React.Fragment>
        );
        return (
            this.state.permission.view ? (
                <Card>
                    <Toast ref={(el) => this.toast = el} />
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-grid" >
                                <RegionApp {...this} />
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {this.state.loading ? <ProgressBar mode="indeterminate" style={{ height: '5px' }}></ProgressBar> : null}
                    <DataTable
                        value={this.state.datas}
                        paginator
                        rows={20}
                        rowsPerPageOptions={[20, 50, 100]}
                        style={{ fontSize: "13px" }}
                        rowHover paginatorPosition={"both"}
                        dataKey="rowNum"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    >
                        <Column filter field='rowNum' style={{ width: "4%", textAlign: 'center' }} header="No." />
                        <Column filter field="area" header={this.props.language["area"] || "l_area"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column filter field="areaVN" header={this.props.language["area_vn"] || "l_area_vn"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column filter field="region" header={this.props.language["region"] || "l_region"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column filter field="regionVN" header={this.props.language["region_vn"] || "l_region_vn"} style={{ width: "10%", textAlign: 'center' }} />
                        <Column filter field="provinceVN" header={this.props.language["province"] || "l_province"} style={{ width: "15%", textAlign: 'center' }} />
                        <Column filter field="districtVN" header={this.props.language["district"] || "l_district"} style={{ textAlign: 'center' }} />
                        <Column filter field="townVN" header={this.props.language["town"] || "l_town"} style={{ textAlign: 'center' }} />
                    </DataTable>

                </Card>

            ) : (this.state.permission.view !== undefined && <Page403 />)

        );
    }
}

function mapStateToProps(state) {
    return {
        regions: state.regions.regions,
        filteRegion: state.regions.filteRegion,
        exportRegion: state.regions.exportRegion,
        importRegion: state.regions.importRegion,
        language: state.languageList.language,
        usearea: true,
        useregion: true,
        useprovince: true,
        usedistrict: false,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        RegionController: bindActionCreators(RegionActionCreate, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Region);