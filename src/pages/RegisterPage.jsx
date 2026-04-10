// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { authService } from "../services/authService";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 2-step form
    const [form, setForm] = useState({
        username: "", email: "", password: "", confirmPassword: "",
        role: "farm", phone: "", fullName: "",
    });
    const [showPw, setShowPw]         = useState(false);
    const [showCPw, setShowCPw]       = useState(false);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState("");
    const [success, setSuccess]       = useState(false);

    const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validateStep1 = () => {
        if (!form.fullName.trim()) return "Vui lòng nhập họ tên.";
        if (!form.username.trim()) return "Vui lòng nhập tên đăng nhập.";
        if (form.username.length < 4) return "Tên đăng nhập phải ít nhất 4 ký tự.";
        if (!form.email.includes("@")) return "Email không hợp lệ.";
        return "";
    };

    const validateStep2 = () => {
        if (form.password.length < 6) return "Mật khẩu phải ít nhất 6 ký tự.";
        if (form.password !== form.confirmPassword) return "Mật khẩu xác nhận không khớp.";
        return "";
    };

    const handleNext = () => {
        const err = validateStep1();
        if (err) { setError(err); return; }
        setError("");
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateStep2();
        if (err) { setError(err); return; }

        setLoading(true);
        setError("");
        try {
            await authService.register({
                username: form.username,
                fullName: form.fullName,
                email:    form.email,
                password: form.password,
                role:     form.role,
                phone:    form.phone,
            });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err?.response?.data?.message || "Đăng ký thất bại, thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (success) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-sm w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
                    <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Đăng ký thành công!</h2>
                <p className="text-gray-500 mb-4">Tài khoản <span className="font-bold text-blue-600">{form.username}</span> đã được tạo.</p>
                <p className="text-sm text-gray-400">Đang chuyển về trang đăng nhập...</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full animate-[width_2.5s_ease-in-out]" style={{ width: '100%', transition: 'width 2.5s' }} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 flex items-center justify-center p-4">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white/50 p-8">

                    {/* Logo */}
                    <div className="text-center mb-6">
                        <Link to="/" className="inline-flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                                <span className="text-2xl">🍊</span>
                            </div>
                            <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FruitTrace</div>
                        </Link>
                        <p className="text-gray-500 text-sm mt-1">Tạo tài khoản mới</p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-3 mb-6">
                        {[1, 2].map(s => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center gap-2 flex-1 ${s === step ? '' : 'opacity-50'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                        s < step ? 'bg-blue-600 text-white' :
                                            s === step ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' :
                                                'bg-gray-100 text-gray-400'
                                    }`}>
                                        {s < step ? <CheckCircle size={16} /> : s}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600">
                                        {s === 1 ? 'Thông tin' : 'Mật khẩu'}
                                    </span>
                                </div>
                                {s < 2 && <div className={`h-0.5 flex-1 rounded ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
                            <AlertCircle size={16} className="flex-shrink-0" />{error}
                        </div>
                    )}

                    <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4">

                        {/* Step 1 */}
                        {step === 1 && <>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Họ và tên *</label>
                                <input name="fullName" value={form.fullName} onChange={update}
                                       placeholder="Nguyễn Văn A"
                                       className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Tên đăng nhập *</label>
                                <input name="username" value={form.username} onChange={update}
                                       placeholder="username (ít nhất 4 ký tự)"
                                       className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email *</label>
                                <input name="email" type="email" value={form.email} onChange={update}
                                       placeholder="email@example.com"
                                       className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Số điện thoại</label>
                                <input name="phone" value={form.phone} onChange={update}
                                       placeholder="0901234567"
                                       className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Vai trò</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { value: 'farm', label: '🌾 Chủ nông trại' },
                                        { value: 'staff',  label: '👷 Nhân viên' },
                                    ].map(r => (
                                        <button key={r.value} type="button"
                                                onClick={() => setForm({ ...form, role: r.value })}
                                                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition ${
                                                    form.role === r.value
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-blue-300'
                                                }`}>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit"
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5">
                                Tiếp theo →
                            </button>
                        </>}

                        {/* Step 2 */}
                        {step === 2 && <>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Mật khẩu *</label>
                                <div className="relative">
                                    <input name="password" type={showPw ? "text" : "password"}
                                           value={form.password} onChange={update}
                                           placeholder="Ít nhất 6 ký tự"
                                           className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition" />
                                    <button type="button" onClick={() => setShowPw(!showPw)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Password strength */}
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                                                    form.password.length >= i * 3
                                                        ? i <= 1 ? 'bg-red-400'
                                                            : i <= 2 ? 'bg-yellow-400'
                                                                : i <= 3 ? 'bg-blue-400'
                                                                    : 'bg-green-400'
                                                        : 'bg-gray-200'
                                                }`} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {form.password.length < 4 ? 'Yếu' : form.password.length < 8 ? 'Trung bình' : form.password.length < 12 ? 'Mạnh' : 'Rất mạnh'}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Xác nhận mật khẩu *</label>
                                <div className="relative">
                                    <input name="confirmPassword" type={showCPw ? "text" : "password"}
                                           value={form.confirmPassword} onChange={update}
                                           placeholder="Nhập lại mật khẩu"
                                           className={`w-full px-4 py-3 pr-12 rounded-xl border-2 bg-gray-50 text-sm focus:outline-none focus:bg-white transition ${
                                               form.confirmPassword && form.password !== form.confirmPassword
                                                   ? 'border-red-300 focus:border-red-400'
                                                   : form.confirmPassword && form.password === form.confirmPassword
                                                       ? 'border-green-300 focus:border-green-400'
                                                       : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                                           }`} />
                                    <button type="button" onClick={() => setShowCPw(!showCPw)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showCPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-sm">
                                <p className="font-semibold text-blue-700 mb-2">Thông tin tài khoản</p>
                                <div className="space-y-1 text-gray-600">
                                    <p>👤 {form.fullName}</p>
                                    <p>🔑 @{form.username}</p>
                                    <p>📧 {form.email}</p>
                                    <p>🎭 {form.role === 'farm' ? '🌾 Chủ nông trại' : '👷 Nhân viên'}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => { setStep(1); setError(''); }}
                                        className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                                    ← Quay lại
                                </button>
                                <button type="submit" disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-blue-600/30 transition disabled:opacity-60 flex items-center justify-center gap-2">
                                    {loading
                                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang tạo...</>
                                        : <><UserPlus size={16} />Tạo tài khoản</>
                                    }
                                </button>
                            </div>
                        </>}
                    </form>

                    <div className="text-center mt-5 text-sm text-gray-500">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;