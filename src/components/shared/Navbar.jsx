import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router'; // Use useNavigate for better flow
import { Sun, Moon, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { toggleTheme } from '../../slices/uiSlice';
import { logoutUser, checkAuth } from '../../slices/authSlice'; // Use checkAuth thunk
import AuthStatus from './AuthStatus';

export default function Navbar({ className = '', style = {} }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.ui.theme);
  
  // Get both user and isAuthenticated from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log('Navbar render - isAuthenticated:', isAuthenticated, 'user:', user);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLoginClick = () => {
    navigate('/auth'); // Or wherever your AuthLayout is
  };

  // 🔥 2. LOGOUT
  const handleLogoutClick = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/'); // Redirect to login after logout
    });
  };

  const navLinks = [
    { href: '/blogs', label: 'Blogs' },
    { href: '/visualizers', label: 'Visualizers' }
  ]; 

  return (
    <div className={`fixed top-4 left-0 right-0 z-50 px-3.5 transition-all ${className}`} style={style}>
      <nav className="max-w-full mx-auto bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg">
        <div className="flex items-center justify-between px-5 md:px-10 lg:px-15 lg:py-2.5 py-1.75">

          {/* LOGO */}
          <Link to="/" className="flex items-baseline group">
            <span className="text-lg md:text-2xl font-extrabold text-text-primary">ALGO</span>
            <span className="text-lg md:text-2xl font-extrabold text-accent">Vision</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} className="text-sm font-medium hover:text-accent transition-colors">
                {link.label}
              </Link>
            ))}

            {/* Login/Logout Logic Component */}
            <AuthStatus
              authUser = {user}
              isAuthenticated={isAuthenticated}
              onLoginClick={handleLoginClick}
              onLogoutClick={handleLogoutClick}
            />

            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent/10 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden p-4 flex flex-col gap-4 border-t border-border bg-card rounded-b-2xl">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="px-2 py-1">
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-border my-1" />

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-2" onClick={() => setIsMenuOpen(false)}>
                   <User size={18} /> Profile ({user?.name})
                </Link>
                <button onClick={handleLogoutClick} className="flex items-center gap-2 px-2 text-red-500">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <button onClick={handleLoginClick} className="flex items-center gap-2 px-2 text-accent font-bold">
                <User size={18} /> Login / Signup
              </button>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router';
// import { Sun, Moon, User, Menu, X, LogOut } from 'lucide-react';
// import { toggleTheme } from '../../slices/uiSlice';
// import { logoutUser, clearAuthState } from '../../slices/authSlice';
// import axiosClient from '../../utils/axios';
// import AuthStatus from './AuthStatus';

// export default function Navbar({ className = '', style = {} }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const theme = useSelector((state) => state.ui.theme);
//   const authUser = useSelector((state) => state.auth.user);

//   const dispatch = useDispatch();

//   // 🔥 AUTO LOAD USER (COOKIE BASED)
//   useEffect(() => {
//     let cancelled = false;

//     const hydrateUser = async () => {
//       try {
//         const data = await axiosClient.get('/auth/me');

//         if (!data?.user || cancelled) return;

//         dispatch(clearAuthState({ token: null, user: data.user }));
//       } catch (error){
//         console.log(error);
//       }
//     };

//     hydrateUser();

//     return () => {
//       cancelled = true;
//     };
//   }, [dispatch]);

//   const handleLoginClick = () => {
//     window.location.href = '/auth';
//   };

//   // 🔥 LOGOUT (COOKIE BASED)
//   const handleLogoutClick = async () => {
//     try {
//       await axiosClient.post('/auth/logout');
//     } catch (err) {
//       console.error(err);
//     }

//     dispatch(logoutUser());
//   };

//   const themeIcons = {
//     light: <Moon size={17} />,
//     dark: <Sun size={17} />
//   };

//   const navLinks = [
//     { href: '/blogs', label: 'Blogs' },
//     { href: '/visualizers', label: 'Visualizers' }
//   ];

//   return (
//     <div
//       className={`fixed top-4 left-0 right-0 z-50 px-3.5 transition-all ${className}`}
//       style={style}
//     >
//       <nav className="max-w-full mx-auto bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg">

//         <div className="flex items-center justify-between px-5 md:px-10 lg:px-15 lg:py-2.5 py-1.75">

