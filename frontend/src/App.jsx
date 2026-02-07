import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EyeGlasses from "./pages/EyeGlasses";
import SunGlasses from "./pages/SunGlasses";
import PoweredSunGlasses from "./pages/PoweredSunGlasses";
import ComputerGlasses from "./pages/ComputerGlasses";
import ContactLenses from "./pages/ContactLenses"
import Accessories from "./pages/Accessories"
import Brands from "./pages/Brands"
import Product from "./pages/Product"
import Orders from "./pages/Orders"
import Cart from "./pages/Cart"
import PlaceOrder from './pages/PlaceOrder'
import Login from './pages/Login'
import Footer from "./components/Footer";
import Navbar_New from "./components/Navbar_New"

const App = () => {
  return (
    <div className="min-h-screen max-w-screen bg-[#e7edeb]">
      <Navbar_New/>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eyeglasses" element={<EyeGlasses />} />
        <Route path="/sunglasses" element={<SunGlasses />} />
        <Route path="/poweredsunglasses" element={<PoweredSunGlasses />}/>
        <Route path="/computerglasses" element={<ComputerGlasses />}/>
        <Route path="/ContactLenses" element={<ContactLenses />}/>
        <Route path="/Accessories" element={<Accessories />}/>
        <Route path="/brands" element={<Brands />}/>

        <Route path="/Product/:productId" element={<Product/>}/> 
        <Route path="/Cart" element={<Cart/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/PlaceOrder" element={<PlaceOrder/>}/>
        <Route path="/Orders" element={<Orders/>}/>
      </Routes>
      
      <Footer/>
    </div>
  );
};

export default App;
