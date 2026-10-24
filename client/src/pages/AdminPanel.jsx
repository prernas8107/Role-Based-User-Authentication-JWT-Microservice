import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  Users,
  ShieldAlert,
  UserCheck,
  Shield,
  Search,
  UserPlus,
  X,
  Lock,
  Mail,
  User,
  Trash2,
  Ban,
  CheckCircle,
  ShieldCheck,
  UserMinus,
} from 'lucide-react';

const AdminPanel = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, blockedUsers: 0, adminCount: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  // Fetch Users with Search & Filter
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/admin/users?search=${search}&role=${roleFilter}&status=${statusFilter}`);
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Admin authorization required');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Handle Add New User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      await API.post('/admin/users', newUserData);
      setShowAddModal(false);
      setNewUserData({ name: '', email: '', password: '', role: 'user' });
      setMessage('New user created successfully!');
      fetchUsers();
      fetchStats();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };

  // Toggle User Status (Active / Blocked)
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    try {
      await API.patch(`/admin/users/${user._id}`, { status: newStatus });
      setMessage(`User "${user.name}" status updated to ${newStatus}`);
      fetchUsers();
      fetchStats();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
      setTimeout(() => setError(''), 4000);
    }
  };

  // Make Admin or Remove Admin
  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'promoted to Admin' : 'demoted to standard User';
    try {
      await API.patch(`/admin/users/${user._id}`, { role: newRole });
      setMessage(`User "${user.name}" ${actionText} successfully!`);
      fetchUsers();
      fetchStats();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
      setTimeout(() => setError(''), 4000);
    }
  };

  // Delete User
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${user.name}"?`)) return;
    try {
      await API.delete(`/admin/users/${user._id}`);
      setMessage(`User "${user.name}" deleted from database`);
      fetchUsers();
      fetchStats();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/80 px-3 py-1 rounded-full text-xs font-bold text-purple-700 uppercase tracking-wider mb-2.5 shadow-sm">
            <Shield size={14} className="text-purple-600" /> Admin Restricted Area
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Admin Control Panel
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
            Manage users, grant/revoke administrative privileges, and control account statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-300/40 hover:shadow-indigo-300/60 transition"
          >
            <UserPlus size={16} /> Add New User
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl flex items-center gap-2.5 shadow-sm font-medium">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl flex items-center gap-2.5 shadow-sm font-medium">
          <ShieldAlert size={18} className="text-rose-600 shrink-0" /> {error}
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white/95 border border-indigo-100/90 p-6 rounded-3xl shadow-lg shadow-indigo-100/30 backdrop-blur-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalUsers}</div>
        </div>

        <div className="bg-white/95 border border-indigo-100/90 p-6 rounded-3xl shadow-lg shadow-indigo-100/30 backdrop-blur-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider">Active</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">{stats.activeUsers}</div>
        </div>

        <div className="bg-white/95 border border-indigo-100/90 p-6 rounded-3xl shadow-lg shadow-indigo-100/30 backdrop-blur-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider">Blocked</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ban size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 tracking-tight">{stats.blockedUsers}</div>
        </div>

        <div className="bg-white/95 border border-indigo-100/90 p-6 rounded-3xl shadow-lg shadow-indigo-100/30 backdrop-blur-xl flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider">Admins</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-600 tracking-tight">{stats.adminCount}</div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white/95 border border-indigo-100/90 p-4 rounded-3xl mb-7 shadow-sm backdrop-blur-xl flex flex-col md:flex-row gap-3.5 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2.5 bg-indigo-50/40 border border-indigo-100/90 rounded-2xl px-4 py-2.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100/60 transition">
          <Search size={18} className="text-indigo-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-800 w-full text-sm placeholder-slate-400 font-medium"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-indigo-50/40 border border-indigo-100/90 text-slate-700 text-sm font-semibold rounded-2xl px-4 py-2.5 outline-none cursor-pointer focus:border-indigo-500 transition"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-indigo-50/40 border border-indigo-100/90 text-slate-700 text-sm font-semibold rounded-2xl px-4 py-2.5 outline-none cursor-pointer focus:border-indigo-500 transition"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/95 border border-indigo-100/90 rounded-3xl overflow-hidden shadow-xl shadow-indigo-100/30 backdrop-blur-xl">
        {loading ? (
          <div className="p-14 text-center text-slate-500 font-medium">Loading user records from MongoDB...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/50 text-slate-600 text-xs uppercase tracking-wider font-extrabold border-b border-indigo-100/80">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isSelf = currentUser?._id === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-indigo-50/30 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {u.name}
                          {isSelf && (
                            <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-xs font-medium">{u.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                            u.status === 'blocked'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {u.status || 'active'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isSelf ? (
                          <span className="text-xs text-slate-400 font-semibold italic pr-2">Current Admin</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Make Admin / Remove Admin Button */}
                            {u.role === 'admin' ? (
                              <button
                                onClick={() => handleToggleRole(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/90 rounded-xl text-xs font-bold transition shadow-sm"
                                title="Demote to Standard User"
                              >
                                <UserMinus size={14} /> Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleRole(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/90 rounded-xl text-xs font-bold transition shadow-sm"
                                title="Promote to Administrator"
                              >
                                <ShieldCheck size={14} /> Make Admin
                              </button>
                            )}

                            {/* Block / Unblock Button */}
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
                                u.status === 'blocked'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                              }`}
                              title={u.status === 'blocked' ? 'Unblock user' : 'Block user'}
                            >
                              {u.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-xl transition shadow-sm"
                              title="Delete user permanently"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-indigo-100 rounded-3xl p-7 w-full max-w-md shadow-2xl relative text-slate-800">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Create New User</h3>
            <p className="text-slate-500 text-xs mb-5 font-medium">Add a new user directly to MongoDB Atlas</p>

            {addError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Full Name</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
                  <User size={16} className="text-indigo-400" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="bg-transparent border-none outline-none text-slate-800 text-sm w-full font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
                  <Mail size={16} className="text-indigo-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="bg-transparent border-none outline-none text-slate-800 text-sm w-full font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
                  <Lock size={16} className="text-indigo-400" />
                  <input
                    type="password"
                    required
                    placeholder="Password (min 6 chars)"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="bg-transparent border-none outline-none text-slate-800 text-sm w-full font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Assign Initial Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-semibold outline-none cursor-pointer focus:border-indigo-500"
                >
                  <option value="user">User (Standard Access)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-300 disabled:opacity-50 transition"
                >
                  {addLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
