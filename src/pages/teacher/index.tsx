import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import type { Student } from '@/types';
import gsap from 'gsap';

function MiniMap({ location }: { location: string }) {
  const locCoords: Record<string, { x: number; y: number }> = { '教室A': { x: 30, y: 25 }, '教室B': { x: 70, y: 25 }, '教室C': { x: 50, y: 45 }, '操场': { x: 80, y: 65 }, '休息室': { x: 20, y: 55 }, '图书馆': { x: 75, y: 40 }, '食堂': { x: 45, y: 75 }, '走廊': { x: 55, y: 35 }, '感统训练室': { x: 15, y: 40 }, '心理咨询室': { x: 85, y: 30 }, '医务室': { x: 40, y: 60 }, '音乐教室': { x: 25, y: 70 }, '美术教室': { x: 60, y: 60 }, '舞蹈室': { x: 10, y: 70 } };
  const coord = locCoords[location] || { x: 50, y: 50 };
  return (
    <div className="relative w-full h-40 bg-[#F0F7F0] rounded-2xl overflow-hidden border border-[#D8E8D8]">
      <svg viewBox="0 0 100 100" className="w-full h-full"><rect x="5" y="5" width="90" height="90" rx="3" fill="#E8F3E8" stroke="#3A7D4A" strokeWidth="0.8" /><line x1="5" y1="35" x2="95" y2="35" stroke="#B8D8B8" strokeWidth="0.5" /><line x1="5" y1="65" x2="95" y2="65" stroke="#B8D8B8" strokeWidth="0.5" /><line x1="35" y1="5" x2="35" y2="95" stroke="#B8D8B8" strokeWidth="0.5" /><line x1="65" y1="5" x2="65" y2="95" stroke="#B8D8B8" strokeWidth="0.5" />{Object.entries(locCoords).slice(0, 9).map(([name, c]) => <text key={name} x={c.x} y={c.y + 1} fontSize="4" fill="#5A8A5A" textAnchor="middle">{name.slice(0, 3)}</text>)}<circle cx={coord.x} cy={coord.y} r="4" fill="#D4A843" opacity="0.3"><animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" /></circle><circle cx={coord.x} cy={coord.y} r="3" fill="#D4A843" /><circle cx={coord.x} cy={coord.y} r="1.5" fill="#FFF" /></svg>
      <div className="absolute bottom-2 left-2 text-[10px] text-[#3A7D4A] font-medium bg-white/80 px-2 py-0.5 rounded-full">📍 {location}</div>
    </div>
  );
}

function StatCard({ icon, value, label, gradient }: { icon: string; value: string | number; label: string; gradient?: string }) {
  return (
    <div className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4" style={{ background: gradient || 'linear-gradient(135deg, #2D6B3F 0%, #3A7D4A 100%)', boxShadow: '0 4px 12px rgba(45,107,63,0.25)' }}>{icon}</div>
      <div className="text-3xl font-bold text-[#2A2A2A] mb-1" style={{ fontFamily: '"Inter", monospace' }}>{value}</div>
      <div className="text-sm text-[#8B8B80]">{label}</div>
    </div>
  );
}