//           {/* LOGO */}
//           <Link to="/" className="flex items-baseline group">
//             <span className="text-lg md:text-2xl font-extrabold text-text-primary">
//               ALGO
//             </span>
//             <span className="text-lg md:text-2xl font-extrabold text-accent">
//               Vision
//             </span>
//           </Link>

//           {/* DESKTOP */}
//           <div className="hidden md:flex items-center gap-4">

//             {navLinks.map(link => (
//               <Link key={link.href} to={link.href}>
//                 {link.label}
//               </Link>
//             ))}

//             <AuthStatus
//               authUser={authUser}
//               onLoginClick={handleLoginClick}
//               onLogoutClick={handleLogoutClick}
//             />

//             <button
//               onClick={() => dispatch(toggleTheme())}
//               className="w-8 h-8 flex items-center justify-center rounded-full border"
//             >
//               {theme === 'dark' ? themeIcons.dark : themeIcons.light}
//             </button>
//           </div>

//           {/* MOBILE BUTTON */}
//           <div className="md:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* MOBILE MENU */}
//         {isMenuOpen && (
//           <div className="md:hidden p-4 flex flex-col gap-2">

//             {navLinks.map(link => (
//               <Link
//                 key={link.href}
//                 to={link.href}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {authUser ? (
//               <>
//                 <Link to="/profile">
//                   {authUser?.name}
//                 </Link>

//                 <button onClick={handleLogoutClick}>
//                   <LogOut size={16} /> Logout
//                 </button>
//               </>
//             ) : (
//               <button onClick={handleLoginClick}>
//                 <User size={16} /> Login
//               </button>
//             )}

//             <button onClick={() => dispatch(toggleTheme())}>
//               {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
//             </button>
//           </div>
//         )}
//       </nav>
//     </div>
//   );
// }

// import { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router'; 
// import { Sun, Moon, User, Menu, X, LogOut } from 'lucide-react';
// import { toggleTheme } from '../../slices/uiSlice';
// import { logout, setAuth } from '../../slices/authSlice';
// import { apiFetchFirstAvailable } from '../../utils/axios';
// import AuthStatus from './AuthStatus';

// export default function Navbar({ className = '', style = {} }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const theme = useSelector((state) => state.ui.theme);
//   const authToken = useSelector((state) => state.auth.token);
//   const authUser = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();


//   useEffect(() => {
//     let cancelled = false;

//     const hydrateUserFromToken = async () => {
//       if (!authToken || authUser) return;
//       try {
//         const res = await apiFetchFirstAvailable(['/auth/me', '/api/auth/me'], {
//           method: 'GET'
//         });
//         const data = await res.json().catch(() => ({}));
//         if (!res.ok || !data?.user || cancelled) return;
//         dispatch(setAuth({ token: authToken, user: data.user }));
//       } catch {
//         // keep navbar fallback icon when /me endpoint is unavailable
//       }
//     };

//     hydrateUserFromToken();
//     return () => {
//       cancelled = true;
//     };
//   }, [authToken, authUser, dispatch]);

//   const handleLoginClick = () => {
//     // Open login modal or redirect
//     window.location.href = '/login';
//   };

//   const handleLogoutClick = () => {
//     localStorage.removeItem('authToken');
//     setAuthToken(null);
//     setAuthUser(null);
//   };


//   const themeIcons = {
//     light: <Moon size={17} />,
//     dark: <Sun size={17} />,
//   };
  
//   const navLinks = [
//     { href: '/blogs', label: 'Blogs' },
//     { href: '/visualizers', label: 'Visualizers' },
//   ];

//   return (
//     // The main floating container, using your existing style
//     <div
//       className={`fixed top-4 left-0 right-0 z-50 px-3.5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${className}`}
//       style={style}
//     >
//       <nav className="max-w-full mx-auto bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg transition-all duration-300 overflow-hidden">
//         <div className="flex items-center justify-between px-5 md:px-10 lg:px-15 lg:py-2.5 py-1.75">
//           <Link to="/" className="flex items-baseline group">
//             <span className="text-lg md:text-2xl font-extrabold tracking-tight text-text-primary group-hover:text-accent transition-colors duration-300">
//               ALGO
//             </span>
//             <span className="text-lg md:text-2xl font-extrabold text-accent">
//               Vision
//             </span>
//           </Link>
          
