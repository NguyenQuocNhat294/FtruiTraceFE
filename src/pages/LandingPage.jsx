// src/pages/LandingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight, Play, Star, CheckCircle2, ChevronRight,
    Shield, BarChart3, Smartphone, Globe, Facebook,
    Twitter, Instagram, Send, ArrowUp, Package, Scan,
    TrendingUp, QrCode, MapPin, Leaf, Users, Building2,
    Sprout, Truck, FlaskConical, Eye, X, Menu
} from "lucide-react";

/* ─── DATA ─── */
const FEATURES = [
    { icon:QrCode,      title:"Tạo mã QR thông minh",      desc:"Mỗi lô hàng có mã QR duy nhất. Người tiêu dùng quét là thấy ngay toàn bộ hành trình nông sản.",    color:'#22c55e', accent:'rgba(34,197,94,0.12)'   },
    { icon:MapPin,      title:"Truy xuất hành trình",       desc:"Theo dõi từng bước: trồng trọt → thu hoạch → kiểm định → đóng gói → vận chuyển → tay người dùng.", color:'#38bdf8', accent:'rgba(56,189,248,0.12)'  },
    { icon:Shield,      title:"Kiểm định chất lượng",       desc:"Nhân viên kiểm định ghi nhận kết quả trực tiếp trên hệ thống. Dữ liệu minh bạch, không thể sửa.",   color:'#818cf8', accent:'rgba(129,140,248,0.12)' },
    { icon:BarChart3,   title:"Dashboard phân tích",        desc:"Thống kê sản lượng, doanh thu, lô hàng theo thời gian thực. Xuất báo cáo PDF/Excel dễ dàng.",        color:'#fbbf24', accent:'rgba(251,191,36,0.12)'  },
    { icon:Leaf,        title:"Quản lý nông trại",          desc:"Quản lý nhiều nông trại, nhiều vụ mùa. Theo dõi chứng nhận VietGAP, GlobalGAP tự động.",            color:'#34d399', accent:'rgba(52,211,153,0.12)'  },
    { icon:Globe,       title:"Chứng chỉ xuất khẩu",        desc:"Tạo chứng chỉ xuất khẩu tự động theo tiêu chuẩn quốc tế. Hỗ trợ mở rộng thị trường EU, Nhật.",     color:'#f97316', accent:'rgba(249,115,22,0.12)'  },
];

const STEPS = [
    { icon:Sprout,       step:"01", title:"Đăng ký lô hàng",      desc:"Tạo lô hàng với đầy đủ thông tin: giống cây, ngày trồng, phân bón, phương pháp canh tác.",    color:'#22c55e' },
    { icon:QrCode,       step:"02", title:"Gắn mã QR",            desc:"Hệ thống tự động tạo mã QR duy nhất. In hoặc dán trực tiếp lên sản phẩm, thùng hàng.",         color:'#38bdf8' },
    { icon:FlaskConical, step:"03", title:"Ghi nhật ký & Kiểm định", desc:"Nhân viên cập nhật từng bước quy trình. Tự động tạo TraceLog minh bạch theo thời gian.",   color:'#818cf8' },
    { icon:Eye,          step:"04", title:"Người dùng truy xuất",  desc:"Quét QR → xem ngay hành trình sản phẩm: từ vườn trồng đến tay người tiêu dùng.",              color:'#fbbf24' },
];

const STATS = [
    { val:"18+",   label:"Nông trại",     icon:"🌾", color:'#22c55e' },
    { val:"500+",  label:"Lô hàng",       icon:"📦", color:'#38bdf8' },
    { val:"43+",   label:"Sản phẩm",      icon:"🍊", color:'#fbbf24' },
    { val:"99.9%", label:"Độ tin cậy",    icon:"✓",  color:'#818cf8' },
];

