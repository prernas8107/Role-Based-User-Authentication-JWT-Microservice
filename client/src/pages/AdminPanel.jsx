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
  RefreshCw,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Shield className="text-cyan-400" /> Admin Control Panel
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage users, permissions, promote/demote roles, and block accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchStats(); fetchUsers(); }}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-4 py-2.5 rounded-xl border border-gray-700 transition"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition"
          >
            <UserPlus size={16} /> Add New User
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle size={18} /> {message}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl flex items-center gap-2">
          <ShieldAlert size={18} /> {error}
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gray-900/60 border border-gray-800 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Total Users</span>
            <Users size={20} className="text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalUsers}</div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Active</span>
            <UserCheck size={20} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.activeUsers}</div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Blocked</span>
            <Ban size={20} className="text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-red-400">{stats.blockedUsers}</div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider">Admins</span>
            <Shield size={20} className="text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{stats.adminCount}</div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-2xl mb-6 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2 bg-gray-950/60 border border-gray-800 rounded-xl px-3.5 py-2.5 focus-within:border-cyan-500">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-950/60 border border-gray-800 text-gray-300 text-sm rounded-xl px-3.5 py-2.5 outline-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-950/60 border border-gray-800 text-gray-300 text-sm rounded-xl px-3.5 py-2.5 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading user records from MongoDB...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-950/80 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((u) => {
                  const isSelf = currentUser?._id === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-gray-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {u.name}
                          {isSelf && (
                            <span className="text-[10px] font-bold uppercase bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">{u.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs uppercase font-extrabold px-2.5 py-1 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs uppercase font-extrabold px-2.5 py-1 rounded-full ${
                            u.status === 'blocked'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {u.status || 'active'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isSelf ? (
                          <span className="text-xs text-gray-500 italic pr-2">Active Admin</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Make Admin / Remove Admin Button */}
                            {u.role === 'admin' ? (
                              <button
                                onClick={() => handleToggleRole(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
                                title="Demote to Standard User"
                              >
                                <UserMinus size={14} /> Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleRole(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition"
                                title="Promote to Administrator"
                              >
                                <ShieldCheck size={14} /> Make Admin
                              </button>
                            )}

                            {/* Block / Unblock Button */}
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                                u.status === 'blocked'
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300'
                              }`}
                              title={u.status === 'blocked' ? 'Unblock user' : 'Block user'}
                            >
                              {u.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                              title="Delete user permanently"
                            >
                              <Trash2 size={16} />
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Create New User</h3>
            <p className="text-gray-400 text-xs mb-4">Add a new user directly to MongoDB</p>

            {addError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                <div className="flex items-center gap-2 bg-gray-950/60 border border-gray-800 rounded-lg px-3 py-2">
                  <User size={16} className="text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="bg-transparent border-none outline-none text-white text-sm w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                <div className="flex items-center gap-2 bg-gray-950/60 border border-gray-800 rounded-lg px-3 py-2">
                  <Mail size={16} className="text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="bg-transparent border-none outline-none text-white text-sm w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                <div className="flex items-center gap-2 bg-gray-950/60 border border-gray-800 rounded-lg px-3 py-2">
                  <Lock size={16} className="text-gray-500" />
                  <input
                    type="password"
                    required
                    placeholder="Password (min 6 chars)"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="bg-transparent border-none outline-none text-white text-sm w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Assign Initial Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full bg-gray-950/60 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm outline-none cursor-pointer"
                >
                  <option value="user">User (Standard Access)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-cyan-500/20 disabled:opacity-50"
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
