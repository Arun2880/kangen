import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Basic/Login.js";
import Register from "./components/Basic/Register.js";
import Header from "./components/Header/header";
import Sidebar from "./components/SideBar/SideBar"; // Import only the dynamic Sidebar
import Createbill from "./pages/Billing/Createbill";
import Genratebill from "./pages/Billing/GenrateBill.js";
import Reviewbillpro from "./pages/Billing/reviewbillpro.js";
import Selectproduct from "./pages/Billing/Selectproduct";
import Viewbilllist from "./pages/Billing/Viewbilllist.js";
import Addblog from "./pages/Blog/Addblog.js";
import Viewblogs from "./pages/Blog/Viewblogs.js";
import AddClient from "./pages/clients/AddClient";
import Getconsumerbydealer from "./pages/clients/Getconsumerbydealer.js";
import ViewClient from "./pages/clients/ViewClient";
import ALLProductlist from "./pages/Consumer/Buynow/allProductlist.js";
import ALIviewcart from "./pages/Consumer/Buynow/ALlviewcart.js";
import ConsumerHistory from "./pages/Consumer/History/ConsumerHistory.js";
import Dealersearning from "./pages/Dealerearning/Dealersearning.js";
import Productlist from "./pages/Dealers/Buynow/Productlist.js";
import Viewcart from "./pages/Dealers/Buynow/Viewcart.js";
import Totalearning from "./pages/Dealers/Comission/Totalearning.js";
import AddConsumer from "./pages/Dealers/Consumers/Addconsumer.js";
import ViewConsumers from "./pages/Dealers/Consumers/ViewConsumers.js";
import History from "./pages/Dealers/history/History.js";
import Consumersorder from "./pages/Dealers/Orders/Consumersorder.js";
import Yourorder from "./pages/Dealers/Orders/Yourorder.js";
import DealerDashboard from "./pages/Home-copy/DealerDashboard.js";
import Dashboard from "./pages/Home/Dashboard";
import Independetuserdashboard from "./pages/Independetuser/Independetuser.js";
import Consumer_orders from "./pages/Orders/Consumer_orders.js";
import Dealer_order from "./pages/Orders/Dealer_order.js";
import Addcategory from "./pages/Product/Addcategory.js";
import AddProduct from "./pages/Product/AddProduct.js";
import Viewcategory from "./pages/Product/Viewcategory.js";
import Viewproductlist from "./pages/Product/Viewproductlist.js";
import Viewquotations from "./pages/quotation/Viewquotations";
import Revenueall from "./pages/revenue/Revenueall.js";
import Addstock from "./pages/Stock/Addstock.js";
import Viewaddstock from "./pages/Stock/Viewaddstock.js";
import Userdashboard from "./pages/Userdashboard/Userdashboard.js";
import Invoice from "./pages/Dealers/Buynow/Invoice.js";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const [ role, setRole ] = useState(null); // State to hold the role of the user

  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("Token");
    console.log("token is", token);
    if (!token) {
      navigate("/")
    }
    const userRole = sessionStorage.getItem("Role");
    if (token && userRole) {
      setRole(userRole); // Set role if available
    }
  }, []);
  const [ toggle, settoggle ] = useState(false);

  return (
    <div>
      {!isLoginPage && <Header toggle={toggle} settoggle={settoggle} />}
      <div className="main d-flex">
        {/* Show sidebar based on the user's role */}
        {!isLoginPage && role && (
          <div className={`sidebarWrapper ${toggle === true ? 'show' : ""} console.log("hello")`}>
            <Sidebar />
          </div>
        )}
        <div className={isLoginPage ? "full-page" : "content"}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/adddealer" element={<AddClient />} />
            <Route path="/viewdealer" element={<ViewClient />} />
            <Route path="/getconsumers" element={<Getconsumerbydealer />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/viewconsumer" element={<Viewquotations />} />
            <Route path="/createbill" element={<Createbill />} />
            <Route path="/selectproduct" element={<Selectproduct />} />
            <Route path="/bill" element={<Genratebill />} />
            <Route path="/allbill" element={<Viewbilllist />} />
            <Route path="/reviewbillproduts" element={<Reviewbillpro />} />
            <Route path="/productlist" element={<Viewproductlist />} />
            <Route path="/addstockproduct" element={<Addstock />} />
            <Route path="/addcategory" element={<Addcategory />} />
            <Route path="/viewcategory" element={<Viewcategory />} />
            <Route path="/viewstock" element={<Viewaddstock />} />
            <Route path="/revenue" element={<Revenueall />} />
            <Route path="/dealerorders" element={<Dealer_order />} />
            <Route path="/cuslist" element={<Consumer_orders />} />
            <Route path="/dealersearning" element={<Dealersearning />} />

            {/* --------------------------------Dealer by consumers-------------------- */}
            <Route path="/dealerdashboard" element={<DealerDashboard />} />
            <Route path="/addconsumer" element={<AddConsumer />} />
            <Route path="/viewdealerconsumer" element={<ViewConsumers />} />
            <Route path="/orders" element={<Yourorder />} />
            <Route path="/consumerorders" element={<Consumersorder />} />

            {/* ----------------------------------Buy now ------------------- */}
            <Route path="/products" element={<Productlist />} />
            <Route path="/viewcart" element={<Viewcart />} />
            <Route path="/history" element={<History />} />
            <Route path="/earning" element={<Totalearning />} />

            {/* ---------------------------consumer routes----------------- */}
            <Route path="/userdashboard" element={<Userdashboard />} />
            {/* <Route path="/userdashboard" element={<History />} /> */}
            <Route path="/conproductlist" element={<ALLProductlist />} />
            <Route path="/viewcuscart" element={<ALIviewcart />} />
            <Route path="/cushistory" element={<ConsumerHistory />} />

            {/* ---------------------------------blog routes------------------ */}

            <Route path="/addblog" element={<Addblog />} />
            <Route path="/viewblog" element={<Viewblogs />} />
<Route path="/invoice" element={<Invoice />} />

            {/* ----------------------Independetuser routes */}
            <Route path="/independetdashboard" element={<Independetuserdashboard />} />

            <Route path="/registeruser" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