const TESTIMONIALS = [
    { name:"Nguyễn Văn Minh", role:"Chủ vườn xoài · Tiền Giang",   avatar:"M", content:"Doanh số tăng 65% sau 3 tháng. Khách hàng tin tưởng hơn khi thấy nguồn gốc minh bạch!", rating:5, metric:"+65% Doanh số",  color:'#22c55e' },
    { name:"Trần Thị Hương",  role:"GĐ Công ty Xuất khẩu nông sản", avatar:"H", content:"Tiết kiệm 40% chi phí quản lý, giảm 90% thời gian làm giấy tờ xuất khẩu. Tuyệt vời!",   rating:5, metric:"-40% Chi phí",   color:'#38bdf8' },
    { name:"Lê Hoàng Nam",    role:"Nhà phân phối trái cây",         avatar:"N", content:"Mọi thông tin đều trong tầm tay. Không còn lo về nguồn gốc. Khách hàng rất hài lòng!",   rating:5, metric:"100% Minh bạch", color:'#818cf8' },
];

const BRANDS = ["VinEco 🌱","BigC 🛒","Coopmart 🏪","Lotte 🏬","Metro 🏭","Aeon 🌟"];

const NAV = [
    { label:"Tính năng",    href:"#features" },
    { label:"Cách dùng",    href:"#how"      },
    { label:"Đánh giá",     href:"#reviews"  },
];

/* ─── ANIMATED NUMBER ─── */
function AnimNum({ target, suffix='' }) {
    const [n, setN] = useState(0);
    const ref = useRef();
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let s = 0;
                const tm = setInterval(() => {
                    s++; setN(Math.round(target*s/50));
                    if (s >= 50) { setN(target); clearInterval(tm); }
                }, 30);
                obs.disconnect();
            }
        }, { threshold:0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);
    return <span ref={ref}>{n}{suffix}</span>;
}

/* ─── TRACE DEMO CARD ─── */
const TraceDemoCard = () => {
    const steps = [
        { icon:<Sprout size={12}/>,       label:"Xuống giống",    date:"10/01/2026", color:'#22c55e' },
        { icon:<FlaskConical size={12}/>,  label:"Bón phân",       date:"15/02/2026", color:'#fbbf24' },
        { icon:<Package size={12}/>,      label:"Thu hoạch",      date:"10/03/2026", color:'#38bdf8' },
        { icon:<Shield size={12}/>,       label:"Kiểm định ✓",    date:"12/03/2026", color:'#818cf8' },
        { icon:<Truck size={12}/>,        label:"Giao hàng",      date:"15/03/2026", color:'#f97316' },
    ];
    return (
        <div className="rounded-3xl overflow-hidden shadow-2xl"
             style={{ background:'rgba(4,8,20,0.95)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(20px)' }}>
            <div className="h-1.5" style={{ background:'linear-gradient(90deg,#16a34a,#22c55e,#38bdf8)' }}/>
            <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color:'rgba(34,197,94,0.7)' }}>
                            🍊 Xoài Cát Chu · F014
                        </div>
                        <div className="font-black text-white text-lg" style={{ fontFamily:'Syne,sans-serif' }}>BATCH-001</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs px-2.5 py-1 rounded-full font-bold mb-1"
                             style={{ background:'rgba(34,197,94,0.12)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.25)' }}>
                            ✓ VietGAP
                        </div>
                        <div className="text-[10px]" style={{ color:'rgba(255,255,255,0.3)' }}>663 kg</div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2.5 mb-4">
                    {steps.map((s,i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                                 style={{ background:`${s.color}25`, color:s.color, border:`1px solid ${s.color}30` }}>
                                {s.icon}
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                                <span className="text-xs font-semibold text-white">{s.label}</span>
                                <span className="text-[10px]" style={{ color:'rgba(255,255,255,0.3)' }}>{s.date}</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background:s.color }}/>
                        </div>
                    ))}
                </div>

                {/* QR */}
                <div className="flex items-center gap-3 p-3 rounded-xl"
                     style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.12)' }}>
                    <QrCode size={28} style={{ color:'#22c55e' }}/>
                    <div>
                        <div className="text-xs font-black text-white">Quét để truy xuất</div>
                        <div className="text-[10px]" style={{ color:'rgba(255,255,255,0.3)' }}>fruittrace.vn/trace?code=BATCH-001</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════ MAIN ═══════════ */
