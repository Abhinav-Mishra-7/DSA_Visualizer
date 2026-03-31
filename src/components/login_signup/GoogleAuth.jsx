import { GoogleLogin } from '@react-oauth/google';
import axiosClient from "../../utils/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import { loginSuccess } from '../../slices/authSlice';

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // 1. credentialResponse.credential is the ID Token (JWT) your backend needs
      const res = await axiosClient.post('/auth/google', {
        token: credentialResponse.credential 
      });

      console.log('Google auth response:', res);

      if (res?.user) {
        dispatch(loginSuccess(res.user));
        navigate('/visualizers');
        toast.success(`Welcome back, ${res.user.name}!`);
      }
    } catch (err) {
      toast.error(err?.message || 'Google authentication failed');
    }
  };

  return (
    <div className="flex items-center justify-center scale-[0.85] origin-left">
      <GoogleLogin 
        onSuccess={handleGoogleSuccess} 
        onError={() => { toast.error('Google Sign-In failed'); }}
        theme="filled_blue"        
        shape="pill"        
        size="large"         
        text="signin"         
        width="100px"          
        logo_alignment="left"
      />
    </div>
  );
};

export default GoogleAuth;

// import axiosClient from "../../utils/axios";
// import { useDispatch } from "react-redux";
// import { useNavigate } from 'react-router';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { toast } from "react-toastify";
// import { loginSuccess } from '../../slices/authSlice';

// const GoogleAuth = ({ text }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

// // GoogleAuth.jsx

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       // REMOVED { data, status } destructuring because your 
//       // axios interceptor already returns response.data
//       const res = await axiosClient.post(
//         '/auth/google',
//         { token: credentialResponse.credential }
//       );

//       console.log('Google auth response:', res);
//       if (res?.user) {
//         dispatch(loginSuccess(res.user));
//         navigate('/visualizers');        
//         toast.success(`Welcome back, ${res.user.name}!`);
//       }
//     } catch (err) {
//       // Interceptor returns error.response.data, handle it here
//       toast.error(err?.message || 'Google authentication failed');
//     }
//   };


//   return (       
//       <div className="flex justify-center">
//         <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//           <GoogleLogin 
//             onSuccess={handleGoogleSuccess} 
//             onError={() => { toast.error('Google Sign-In failed'); }}
//             useOneTap
//             theme="filled_blue"
//             size="medium"
//             shape="square"
//           />
//         </GoogleOAuthProvider>
//       </div>
//   );
// };

// export default GoogleAuth;

// import { useGoogleLogin } from "@react-oauth/google";
// import { useDispatch } from "react-redux";
// import { clearAuthState } from "../../slices/authSlice";
// import axiosClient from "../../utils/axios";

// export default function GoogleAuth({ onSuccessLogin }) {
//   const dispatch = useDispatch();

//   // This is the function that opens the Google Gmail popup
//   // const loginWithGoogle = useGoogleLogin({
//   //   onSuccess: async (tokenResponse) => {
//   //     try {
//   //       // 1. Fetch user profile info from Google using the access token
//   //       const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
//   //         headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
//   //       }).then(res => res.json());

//   //       // 2. Send this data to your backend API
//   //       const {user} = await axiosClient.post("/auth/google", {
//   //         name: userInfo.name,
//   //         email: userInfo.email,
//   //         picture: userInfo.picture,
//   //         googleId: userInfo.sub
//   //       });

//   //       console.log(user) ;

//   //       // 3. Update your Redux global state
//   //       dispatch(
//   //         clearAuthState({
//   //           token: user?.token || null, 
//   //           user: user?.user || {
//   //             name: userInfo.name,
//   //             email: userInfo.email,
//   //             picture: userInfo.picture,
//   //           }
//   //         })
//   //       );

//   //       // 4. Trigger the redirect/callback in AuthLayout
//   //       if (onSuccessLogin) onSuccessLogin(user);

//   //     } catch (err) {
//   //       console.error("Authentication flow failed:", err);
//   //     }
//   //   },
//   //   onError: (error) => console.log("Login Failed:", error),
//   // });

//     const handleGoogleSuccess = async (credentialResponse) => {
//       try {
//         const { data, status } = await axiosClient.post(
//           '/auth/google',
//           { token: credentialResponse.credential },
//           { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
//         );

//         if (status === 200 && data?.user) {
//           if (data.user.verified) {
//             dispatch({ type: 'auth/loginSuccess', payload: data.user });
//             navigate('/');
//           } else {
//             navigate(`/OTPVerification/${data.user.emailId}/${data.user.firstName}`);
//           }
//         } else {
//           throw new Error('Google authentication failed');
//         }
//       } catch (err) {
//         toast.error(err?.response?.data?.message || err.message || 'Google authentication failed');
//       }
//     };

//   return (
//     <button
//       onClick={() => handleGoogleSuccess()} // THIS TRIGGERS THE POPUP
//       type="button"
//       className="flex items-center gap-2 bg-white/5 dark:bg-white/10 border border-border/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-text-primary hover:bg-white/20 dark:hover:bg-white/20 transition-all shadow-sm"
//     >
//       <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
//         <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.69 1.136 6.645l4.13 3.12z" />
//         <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078-2.855 0-5.273-1.923-6.136-4.504l-4.13 3.12C3.794 21.31 7.644 24 12 24c3.055 0 5.782-1.013 7.736-2.741l-3.696-3.246z" />
//         <path fill="#4285F4" d="M22.541 10.033H12v4.418h5.92c-.254 1.378-1.033 2.546-2.203 3.328l3.696 3.246C21.573 19.014 24 15.845 24 12c0-.682-.068-1.35-.186-2.01l-1.273.043z" />
//         <path fill="#FBBC05" d="M5.864 14.587A7.098 7.098 0 0 1 5.455 12c0-.9.155-1.764.409-2.564L1.734 6.316A11.94 11.94 0 0 0 0 12c0 2.05.514 3.986 1.418 5.682l4.446-3.095z" />
//       </svg>
//       Google
//     </button>
//   );
// }