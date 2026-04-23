import React, { useState, useEffect } from 'react';
import { listAllowlistedUsers, addEmailToAllowlist, removeEmailFromAllowlist } from '../../services/allowlist';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState([] as { email: string; addedAt?: string }[]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const list = await listAllowlistedUsers();
      setUsers(list);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addEmailToAllowlist(newEmail);
      setNewEmail('');
      await fetchUsers();
    } catch (err: any) {
      console.error("Add User Error:", err);
      // Handle the case where handleFirestoreError throws a JSON string
      try {
        const parsed = JSON.parse(err.message);
        setError(`Firestore Error: ${parsed.error} during ${parsed.operationType}`);
      } catch {
        setError(err.message || "Failed to add user");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email}?`)) return;
    setLoading(true);
    setError(null);
    try {
      await removeEmailFromAllowlist(email);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500 text-sm">Manage allowlisted users. Access automatically expires 90 days after their first login.</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleAdd} className="flex gap-3 mb-8">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter user email to allowlist"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                <th className="px-4 py-3 border-b border-slate-100">Email</th>
                <th className="px-4 py-3 border-b border-slate-100">Added Date</th>
                <th className="px-4 py-3 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">
                    No users allowlisted yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-slate-900 font-medium">{user.email}</td>
                    <td className="px-4 py-4 text-slate-500 text-sm">
                      {user.addedAt ? new Date(user.addedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleRemove(user.email)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
