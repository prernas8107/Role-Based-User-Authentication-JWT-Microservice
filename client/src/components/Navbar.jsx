import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserCheck, LogOut, KeyRound, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-indigo-100/80 shadow-sm shadow-indigo-100/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <KeyRound size={18} />
          </div>
          <span>
            Auth<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Matrix</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 text-sm font-bold px-3.5 py-1.5 rounded-xl transition ${
                  isDashboard
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-sm font-bold px-3.5 py-1.5 rounded-xl border transition shadow-sm ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-purple-100'
                      : 'text-purple-700 bg-purple-50/80 hover:bg-purple-100 border-purple-200'
                  }`}
                >
                  <ShieldCheck size={16} className="text-purple-600" /> Admin Panel
                </Link>
              )}

              <div className="hidden sm:flex items-center gap-2 bg-indigo-50/70 px-3 py-1.5 rounded-full border border-indigo-100/80 shadow-sm">
                <UserCheck size={16} className="text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                <span
                  className={`text-xs uppercase font-extrabold px-2 py-0.5 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 text-sm font-semibold transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-indigo-100/80 shadow-inner">
              <Link
                to="/login"
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                  isLogin
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-300'
                    : 'text-slate-600 hover:text-indigo-700 hover:bg-white/80'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                  isRegister
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-300'
                    : 'text-slate-600 hover:text-indigo-700 hover:bg-white/80'
                }`}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
