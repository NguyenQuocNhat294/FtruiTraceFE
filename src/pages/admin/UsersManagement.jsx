import React, { useEffect, useMemo, useState } from 'react';
import { userService } from '../../services/userService';

function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await userService.getAll();
            setUsers(res.data || []);
        } catch (err) {
            setError('Không thể tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) =>
            [u.username, u.email, u.fullName, u.role, u.status]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [users, search]);

    const handleToggleStatus = async (user) => {
        const nextStatus = user.status === 'active' ? 'inactive' : 'active';
        try {
            await userService.update(user._id, { status: nextStatus });
            setUsers((prev) =>
                prev.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u))
            );
        } catch {
            alert('Không thể cập nhật trạng thái.');
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Xóa user ${user.username}?`)) return;
        try {
            await userService.delete(user._id);
            setUsers((prev) => prev.filter((u) => u._id !== user._id));
        } catch {
            alert('Không thể xóa user.');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-500 mt-1">Theo dõi, khóa/mở và xóa tài khoản người dùng.</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm"
                >
                    Làm mới
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo username, email, role..."
                    className="w-full md:w-96 bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-purple-500"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Username</th>
                            <th className="p-4 font-semibold text-gray-600">Email</th>
                            <th className="p-4 font-semibold text-gray-600">Role</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">Đang tải dữ liệu...</td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">Không có người dùng phù hợp.</td>
                            </tr>
                        ) : (
                            filtered.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-gray-800">{u.username}</td>
                                    <td className="p-4 text-gray-700">{u.email}</td>
                                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {String(u.role || '').toLowerCase()}
                      </span>
                                    </td>
                                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-200 text-gray-700'
                      }`}>
                        {u.status || 'active'}
                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(u)}
                                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-50"
                                            >
                                                {u.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u)}
                                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50"
                                            >
                                                Xóa
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
        </div>
    );
}

export default UsersManagement;

