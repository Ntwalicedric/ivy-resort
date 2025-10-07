import React, { useMemo, useState } from 'react';
import { useDatabase } from '../../../context/DatabaseContext';
import { Plus, Edit, Trash2, Check, X, Mail } from 'lucide-react';

const emptyForm = { name: '', email: '', role: 'staff', active: true };

const UserManagement = () => {
  const { users = [], loading, createUser, updateUser, deleteUser, refreshUsers } = useDatabase();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name || '', email: user.email || '', role: user.role || 'staff', active: !!user.active });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }
      setForm(emptyForm);
      setEditingId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Dashboard Users</h3>
        <div className="flex items-center gap-2">
          <input
            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring focus:ring-slate-200"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => refreshUsers()}
            className="px-3 py-2 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
            type="button"
          >
            Refresh
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
        />
        <div className="flex items-center gap-2 md:col-span-2">
          <Mail className="text-slate-400" size={18} />
          <input
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <select
          className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          value={form.role}
          onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))}
            />
            Active
          </label>
          <button
            className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
            disabled={submitting}
          >
            <Plus size={16} /> {editingId ? 'Save' : 'Add User'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-slate-100 hover:bg-slate-200"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-slate-50 text-slate-600">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading.users ? (
              <tr><td className="px-4 py-6 text-center" colSpan={5}>Loading users...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-4 py-6 text-center" colSpan={5}>No users found</td></tr>
            ) : (
              filtered.map(user => (
                <tr key={user.id} className="bg-white">
                  <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <Check size={16} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <X size={16} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                        onClick={() => startEdit(user)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;




