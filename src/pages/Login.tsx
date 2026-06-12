import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

import axios from "axios";
import axiosInstance from "../services/api";
import logo from "../../public/ZCAD.ico";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await axiosInstance.post(
        "/admin/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", data.token);

      if (data.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );
      }

      toast.success("Login Successful");

      navigate("/");
    } catch (error: unknown) {
      console.log(error);

      let message = "Login Failed";

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = String(error.response.data.message);
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full bg-white shadow-2xl rounded-lg max-w-md mx-auto p-8'>

        <div className="flex flex-col items-center mb-5">
          <img
            src={logo}
            alt="ZCAD"
            className="h-20 object-contain"
          />

           <h2 className='text-2xl font-semibold text-center mb-5 mt-5'>
        ZCAD FlipBook Admin
          </h2>

          <p className="text-slate-500 mt-2">
            Sign in to continue
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className='block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500  outline-none transition duration-200'
     
            />

            {emailError && (
              <p className="text-red-500 text-sm mt-1">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword ? "text" : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className='block w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500  outline-none transition duration-200'
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm mt-1">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className='w-full py-3 px-4 rounded-lg bg-[#3b82f6] hover:bg-primary-600 text-white font-medium transition duration-200 flex items-center justify-center'
          >
            {loading ? (
              <span className="flex justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}