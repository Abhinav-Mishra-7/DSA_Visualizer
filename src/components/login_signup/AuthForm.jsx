import { Mail, Lock, User } from "lucide-react";
import Input from "./Input";
import GoogleAuth from "./GoogleAuth";

export default function AuthForm({ type }) {
  const isLogin = type === "login";

  return (
    <form className="space-y-4">

      {!isLogin && (
        <Input icon={<User size={16} />} placeholder="Full Name" />
      )}

      <Input icon={<Mail size={16} />} placeholder="Email" />
      <Input icon={<Lock size={16} />} placeholder="Password" type="password" />

      {!isLogin && (
        <Input icon={<Lock size={16} />} placeholder="Confirm Password" type="password" />
      )}

      <button
        type="submit"
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md"
      >
        {isLogin ? "Login" : "Create Account"}
      </button>

      <p className="text-xs text-center text-gray-500">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </p>

      <GoogleAuth onSuccessLogin={(data) => {
        console.log("Logged in:", data);

        // redirect after login
        window.location.href = "/visualizers";
      }} />
    </form>
  );
}