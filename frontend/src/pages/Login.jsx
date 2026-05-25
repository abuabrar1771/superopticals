import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const { backendUrl, setToken, setUserProfile, token, navigate } = useContext(ShopContext);

  // If already logged in, push to home
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // 🌟 ROBUST CLEANING: Strip spaces, dashes, parenthetical blocks completely
      const cleanMobile = mobileNumber.replace(/\s+/g, '').replace(/[-()]/g, '');
      
      // Standardize to your exact backend requirement (+91xxxxxxxxxx)
      const fullMobileNum = cleanMobile.startsWith('+91') 
        ? cleanMobile 
        : cleanMobile.startsWith('91') 
          ? `+${cleanMobile}` 
          : `+91${cleanMobile}`;

      const isLogin = currentState === 'Login';
      const endpoint = isLogin ? '/api/user/login' : '/api/user/register';
      
      const payload = isLogin 
        ? { mobileNum: fullMobileNum, password }
        : { fullname: name, mobileNum: fullMobileNum, password };

      const response = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (response.data.success) {
        // Extract the user record sent back from your backend controller response block
        const userData = response.data.user || { fullname: isLogin ? "Customer" : name };

        // FIXED STORAGE KEYS: Matches your Navbar's dynamic isAdmin role estimation rules
        localStorage.setItem('token', 'true');
        localStorage.setItem('user', JSON.stringify(userData));

        // Update the context states actively right now!
        setToken(true);
        setUserProfile(userData);

        toast.success(response.data.message || "Authentication successful!");

        // Handle your guest checking out vs standard browser navigation
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('redirect') === 'checkout') {
          navigate('/PlaceOrder');
        } else {
          navigate('/');
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Internal Connection Error");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-9xl m-auto mt-24 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === 'Login' ? null : (
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-md px-3 py-2 border border-gray-800"
          placeholder="Full Name"
          required
        />
      )}

      <input
        type="tel"
        onChange={(e) => setMobileNumber(e.target.value)}
        value={mobileNumber}
        className="w-full max-w-md px-3 py-2 border border-gray-800"
        placeholder="Mobile Number (e.g. 9876543210 or +919876543210)"
        required
      />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full max-w-md px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full max-w-md flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer font-bold text-blue-600 underline">
            Create account
          </p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className="cursor-pointer font-bold text-blue-600 underline">
            Login Here
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4 active:scale-95 transition-all">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;