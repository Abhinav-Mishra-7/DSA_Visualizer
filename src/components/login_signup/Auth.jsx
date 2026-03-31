import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthForm from "./AuthForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearAuthState } from "../../slices/authSlice";
import axiosClient from "../../utils/axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔥 HANDLE SUCCESS (UPDATED)
  const handleAuthSuccess = useMemo(() => {
    return (data) => {
      const user = data?.user || null;

      dispatch(clearAuthState({ token: null, user }));
      navigate("/", { replace: true });
    };
  }, [dispatch, navigate]);



  // 🔥 AUTO LOGIN ON REFRESH (IMPORTANT)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await axiosClient.get("/auth/me");

        if (data?.user) {
          dispatch(setAuth({ token: null, user: data.user }));
          navigate("/", { replace: true });
        }
      } catch (err) {
        // not logged in → ignore
      }
    };

    checkAuth();
  }, [dispatch, navigate]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">

      <div className="w-full max-w-5xl h-[600px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center">

          <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
          <div className="absolute w-56 h-56 bg-white/20 rounded-full blur-2xl bottom-10 right-10 animate-pulse"></div>

          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center px-8"
          >
            <h2 className="text-3xl font-bold mb-4">
              {isLogin ? "Welcome Back 👋" : "Join Us 🚀"}
            </h2>
            <p className="text-sm opacity-80">
              {isLogin
                ? "Login to continue your learning journey"
                : "Create your account and start learning smarter"}
            </p>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">

            {/* TOGGLE */}
            <div className="flex mb-6 bg-blue-50 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm rounded-lg transition ${
                  isLogin ? "bg-blue-600 text-white" : "text-blue-600"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm rounded-lg transition ${
                  !isLogin ? "bg-blue-600 text-white" : "text-blue-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* FORM */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthForm type="login" onAuthSuccess={handleAuthSuccess} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthForm type="signup" onAuthSuccess={handleAuthSuccess} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}