import { User, LogOut, Settings} from 'lucide-react';
import { Link } from 'react-router';

export default function AuthStatus({isAuthenticated, authUser}) {


  if (isAuthenticated) {
    return (
      <Link to="/profile" className="flex items-center gap-2 text-sm font-medium rounded-full bg-card transition-colors">
        <div className="flex items-center gap-3 p-1 px-2.5 rounded-full bg-accent/10 transition-all duration-200 group shadow-md shadow-accent/40 hover:-translate-y-px hover:shadow-lg">
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center cursor-pointer">
          <User size={18} className="text-white font-semibold" />
        </div>
        
        {/* User Info */}
        <div className="flex flex-col min-w-0 flex-1 lg:block">
          <span className="text-sm font-semibold text-text-primary truncate max-w-[180px]">
            {authUser?.name}
          </span>
        </div>
        </div>
      </Link>
    );
  }

  // Show login buttons if not authenticated
  return (
    <Link to="/auth" className="flex items-center gap-2 px-5 py-1.75 text-sm font-semibold rounded-full bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to text-white transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/40 shadow-accent/30 shadow-md">
        <User size={15} />
        <span>Login / Signup</span>
    </Link>
  );
}