function StudentCard({ student, onClick }: { student: Student; onClick?: () => void }) {
  const isOnline = student.deviceStatus === 'online';
  return (
    <div onClick={onClick} className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm cursor-pointer hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8F5E8] to-[#D4E8D4] flex items-center justify-center text-lg shadow-sm">{student.avatar ? <img src={student.avatar} className="w-8 h-8 rounded-lg" /> : '👦'}</div>
          <div><div className="font-semibold text-[#2A2A2A] text-[15px]">{student.name}</div><div className="text-xs text-[#8B8B80]">{student.class}</div></div>
        </div>
        <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#3A7D4A] animate-pulse' : 'bg-[#C85A54]'}`} /><span className="text-xs text-[#5A5A50]">{student.condition}</span></div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-2xl p-4 text-center bg-[#F5F5EE] hover:bg-[#F0F7F0] transition-all"><div className="text-lg mb-1 animate-pulse">❤️</div><div className="text-lg font-bold text-[#2A2A2A] data-live">{student.heartRate}</div><div className="text-[10px] text-[#8B8B80]">心率 BPM</div></div>
        <div className="rounded-2xl p-4 text-center bg-[#F5F5EE]"><div className="text-lg mb-1">🌡️</div><div className="text-lg font-bold text-[#2A2A2A]">{student.bodyTemp}°C</div><div className="text-[10px] text-[#8B8B80]">体温</div></div>
        <div className="rounded-2xl p-4 text-center bg-[#F5F5EE]"><div className="text-lg mb-1">😊</div><div className="text-base font-bold text-[#2A2A2A]">{student.emotion}</div><div className="text-[10px] text-[#8B8B80]">情绪</div></div>
      </div>
      <MiniMap location={student.location} />
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#F0F0E8]">
        <div className="text-xs text-[#8B8B80]"><span className="mr-3">👟 {student.steps}</span><span>🔋 {student.battery}%</span></div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${isOnline ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#FFEBEE] text-[#C85A54]'}`}>{isOnline ? '⌚ 实时监测' : '离线'}</span>
      </div>
    </div>
  );
}

/* ===================== TEACHER HOME (merged with analytics) ===================== */
export function TeacherHome() {
  const { students, alerts, setPage, selectStudent, historicalData } = useStore();
  const pageRef = useRef<HTMLDivElement>(null);
  const onlineCount = students.filter(s => s.deviceStatus === 'online').length;
  const pendingAlerts = alerts.filter(a => !a.handled).length;
  const conditionStudents = students.filter(s => s.hasCondition);
  const [chartStudent, setChartStudent] = useState(students[0]);

  const data = historicalData[chartStudent.name] || [];
  const last7 = data.slice(-7);
  const avgHR = last7.length ? Math.round(last7.reduce((s, d) => s + d.heartRate, 0) / last7.length) : 0;
  const avgTemp = last7.length ? (last7.reduce((s, d) => s + d.bodyTemp, 0) / last7.length).toFixed(1) : '0';
  const avgSteps = last7.length ? Math.round(last7.reduce((s, d) => s + d.steps, 0) / last7.length) : 0;

  const renderChart = (values: number[], color: string, label: string) => {
    if (!values.length) return null;
    const max = Math.max(...values) * 1.1, min = Math.min(...values) * 0.9, range = max - min || 1;
    const w = 600, h = 140, pad = 30;
    const points = values.map((v, i) => `${pad + (w - 2 * pad) * i / (values.length - 1)},${pad + (h - 2 * pad) * (1 - (v - min) / range)}`).join(' ');
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E8D8]">
        <h3 className="text-xs font-medium text-[#2D6B3F] mb-3">{label}</h3>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 130 }}>
          {[0, 1, 2, 3].map(i => <line key={i} x1={pad} y1={pad + (h - 2 * pad) * i / 3} x2={w - pad} y2={pad + (h - 2 * pad) * i / 3} stroke="#F0F0E8" strokeWidth="1" />)}
          <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {values.map((v, i) => <circle key={i} cx={pad + (w - 2 * pad) * i / (values.length - 1)} cy={pad + (h - 2 * pad) * (1 - (v - min) / range)} r="4" fill={color} />)}
        </svg>
      </div>
    );
  };

  useEffect(() => { if (pageRef.current) gsap.fromTo(pageRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' }); }, []);

  return (
    <div ref={pageRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>首页监控</h2><p className="text-sm text-[#8B8B80] mt-1">⌚ 智能手表实时数据采集 · {onlineCount}/{students.length} 设备在线</p></div>
        <button onClick={() => setPage('alerts')} className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">预警管理</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👦" value={students.length} label="学生总数" />
        <StatCard icon="⌚" value={onlineCount} label="在线设备" gradient="linear-gradient(135deg, #3A7D4A 0%, #4A9B5E 100%)" />
        <StatCard icon="🔔" value={pendingAlerts} label="待处理预警" gradient="linear-gradient(135deg, #D4A843 0%, #E8C55A 100%)" />
        <StatCard icon="⚠️" value={conditionStudents.length} label="需关注学生" gradient="linear-gradient(135deg, #C85A54 0%, #E07A72 100%)" />
      </div>

      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #2D6B3F 0%, #3A7D4A 100%)' }}>
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">📊 近7天数据 · {chartStudent.name}</h3><div className="flex gap-2">{students.slice(0, 5).map(s => <button key={s.name} onClick={() => setChartStudent(s)} className={`px-3 py-1 rounded-full text-xs ${chartStudent.name === s.name ? 'bg-white text-[#2D6B3F]' : 'bg-white/20 text-white'}`}>{s.name}</button>)}</div></div>
        <div className="grid grid-cols-3 gap-4">{[{ v: avgHR, l: '平均心率 BPM' }, { v: `${avgTemp}°C`, l: '平均体温' }, { v: avgSteps, l: '平均步数' }].map((s, i) => <div key={i} className="bg-white/10 rounded-xl p-4 text-center"><div className="text-2xl font-bold">{s.v}</div><div className="text-xs opacity-80 mt-1">{s.l}</div></div>)}</div>
      </div>

      {last7.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{renderChart(last7.map(d => d.heartRate), '#C85A54', '❤️ 心率趋势')}{renderChart(last7.map(d => d.bodyTemp), '#D4A843', '🌡️ 体温趋势')}</div>}

      <div className="flex items-center justify-between"><h3 className="text-lg text-[#2D6B3F] font-semibold">需关注学生</h3><span className="text-xs text-[#8B8B80]">数据每3秒自动刷新</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {conditionStudents.slice(0, 6).map(s => <StudentCard key={s.id} student={s} onClick={() => { selectStudent(s); }} />)}
      </div>
    </div>
  );
}

/* ===================== ALERTS ===================== */
export function TeacherAlerts() {
  const { alerts, handleAlert, openModal } = useStore();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? alerts : filter === 'pending' ? alerts.filter(a => !a.handled) : alerts.filter(a => a.level === Number(filter));
  const levelCfg: Record<number, { border: string; badge: string; icon: string }> = { 1: { border: 'border-l-[#D4A843]', badge: 'bg-[#FFF8E0] text-[#8B6914]', icon: '⚡' }, 2: { border: 'border-l-[#E07A72]', badge: 'bg-[#FFE8E0] text-[#C85A54]', icon: '🔶' }, 3: { border: 'border-l-[#C85A54]', badge: 'bg-[#FFEBEE] text-[#C62828]', icon: '🚨' } };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>预警管理</h2><p className="text-sm text-[#8B8B80] mt-1">智能手表异常自动检测 · AI辅助分析</p></div>
      <div className="flex gap-2 flex-wrap">
        {[{ k: 'all', l: '全部' }, { k: 'pending', l: '待处理' }, { k: '1', l: '一般' }, { k: '2', l: '中等' }, { k: '3', l: '紧急' }].map(f => <button key={f.k} onClick={() => setFilter(f.k)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.k ? 'bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md' : 'bg-white text-[#5A5A50] border border-[#E8E8D8]'}`}>{f.l}</button>)}
      </div>
      <div className="space-y-3">
        {filtered.sort((a, b) => b.level - a.level).map(a => {
          const cfg = levelCfg[a.level];
          return (
            <div key={a.id} className={`rounded-3xl p-5 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm ${cfg.border} border-l-4 ${a.level === 3 && !a.handled ? 'animate-pulse' : ''}`}>
              <div className="flex justify-between items-start mb-3"><div className="flex items-center gap-2"><span>{cfg.icon}</span><span className="font-semibold text-[#2A2A2A] text-sm">{a.type}</span><span className="text-xs text-[#8B8B80]">· {a.student}</span></div><span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.badge}`}>{a.handled ? '已处理' : '待处理'}</span></div>
              <p className="text-sm text-[#5A5A50] mb-3">{a.message}</p>
              <div className="bg-[#F8F8F0] rounded-xl p-3 mb-3"><div className="text-xs font-medium text-[#2D6B3F] mb-1">💡 处理建议</div><p className="text-xs text-[#5A5A50]">{a.solution}</p></div>
              <div className="flex gap-2">
                <button onClick={() => handleAlert(a.id)} className={`px-4 py-2 rounded-xl text-xs font-medium ${a.handled ? 'bg-[#F5F5EE] text-[#5A5A50]' : 'bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white'}`}>{a.handled ? '撤销' : '标记已处理'}</button>
                {a.level >= 2 && <button onClick={() => openModal('📞', '正在联系家长', `正在拨打${a.student}家长的电话...`)} className="px-4 py-2 rounded-xl text-xs bg-[#FFF8E0] text-[#8B6914]">📞 联系家长</button>}
                <button onClick={() => openModal('🤖', 'AI分析报告', `异常类型：${a.type}\n涉及学生：${a.student}\n发生时间：${a.time}\n\nAI分析：\n根据历史数据分析，此类异常在过去30天内发生了${Math.floor(Math.random() * 8 + 1)}次。\n\n建议措施：\n${a.solution}`)} className="px-4 py-2 rounded-xl text-xs bg-[#E8F0F8] text-[#1565C0]">🤖 AI分析</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== STUDENTS ===================== */
export function TeacherStudents() {
  const { students, openModal } = useStore();
  const [filterClass, setFilterClass] = useState('all');
  const classes = [...new Set(students.map(s => s.class))];
  const filtered = filterClass === 'all' ? students : students.filter(s => s.class === filterClass);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>学生管理</h2><p className="text-sm text-[#8B8B80] mt-1">共 {students.length} 名特殊学生 · 智能手表绑定管理</p></div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterClass('all')} className={`px-4 py-2 rounded-full text-xs font-medium ${filterClass === 'all' ? 'bg-[#2D6B3F] text-white' : 'bg-white border border-[#E8E8D8] text-[#5A5A50]'}`}>全部</button>
        {classes.map(c => <button key={c} onClick={() => setFilterClass(c)} className={`px-4 py-2 rounded-full text-xs font-medium ${filterClass === c ? 'bg-[#2D6B3F] text-white' : 'bg-white border border-[#E8E8D8] text-[#5A5A50]'}`}>{c}</button>)}
      </div>
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#E8E8D8]">
        <table className="w-full"><thead><tr className="bg-[#F5F5EE]">{['姓名','班级','状况','家长','老师','设备','电量','操作'].map(h => <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-[#8B8B80]">{h}</th>)}</tr></thead>
          <tbody>{filtered.map(s => <tr key={s.id} className="border-t border-[#F0F0E8] hover:bg-[#FAFAF5]"><td className="px-5 py-3.5 font-medium text-sm">{s.name}</td><td className="px-5 py-3.5 text-xs text-[#5A5A50]">{s.class}</td><td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-full text-xs bg-[#FFF8E0] text-[#8B6914]">{s.condition}</span></td><td className="px-5 py-3.5 text-xs">{s.parent}</td><td className="px-5 py-3.5 text-xs">{s.teachers.join(', ')}</td><td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs ${s.deviceStatus === 'online' ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#FFEBEE] text-[#C85A54]'}`}>{s.deviceStatus === 'online' ? '在线' : '离线'}</span></td><td className="px-5 py-3.5"><div className="w-16 h-2 bg-[#F0F0E8] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.battery}%`, background: s.battery > 60 ? '#3A7D4A' : s.battery > 30 ? '#D4A843' : '#C85A54' }} /></div></td><td className="px-5 py-3.5"><button onClick={() => openModal('👦', s.name + ' 详情', `姓名：${s.name}\n班级：${s.class}\n状况：${s.condition}\n家长：${s.parent}\n老师：${s.teachers.join(', ')}\n位置：${s.location}\n设备：${s.deviceStatus === 'online' ? '在线' : '离线'}\n电量：${s.battery}%\n手表ID：D${String(s.id).padStart(3, '0')}`)} className="px-3 py-1.5 rounded-lg bg-[#F5F5EE] text-xs hover:bg-[#E8E8D8]">详情</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ===================== DEVICES ===================== */
export function TeacherDevices() {
  const { devices, openModal } = useStore();
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>设备管理</h2><p className="text-sm text-[#8B8B80] mt-1">智能手环/手表设备管理 · 电量与信号监测</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {devices.map(d => (
          <div key={d.id} className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #2D6B3F 0%, #3A7D4A 100%)' }}>⌚</div><div><div className="text-sm font-semibold">{d.name}</div><div className="text-xs text-[#8B8B80]">{d.id}</div></div></div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${d.status === 'online' ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#FFEBEE] text-[#C85A54]'}`}>{d.status === 'online' ? '在线' : '离线'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#F5F5EE] rounded-xl p-3"><div className="text-[10px] text-[#8B8B80]">绑定学生</div><div className="text-sm font-semibold">{d.student}</div></div>
              <div className="bg-[#F5F5EE] rounded-xl p-3"><div className="text-[10px] text-[#8B8B80]">最后同步</div><div className="text-sm font-semibold">{d.lastSync.split(' ')[1]}</div></div>
            </div>
            <div className="flex items-center gap-2"><span className="text-xs text-[#8B8B80]">电量</span><div className="flex-1 h-2 bg-[#F0F0E8] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${d.battery}%`, background: d.battery > 60 ? 'linear-gradient(to right, #2D6B3F, #3A7D4A)' : d.battery > 30 ? 'linear-gradient(to right, #D4A843, #E8C55A)' : 'linear-gradient(to right, #C85A54, #E07A72)' }} /></div><span className="text-xs font-medium" style={{ color: d.battery > 60 ? '#2D6B3F' : d.battery > 30 ? '#D4A843' : '#C85A54' }}>{d.battery}%</span></div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => openModal('📱', '设备详情', `设备：${d.name}\nID：${d.id}\n类型：智能手环\n绑定学生：${d.student}\n电量：${d.battery}%\n状态：${d.status === 'online' ? '在线' : '离线'}\n最后同步：${d.lastSync}\n\n传感器：心率、体温、GPS、步数、加速度`)} className="flex-1 px-3 py-2 rounded-xl bg-[#F5F5EE] text-xs hover:bg-[#E8E8D8]">详情</button>
              <button onClick={() => openModal('🔔', '查找设备', `正在向 ${d.name} 发送查找信号...\n手环将震动并发出提示音。`)} className="flex-1 px-3 py-2 rounded-xl bg-[#E8F5E8] text-[#2D6B3F] text-xs hover:bg-[#D4E8D4]">查找</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
