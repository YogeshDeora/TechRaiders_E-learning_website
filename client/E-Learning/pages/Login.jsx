import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthPage from "./AuthPage";
import Header from "../components/Header";

const SignupApi = {
  sendOtp: { url: "http://localhost:8000/api/send-otp" },
  verifyOtp: { url: "http://localhost:8000/api/verify-otp" },
  login: { url: "http://localhost:8000/api/login" },
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Step 1: Check Password First
  const checkPassword = async () => {
    if (!data.email || !data.password) {
      alert("Please enter a valid email and password");
      return;
    }

    try {
      const response = await fetch(SignupApi.login.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password verified! Sending OTP...");
        setPasswordVerified(true);
        requestOTP(); // Automatically send OTP after password verification
      } else {
        alert(result.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    }
  };

  // Step 2: Send OTP After Password Verification
  const requestOTP = async () => {
    // if (!passwordVerified) {
    //   alert("Please verify your password first.");
    //   return;
    // }

    try {
      const response = await fetch(SignupApi.sendOtp.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("OTP sent to your email.");
        setOtpSent(true);
      } else {
        alert(result.message || "User  not found. Kindly sign up.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    }
  };

  // Step 3: Verify OTP
  const verifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch(SignupApi.verifyOtp.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("OTP verified successfully! You can now log in.");
        setOtpVerified(true);
      } else {
        alert(result.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    }
  };

  // Step 4: Final Login After OTP Verification
  const handleFinalLogin = () => {
    if (!otpVerified) {
      alert("Please verify OTP first.");
      return;
    }

    alert("Login successful!");
    localStorage.setItem("token", "dummy-token"); // Replace with actual token
    window.location.href = "/dashboard"; // Redirect
  };

  return (
    <>
      <Header />
      <AuthPage>
        {/* Tabs */}
        <div className="flex mb-6">
          <Link to="/signup" className="w-1/2 py-3 text-gray-500 hover:text-white transition text-center">
            Signup
          </Link>
          <Link to="/login" className="w-1/2 py-3 text-white border-b-2 border-[#FACC15] font-semibold text-center">
            Login
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-center text-3xl font-bold mb-2 text-[#FACC15]">Login</h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Login with your email & password. If you are new, please sign up.
        </p>

        {/* Login Form */}
        <div>
          {/* Email Input */}
          <div className="mb-5">
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <div className="relative mt-2">
              <CiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="User @gmail.com"
                className="w-full h-12 p-3 pl-10 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                required
                name="email"
                value={data.email}
                onChange={handleOnChange}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <label className="text-gray-300 text-sm font-medium">Password</label>
            <div className="relative mt-2">
              <TbLockPassword className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                className="w-full h-12 p-3 pl-10 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                required
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
          </div>

          {/* Check Password Button */}
          {!passwordVerified && (
            <button className="mb-5 bg-[#FACC15] text-black w-full p-3 rounded-lg hover:bg-yellow-500 transition" onClick={checkPassword}>
              Verify Password
            </button>
          )}

          {/* OTP Section */}
          {passwordVerified && !otpSent && (
            <button className="mb-5 bg-[#4F46E5] text-white w-full p-3 rounded-lg hover:bg-[#3B37C9] transition" onClick={requestOTP}>
              Send OTP
            </button>
          )}

          {otpSent && (
            <div className="mb-5">
              <label className="text-gray-300 text-sm font-medium">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full h-12 p-3 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="mt-3 bg-[#4F46E5] text-white w-full p-3 rounded-lg hover:bg-[#3B37C9] transition" onClick={verifyOTP}>
                Verify OTP
              </button>
            </div>
          )}

          {/* Final Login Button */}
          {otpVerified && (
            <button className="w-full bg-[#4F46E5] text-white py-3 rounded-lg hover:bg-[#3B37C9] transition" onClick={handleFinalLogin}>
              Login
            </button>
          )}
        </div>
      </AuthPage>
    </>
  );
}

export default Login;