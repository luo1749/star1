import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import ParticleCanvas from '@/components/ParticleCanvas';
import type { UserRole } from '@/types';
import gsap from 'gsap';

const ROLES: { key: UserRole; label: string }[] = [
  { key: 'teacher', label: '老师' },
  { key: 'parent', label: '家长' },
  { key: 'admin', label: '管理员' },
  { key: 'expert', label: '专家' },
];

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [regData, setRegData] = useState({ realName: '', phone: '', regUsername: '', regPassword: '', regRole: 'parent' as Exclude<UserRole, 'admin'> });
  const [error, setError] = useState('');
  const login = useStore(s => s.login);
  const registerUser = useStore(s => s.registerUser);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.3 });
    }
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
    }
  }, [isRegister]);

  const handleLogin = () => {
    if (!username || !password) { setError('请输入用户名和密码'); return; }
    const success = login(username, password);
    if (!success) setError('用户名或密码错误');
  };

  const handleRegister = () => {
    const { realName, phone, regUsername, regPassword, regRole } = regData;
    if (!realName || !phone || !regUsername || !regPassword) { setError('请填写所有必填信息'); return; }
    if (!/^1[3-9]\d{9}$/.test(phone)) { setError('请输入有效的手机号码'); return; }
    const ok = registerUser({ realName, phone, username: regUsername, password: regPassword, role: regRole as Exclude<UserRole, 'admin'> });
    if (!ok) { setError('用户名或手机号已存在'); return; }
    setIsRegister(false); setError('');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 1 }}>
        <source src="/videos/login-bg.mp4" type="video/mp4" />
      </video>
      {/* Overlay */}
      <div className="absolute inset-0" style={{ zIndex: 1, background: 'linear-gradient(to bottom, rgba(45,107,63,0.15) 0%, rgba(45,107,63,0.5) 50%, rgba(45,107,63,0.75) 100%)' }} />
      {/* Particle Layer */}
      <ParticleCanvas />

      {/* Top Nav */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 py-6" style={{ zIndex: 10 }}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full shadow-lg" />
          <div>
            <span className="text-white text-lg font-semibold tracking-wide block" style={{ fontFamily: '"Noto Serif SC", serif', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>家校智联·掌上守护</span>
            <span className="text-white/60 text-xs">特殊学生身心监测系统</span>
          </div>
        </div>
        <div className="flex gap-8 text-white/70 text-sm">
          {['关于我们', '帮助中心', '联系支持'].map(item => (
            <button key={item} onClick={() => useStore.getState().openModal('ℹ️', item, '功能开发中，敬请期待...')} className="relative hover:text-white transition-colors duration-300 group">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4A843] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>
        <div ref={titleRef} className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full shadow-xl animate-float" />
          </div>
          <h1 className="text-5xl md:text-6xl text-white font-bold text-shadow-glow mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            家校智联 · 掌上守护
          </h1>
          <p className="text-white/80 text-xl mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>特殊学生身心监测系统</p>
          <p className="text-white/60 text-base max-w-lg mx-auto leading-relaxed">
            智能手表实时采集 · 家校协同守护 · 专家在线支持<br />
            为每一个特殊孩子筑起温暖的守护圈
          </p>
        </div>

        <div ref={cardRef} className="glass-card rounded-[32px] p-8 md:p-10 w-[440px] max-w-[90vw]">
          {!isRegister ? (
            <>
              <div className="flex gap-1 p-1 rounded-xl bg-white/10 mb-8">
                {ROLES.map(r => (
                  <button key={r.key} onClick={() => { setRole(r.key); setError(''); }}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${role === r.key ? 'bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-white/60 text-xs mb-2 tracking-wider">用户名</label>
                  <input type="text" value={username} onChange={e => { setUsername(e.target.value); setError(''); }} placeholder="请输入用户名"
                    className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 px-1 focus:outline-none focus:border-[#D4A843] transition-colors duration-300"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-2 tracking-wider">密码</label>
                  <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="请输入密码"
                    className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 px-1 focus:outline-none focus:border-[#D4A843] transition-colors duration-300"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                {error && <p className="text-red-300 text-sm">{error}</p>}
                <button onClick={handleLogin} className="w-full btn-main mt-4 py-3.5 text-base">登 录</button>
                <div className="flex justify-between text-sm mt-4">
                  <button onClick={() => { setIsRegister(true); setError(''); }} className="text-white/60 hover:text-[#D4A843] transition-colors">注册账号</button>
                  <button onClick={() => useStore.getState().openModal('🔑', '忘记密码', '请联系管理员重置密码\n管理员电话：13800138000')} className="text-white/60 hover:text-[#D4A843] transition-colors">忘记密码</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white text-xl font-semibold mb-6 text-center" style={{ fontFamily: '"Noto Serif SC", serif' }}>用户注册</h2>
              <div className="space-y-4">
                <input type="text" placeholder="真实姓名" value={regData.realName} onChange={e => setRegData({ ...regData, realName: e.target.value })} className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 px-1 focus:outline-none focus:border-[#D4A843]" />
                <input type="tel" placeholder="手机号码" value={regData.phone} onChange={e => setRegData({ ...regData, phone: e.target.value })} className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 px-1 focus:outline-none focus:border-[#D4A843]" />
                <input type="text" placeholder="用户名" value={regData.regUsername} onChange={e => setRegData({ ...regData, regUsername: e.target.value })} className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 px-1 focus:outline-none focus:border-[#D4A843]" />
                <input type="password" placeholder="密码" value={regData.regPassword} onChange={e => setRegData({ ...regData, regPassword: e.target.value })} className="w-full bg-transparent border-0 border-b border-white/20 text-white placeholder-white/30 py-3 px-1 focus:outline-none focus:border-[#D4A843]" />
                <select value={regData.regRole} onChange={e => setRegData({ ...regData, regRole: e.target.value as Exclude<UserRole, 'admin'> })} className="w-full bg-transparent border-0 border-b border-white/20 text-white py-3 px-1 focus:outline-none focus:border-[#D4A843]">
                  <option value="teacher" className="text-gray-800">老师</option>
                  <option value="parent" className="text-gray-800">家长</option>
                  <option value="expert" className="text-gray-800">专家</option>
                </select>
                {error && <p className="text-red-300 text-sm">{error}</p>}
                <button onClick={handleRegister} className="w-full btn-main mt-4 py-3.5">注册</button>
                <button onClick={() => { setIsRegister(false); setError(''); }} className="w-full text-white/60 hover:text-white text-sm py-2 transition-colors">返回登录</button>
              </div>
            </>
          )}
          <p className="text-white/40 text-xs text-center mt-6" style={{ fontFamily: '"Noto Serif SC", serif' }}>每一个生命都值得被温柔以待</p>
        </div>
      </div>
    </div>
  );
}
