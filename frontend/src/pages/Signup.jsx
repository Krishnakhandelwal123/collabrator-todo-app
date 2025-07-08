import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../index.css';
import { useAuthStore } from "../Store/AuthStore";
import { Loader2 } from 'lucide-react';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { RevealBento } from "../components/Anime";
import { auth, provider } from "../lib/firebase.js";
import { signInWithPopup } from "firebase/auth";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp, googleLogin, isLoggingIn } = useAuthStore();
  const togglePassword = () => setShowPassword(!showPassword);

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      googleLogin({ token: idToken });
    } catch (error) {
      console.error("Google Sign-in error:", error);
      toast.error("Google sign-in failed.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-black itim-regular">
      {/* Left side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-10 gap-8 min-h-screen">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl">Signup</h1>
        <div className="w-full max-w-md bg-[#3f3f3f] rounded-2xl p-6 sm:p-8">
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              className="bg-white mt-4 p-3 shadow-lg placeholder:text-base sm:placeholder:text-lg placeholder-black rounded-2xl w-full"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
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
              <span
                className="absolute top-1/2 mt-2 right-4 -translate-y-1/2 cursor-pointer text-xl text-gray-700"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="p-3 mt-6 w-full text-xl bg-black cursor-pointer text-white rounded-2xl"
            >
              {isSigningUp ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Signup"
              )}
            </button>
          </form>

          <p className="text-white mt-4 text-center text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 underline cursor-pointer">Login</Link>
          </p>

          <div className="flex justify-center gap-3 mt-5 items-center">
            <div className="flex-1 h-px bg-white"></div>
            <p className="text-white text-lg sm:text-xl">or</p>
            <div className="flex-1 h-px bg-white"></div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogle}
              disabled={isLoggingIn}
              className="bg-white cursor-pointer flex items-center justify-center gap-4 w-full text-sm sm:text-base md:text-xl p-3 rounded-2xl"
            >
              <img
                className="w-6 h-6"
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                alt="Google icon"
              />
              {isLoggingIn ? "Signing in..." : "Signup with Google"}
            </button>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:block w-full lg:w-1/2">
        <RevealBento />
      </div>
    </div>
  );
};

export default Signup;
