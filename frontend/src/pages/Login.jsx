import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../index.css';
import { useAuthStore } from "../Store/AuthStore";
import { Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { RevealBento } from "../components/Anime";
import { auth, provider } from "../lib/firebase.js";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, googleLogin } = useAuthStore();
  const togglePassword = () => setShowPassword(!showPassword);
  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      googleLogin({ token: idToken });
    } catch (error) {
      console.error("Google Sign-in error:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-black itim-regular">
      {/* Left side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6 px-6 py-10 lg:px-16 min-h-screen">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl mb-4">Login</h1>
        <div className="w-full max-w-md bg-[#3f3f3f] rounded-2xl p-6 sm:p-8">
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              className="bg-white mt-4 p-3 shadow-lg placeholder:text-base sm:placeholder:text-lg placeholder-black rounded-2xl w-full"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white mt-4 p-3 shadow-lg placeholder:text-base sm:placeholder:text-lg placeholder-black rounded-2xl w-full"
              />
              <div
                className="absolute right-4 mt-2 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-700"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="p-3 mt-6 w-full text-xl bg-black cursor-pointer text-white rounded-2xl"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-white mt-4 text-center text-base">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 underline">Signup</Link>
          </p>

          <div className="flex justify-center gap-3 mt-5 items-center">
            <div className="flex-1 h-px bg-white"></div>
            <p className="text-white text-lg sm:text-xl">or</p>
            <div className="flex-1 h-px bg-white"></div>
          </div>

          <div className="mt-6 w-full">
            <button
              onClick={handleGoogle}
              disabled={isLoggingIn}
              className="bg-white cursor-pointer hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-4 w-full text-sm sm:text-base md:text-lg p-3 rounded-2xl"
            >
              <img
                className="w-6 h-6 sm:w-8 sm:h-8"
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                alt="Google icon"
              />
              {isLoggingIn ? "Logging in..." : "Login with Google"}
            </button>
          </div>
        </div>
      </div>

      {/* Right side: Hidden on mobile */}
      <div className="hidden lg:block w-full lg:w-1/2">
        <RevealBento />
      </div>
    </div>
  );
}
