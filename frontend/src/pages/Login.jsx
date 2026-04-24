import React, { useState } from "react";
import Title from "../components/Title";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [useOtp, setUseOtp] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Logic for Mobile Authentication / OTP verification goes here
  };

  return (
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-3 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-3">
          <p className="prata-regular text-3xl uppercase tracking-tighter">
            {currentState}
          </p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        {/* Show Name only during Sign Up */}
        {currentState === "Sign Up" && (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800 rounded focus:ring-1 focus:ring-black outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {/* Mobile Number Input with Country Code */}
        <div className="flex w-full border border-gray-800 rounded overflow-hidden">
          <span className="bg-gray-100 px-3 py-2 border-r border-gray-800 text-gray-500 text-sm flex items-center">
            +91
          </span>
          <input
            type="tel"
            pattern="[0-9]{10}"
            className="w-full px-3 py-2 outline-none"
            placeholder="Mobile Number"
            required
          />
        </div>

        {/* Password or OTP Input */}
        {useOtp ? (
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-800 rounded outline-none tracking-[1em] text-center font-bold"
            placeholder="000000"
            max="999999"
            required
          />
        ) : (
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800 rounded outline-none"
            placeholder="Password"
            required
          />
        )}

        <div className="w-full flex justify-between text-xs mt-[-8px]">
          {/* Toggle between Password and OTP login */}
          <p
            onClick={() => setUseOtp(!useOtp)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {useOtp ? "Login with Password" : "Login with OTP"}
          </p>

          {/* Toggle between Login and Sign Up */}
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer hover:text-black"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:text-black"
            >
              Login Here
            </p>
          )}
        </div>

        <button className="bg-black text-white font-light px-8 py-2.5 mt-4 rounded w-full active:bg-gray-700 transition-all">
          {currentState === "Login"
            ? useOtp
              ? "Verify & Sign In"
              : "Sign In"
            : "Create Account"}
        </button>

        {useOtp && (
          <p className="text-xs text-gray-400">
            Resend OTP in <span className="font-bold text-gray-600">00:59</span>
          </p>
        )}
      </form>
  );
};

export default Login;