//           {/* Desktop Links & Buttons (Hidden on mobile) */}
//           <div className="hidden md:flex items-center gap-4">
//             <div className="flex items-center gap-4">
//               {navLinks.map(link => (
//                 <Link key={link.href} to={link.href} className="px-2 py-2 text-sm font-medium text-text-primary hover:text-accent transition-colors duration-200">
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//             {/* <div className="flex items-center gap-2">
//               <Link
//                 to={authToken ? '/profile' : '/auth'}
//                 className="flex items-center gap-2 rounded-full bg-card/60 transition-colors"
//                 aria-label={authToken ? 'Open profile' : 'Open authentication'}
//                 title={authUser?.name || authUser?.email || (authToken ? 'Profile' : 'Login')}
//               >
//                 {authUser?.picture ? (
//                   <div>
//                     <img
//                       src={authUser.picture}
//                       alt={authUser?.name ? `${authUser.name} avatar` : 'User avatar'}
//                       className="w-8 h-8 rounded-full object-cover"
//                       referrerPolicy="no-referrer" 
//                     />
//                     <span></span>
//                   </div>
//                 ) : (
                  
//                 )}
//               </Link>
//             </div> */}
//             <AuthStatus 
//                     authToken={authToken}
//                     authUser={authUser}
//                     onLoginClick={handleLoginClick}
//                     onLogoutClick={handleLogoutClick}
//                   />
//             <button
//               onClick={() => dispatch(toggleTheme())}
//               className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-card border-2 border-text-primary hover:border-accent transition-colors cursor-pointer"
//               aria-label="Toggle theme"
//             >
//               {theme === 'dark' ? themeIcons.dark : themeIcons.light} 
//             </button>
//           </div>

//           {/* Hamburger/Close Icon (Visible on mobile) */}
//           <div className="md:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Toggle menu">
//               {isMenuOpen ? <X size={24} className="text-text-primary"/> : <Menu size={24} className="text-text-primary"/>}
//             </button>
//           </div>
//         </div>

//         {/* --- EXPANDABLE MOBILE MENU SECTION --- */}
//         {/* This section is only rendered on mobile and expands/collapses */}
//         {isMenuOpen && (
//           <div className="md:hidden px-6 pb-4 pt-2 flex flex-col gap-2">
//             {navLinks.map(link => (
//               <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="px-4 py-2 rounded-lg font-medium text-text-primary hover:bg-border transition-colors">
//                 {link.label}
//               </Link>
//             ))}
//             {authToken ? (
//               <div className="mt-2 flex flex-col gap-2">
//                 <Link
//                   to="/profile"
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-card/60 text-text-primary"
//                 >
//                   {authUser?.picture ? (
//                     <img
//                       src={authUser.picture}
//                       alt={authUser?.name ? `${authUser.name} avatar` : 'User avatar'}
//                       className="w-9 h-9 rounded-full object-cover"
//                       referrerPolicy="no-referrer"
//                     />
//                   ) : (
//                     <span className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
//                       <User size={18} />
//                     </span>
//                   )}
//                   <div className="min-w-0 flex-1">
//                     <div className="font-semibold truncate">{authUser?.name || 'Profile'}</div>
//                     <div className="text-xs text-text-secondary truncate">{authUser?.email || ''}</div>
//                   </div>
//                 </Link>
//                 <button
//                   onClick={() => { dispatch(logout()); setIsMenuOpen(false); }}
//                   className="flex items-center justify-center gap-2 px-5 py-2 text-base font-semibold rounded-full border border-border bg-card hover:border-accent/70 transition-colors"
//                 >
//                   <LogOut size={16} />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 px-5 py-2 text-base font-semibold rounded-full border border-border bg-card hover:border-accent/70 text-text-primary transition-colors">
//                 <User size={16} />
//                 <span>Account</span>
//               </Link>
//             )}
//             <button 
//               onClick={() => { dispatch(toggleTheme()); setIsMenuOpen(false); }} 
//               className="mt-2 p-2 rounded-lg self-start flex items-center gap-3 font-medium text-text-primary hover:bg-border transition-colors"
//             >
//               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
//               <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
//             </button>
//           </div>
//         )}
//       </nav>
//     </div>
//   );
// }