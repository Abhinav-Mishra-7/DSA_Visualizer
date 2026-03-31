import { useDispatch, useSelector } from 'react-redux';
import { Link , useNavigate} from 'react-router';
import { User, LogOut, ArrowLeft } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { logoutUser } from '../slices/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth');
  };

  console.log('ProfilePage render - user:', user);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-28 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-accent transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <button
              onClick={() => dispatch(handleLogout())}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border border-border bg-card hover:border-accent/70 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 bg-gradient-to-br from-accent/10 to-transparent">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user?.name ? `${user.name} avatar` : 'User avatar'}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-border"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-border">
                    <User size={28} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-xl md:text-2xl font-extrabold text-text-primary truncate">
                    {user?.name || 'Your Profile'}
                  </div>
                  <div className="text-sm md:text-base text-text-secondary truncate">
                    {user?.email || 'Not signed in yet'}
                  </div>
                  {user?.provider && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-border">
                      Provider: {user.provider}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {!user ? (
                <div className="text-text-secondary">
                  You are not logged in.{' '}
                  <Link to="/auth" className="text-accent font-semibold hover:underline">
                    Go to Login
                  </Link>
                  .
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-xs uppercase tracking-widest text-text-secondary/70">Name</div>
                    <div className="mt-1 font-semibold text-text-primary break-words">{user.name || '—'}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-xs uppercase tracking-widest text-text-secondary/70">Email</div>
                    <div className="mt-1 font-semibold text-text-primary break-words">{user.email || '—'}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-xs uppercase tracking-widest text-text-secondary/70">Provider</div>
                    <div className="mt-1 font-semibold text-text-primary break-words">{user.provider || '—'}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="text-xs uppercase tracking-widest text-text-secondary/70">Premium</div>
                    <div className="mt-1 font-semibold text-text-primary break-words">
                      {user.isPremium ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

