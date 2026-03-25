import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

export default function GoogleAuth({ onSuccessLogin }) {

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      console.log("Google User:", decoded);

      // 🔥 Send to backend
      const res = await fetch("http://localhost:3000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture
        })
      });

      const data = await res.json();

      // ✅ store token
      localStorage.setItem("token", data.token);

      // optional callback
      if (onSuccessLogin) onSuccessLogin(data);

    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 mt-4">
      
      {/* Divider */}
      <div className="flex items-center w-full gap-2">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      {/* Google Button */}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        theme="outline"
        size="large"
        text="continue_with"
        shape="pill"
      />

    </div>
  );
}