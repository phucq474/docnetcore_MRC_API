import React from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import EmployeeList from "./components/Employee/EmployeeList";
import Login from "./components/Login";
import Home from "./components/Home";
import ImageZoom from "./components/Controls/ImageZoom";
import StoreList from "./components/Shop/StoreList";
import EmployeeDetail from "./components/Employee/CreateEmployee";
import Report from "./components/Report/Report";
import Attendant from "./components/Attendant/Attendant";
import TimesheetResult from "./components/Timesheet/timesheet-result";
import NotifyManager from "./components/notify/NotifyManager";
import DocumentList from "./components/Document/DocumentList";
import DigitalMapping from "./components/Mapping/DigitalMapping";
import ProductPermission from "./components/Product/product-permission";
import WorkingPlan from "./components/WorkingPlan/working-plan-result";
import ProductList from "./components/Product/product-list";
import ShopPermission from "./components/Shop/ShopPermission";
import WorkingPlanDaily from "./components/WorkingPlan/Default";
import FormSetup from "./components/SpiralForm/FormSetup";
import FormResult from "./components/SpiralForm/form-result";
import QC from "./components/QC/qc.js";
import PrimeReact from "primereact/api";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import FormList from "./components/SpiralForm/FormList";
import PermissionForm from "./components/Permission/PermissionForm";
import MasterList from "./components/MasterList/MasterList";
import LanguageResources from "./components/Language/LanguageResources";
import ProductPrice from "./components/Product/product-price";
import ShopTargetForm from "./components/ShopTarget/ShopTargetForm";
import Page404 from "./components/ErrorRoute/Page404";
import Page403 from "./components/ErrorRoute/page403";
import ResultTotal from "./components/SpiralForm/result-total";
import WorkingPlanTimeShift from "./components/WorkingPlan/WorkingPlan-Timeshift";
import CategoryForm from "./components/Category/CategoryForm";
import Competitor from "./components/Competitor/Competitor";
import WorkingPlanDefault from "./components/WorkingPlan/WorkingPlanDefault";
import ShiftList from "./components/WorkingPlan/ShiftList";
import Suppliers from "./components/Suppliers/Suppliers";
import OOLTarget from "./components/OOL/OOLTarget";
import OOLResult from "./components/OOL/OOLResult";
import OSAResult from "./components/OSA/OSAResult";
import StockOut from "./components/StockOut/StockOut";
import SOSResult from "./components/SOS/SOSResult";
import Promotion from "./components/Promotions/Promotion";
import PromotionList from "./components/Promotions/PromotionList";
import OSATarget from "./components/OSA/OSATarget";
import DocumentUser from "./components/Document/DocumentUser";
import StockOutTarget from "./components/StockOut/StockOutTarget";
import SOSList from "./components/SOS/SOSList";
import Customers from "./components/Customer/Customer";
import AnnualLeave from "./components/AnnualLeave/AnnualLeave";
import SOSTarget from "./components/SOS/SOSTarget";
import NewFeed from "./components/NewFeed/NewFeed";
import FeedDetail from "./components/NewFeed/FeedDetail";
import { getLogin } from "./Utils/Helpler";
import { QuickRecent } from "./components/QuickRecent";
import AddressSurvey from "./components/AddressSurvey";
import EmployeeIMEI from "./components/EmployeeIMEI/EmployeeIMEI";
import ShopInfo from "./components/ShopInfo/ShopInfo";
import Approach from "./components/Approach/Approach.js";
import CompetitorResult from "./components/Competitor/Competitor-Result.js";
import NewCustomer from "./components/NewCustomer/new-customer.js";
import SellIn from "./components/SellIn/SellIn.js";
import WorkingTask from "./components/WorkingTask/WorkingTask.js";
import CompetitorDetail from "./components/CompetitorDetail/Competitor-Detail";
import TimesheetResultFonterra from "./components/Timesheet/timesheet-result-fonterra";
import CoachingResult from "./components/WorkingTask/CoachingResult";
import CustomerTarget from "./components/CustomerTarget/CustomerTarget";
import SellInByEmployee from "./components/SellIn/SellInByEmployee";
import TargetCover from "./components/TargetCover/TargetCover";
import DashboardAttendantForm from "./components/Dashboard/DashboardAttendant";
import ShopByCustomer from "./components/ShopByCustomer/ShopByCustomer";
import SyncData from "./components/API-MRC/sync-data";
import DisplayContest from "./components/DisplayContest/result";
import SellInIMV from "./components/SellIn/IMV/sellIn-imv";
import EmployeePOG from "./components/EmployeePOG/EmployeePOG";
import MobileMenu from "./components/MobileMenu/MobileMenu";
import EmployeeCategory from "./components/EmployeeCategory/CategoryEmployee";
import CoachingByEmployee from "./components/WorkingTask/CoachingByEmployee";
const isLogin = getLogin();
const hist = createBrowserHistory();
PrimeReact.ripple = true;
const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route history={hist} exact path="/Login" component={Login} />
        <Route history={hist}>
          <MainLayout>
            <Switch>
              <Route
                exact
                path="/"
                component={isLogin === null ? Login : QuickRecent}
              />
              <Route exact path="/Login" component={Login} />
              <Route exact path="/employees" component={EmployeeList} />
              <Route exact path="/Home" component={Home} />
              <Route exact path="/shops" component={StoreList} />
              <Route exact path="/reports" component={Report} />
              <Route exact path="/attendance" component={Attendant} />
              <Route
                exact
                path="/createemployee/:id"
                component={EmployeeDetail}
              />
              <Route exact path="/notification" component={NotifyManager} />
              <Route exact path="/imagezoom" component={ImageZoom} />
              <Route exact path="/digitalmapping" component={DigitalMapping} />
              <Route exact path="/document" component={DocumentList} />
              <Route
                exact
                path="/timesheet-result"
                component={
                  getLogin()?.accountName === "Fonterra"
                    ? TimesheetResultFonterra
                    : TimesheetResult
                }
              />
              <Route
                exact
                path="/timesheet-result-confirm"
                component={TimesheetResultFonterra}
              />
              <Route
                exact
                path="/product-permission"
                component={ProductPermission}
              />
              <Route exact path="/storepermission" component={ShopPermission} />
              <Route exact path="/products" component={ProductList} />
              {/* Wokingplan */}
              <Route
                exact
                path="/workingPlandaily"
                component={WorkingPlanDaily}
              />
              <Route exact path="/WorkingPlan" component={WorkingPlan} />
              <Route
                exact
                path="/workingplan-default"
                component={WorkingPlanDefault}
              />
              {/* End */}
              {/* SpiralForm */}
              <Route exact path="/form/formsetup" component={FormSetup} />
              <Route exact path="/form/list" component={FormList} />
              <Route exact path="/form/formresult" component={FormResult} />
              <Route exact path="/result-total" component={ResultTotal} />
              {/* End */}
              <Route exact path="/Permission" component={PermissionForm} />
              <Route exact path="/masterlist" component={MasterList} />
              <Route exact path="/Language" component={LanguageResources} />
              <Route exact path="/ShopTarget" component={ShopTargetForm} />
              <Route exact path="/ProductPrice" component={ProductPrice} />
              <Route
                exact
                path="/WorkingPlan/TimeShift"
                component={WorkingPlanTimeShift}
              />
              <Route exact path="/CreateEmployee" component={EmployeeDetail} />
              <Route exact path="/Category" component={CategoryForm} />
              <Route exact path="/Competitor/Create" component={Competitor} />
              <Route exact path="/Notify" component={NotifyManager} />
              <Route exact path="/ShiftList" component={ShiftList} />
              <Route exact path="/Suppliers" component={Suppliers} />
              <Route exact path="/OOLTarget" component={OOLTarget} />
              <Route exact path="/osa-result" component={OSAResult} />
              {/* <Route exact path='/OOLResult' component={OOLResult} /> */}
              <Route exact path="/OOL/Result" component={OOLResult} />
              <Route exact path="/StockOut" component={StockOut} />
              <Route exact path="/sos-result" component={SOSResult} />
              <Route exact path="/Promotion" component={Promotion} />
              <Route exact path="/PromotionList" component={PromotionList} />
              <Route exact path="/osa-target" component={OSATarget} />
              <Route exact path="/DocumentUser" component={DocumentUser} />
              <Route exact path="/StockOutTarget" component={StockOutTarget} />
              <Route exact path="/SOSList" component={SOSList} />
              <Route exact path="/Customers" component={Customers} />
              <Route exact path="/AnnualLeave" component={AnnualLeave} />
              <Route exact path="/SOSTarget" component={SOSTarget} />
              <Route exact path="/AddressSurvey" component={AddressSurvey} />
              <Route exact path="/employeeimei" component={EmployeeIMEI} />
              <Route exact path="/shop-info" component={ShopInfo} />
              <Route exact path="/approach" component={Approach} />
              <Route exact path="/qc" component={QC} />
              <Route
                exact
                path="/Competitor/Result"
                component={CompetitorResult}
              />
              <Route exact path="/NewCustomer" component={NewCustomer} />
              <Route exact path="/SellIn/Default" component={SellIn} />
              <Route exact path="/WorkingTask" component={WorkingTask} />
              <Route
                exact
                path="/Competitor/CompetitorDetails"
                component={CompetitorDetail}
              />
              <Route exact path="/CoachingResult" component={CoachingResult} />
              <Route exact path="/CustomerTarget" component={CustomerTarget} />
              <Route
                exact
                path="/SellInByEmployee"
                component={SellInByEmployee}
              />
              <Route exact path="/TargetCover" component={TargetCover} />
              <Route
                exact
                path="/Dashboard/Attendant"
                component={DashboardAttendantForm}
              />
              <Route exact path="/ShopByCustomer" component={ShopByCustomer} />

              <Route exact path="/newfeed" component={NewFeed} />
              <Route
                exact
                path="/newfeed/feed/:feedKey"
                component={FeedDetail}
              />
              <Route exact path="/sell-in-imv" component={SellInIMV} />
              <Route exact path="/employeePOG" component={EmployeePOG} />
              <Route exact path="/sync-data" component={SyncData} />
              <Route exact path="/display-contest" component={DisplayContest} />
              <Route exact path="/Page403" component={Page403} />
              <Route exact path="/mobilemenu" component={MobileMenu} />

              <Route
                exact
                path="/employeecategory"
                component={EmployeeCategory}
              />
              <Route
                exact
                path="/coaching-byemployee"
                component={CoachingByEmployee}
              />

              <Route exact path="*" component={Page404} />
            </Switch>
          </MainLayout>
        </Route>
      </Switch>
    </Router>
  );
};
export default App;
