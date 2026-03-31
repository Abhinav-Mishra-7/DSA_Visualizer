import { Routes, Route, Navigate } from 'react-router';
import LandingPage from './pages/LandingPage';
import VisualizersPage from './pages/VisualizersPage';
import VisualizerLayout from './layouts/VisualizerLayout';
import ThemeManager from './components/ui/ThemeManager';
import Auth from './components/login_signup/Auth';
import ProfilePage from './pages/ProfilePage';
import AuthLayout from './components/login_signup/Authentication';
import {useSelector } from 'react-redux';
import OTPPage from './components/login_signup/OTPPage';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/visualizers" element={isAuthenticated ? <VisualizersPage/> : <Navigate to="/" replace />} />

        <Route path="/visualizers/:slug" element={isAuthenticated ? <VisualizerLayout/> : <Navigate to="/" replace />} />

        <Route path="/auth" element={isAuthenticated ? <Navigate to="/visualizers" replace /> : <AuthLayout />} />
        <Route path="/verify-otp/:email" element={isAuthenticated ? <Navigate to="/visualizers" replace /> : <OTPPage /> } />
        <Route path="/auth/github" element={<Auth />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage/> : <Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;