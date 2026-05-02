import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from "../App";

const Login = ({ setToken }) => {
  
  const navigate = useNavigate();

  // State for form inputs
  const [mobileNum, setMobileNum] = useState('');
  const [password, setPassword] = useState('');

  const fullMobileNum = `+91${mobileNum}`;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
     
    try {
      
      const response = await axios.post(backendUrl + '/api/user/admin', {
      mobileNum: fullMobileNum, 
      password
      });
      console.log(response);
      if (response.data.success) {
        setToken(response.data.token)
        toast.success("Welcome back, Admin!");
      }
      else
      {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }
   
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-10 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-3">
        <p className="prata-regular text-3xl uppercase tracking-tighter">
          LogIn
        </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Mobile Number Input */}
      <div className="flex w-full border border-gray-800 rounded overflow-hidden">
        <span className="bg-gray-100 px-3 py-2 border-r border-gray-800 text-gray-500 text-sm flex items-center">
          +91
        </span>
        <input
          type="tel"
          value={mobileNum}
          onChange={(e) => setMobileNum(e.target.value)}
          pattern="[0-9]{10}"
          className="w-full px-3 py-2 outline-none"
          placeholder="Mobile Number"
          required
        />
      </div>
     
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800 rounded outline-none"
          placeholder="Password"
          required
        />
      
      <button className="bg-black text-white font-light px-8 py-2.5 mt-4 rounded w-full active:bg-gray-700 transition-all">
        Login
      </button>
    </form>
  );
};

export default Login;