import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router'; 
import { Sun, Moon, Sparkles, User, Menu, X } from 'lucide-react';
import { toggleTheme } from '../../slices/uiSlice';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useSelector((state) => state.ui.theme);
  const dispatch = useDispatch();

  const themeIcons = {
    light: <Moon size={20} />,
    dark: <Sun size={20} />,
    neon: <Sparkles size={20} className="text-accent" />,
  };
  
  const navLinks = [
    { href: '/blogs', label: 'Blogs' },
    { href: '/visualizers', label: 'Visualizers' },
  ];

  return (
    // The main floating container, using your existing style
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <nav className="max-w-full mx-auto bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg transition-all duration-300 overflow-hidden">
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-19 py-3">
          <Link to="/" className="flex items-baseline group">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-text-primary group-hover:text-accent transition-colors duration-300">
              ALGO
            </span>
            <span className="text-xl md:text-2xl font-extrabold text-accent">
              Vision
            </span>
          </Link>
          
          {/* Desktop Links & Buttons (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-4">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href} className="px-2 py-2 text-base font-medium text-text-primary hover:text-accent transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </div>
            {/* YOUR CUSTOM LOGIN BUTTON - Preserved as requested */}
            <Link to="" className="flex items-center gap-2 px-5 py-2 text-base font-semibold rounded-full bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to text-white transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/40">
              <User size={16} />
              <span>Login / Signup</span>
            </Link>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-card border-2 border-text-primary hover:border-accent transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? themeIcons.dark : themeIcons.light}
            </button>
          </div>

          {/* Hamburger/Close Icon (Visible on mobile) */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} className="text-text-primary"/> : <Menu size={24} className="text-text-primary"/>}
            </button>
          </div>
        </div>

        {/* --- EXPANDABLE MOBILE MENU SECTION --- */}
        {/* This section is only rendered on mobile and expands/collapses */}
        {isMenuOpen && (
          <div className="md:hidden px-6 pb-4 pt-2 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="px-4 py-2 rounded-lg font-medium text-text-primary hover:bg-border transition-colors">
                {link.label}
              </Link>
            ))}
            {/* YOUR CUSTOM LOGIN BUTTON (Mobile Version) */}
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 px-5 py-2 text-base font-semibold rounded-full bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to text-white transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/40">
              <User size={16} />
              <span>Login / Signup</span>
            </Link>
            <button 
              onClick={() => { dispatch(toggleTheme()); setIsMenuOpen(false); }} 
              className="mt-2 p-2 rounded-lg self-start flex items-center gap-3 font-medium text-text-primary hover:bg-border transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}