export default function LandingPage() {
    const [scrolled,  setScrolled]  = useState(false);
    const [mobileMenu,setMobileMenu]= useState(false);
    const [activeTesti,setTesti]    = useState(0);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setTesti(p=>(p+1)%TESTIMONIALS.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden"
             style={{ background:'#060c14', fontFamily:"'DM Sans','Syne',system-ui,sans-serif", color:'#e2e8f0' }}>

            {/* ─── BACKGROUND ─── */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div style={{ background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(56,189,248,0.05) 0%, transparent 50%), #060c14' }} className="absolute inset-0"/>
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
                     style={{ background:'radial-gradient(circle,#22c55e,transparent 70%)', animation:'orb1 14s ease-in-out infinite alternate' }}/>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                     style={{ background:'radial-gradient(circle,#38bdf8,transparent 70%)', animation:'orb2 18s ease-in-out infinite alternate' }}/>
                <div className="absolute inset-0 opacity-[0.025]" style={{
                    backgroundImage:'linear-gradient(rgba(34,197,94,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.5) 1px,transparent 1px)',
                    backgroundSize:'60px 60px',
                    maskImage:'radial-gradient(ellipse at center, black 20%, transparent 70%)'
                }}/>
            </div>

            {/* ─── NAVBAR ─── */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled?'py-3':'py-5'}`}
                    style={ scrolled ? { background:'rgba(6,12,20,0.92)', borderBottom:'1px solid rgba(34,197,94,0.1)', backdropFilter:'blur(20px)' } : {} }>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                             style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 4px 16px rgba(34,197,94,0.4)' }}>
                            <span className="text-lg">🍊</span>
                        </div>
                        <div>
                            <div className="font-black text-lg text-white leading-none" style={{ fontFamily:'Syne,sans-serif' }}>FruitTrace</div>
                            <div className="text-[10px] leading-none mt-0.5" style={{ color:'rgba(34,197,94,0.7)' }}>Truy xuất nguồn gốc</div>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV.map(l => (
                            <a key={l.href} href={l.href}
                               className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                               style={{ color:'rgba(255,255,255,0.5)' }}
                               onMouseEnter={e=>{ e.currentTarget.style.color='#22c55e'; e.currentTarget.style.background='rgba(34,197,94,0.08)'; }}
                               onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.background='transparent'; }}>
                                {l.label}
                            </a>
                        ))}
                        <Link to="/trace"
                              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                              style={{ color:'rgba(255,255,255,0.5)' }}
                              onMouseEnter={e=>{ e.currentTarget.style.color='#22c55e'; e.currentTarget.style.background='rgba(34,197,94,0.08)'; }}
                              onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.background='transparent'; }}>
                            🔍 Tra cứu
                        </Link>
                        <Link to="/products"
                              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                              style={{ color:'rgba(255,255,255,0.5)' }}
                              onMouseEnter={e=>{ e.currentTarget.style.color='#22c55e'; e.currentTarget.style.background='rgba(34,197,94,0.08)'; }}
                              onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.background='transparent'; }}>
                            🍊 Sản phẩm
                        </Link>
                    </nav>

                    <div className="hidden lg:flex items-center gap-3">
                        <Link to="/login"
                              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                              style={{ color:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.08)' }}
                              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(34,197,94,0.3)'}
                              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
                            Đăng nhập
                        </Link>
                        <Link to="/login"
                              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
                              style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 4px 16px rgba(34,197,94,0.4)' }}>
                            Bắt đầu <ArrowRight size={14}/>
                        </Link>
                    </div>

                    <button onClick={()=>setMobileMenu(!mobileMenu)} className="lg:hidden p-2 rounded-xl" style={{ color:'rgba(255,255,255,0.6)' }}>
                        {mobileMenu ? <X size={22}/> : <Menu size={22}/>}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileMenu && (
                    <div className="lg:hidden mx-4 mt-2 rounded-2xl overflow-hidden shadow-2xl"
                         style={{ background:'rgba(4,8,20,0.98)', border:'1px solid rgba(34,197,94,0.15)' }}>
                        <nav className="p-4 flex flex-col gap-1">
                            {[...NAV,{label:'🔍 Tra cứu',href:'/trace'},{label:'🍊 Sản phẩm',href:'/products'}].map((l,i) => (
                                <a key={i} href={l.href} onClick={()=>setMobileMenu(false)}
                                   className="px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                                   style={{ color:'rgba(255,255,255,0.6)' }}>
                                    {l.label}
                                </a>
                            ))}
                        </nav>
                        <div className="p-4 pt-0 flex flex-col gap-2">
                            <Link to="/login" className="py-3 rounded-xl text-center text-sm font-semibold" style={{ border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)' }}>Đăng nhập</Link>
                            <Link to="/login" className="py-3 rounded-xl text-center text-sm font-black text-white" style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)' }}>Bắt đầu ngay →</Link>
                        </div>
                    </div>
                )}
            </header>

            {/* ─── HERO ─── */}
            <section className="relative pt-36 pb-24 lg:pt-52 lg:pb-36 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8"
                             style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', color:'#4ade80' }}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"/>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"/>
                            </span>
                            Được tin dùng bởi 500+ doanh nghiệp Việt Nam
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-7 tracking-tight" style={{ fontFamily:'Syne,sans-serif' }}>
                            <span className="text-white">Truy xuất</span><br/>
                            <span style={{ background:'linear-gradient(135deg,#22c55e,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                                nguồn gốc
                            </span><br/>
                            <span className="text-white">nông sản</span>
                        </h1>

                        <p className="text-lg mb-10 leading-relaxed max-w-lg" style={{ color:'rgba(255,255,255,0.5)' }}>
                            Nền tảng giúp <span className="font-bold text-white">minh bạch 100%</span> hành trình nông sản từ nông trại đến tay người tiêu dùng.
                            Quản lý lô hàng, tạo QR, truy xuất nguồn gốc — tất cả trong một hệ thống.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mb-12">
                            <Link to="/trace"
                                  className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-black text-base transition-all hover:-translate-y-1"
                                  style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 8px 32px rgba(34,197,94,0.4)' }}>
                                🔍 Tra cứu ngay <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                            </Link>
                            <Link to="/products"
                                  className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-1"
                                  style={{ border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.8)', background:'rgba(255,255,255,0.04)' }}>
                                🍊 Xem sản phẩm
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {['#22c55e','#38bdf8','#818cf8','#fbbf24'].map((c,i)=>(
                                        <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black text-white"
                                             style={{ borderColor:'#060c14', background:`linear-gradient(135deg,${c},${c}80)` }}>
                                            {['M','H','N','A'][i]}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-semibold" style={{ color:'rgba(255,255,255,0.5)' }}>5,000+ người dùng</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {[...Array(5)].map((_,i)=><Star key={i} size={15} style={{ color:'#fbbf24' }} fill="#fbbf24"/>)}
                                <span className="text-sm font-semibold" style={{ color:'rgba(255,255,255,0.5)' }}>4.9/5</span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Demo card */}
                    <div className="relative">
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30" style={{ background:'radial-gradient(circle,#22c55e,#38bdf8,transparent 70%)' }}/>
                        <div className="relative">
                            <TraceDemoCard/>
                        </div>

                        {/* Floating badges */}
                        <div className="absolute -left-6 top-10 hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
                             style={{ background:'rgba(4,8,20,0.95)', border:'1px solid rgba(34,197,94,0.2)', backdropFilter:'blur(12px)', animation:'floatA 4s ease-in-out infinite' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(34,197,94,0.15)' }}>
                                <Building2 size={18} style={{ color:'#22c55e' }}/>
                            </div>
                            <div>
                                <div className="font-black text-white text-lg" style={{ fontFamily:'Syne,sans-serif' }}>18+</div>
                                <div className="text-[10px]" style={{ color:'rgba(255,255,255,0.4)' }}>Nông trại</div>
                            </div>
                        </div>

                        <div className="absolute -right-6 bottom-16 hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl"
                             style={{ background:'rgba(4,8,20,0.95)', border:'1px solid rgba(56,189,248,0.2)', backdropFilter:'blur(12px)', animation:'floatB 4s ease-in-out infinite 2s' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'rgba(56,189,248,0.15)' }}>
                                <Shield size={18} style={{ color:'#38bdf8' }}/>
                            </div>
                            <div>
                                <div className="font-black text-white text-lg" style={{ fontFamily:'Syne,sans-serif' }}>99.9%</div>
                                <div className="text-[10px]" style={{ color:'rgba(255,255,255,0.4)' }}>Độ tin cậy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── BRANDS ─── */}
            <section className="py-12 px-6" style={{ borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-xs font-black uppercase tracking-[0.2em] mb-8" style={{ color:'rgba(255,255,255,0.2)' }}>
                        Được tin dùng bởi các thương hiệu hàng đầu Việt Nam
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {BRANDS.map((b,i)=>(
                            <div key={i} className="text-center py-3 px-4 rounded-xl transition-all cursor-pointer text-sm font-bold"
                                 style={{ color:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.05)' }}
                                 onMouseEnter={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                                 onMouseLeave={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'; e.currentTarget.style.background='transparent'; }}>
                                {b}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── STATS ─── */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {STATS.map((s,i)=>(
                            <div key={i} className="text-center p-6 rounded-2xl group transition-all hover:-translate-y-1"
                                 style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <div className="text-4xl font-black text-white mb-1" style={{ fontFamily:'Syne,sans-serif', color:s.color }}>{s.val}</div>
                                <div className="text-xs font-bold uppercase tracking-wider" style={{ color:'rgba(255,255,255,0.3)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-5"
                             style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', color:'#4ade80' }}>
                            ✨ Tính năng hệ thống
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily:'Syne,sans-serif' }}>
                            Quản lý toàn diện<br/>
                            <span style={{ background:'linear-gradient(135deg,#22c55e,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                                trong một nền tảng
                            </span>
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color:'rgba(255,255,255,0.4)' }}>
                            Từ quản lý nông trại đến truy xuất nguồn gốc — tất cả được tích hợp liền mạch
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f,i)=>{
                            const Icon = f.icon;
                            return (
                                <div key={i} className="group p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
                                     style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}
                                     onMouseEnter={e=>e.currentTarget.style.borderColor=`${f.color}30`}
                                     onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
                                    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                                         style={{ background:`linear-gradient(90deg,transparent,${f.color}60,transparent)` }}/>
                                    <div className="absolute top-4 right-4 text-5xl font-black select-none" style={{ color:'rgba(255,255,255,0.04)', fontFamily:'Syne,sans-serif' }}>
                                        {String(i+1).padStart(2,'0')}
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                                         style={{ background:f.accent, color:f.color }}>
                                        <Icon size={22}/>
                                    </div>
                                    <h3 className="font-black text-white text-base mb-2">{f.title}</h3>
                                    <p className="text-sm leading-relaxed" style={{ color:'rgba(255,255,255,0.4)' }}>{f.desc}</p>
                                    <div className="flex items-center gap-1.5 mt-4 text-xs font-bold transition-all"
                                         style={{ color:f.color, opacity:0 }}
                                         ref={el=>{ if(el) el.parentElement.addEventListener('mouseenter',()=>el.style.opacity='1'); if(el) el.parentElement.addEventListener('mouseleave',()=>el.style.opacity='0'); }}>
                                        Tìm hiểu thêm <ChevronRight size={13}/>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section id="how" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-5"
                             style={{ background:'rgba(56,189,248,0.1)', border:'1px solid rgba(56,189,248,0.2)', color:'#7dd3fc' }}>
                            🚀 Luồng hoạt động
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily:'Syne,sans-serif' }}>
                            Farm → Batch → Product<br/>
                            <span style={{ background:'linear-gradient(135deg,#38bdf8,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                                4 bước đơn giản
                            </span>
                        </h2>
                        <p className="text-lg" style={{ color:'rgba(255,255,255,0.4)' }}>Không cần kỹ thuật. Setup xong trong 5 phút.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {STEPS.map((s,i)=>{
                            const Icon = s.icon;
                            return (
                                <div key={i} className="relative p-5 rounded-2xl text-center group transition-all hover:-translate-y-1"
                                     style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                                    {i < STEPS.length-1 && (
                                        <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-5 h-px z-10"
                                             style={{ background:`linear-gradient(90deg,${s.color}50,transparent)` }}/>
                                    )}
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110"
                                         style={{ background:`${s.color}15`, color:s.color, border:`1px solid ${s.color}25` }}>
                                        <Icon size={24}/>
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color:`${s.color}80` }}>{s.step}</div>
                                    <h3 className="font-black text-white text-sm mb-2">{s.title}</h3>
                                    <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.4)' }}>{s.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/login"
                              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-black transition-all hover:-translate-y-0.5"
                              style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 8px 32px rgba(34,197,94,0.35)' }}>
                            Bắt đầu ngay miễn phí <ArrowRight size={18}/>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section id="reviews" className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-5"
                             style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', color:'#fde68a' }}>
                            💬 Khách hàng nói gì
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ fontFamily:'Syne,sans-serif' }}>
                            Câu chuyện thành công
                        </h2>
                        <p style={{ color:'rgba(255,255,255,0.4)' }}>Hơn 2,500 đánh giá 5 sao từ những khách hàng hài lòng</p>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl mb-6"
                         style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex transition-transform duration-500 ease-out"
                             style={{ transform:`translateX(-${activeTesti*100}%)` }}>
                            {TESTIMONIALS.map((t,i)=>(
                                <div key={i} className="w-full shrink-0 p-10">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(t.rating)].map((_,j)=><Star key={j} size={18} style={{ color:'#fbbf24' }} fill="#fbbf24"/>)}
                                    </div>
                                    <p className="text-xl leading-relaxed italic mb-8" style={{ color:'rgba(255,255,255,0.8)' }}>"{t.content}"</p>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg"
                                                 style={{ background:`linear-gradient(135deg,${t.color},${t.color}80)` }}>
                                                {t.avatar}
                                            </div>
                                            <div>
                                                <div className="font-black text-white">{t.name}</div>
                                                <div className="text-sm" style={{ color:'rgba(255,255,255,0.4)' }}>{t.role}</div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black px-4 py-1.5 rounded-full"
                                              style={{ background:`${t.color}15`, color:t.color, border:`1px solid ${t.color}25` }}>
                                            📈 {t.metric}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-2">
                        {TESTIMONIALS.map((_,i)=>(
                            <button key={i} onClick={()=>setTesti(i)}
                                    className="rounded-full transition-all duration-300"
                                    style={ i===activeTesti
                                        ? { width:32, height:10, background:'#22c55e' }
                                        : { width:10, height:10, background:'rgba(255,255,255,0.1)' }
                                    }/>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="relative py-28 px-6 overflow-hidden">
                <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(22,163,74,0.15),rgba(56,189,248,0.08),rgba(129,140,248,0.1))' }}/>
                <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center,rgba(34,197,94,0.1),transparent 70%)' }}/>
                {[120,240,360,480].map((s,i)=>(
                    <div key={i} className="absolute rounded-full"
                         style={{ width:s, height:s, top:'50%', left:'50%', transform:'translate(-50%,-50%)', border:'1px solid rgba(34,197,94,0.08)', animation:`ringPulse ${3+i}s ease-in-out infinite ${i*0.5}s` }}/>
                ))}
                <div className="relative max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6" style={{ fontFamily:'Syne,sans-serif' }}>
                        Sẵn sàng minh bạch hóa<br/>
                        <span style={{ background:'linear-gradient(135deg,#22c55e,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                            nguồn gốc nông sản?
                        </span>
                    </h2>
                    <p className="text-lg mb-10" style={{ color:'rgba(255,255,255,0.5)' }}>
                        Tham gia cùng 500+ doanh nghiệp đang tin tưởng FruitTrace.<br/>
                        Dùng thử <span className="font-black text-white">miễn phí</span> — không cần thẻ tín dụng.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                        <Link to="/login"
                              className="group flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-white font-black text-base transition-all hover:-translate-y-1"
                              style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 8px 40px rgba(34,197,94,0.4)' }}>
                            Dùng thử miễn phí <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                        </Link>
                        <Link to="/trace"
                              className="flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-bold text-base transition-all hover:-translate-y-1"
                              style={{ border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)', background:'rgba(255,255,255,0.04)' }}>
                            🔍 Thử tra cứu ngay
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color:'rgba(255,255,255,0.4)' }}>
                        {["Không cần thẻ tín dụng","Setup trong 5 phút","Hỗ trợ 24/7"].map((item,i)=>(
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 size={16} style={{ color:'#22c55e' }}/> {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer style={{ background:'rgba(2,4,10,0.95)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                                    <span className="text-lg">🍊</span>
                                </div>
                                <div>
                                    <div className="font-black text-white text-lg" style={{ fontFamily:'Syne,sans-serif' }}>FruitTrace</div>
                                    <div className="text-[10px]" style={{ color:'rgba(34,197,94,0.6)' }}>Truy xuất nguồn gốc</div>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color:'rgba(255,255,255,0.35)' }}>
                                Nền tảng công nghệ hàng đầu giúp minh bạch hóa chuỗi cung ứng nông sản. Xây dựng niềm tin, tạo giá trị bền vững.
                            </p>
                            <div className="flex gap-2">
                                <input placeholder="Email của bạn..."
                                       className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-slate-700 focus:outline-none"
                                       style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}/>
                                <button className="p-2.5 rounded-xl text-white transition-all hover:brightness-110"
                                        style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                                    <Send size={16}/>
                                </button>
                            </div>
                        </div>

                        {[
                            { title:"Hệ thống",   links:[{l:"Tra cứu QR",to:"/trace"},{l:"Sản phẩm",to:"/products"},{l:"Đăng nhập",to:"/login"},{l:"Dashboard",to:"/admin"}] },
                            { title:"Công ty",    links:[{l:"Về chúng tôi"},{l:"Blog"},{l:"Tuyển dụng"},{l:"Đối tác"},{l:"Liên hệ"}] },
                            { title:"Hỗ trợ",    links:[{l:"Hướng dẫn"},{l:"FAQ"},{l:"Community"},{l:"Hỗ trợ 24/7"}] },
                            { title:"Pháp lý",   links:[{l:"Điều khoản"},{l:"Bảo mật"},{l:"GDPR"}] },
                        ].map((col,i)=>(
                            <div key={i}>
                                <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white">{col.title}</h4>
                                <ul className="space-y-2.5">
                                    {col.links.map((link,j)=>(
                                        <li key={j}>
                                            {link.to ? (
                                                <Link to={link.to} className="text-sm transition-colors" style={{ color:'rgba(255,255,255,0.35)' }}
                                                      onMouseEnter={e=>e.currentTarget.style.color='#22c55e'}
                                                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
                                                    {link.l}
                                                </Link>
                                            ) : (
                                                <a href="#" className="text-sm transition-colors" style={{ color:'rgba(255,255,255,0.35)' }}
                                                   onMouseEnter={e=>e.currentTarget.style.color='#22c55e'}
                                                   onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
                                                    {link.l}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                         style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                        <p className="text-sm" style={{ color:'rgba(255,255,255,0.25)' }}>
                            © {new Date().getFullYear()} FruitTrace. Made with 💚 in Vietnam
                        </p>
                        <div className="flex gap-2">
                            {[{icon:Facebook,label:"Facebook"},{icon:Twitter,label:"Twitter"},{icon:Instagram,label:"Instagram"}].map(({icon:Icon,label})=>(
                                <a key={label} href="#" aria-label={label}
                                   className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5"
                                   style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.35)' }}
                                   onMouseEnter={e=>{ e.currentTarget.style.background='rgba(34,197,94,0.15)'; e.currentTarget.style.color='#22c55e'; e.currentTarget.style.borderColor='rgba(34,197,94,0.25)'; }}
                                   onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>
                                    <Icon size={15}/>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to top */}
            {scrolled && (
                <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-2xl text-white shadow-2xl transition-all hover:-translate-y-1"
                        style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 4px 20px rgba(34,197,94,0.4)' }}>
                    <ArrowUp size={18} className="mx-auto"/>
                </button>
            )}

            <style dangerouslySetInnerHTML={{ __html:`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
                @keyframes orb1 { from{transform:translate(0,0) scale(1)} to{transform:translate(-60px,40px) scale(1.2)} }
                @keyframes orb2 { from{transform:translate(0,0) scale(1)} to{transform:translate(40px,-30px) scale(0.9)} }
                @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
                @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
                @keyframes ringPulse { 0%,100%{opacity:.06} 50%{opacity:.15} }
            `}}/>
        </div>
    );
}