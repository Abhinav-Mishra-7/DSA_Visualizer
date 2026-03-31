import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, User, Phone, KeyRound, Github } from "lucide-react";
import Input from "./Input";
import GoogleAuth from "./GoogleAuth";
import axiosClient from "../../utils/axios";

export default function AuthForm({ type, onAuthSuccess }) {
  const isLogin = type === "login";
  const [mode, setMode] = useState("email");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  const githubAuthPath = import.meta.env.VITE_GITHUB_AUTH_PATH || "/auth/github";

  const navigate = useNavigate();

  // ⏱ OTP TIMER
  useEffect(() => {
    if (!otpSent || resendIn <= 0) return;
    const timer = setInterval(() => {
      setResendIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent, resendIn]);

  // 🔥 EMAIL LOGIN / SIGNUP
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");
    setIsBusy(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const endpoint = isLogin ? "/auth/login" : "/auth/signup";

      const payload = isLogin
        ? { email, password }
        : { name: fullName, email, password };

      const data = await axiosClient.post(endpoint, payload);

      onAuthSuccess?.(data);

    } catch (err) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setIsBusy(false);
    }
  };

  // 🔥 SEND OTP
  const handleSendOtp = async () => {
    setError("");
    setIsBusy(true);

    try {
      await axiosClient.post("/auth/phone/send-otp", { phone });

      setOtpSent(true);
      setResendIn(30);

    } catch (err) {
      setError(err?.message || "Failed to send OTP.");
    } finally {
      setIsBusy(false);
    }
  };

  // 🔥 VERIFY OTP (FIXED ENDPOINT)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsBusy(true);

    try {
      const data = await axiosClient.post("/auth/phone/verify-otp", {
        phone,
        otp
      });

      onAuthSuccess?.(data);

    } catch (err) {
      setError(err?.message || "OTP verification failed.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleBack = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="space-y-4">

      {/* MODE SWITCH */}
      <div className="flex gap-2 bg-white dark:bg-white/5 rounded-xl p-1 border border-border">
        <button
          type="button"
          onClick={() => setMode("email")}
          className={`flex-1 py-2 text-sm rounded-lg ${
            mode === "email"
              ? "bg-blue-600 text-white"
              : "text-blue-700"
          }`}
        >
          Email
        </button>

        <button
          type="button"
          onClick={() => setMode("phone")}
          className={`flex-1 py-2 text-sm rounded-lg ${
            mode === "phone"
              ? "bg-blue-600 text-white"
              : "text-black"
          }`}
        >
          Phone OTP
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600 bg-red-100 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {/* EMAIL FORM */}
      {mode === "email" ? (
        <form className="space-y-4" onSubmit={handleSubmitEmail}>
          {!isLogin && (
            <Input
              icon={<User size={16} />}
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <Input
            icon={<Mail size={16} />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={<Lock size={16} />}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <Input
              icon={<Lock size={16} />}
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl">
            {isBusy ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <Input
            icon={<Phone size={16} />}
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {otpSent && (
            <Input
              icon={<KeyRound size={16} />}
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}

          {!otpSent ? (
            <button onClick={handleSendOtp} className="w-full bg-blue-600 text-white py-2.5 rounded-xl">
              {isBusy ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl">
                {isBusy ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                type="button"
                disabled={resendIn > 0}
                onClick={handleSendOtp}
                className="w-full border py-2.5 rounded-xl"
              >
                {resendIn > 0
                  ? `Resend in ${resendIn}s`
                  : "Resend OTP"}
              </button>
            </>
          )}
        </form>
      )}

      {/* GOOGLE + GITHUB */}
      <GoogleAuth onSuccessLogin={onAuthSuccess} />

      <div className="flex justify-center gap-3 mt-3">
        <button onClick={handleBack} className="px-4 py-2 border rounded-xl bg-accent">
          Back
        </button>

        <button
          onClick={() => {
            window.location.href = `http://localhost:3000${githubAuthPath}`;
          }}
          className="px-4 py-2 border rounded-xl flex items-center gap-2 bg-secondary"
        >
          <Github size={18} />
          GitHub
        </button>
      </div>
    </div>
  );
}