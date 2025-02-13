import React,{PureComponent} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Accordion,AccordionTab} from 'primereact/accordion';
import {Button} from 'primereact/button';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import CategoryDialog from './CategoryDialog';
import {Dialog} from 'primereact/dialog';
import {Toolbar} from 'primereact/toolbar';
import {HelpPermission,toSetArray} from '../../Utils/Helpler'
import {RegionActionCreate} from '../../store/RegionController';
import {actionCreatorsCategory} from '../../store/CategoryController';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Dropdown} from 'primereact/dropdown';
import {ProductCreateAction} from '../../store/ProductController';
import '../../css/highlight.css'
import Page403 from '../ErrorRoute/page403';

class CategoryForm extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            displayUpdateDialog: false,
            displayInsertDialog: false,
            displayConfirmDialog: false,
            inputValues: {},
            isLoading: false,
            permission: {},
        }
        this.pageId = 6
        this.handleSearch = this.handleSearch.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleInsert = this.handleInsert.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleValidInput = this.handleValidInput.bind(this)
        this.displayToastMessage = this.displayToastMessage.bind(this)
        this.actionButtons = this.actionButtons.bind(this)
        this.renderFooterAction = this.renderFooterAction.bind(this)
        this.handleDialog = this.handleDialog.bind(this)
        this.handleChangeForm = this.handleChangeForm.bind(this)
        this.statuses = [
            {name: "Active",id: 1},
            {name: "Inactive",id: 0}
        ]
    }
    async handleSearch() {
        await this.setState({isLoading: true,datas: []})
        const {category,subCategory,segment,status} = await this.state
        const data = await {
            category: (typeof category === "object" && category !== null) ? category.categoryId : category || null,
            subCategory: (typeof subCategory === "object" && subCategory !== null) ? subCategory.subCatId : subCategory || null,
            segment: (typeof segment === "object" && segment !== null) ? segment.segmentId : segment || null,
            status: (status && status.id !== undefined) ? status.id : 1,
        }
        await this.props.CategoryController.FilterCategory(data)
        const datas = await this.props.filterCategory
        await this.displayToastMessage("info","Result ",datas.length)
        await this.setState({datas: datas,isLoading: false})
    }
    async handleInsert() {
        await this.setState({isLoading: true})
        await this.handleValidInput().then(async (valid) => {
            if(valid) {
                const {division,category,categoryCode,categoryVN,subCategory,
                    subCategoryVN,segment,subSegment,order,order2,type} = await this.state.inputValues
                const data = await {
                    division: (division && division.division !== undefined) ? division.division : "",
                    categoryId: (typeof category === "object" && category !== null) ? category.categoryId : null,
                    categoryCode: categoryCode || "",
                    category: (typeof category === "object" && category !== null) ? category.category : category || null,
                    categoryVN: categoryVN || "",
                    subCatId: (typeof subCategory === "object" && subCategory !== null) ? subCategory.subCatId : null,
                    subCategory: (typeof subCategory === "object" && subCategory !== null) ? subCategory.subCategory : subCategory || null,
                    subCategoryVN: subCategoryVN || "",
                    segmentId: (typeof segment === "object" && segment !== null) ? segment.segmentId : null,
                    segment: (typeof segment === 'object' && segment !== null) ? segment.segment : segment || null,
                    subSegmentId: (typeof subSegment === "object" && subSegment !== null) ? subSegment.subSegmentId : null,
                    subSegment: (typeof subSegment === "object" && subSegment !== null) ? subSegment.subSegment : subSegment || null,
                    order: order || null,
                    order2: order2 || null,
                    type: type || null,
                }
                await this.props.CategoryController.InsertCategory(data)
                let response = await this.props.insertCategory
                await this.handleDialog(false,"displayInsertDialog")
                if(typeof response === "object" && response[0] && response[0].alert == "1") {
                    this.fetchCategory()
                    await this.setState({
                        datas: this.props.filterCategory
                    })
                    await this.displayToastMessage("info","Insert Successful",1)
                } else {
                    await this.displayToastMessage("error","Insert Failed",-1)
                }
            }
        })
        await this.setState({isLoading: false})
    }
    async handleUpdate() {
        await this.setState({isLoading: true})
        await this.handleValidInput().then(async (valid) => {
            if(valid) {
                const {division,category,categoryCode,categoryVN,subCategory,
                    subCategoryVN,segment,subSegment,order,order2,type,status} = await this.state.inputValues
                const {id} = await this.state.rowData
                const data = await {
                    id: id,
                    division: (division && division.division !== undefined) ? division.division : "",
                    categoryId: (typeof category === "object" && category !== null) ? category.categoryId : null,
                    categoryCode: categoryCode || "",
                    category: (typeof category === "object" && category !== null) ? category.category : category || null,
                    categoryVN: categoryVN || "",
                    subCatId: (typeof subCategory === "object" && subCategory !== null) ? subCategory.subCatId : null,
                    subCategory: (typeof subCategory === "object" && subCategory !== null) ? subCategory.subCategory : subCategory || null,
                    subCategoryVN: subCategoryVN || "",
                    segmentId: (typeof segment === "object" && segment !== null) ? segment.segmentId : null,
                    segment: (typeof segment === 'object' && segment !== null) ? segment.segment : segment || null,
                    subSegmentId: (typeof subSegment === "object" && subSegment !== null) ? subSegment.subSegmentId : null,
                    subSegment: (typeof subSegment === "object" && subSegment !== null) ? subSegment.subSegment : subSegment || null,
                    order: order || null,
                    order2: order2 || null,
                    type: type || null,
                    status: (status && status.id !== undefined) ? status.id : 1,
                }
                await this.props.CategoryController.UpdateCategory(data,this.state.rowIndex)
                let response = await this.props.updateCategory
                await this.handleDialog(false,"displayUpdateDialog")
                if(typeof response === 'object' && response[0] && response[0].alert == "1") {
                    const seconds = await 3000,outstanding = "highlightText"
                    let rowUpdated = await document.querySelectorAll(".p-datatable-tbody")[0]
                    if(rowUpdated && !rowUpdated.children[this.state.rowIndex].classList.contains(outstanding)) {
                        rowUpdated.children[this.state.rowIndex].classList.add(outstanding)
                        setTimeout(() => {
                            rowUpdated.children[this.state.rowIndex].classList.remove(outstanding)
                        },seconds)
                    }
                    await this.fetchCategory()
                    await this.setState({
                        datas: this.props.filterCategory,
                        category: this.state.category ? response[0].category : "",
                        division: this.state.division ? response[0].division : "",
                        subCategory: this.state.subCategory ? response[0].subCategory : "",
                        segment: this.state.segment ? response[0].segment : "",
                    })
                    await this.displayToastMessage("info","Update Successful",1)
                } else {
                    await this.displayToastMessage("error","Update Failed",-1)
                }
            }
        })
        await this.setState({isLoading: false})
    }
    async handleDelete() {
        await this.setState({isLoading: true})
        await this.props.CategoryController.DeleteCategory(this.state.rowData.id,this.state.rowIndex)
        const response = await this.props.deleteCategory
        await this.handleDialog(false,"displayConfirmDialog")
        if(response.result === 1) {
            await this.fetchCategory()
            await this.displayToastMessage("info","Delete succeed",1)
            await this.setState({
                datas: this.props.filterCategory
            })
        } else {
            await this.displayToastMessage("error","Delete failed",-1)
        }
        await this.setState({isLoading: false})
    }
    async handleValidInput() {
        let check = true;
        const {division,category,categoryCode} = await this.state.inputValues
        if(!division) {
            await this.setState({inputValues: {...this.state.inputValues,errorDivision: "Division Required"}})
            check = false
        } else await this.setState({inputValues: {...this.state.inputValues,errorDivision: ""}})
        if(!category) {
            await this.setState({inputValues: {...this.state.inputValues,errorCate: "Category Required"}})
            check = false
        } else await this.setState({inputValues: {...this.state.inputValues,errorCate: ""}})
        if(!categoryCode) {
            await this.setState({inputValues: {...this.state.inputValues,errorCateCode: "Code Required"}})
            check = false
        } else await this.setState({inputValues: {...this.state.inputValues,errorCateCode: ""}})
        if(!check) return false
        else return true
    }
    displayToastMessage(severity,toastMessage,actionState) { // 1:succeess  -1:failed
        let detail = ""
        if(actionState === 1) detail = "1 row affected"
        else if(actionState === -1) detail = "0 row affected"
        else detail = `Result ${actionState}`
        this.toast.show({severity: severity,summary: toastMessage,detail: detail,life: 3000});
    }
    actionButtons(rowData,event) {
        return (
            this.state.permission && (
                <div className="p-d-flex p-flex-column">
                    {this.state.permission.view && this.state.permission.edit && (
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-info p-mr-2 p-mb-2" onClick={() => this.handleDialog(true,"displayUpdateDialog",rowData,event.rowIndex)} />
                    )}
                    {this.state.permission.view && this.state.permission.delete && (
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger p-mb-2" onClick={() => this.handleDialog(true,"displayConfirmDialog",rowData,event.rowIndex)} />
                    )}
                </div>
            )
        )
    }
    renderFooterAction(actionName,cancel,proceed) {
        return (
            <div>
                <Button label="Cancel" className="p-button-danger" onClick={cancel} />
                <Button label={actionName} className="p-button-Success" onClick={proceed} />
            </div>
        )
    }
    async handleDialog(boolean,stateName,rowData = {},rowIndex = -1) {
        if(boolean) {
            await this.setState({isLoading: true})
            switch(stateName) {
                case "displayUpdateDialog":
                    const {categoryCode,categoryVN,division,subCategoryVN,
                        order,order2,type,status,
                        categoryId,subCatId,segmentId,subSegmentId} = await rowData
                    let arr = await this.props.categories
                    const filterCate = await this.filter(arr,'categoryId',categoryId)[0]
                    const filterSubCate = await this.filter(arr,'subCatId',subCatId)[0]
                    const filterSegment = await this.filter(arr,'segmentId',segmentId)
                    const filterSubsegment = await this.filter(arr,'subSegmentId',subSegmentId)
                    const filterDivision = await this.props.categories.filter(e => e.division === division)
                    await this.setState({
                        inputValues: {
                            categoryCode,categoryVN,subCategoryVN,order,order2,type,
                            status: status ? this.statuses[0] : this.statuses[1],
                            category: filterCate ? (filterCate.category ? filterCate : "") : "",
                            subCategory: filterSubCate ? (filterSubCate.subCategory ? filterSubCate : "") : "",
                            segment: filterSegment[0] ? (filterSegment[0].segment ? filterSegment[0] : "") : "",
                            subSegment: filterSubsegment[0] ? (filterSubsegment[0].subSegment ? filterSubsegment[0] : "") : "",
                            division: filterDivision[0] ? filterDivision[0] : {},
                            disabledCateCode: true,
                            disabledCateVN: true,
                            disabledSubCateVN: (filterSubCate && filterSubCate.subCatId !== null) ? true : false
                        }
                    })
                    break;
                case "displayInsertDialog":
                    await this.setState({
                        inputValues: {
                            status: this.statuses[0],
                        }
                    })
                    break;
            }
            await this.setState({
                [stateName]: true,
                rowData: rowData,
                inputValues: {
                    ...this.state.inputValues,
                    statuses: this.statuses,
                    categoryList: toSetArray(this.props.categories,"category"),
                    subCategoryList: toSetArray(this.props.categories,"subCategory"),
                    segmentList: toSetArray(this.props.categories,"segment"),
                    subSegmentList: toSetArray(this.props.categories,"subSegment"),
                    divisions: toSetArray(this.props.categories,"division"),
                },
                rowIndex: rowIndex,
            })
            await this.setState({isLoading: false})
        } else {
            this.setState({
                [stateName]: false,
                rowData: {},
                inputValues: {},
            })
        }
    }
    async handleChangeForm(value,stateName,subStateName = null) {
        if(subStateName === null) {
            await this.setState({[stateName]: value});
        } else {
            switch(subStateName) {
                case "category":
                    if(value !== null && typeof value === "object") {
                        await this.setState({
                            [stateName]: {
                                ...this.state[stateName],
                                categoryCode: value.categoryCode,
                                categoryVN: value.categoryVN,
                                disabledCateCode: true,
                                disabledCateVN: true,
                            }
                        })
                    } else if((value === null && typeof value === "object") || (value !== null && typeof value === 'string')) {
                        await this.setState({
                            [stateName]: {
                                ...this.state[stateName],
                                categoryCode: "",categoryVN: "",
                                disabledCateCode: false,
                                disabledCateVN: false,
                            }
                        })
                    }
                    break;
                case "subCategory":
                    if(value !== null && typeof value === "object") {
                        await this.setState({
                            [stateName]: {
                                ...this.state[stateName],
                                subCategoryVN: value.subCategoryVN,
                                disabledSubCateVN: true,

                            }
                        })
                    } else if((value === null && typeof value === "object") || (value !== null && typeof value === 'string')) {
                        await this.setState({
                            [stateName]: {
                                ...this.state[stateName],
                                subCategoryVN: "",
                                disabledSubCateVN: false,
                            }
                        })
                    }
                    break;
            }
            await this.setState({
                [stateName]: {
                    ...this.state[stateName],
                    [subStateName]: value,
                }
            });
        }
    }
    handleChangeSearch = async (id,value) => {
        if(id === "division") {
            if(value !== null) {
                await this.setState({
                    categoryList: toSetArray(this.props.categories,"category",id,value.division)
                })
            } else {
                await this.setState({
                    categoryList: toSetArray(this.props.categories,"category")
                })
            }
        }
        if(id === "category") {
            if(value !== null) {
                await this.setState({
                    subCategoryList: toSetArray(this.props.categories,"subCategory",id,value.category)
                })
            } else {
                await this.setState({
                    subCategoryList: toSetArray(this.props.categories,"subCategory")
                })
            }
        }
        await this.setState({
            [id]: value === null ? "" : value,
        });
    }
    filter = (arr,key,value) => {
        return arr.filter(e => e[key] === value)
    }
    async componentWillMount() {
        let permission = await HelpPermission(this.pageId);
        await this.setState({permission})
    }
    componentDidMount() {
        this.fetchCategory()
    }
    fetchCategory = async () => {
        await this.props.ProductController.GetCategory();
        await this.setState({
            divisionList: toSetArray(this.props.categories,"division"),
            categoryList: toSetArray(this.props.categories,"category"),
            subCategoryList: toSetArray(this.props.categories,"subCategory"),
            segmentList: toSetArray(this.props.categories,"segment"),
            status: this.statuses[0]
        })
    }
    render() {
        let dataTable = null,insertDialog = null,updateDialog = null,confirmDialog = null
        const leftContents = () => {
            return (
                this.state.permission && (
                    <React.Fragment>
                        {this.state.permission.view && (
                            <Button icon="pi pi-search" label={this.props.language["search"] || "l_search"} onClick={() => this.handleSearch(false)} style={{marginRight: "15px"}} className="p-button-info" />
                        )}
                    </React.Fragment>
                )
            )
        }
        const rightContents = () => {
            return (
                this.state.permission && (
                    <React.Fragment>
                        {this.state.permission.view && this.state.permission.create && (
                            <Button label={this.props.language["insert"] || "l_insert"} icon="pi pi-file-o" onClick={() => this.handleDialog(true,"displayInsertDialog")} style={{marginRight: "15px"}} />
                        )}
                    </React.Fragment>
                )
            )
        }
        if(this.state.datas.length > 0) { // * DATATABLE
            dataTable = <DataTable value={this.state.datas} paginator rows={20} rowHover
                resizableColumns columnResizeMode="expand" paginatorPosition={"both"}>
                <Column header="No." style={{width: 50,textAlign: 'center'}} body={(rowData,event) => (<span>{event.rowIndex + 1}</span>)} ></Column>
                <Column filter field="division" header={this.props.language["division"] || "l_division"} style={{textAlign: "center"}} ></Column>
                <Column filter field="categoryCode" header={this.props.language["category_code"] || "l_category_code"} style={{textAlign: "center"}}></Column>
                <Column filter field="category" header={this.props.language["category"] || "l_category"} style={{textAlign: "center"}} ></Column>
                <Column filter field="subCategory" header={this.props.language["subcategory"] || "l_subcategory"} style={{textAlign: "center"}}></Column>
                <Column filter field="segment" header={this.props.language["segment"] || "l_segment"} style={{textAlign: "center"}} ></Column>
                <Column filter field="subSegment" header={this.props.language["subsegment"] || "l_subsegment"} style={{textAlign: "center"}}></Column>
                <Column filter field="status" header={this.props.language["status"] || "l_status"} style={{width: 80,textAlign: "center"}}  ></Column>
                <Column body={this.actionButtons} header="#" style={{width: 80,}} ></Column>
            </DataTable>
        }
        if(this.state.displayInsertDialog) { // * INSERT DIALOG
            insertDialog = <CategoryDialog
                stateName={"inputValues"}
                actionName={"Insert"}
                dialogStateName={"displayInsertDialog"}
                displayDialog={this.state.displayInsertDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleInsert}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleDialog={this.handleDialog}
            />
        }
        if(this.state.displayUpdateDialog) { // * UPDATE DIALOG
            updateDialog = <CategoryDialog
                stateName={"inputValues"}
                actionName={"Update"}
                dialogStateName={"displayUpdateDialog"}
                displayDialog={this.state.displayUpdateDialog}
                displayFooterAction={this.renderFooterAction}
                handleActionFunction={this.handleUpdate}
                inputValues={this.state.inputValues}
                handleChangeForm={this.handleChangeForm}
                handleDialog={this.handleDialog}
            />
        }
        if(this.state.displayConfirmDialog) { // * CONFIRM DIALOG
            confirmDialog = <Dialog header="Confirmation" visible={this.state.displayConfirmDialog} modal style={{width: '350px'}} footer={this.renderFooterAction("Delete",() => this.handleDialog(false,"displayConfirmDialog"),this.handleDelete)} onHide={() => this.handleDialog(false,"displayConfirmDialog")}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}} />
                    <span>{this.props.language["are_you_sure_to_delete"] || "l_are_you_sure_to_delete"}?</span>
                </div>
            </Dialog>
        }
        return (
            this.state.permission.view ? (
                <React.Fragment>
                    <Toast ref={(el) => this.toast = el} />
                    {this.state.isLoading &&
                        <div className="loading_container">
                            <ProgressSpinner className="loading_spinner" strokeWidth="8" fill="none" animationDuration=".5s" />
                        </div>
                    }
                    <Accordion activeIndex={0}>
                        <AccordionTab header={this.props.language["search"] || "l_search"}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{this.props.language["division"] || "l_division"}</label>
                                    <Dropdown value={this.state.division} options={this.state.divisionList} filter showClear
                                        onChange={(e) => this.handleChangeSearch("division",e.value)} optionLabel="division" editable
                                        placeholder={this.props.language["select_division"] || "l_select_division"} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{this.props.language["category"] || "l_category"}</label>
                                    <Dropdown value={this.state.category} options={this.state.categoryList} filter showClear
                                        onChange={(e) => this.handleChangeSearch("category",e.value)} optionLabel="category" editable
                                        placeholder={this.props.language["select_category"] || "l_select_category"} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{this.props.language["subcategory"] || "l_subcategory"}</label>
                                    <Dropdown value={this.state.subCategory} options={this.state.subCategoryList} filter showClear
                                        onChange={(e) => this.handleChangeSearch("subCategory",e.value)} optionLabel="subCategory" editable
                                        placeholder={this.props.language["select_subcategory"] || "l_select_subcategory"} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{this.props.language["segment"] || "l_segment"}</label>
                                    <Dropdown value={this.state.segment} options={this.state.segmentList} filter showClear
                                        onChange={(e) => this.handleChangeSearch("segment",e.value)} optionLabel="segment" editable
                                        placeholder={this.props.language["select_segment"] || "l_select_segment"} />
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label>{this.props.language["status"] || "l_status"}</label>
                                    <Dropdown value={this.state.status} options={this.statuses} onChange={(e) => this.handleChangeSearch("status",e.value)}
                                        optionLabel="name" placeholder={this.props.language["select_status"] || "l_select_status"} />
                                </div>
                            </div>
                            <Toolbar left={leftContents} right={rightContents} />
                        </AccordionTab>
                    </Accordion>
                    {dataTable}
                    {insertDialog}
                    {updateDialog}
                    {confirmDialog}
                </React.Fragment>
            ) : (this.state.permission.view !== undefined && (
                <Page403 />
            ))
        )
    }
}
function mapStateToProps(state) {
    return {
        language: state.languageList.language,
        filterCategory: state.category.filterCategory,
        insertCategory: state.category.insertCategory,
        updateCategory: state.category.filterCategory,
        deleteCategory: state.category.deleteCategory,
        categories: state.products.categories,
        productCates: state.products.productCates,
        usedivision: true,
        usecate: true,
        usesubcate: true,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        RegionController: bindActionCreators(RegionActionCreate,dispatch),
        CategoryController: bindActionCreators(actionCreatorsCategory,dispatch),
        ProductController: bindActionCreators(ProductCreateAction,dispatch),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(CategoryForm);