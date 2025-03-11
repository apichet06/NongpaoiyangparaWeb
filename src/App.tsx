import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import LoginForm from './login/loginform';
import Memu from './components/headers/memu';
import Footer from './components/footer/footer';
import Home from "./admin/home/home";
import RubberPrice from "./admin/rubberPrice/rubberPrice";
import RubberPricehistory from "./admin/rubberPricehistory/rubberPricehistory";
import RubberPriceReport from "./admin/rubberPriceReport/rubberPriceReport";
import ShareapercentReport from "./admin/shareapercentReport/shareapercentReport";
import SharePercent from "./admin/sharePercent/sharePercent";
import Users from "./admin/users/users";
import Weightprice from "./admin/weightprice/weightprice";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/"; // ตรวจสอบว่าเป็นหน้าล็อกอินหรือไม่

  return (
    <>
      {!isLoginPage && <Memu />}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="Home" element={<Home />} />
        <Route path="RubberPrice" element={<RubberPrice />} />
        <Route path="RubberPricehistory" element={<RubberPricehistory />} />
        <Route path="RubberPriceReport" element={<RubberPriceReport />} />
        <Route path="ShareapercentReport" element={<ShareapercentReport />} />
        <Route path="SharePercent" element={<SharePercent />} />
        <Route path="Users" element={<Users />} />
        <Route path="Weightprice" element={<Weightprice />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
