import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from "../App";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [mobileNum, setMobileNum] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Strips '+91' or '91' if the user accidentally types or pastes it
      const cleanMobile = mobileNum.startsWith('+91') 
        ? mobileNum.slice(3) 
        : mobileNum.startsWith('91') 
          ? mobileNum.slice(2) 
          : mobileNum;
      
      const fullMobileNum = `+91${cleanMobile}`;
      
      // 🔄 CHANGED: Hit the main login route so both users & admins can use it
      const response = await axios.post(backendUrl + '/api/user/login', {
        mobileNum: fullMobileNum, 
        password
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        
        // 🌟 Save the user object (including the role!) directly to local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (response.data.user.role === 'admin') {
          toast.success("Welcome back, Admin!");
        } else {
          toast.success(`Welcome, ${response.data.user.fullname}!`);
        }
        
        // Go to your main storefront homepage/dashboard
        navigate('/'); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-full max-w-sm gap-4 text-gray-800 p-8 border rounded-xl shadow-lg bg-white border-t-4 border-black"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-3">
          <p className="prata-regular text-2xl font-bold uppercase tracking-wider">
            Account LogIn
          </p>
        </div>

        {/* Mobile Number Input */}
        <div className="flex w-full border border-gray-400 rounded overflow-hidden focus-within:border-black transition-all">
          <span className="bg-gray-100 px-3 py-2 border-r border-gray-400 text-gray-500 text-sm flex items-center font-medium">
            +91
          </span>
          <input
            type="tel"
            value={mobileNum}
            onChange={(e) => setMobileNum(e.target.value)}
            pattern="[0-9]{10}"
            className="w-full px-3 py-2 outline-none text-sm"
            placeholder="Mobile Number"
            required
          />
        </div>
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded outline-none text-sm focus:border-black transition-all"
          placeholder="Password"
          required
        />
        
        <button className="bg-black text-white font-bold py-2.5 mt-2 rounded w-full hover:bg-gray-800 active:scale-[0.99] transition-all uppercase tracking-widest text-xs">
          Login to System
        </button>
      </form>
    </div>
  );
};

export default Login;