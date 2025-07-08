import {Routes,Route,Navigate} from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthStore } from "./Store/AuthStore";
import { useEffect } from 'react';
import { Loader } from "lucide-react";
import Initial from './components/Initial';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <>
      <Routes>
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/" element={authUser ? <Initial /> : <Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
