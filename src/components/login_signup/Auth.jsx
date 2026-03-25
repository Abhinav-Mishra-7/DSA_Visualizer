import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import AuthForm from "./AuthForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl h-[600px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT SIDE (3D STYLE VISUAL) */}
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center">

          {/* FLOATING 3D EFFECT */}
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

        {/* RIGHT SIDE FORM */}
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

            {/* FORM ANIMATION */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthForm type="login" />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthForm type="signup" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}