import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Mail, Calendar, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2.5 shadow-sm">
          <CheckCircle2 size={14} className="text-indigo-600" /> Authenticated Session
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1.5 font-medium">
          Manage your authenticated profile details and role-based permissions.
        </p>
      </div>

      {/* Exactly 2 Cards: User Profile & Access Privileges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. User Profile Card */}
        <div className="bg-white/95 border border-indigo-100/90 rounded-3xl p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-2xl rounded-2xl flex items-center justify-center shadow-md shadow-indigo-300">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span
              className={`text-xs uppercase font-extrabold px-3.5 py-1.5 rounded-full ${
                user?.role === 'admin'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                  : 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
              }`}
            >
              {user?.role}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-4">User Profile</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-700 bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/70">
              <div className="flex items-center gap-2.5">
                <UserCheck size={18} className="text-indigo-600" />
                <span className="font-semibold text-slate-600">Full Name</span>
              </div>
              <strong className="text-slate-900 font-bold">{user?.name}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-700 bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/70">
              <div className="flex items-center gap-2.5">
                <Mail size={18} className="text-indigo-600" />
                <span className="font-semibold text-slate-600">Email Address</span>
              </div>
              <strong className="text-slate-900 font-bold truncate max-w-[200px]">{user?.email}</strong>
            </div>

            <div className="flex items-center justify-between text-slate-700 bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/70">
              <div className="flex items-center gap-2.5">
                <Calendar size={18} className="text-indigo-600" />
                <span className="font-semibold text-slate-600">Account Status</span>
              </div>
              <span className="text-emerald-700 bg-emerald-100 border border-emerald-200 uppercase text-xs font-bold px-2.5 py-0.5 rounded-full">
                {user?.status || 'active'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Access Privileges Card */}
        <div className="bg-white/95 border border-indigo-100/90 rounded-3xl p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-200/70 shadow-sm">
                <ShieldCheck size={28} />
              </div>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                RBAC
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">Access Privileges</h3>
            <p className="text-sm text-slate-500 mb-5 font-medium">
              Assigned Role: <strong className="text-indigo-700 font-bold uppercase">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</strong>
            </p>
          </div>

          <div>
            {user?.role === 'admin' ? (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50/80 border border-purple-200/80 text-purple-900 text-sm p-5 rounded-2xl shadow-sm">
                <p className="font-bold text-purple-950 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> Full Administrator Rights
                </p>
                <p className="text-xs text-purple-800 leading-relaxed font-medium">
                  You have complete permission to manage users, modify security roles, and access the restricted Admin Control Panel.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-200/80 text-blue-900 text-sm p-5 rounded-2xl shadow-sm">
                <p className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Standard User Rights
                </p>
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  You have authenticated access to your private profile and user dashboard. Access to administrative controls is securely restricted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
