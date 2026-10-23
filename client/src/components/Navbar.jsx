import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserCheck, LogOut, KeyRound } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <KeyRound className="text-cyan-400" />
          <span>Auth<span className="text-cyan-400">Matrix</span></span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition text-sm">
                Dashboard
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-amber-400 font-semibold text-sm bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition"
                >
                  <ShieldCheck size={16} /> Admin Panel
                </Link>
              )}

              <div className="hidden sm:flex items-center gap-2 bg-gray-800/60 px-3 py-1.5 rounded-full border border-gray-700">
                <UserCheck size={16} className="text-cyan-400" />
                <span className="text-sm font-medium">{user.name}</span>
                <span
                  className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 text-sm transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
