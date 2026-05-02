import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [currentState, setCurrentState] = useState("Login");
  const [useOtp, setUseOtp] = useState(false);
  const navigate = useNavigate();

  // State for form inputs
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === 'Login') {
        // We add the '+91' because your .env has it!
        const fullMobileNum = `+91${mobileNumber}`;

        console.log("Attempting Login with:", fullMobileNum);

        const response = await axios.post("http://localhost:4000/api/user/admin", { 
          mobileNum: fullMobileNum, 
          password 
        });

        if (response.data.success) {
          // 1. Save token to LocalStorage
          localStorage.setItem('token', response.data.token);
          
          // 2. Update state in App.js (if applicable)
          if (setToken) setToken(response.data.token);

          toast.success("Welcome back, Admin!");
          
          // 3. Redirect to the Add Product page
          navigate('/add'); 
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Placeholder for Sign Up logic if needed
        toast.info("Sign up logic not yet implemented on backend");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-10 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-3">
        <p className="prata-regular text-3xl uppercase tracking-tighter">
          {currentState}
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
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          pattern="[0-9]{10}"
          className="w-full px-3 py-2 outline-none"
          placeholder="Mobile Number"
          required
        />
      </div>

      {/* Password Input */}
      {!useOtp && (
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800 rounded outline-none"
          placeholder="Password"
          required
        />
      )}

      {/* Login Buttons & Toggles */}
      <div className="w-full flex justify-between text-xs mt-[-8px]">
        <p onClick={() => setUseOtp(!useOtp)} className="cursor-pointer text-blue-600 hover:underline">
          {useOtp ? "Login with Password" : "Login with OTP"}
        </p>
        <p onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')} className="cursor-pointer hover:text-black">
          {currentState === "Login" ? "Create account" : "Login Here"}
        </p>
      </div>

      <button className="bg-black text-white font-light px-8 py-2.5 mt-4 rounded w-full active:bg-gray-700 transition-all">
        {currentState === "Login" ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
};

export default Login;