import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Registration flash message from redirect
  const successMessage = location.state?.message || '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await login(formData.email, formData.password);
      // Auto-redirect to /admin for admin role, otherwise /dashboard
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/95 border border-indigo-100/80 shadow-2xl shadow-indigo-200/40 p-8 sm:p-10 rounded-3xl backdrop-blur-xl">
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-500/10 via-indigo-500/15 to-purple-500/10 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm border border-indigo-100">
            <LogIn size={26} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Sign in to access your role dashboard</p>
        </div>

        {/* Green Success Alert (e.g. after Registration) */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3.5 rounded-xl mb-5 flex items-center gap-2.5 shadow-sm font-medium">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Red Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3.5 rounded-xl mb-5 flex items-center gap-2.5 shadow-sm font-medium">
            <ShieldAlert size={18} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/60 transition">
              <Mail size={18} className="text-indigo-400" />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 w-full text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/60 transition">
              <Lock size={18} className="text-indigo-400" />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 w-full text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-300/40 hover:shadow-indigo-300/60 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm tracking-wide active:scale-[0.99]"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            <LogIn size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-7 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
