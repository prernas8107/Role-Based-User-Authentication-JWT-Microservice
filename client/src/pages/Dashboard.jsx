import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Mail, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Your personal account details and role-based access privileges.
        </p>
      </div>

      {/* Exactly 2 Cards: User Profile & Access Privileges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. User Profile Card */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 font-extrabold text-xl rounded-full flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span
              className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                user?.role === 'admin'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}
            >
              {user?.role}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-4">User Profile</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2.5 text-gray-300 bg-gray-950/40 p-3 rounded-xl border border-gray-800/60">
              <UserCheck size={18} className="text-cyan-400" />
              <span>Full Name: <strong className="text-white ml-1">{user?.name}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300 bg-gray-950/40 p-3 rounded-xl border border-gray-800/60">
              <Mail size={18} className="text-cyan-400" />
              <span>Email: <strong className="text-white ml-1">{user?.email}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300 bg-gray-950/40 p-3 rounded-xl border border-gray-800/60">
              <Calendar size={18} className="text-cyan-400" />
              <span>Account Status: <strong className="text-emerald-400 uppercase text-xs ml-1">{user?.status || 'active'}</strong></span>
            </div>
          </div>
        </div>

        {/* 2. Access Privileges Card */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className="text-cyan-400" size={26} />
              <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300">
                RBAC
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Access Privileges</h3>
            <p className="text-sm text-gray-300 mb-4">
              Assigned Role: <strong className="text-white">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</strong>
            </p>
          </div>

          <div>
            {user?.role === 'admin' ? (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm p-4 rounded-xl">
                ✓ Full administrator privileges enabled. You have access to user management, roles, and administrative controls.
              </div>
            ) : (
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm p-4 rounded-xl">
                ✓ Standard user privileges enabled. You have secure access to your profile and authenticated dashboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
