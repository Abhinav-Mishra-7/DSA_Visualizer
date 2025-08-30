import { Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import VisualizersPage from './pages/VisualizersPage';
import VisualizerLayout from './layouts/VisualizerLayout';
import ThemeManager from './components/ui/ThemeManager';

function App() {
  return (
    <>
      <ThemeManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/visualizers" element={<VisualizersPage />} />
        <Route path="/visualizers/:slug" element={<VisualizerLayout />} />
      </Routes>
    </>
  );
}

export default App;