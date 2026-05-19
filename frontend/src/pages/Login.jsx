import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from "../context/ShopContext";

const Login = ({ isCheckout = false }) => {
  const [currentState, setCurrentState] = useState("Login");
  const navigate = useNavigate();
  
  const { backendUrl, setToken, token, getUserProfile } = useContext(ShopContext);

  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const cleanMobile = mobileNumber.startsWith('91') ? mobileNumber.slice(2) : mobileNumber;
      const fullMobileNum = `+91${cleanMobile}`;
      
      if (currentState === 'Login') {
        const response = await axios.post(`${backendUrl}/api/user/login`, { 
          mobileNum: fullMobileNum, 
          password 
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          
          // 🌟 CRITICAL CONNECT: Store the complete user profile payload (including role: 'admin')
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
          if (getUserProfile) {
            await getUserProfile(response.data.token);
          }
          
          toast.success(response.data.message || "Welcome back!");
          if (!isCheckout) {
            navigate('/');
            window.location.reload(); // Instantly triggers navbar update to show the button
          }
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          fullname: name,
          mobileNum: fullMobileNum,
          password
        });
        
        if(response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
          if (getUserProfile) {
            await getUserProfile(response.data.token);
          }
          
          toast.success("Account Created Successfully!");
          if (!isCheckout) {
            navigate('/');
            window.location.reload();
          }
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <form 
        onSubmit={onSubmitHandler} 
        className="flex flex-col items-center w-full max-w-[450px] gap-4 text-gray-800 p-8 border rounded-xl shadow-lg bg-white"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <p className="prata-regular text-3xl uppercase tracking-tighter font-semibold">
            {currentState}
          </p>
          <hr className="border-none h-[2px] w-10 bg-gray-800" />
        </div>

        {currentState === 'Sign Up' && (
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-black outline-none transition-all" 
            placeholder="Full Name" 
            required 
          />
        )}

        <div className="flex w-full border border-gray-300 rounded-md overflow-hidden focus-within:border-black transition-all">
          <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm flex items-center font-medium border-r">
            +91
          </span>
          <input 
            type="tel" 
            value={mobileNumber} 
            onChange={(e) => setMobileNumber(e.target.value)} 
            pattern="[0-9]{10}" 
            className="w-full px-4 py-2 outline-none" 
            placeholder="Mobile Number" 
            required 
          />
        </div>

        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-black outline-none transition-all" 
          placeholder="Password" 
          required 
        />

        <div className="w-full flex justify-between text-sm mt-[-4px]">
          <p className="cursor-pointer text-gray-500 hover:text-black transition-all">Forgot password?</p>
          <p 
            onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')} 
            className="cursor-pointer text-blue-600 font-medium hover:underline"
          >
            {currentState === "Login" ? "Create account" : "Login Here"}
          </p>
        </div>

        <button 
          type="submit"
          className="bg-black text-white px-8 py-3 mt-4 rounded-md w-full uppercase font-bold tracking-widest text-sm hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;