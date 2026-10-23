import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { UserPlus, Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await API.post('/auth/register', formData);
      // Registration successful -> redirect to login with flash message (like Auth-Admin-Panel repo)
      navigate('/login', { state: { message: 'Registration successful! Please sign in with your credentials.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-gray-900/70 border border-gray-800 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserPlus size={26} />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">Role-Based JWT Authentication Microservice</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="flex items-center gap-2.5 bg-gray-950/60 border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-300 focus-within:border-cyan-500 transition">
              <User size={18} className="text-gray-500" />
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-transparent border-none outline-none text-white w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 bg-gray-950/60 border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-300 focus-within:border-cyan-500 transition">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent border-none outline-none text-white w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2.5 bg-gray-950/60 border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-300 focus-within:border-cyan-500 transition">
              <Lock size={18} className="text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="bg-transparent border-none outline-none text-white w-full text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
