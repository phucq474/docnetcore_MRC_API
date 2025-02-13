import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux";
import * as LoginController from "./LoginController";
import * as EmployeeController from "./EmployeeController";
import * as ShopController from "./ShopController";
import * as MasterListDataController from "./MasterListDataController";
import * as ProductController from "./ProductController";
import * as RegionController from "./RegionController";
import * as AttendantController from "./AttendantController";
import * as TimesheetController from "./TimesheetController";
import * as NotifyController from "./NotifyController";
import * as DocumentController from "./DocumentController";
import * as PhotoController from "./PhotoController";
import * as DigitalMappingController from "./DigitalMappingController";
import * as HRController from "./HRController";
import * as ReportController from "./ReportController";
import * as EmployeeStoreController from "./EmployeeStoreController";
import * as WorkingPlanController from "./WorkingPlanController";
import * as SpiralFormController from "./SpiralFormController";
import * as CalendarController from "./CalendarController";
import * as LanguageController from "./LanguageController";
import * as PermissionController from "./PermissionController";
import * as MasterListController from "./MasterListController";
import * as ShopTargetController from "./ShopTargetController";
import * as CategoryController from "./CategoryController";
import * as CustomerController from "./CustomerController";
import * as CompetitorController from "./CompetitorController";
import * as getListChannel from "./ChannelController";
import * as SuppliersController from "./SuppliersController";
import * as OOLController from "./OOLController";
import * as OSATargetController from "./OSATargetController";
import * as OSAResultController from "./OSAResultController";
import * as SOSResultController from "./SOSResultController";
import * as StockOutController from "./StockOutController";
import * as SOSListController from "./SOSListController";
import * as PromotionController from "./PromotionController";
import * as SellOutController from "./SellOutController";
import * as AnnualLeaveController from "./AnnualLeaveController";
import * as QCController from "./QCController";
import * as ApproachController from "./ApproachController.js";
import * as SellIn from "./SellInController.js";
import * as WorkingTask from "./WorkingTaskController";
import * as SpiralFormPermission from "./SpiralFormPermissionController.js";
import * as SpiralFormStatistical from "./SpiralFormStatisticalController.js";
import * as TargetCover from "./TargetCoverController";
import * as Dashboard from "./DashboardController";
import * as DashboardIMV from "./DashboardIMVController";
import * as ShopByCustomer from "./ShopByCustomerController";
import * as SyncDataController from "./SyncDataController";
import * as DisplayContestResultsController from "./DisplayContestResultsController";
import * as SellInIMVController from "./SellInIMVController";
import * as EmployeePOGController from "./EmployeePOGController";
import * as MobileMenuController from "./MobileMenuController";
import * as AccountController from "./AccountController";
import * as SOSTargetController from "./SOSTargetController";
import * as EmployeeCategory from "./EmployeeCategoryController";

export default function configureStore(history, initialState) {
  const reducers = {
    //dashboard
    qc: QCController.reducer,
    mapping: DigitalMappingController.reducer,
    photos: PhotoController.reducer,
    documents: DocumentController.reducer,
    logins: LoginController.reducer,
    regions: RegionController.reducer,
    hrtool: HRController.reducer,
    spiralform: SpiralFormController.reducer,
    masterListDatas: MasterListDataController.reducer,
    spiralFormPermission: SpiralFormPermission.reducer,
    spiralFormStatistical: SpiralFormStatistical.reducer,
    //Notify
    notifyStore: NotifyController.reducer,
    //------ report
    reportList: ReportController.reducer,
    //----attendant
    attendants: AttendantController.reducer,
    //-----employee
    employees: EmployeeController.reducer,
    //------shop
    shops: ShopController.reducer,
    timesheets: TimesheetController.reducer,
    workingPlans: WorkingPlanController.reducer,
    employeeDetail: EmployeeController.reducer,
    listWorkingStatus: MasterListDataController.reducer,
    products: ProductController.reducer,
    employeeStore: EmployeeStoreController.reducer,
    calendars: CalendarController.reducer,
    //Lang
    languageList: LanguageController.reducer,
    permission: PermissionController.reducer,
    masterList: MasterListController.reducer,
    shoptarget: ShopTargetController.reducer,
    category: CategoryController.reducer,
    customer: CustomerController.reducer,
    competitor: CompetitorController.reducer,
    channels: getListChannel.reducer,
    suppliers: SuppliersController.reducer,
    ool: OOLController.reducer,
    osaTarget: OSATargetController.reducer,
    osaResult: OSAResultController.reducer,
    sosResult: SOSResultController.reducer,
    stockout: StockOutController.reducer,
    sosList: SOSListController.reducer,
    sosTarget: SOSTargetController.reducer,
    promotion: PromotionController.reducer,
    sellout: SellOutController.reducer,
    annualleave: AnnualLeaveController.reducer,
    approach: ApproachController.reducer,
    sellin: SellIn.reducer,
    workingTask: WorkingTask.reducer,
    targetcover: TargetCover.reducer,
    dashboard: Dashboard.reducer,
    dashboardIMV: DashboardIMV.reducer,
    shopByCustomer: ShopByCustomer.reducer,
    syncData: SyncDataController.reducer,
    displayContestResult: DisplayContestResultsController.reducer,
    sellInIMV: SellInIMVController.reducer,
    employeePOG: EmployeePOGController.reducer,
    mobilemenu: MobileMenuController.reducer,
    account: AccountController.reducer,
    employeeCategory: EmployeeCategory.reducer,
  };
  const middleware = [thunk, routerMiddleware(history)];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === "development";
  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension());
  }
  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer,
  });

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
