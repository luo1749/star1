import { useState } from 'react';
import { useStore } from '@/store/useStore';

/* ===================== MINI MAP ===================== */
function MiniMap({ location }: { location: string }) {
  const locCoords: Record<string, { x: number; y: number }> = {
    '教室A': { x: 30, y: 25 }, '教室B': { x: 70, y: 25 }, '教室C': { x: 50, y: 45 },
    '操场': { x: 80, y: 65 }, '休息室': { x: 20, y: 55 }, '图书馆': { x: 75, y: 40 },
    '食堂': { x: 45, y: 75 }, '走廊': { x: 55, y: 35 }, '感统训练室': { x: 15, y: 40 },
    '心理咨询室': { x: 85, y: 30 }, '医务室': { x: 40, y: 60 }, '音乐教室': { x: 25, y: 70 },
    '美术教室': { x: 60, y: 60 }, '舞蹈室': { x: 10, y: 70 },
  };
  const coord = locCoords[location] || { x: 50, y: 50 };
  return (
    <div className="relative w-full h-44 bg-[#F0F7F0] rounded-2xl overflow-hidden border border-[#D8E8D8]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="5" y="5" width="90" height="90" rx="3" fill="#E8F3E8" stroke="#3A7D4A" strokeWidth="0.8" />
        <line x1="5" y1="35" x2="95" y2="35" stroke="#B8D8B8" strokeWidth="0.5" />
        <line x1="5" y1="65" x2="95" y2="65" stroke="#B8D8B8" strokeWidth="0.5" />
        <line x1="35" y1="5" x2="35" y2="95" stroke="#B8D8B8" strokeWidth="0.5" />
        <line x1="65" y1="5" x2="65" y2="95" stroke="#B8D8B8" strokeWidth="0.5" />
        {Object.entries(locCoords).slice(0, 9).map(([name, c]) => (
          <text key={name} x={c.x} y={c.y + 1} fontSize="4" fill="#5A8A5A" textAnchor="middle">{name.slice(0, 3)}</text>
        ))}
        <circle cx={coord.x} cy={coord.y} r="4" fill="#D4A843" opacity="0.3">
          <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={coord.x} cy={coord.y} r="3" fill="#D4A843" />
        <circle cx={coord.x} cy={coord.y} r="1.5" fill="#FFF" />
      </svg>
      <div className="absolute bottom-2 left-2 text-[10px] text-[#3A7D4A] font-medium bg-white/80 px-2 py-0.5 rounded-full">📍 {location}</div>
    </div>
  );
}

/* ===================== RENDER CHART ===================== */
function renderChart(values: number[], color: string, label: string) {
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
}

/* ===================== PARENT CHILD PAGE (monitoring + analytics fused) ===================== */
export function ParentChildPage() {
  const { students, currentUser, registeredUsers, selectedChildForParent, selectChildForParent, alerts, historicalData } = useStore();
  const currentUserData = registeredUsers.find(u => u.username === currentUser);
  const realName = currentUserData?.realName || '';
  const myChildren = students.filter(s => s.parent === realName || s.parent === currentUser);
  const child = selectedChildForParent || myChildren[0];

  const handleAvatarChange = (studentId: number) => {
    useStore.setState({ showAvatarPicker: true, avatarTarget: 'child', avatarTargetChild: String(studentId) });
  };

  if (!child) return (
    <div className="space-y-6">
      <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>孩子监测</h2>
      <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-[#E8E8D8]">
        <div className="text-6xl mb-4 opacity-30">👶</div>
        <div className="text-[#8B8B80]">暂无孩子数据</div>
        <p className="text-sm text-[#8B8B80] mt-2">请联系学校添加孩子信息</p>
      </div>
    </div>
  );

  const childAlerts = alerts.filter(a => a.student === child.name);
  const pendingAlerts = childAlerts.filter(a => !a.handled);
  const data = historicalData[child.name] || [];
  const last7 = data.slice(-7);
  const avgHR = last7.length ? Math.round(last7.reduce((s, d) => s + d.heartRate, 0) / last7.length) : 0;
  const avgTemp = last7.length ? (last7.reduce((s, d) => s + d.bodyTemp, 0) / last7.length).toFixed(1) : '0';
  const avgSteps = last7.length ? Math.round(last7.reduce((s, d) => s + d.steps, 0) / last7.length) : 0;
  const avgSleep = last7.length ? (last7.reduce((s, d) => s + d.sleepHours, 0) / last7.length).toFixed(1) : '0';
  const avgScreen = last7.length ? Math.round(last7.reduce((s, d) => s + d.screenTime, 0) / last7.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>孩子监测</h2>
          <p className="text-sm text-[#8B8B80] mt-1">⌚ 智能手表实时数据 · GPS定位追踪 · 全方位健康监测</p>
        </div>
        <span className="text-xs text-[#8B8B80]">数据每3秒自动刷新</span>
      </div>

      {/* Child Selector */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E8D8]">
        <div className="flex gap-2 flex-wrap">
          {myChildren.map(c => (
            <button key={c.name} onClick={() => selectChildForParent(c)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${child.name === c.name ? 'border-[#2D6B3F] bg-[#E8F5E8] text-[#2D6B3F]' : 'border-[#E8E8D8] text-[#5A5A50] hover:border-[#D4A843]'}`}>
              {c.name} - {c.condition}
            </button>
          ))}
        </div>
      </div>

      {/* Child Identity Card with Avatar */}
      <div className="bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] rounded-3xl p-6 text-white flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl overflow-hidden">
            {child.avatar ? <img src={child.avatar} className="w-full h-full object-cover" alt="" /> : '👦'}
          </div>
          <button onClick={() => handleAvatarChange(child.id)} className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs shadow-md hover:scale-110 transition-transform">📷</button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-bold">{child.name}</h3>
            <span className="px-3 py-0.5 rounded-full text-xs bg-white/20">{child.class}</span>
          </div>
          <p className="text-sm opacity-80 mb-2">{child.condition} · 负责老师：{child.teachers.join(', ')}</p>
          <div className="flex gap-4 text-xs opacity-70">
            <span>👤 家长：{child.parent}</span>
            <span>⌚ 设备：{child.deviceStatus === 'online' ? '在线监测中' : '离线'}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${child.deviceStatus === 'online' ? 'bg-white/20' : 'bg-white/10'}`}>
            <span className={`w-2 h-2 rounded-full ${child.deviceStatus === 'online' ? 'bg-[#90EE90] animate-pulse' : 'bg-[#FF6B6B]'}`} />
            {child.deviceStatus === 'online' ? '实时监测中' : '设备离线'}
          </div>
        </div>
      </div>

      {/* Stats Grid - More info than teacher */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '❤️', value: child.heartRate, label: '心率 BPM', color: 'from-[#C85A54] to-[#E07A72]', animate: 'animate-pulse' },
          { icon: '🌡️', value: `${child.bodyTemp}°C`, label: '体温', color: 'from-[#D4A843] to-[#E8C55A]' },
          { icon: '😊', value: child.emotion, label: '情绪状态', color: 'from-[#2D6B3F] to-[#3A7D4A]' },
          { icon: pendingAlerts.length > 0 ? '🔔' : '✅', value: pendingAlerts.length, label: '待处理预警', color: pendingAlerts.length > 0 ? 'from-[#C85A54] to-[#E07A72]' : 'from-[#2D6B3F] to-[#3A7D4A]' },
          { icon: '😴', value: `${child.sleepHours}h`, label: '睡眠时长', color: 'from-[#1565C0] to-[#42A5F5]' },
          { icon: '📱', value: `${child.screenTime}min`, label: '屏幕时间', color: 'from-[#7B4A8B] to-[#9C6BB5]' },
          { icon: '🍽️', value: child.appetite || '一般', label: '食欲状况', color: 'from-[#E07A72] to-[#FFAB91]' },
          { icon: '💊', value: child.medicationTaken ? '已服药' : '未服药', label: '用药情况', color: child.medicationTaken ? 'from-[#2D6B3F] to-[#4A9B5E]' : 'from-[#C85A54] to-[#E07A72]' },
        ].map((s, i) => (
          <div key={i} className="rounded-3xl p-5 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 bg-gradient-to-br ${s.color} text-white shadow-sm`}>
              <span className={s.animate || ''}>{s.icon}</span>
            </div>
            <div className="text-2xl font-bold text-[#2A2A2A] mb-1 data-live" style={{ fontFamily: '"Inter", monospace' }}>{s.value}</div>
            <div className="text-sm text-[#8B8B80]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 7-Day Overview */}
      {last7.length > 0 && (
        <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #2D6B3F 0%, #3A7D4A 100%)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">📊 近7天数据概览 · {child.name}</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[{ v: avgHR, l: '平均心率' }, { v: `${avgTemp}°C`, l: '平均体温' }, { v: avgSteps, l: '平均步数' }, { v: `${avgSleep}h`, l: '平均睡眠' }, { v: `${avgScreen}min`, l: '平均屏幕时间' }].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs opacity-80 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      {last7.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderChart(last7.map(d => d.heartRate), '#C85A54', '❤️ 心率趋势')}
          {renderChart(last7.map(d => d.bodyTemp), '#D4A843', '🌡️ 体温趋势')}
          {renderChart(last7.map(d => d.sleepHours), '#1565C0', '😴 睡眠时长趋势')}
          {renderChart(last7.map(d => d.screenTime), '#7B4A8B', '📱 屏幕时间趋势')}
        </div>
      )}

      {/* Map + Extra Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
          <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">📋 {child.name} 详细信息</h3>
          <div className="space-y-3">
            {[
              { k: '社交互动', v: `${child.socialInteraction || 0} 次/天` },
              { k: '睡眠质量', v: child.sleepHours && child.sleepHours >= 8 ? '良好' : child.sleepHours && child.sleepHours >= 6 ? '一般' : '较差', h: child.sleepHours && child.sleepHours < 6 },
              { k: '用药情况', v: child.medicationTaken ? '今日已服药 ✅' : '今日未服药 ⚠️', h: !child.medicationTaken },
              { k: '食欲状况', v: child.appetite || '未知' },
              { k: '屏幕时间', v: `${child.screenTime || 0} 分钟` },
            ].map(item => (
              <div key={item.k} className="flex justify-between py-2 border-b border-[#F0F0E8] last:border-0">
                <span className="text-[#8B8B80] text-sm">{item.k}</span>
                <span className={`font-medium text-sm ${item.h ? 'text-[#C85A54]' : 'text-[#2A2A2A]'}`}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">📍 实时位置 · {child.location}</h3>
          <MiniMap location={child.location} />
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="bg-[#F5F5EE] rounded-2xl p-4 text-center">
              <div className="text-lg mb-1">👟</div>
              <div className="text-xl font-bold text-[#2A2A2A]">{child.steps}</div>
              <div className="text-[10px] text-[#8B8B80]">今日步数</div>
            </div>
            <div className="bg-[#F5F5EE] rounded-2xl p-4 text-center">
              <div className="text-lg mb-1">🔋</div>
              <div className="text-xl font-bold" style={{ color: child.battery > 60 ? '#2D6B3F' : child.battery > 30 ? '#D4A843' : '#C85A54' }}>{child.battery}%</div>
              <div className="text-[10px] text-[#8B8B80]">手表电量</div>
            </div>
            <div className="bg-[#F5F5EE] rounded-2xl p-4 text-center">
              <div className="text-lg mb-1">🤝</div>
              <div className="text-xl font-bold text-[#2A2A2A]">{child.socialInteraction || 0}</div>
              <div className="text-[10px] text-[#8B8B80]">社交互动</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h3 className="text-lg text-[#2D6B3F] font-semibold mb-4">⚠️ 预警信息</h3>
        {childAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-[#E8E8D8]">
            <div className="text-4xl mb-3 opacity-30">✅</div>
            <div className="text-[#8B8B80]">暂无预警，孩子状态良好</div>
          </div>
        ) : (
          <div className="space-y-3">
            {childAlerts.slice(0, 5).map(a => (
              <div key={a.id} className="rounded-3xl p-5 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm" style={{ borderLeftWidth: 4, borderLeftColor: a.level === 3 ? '#C85A54' : a.level === 2 ? '#D4A843' : '#3A7D4A' }}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-[#2A2A2A] text-sm">{a.type} · {a.student}</span>
                  <span className="text-xs text-[#8B8B80]">{a.time}</span>
                </div>
                <p className="text-sm text-[#5A5A50] mb-2">{a.message}</p>
                <div className="bg-[#F8F8F0] rounded-xl p-3 mb-2">
                  <div className="text-xs text-[#2D6B3F] font-medium mb-1">💡 处理建议</div>
                  <p className="text-xs text-[#5A5A50]">{a.solution}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${a.handled ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#FFEBEE] text-[#C85A54]'}`}>
                  {a.handled ? '已处理' : '待处理'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== MOOD JOURNAL (with edit) ===================== */
export function MoodJournalPage() {
  const { moodJournal, currentUser, registeredUsers, students, addMoodEntry, updateMoodEntry, openModal } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [entry, setEntry] = useState<{ student: string; mood: string; intensity: number; trigger: string; notes: string; strategies: string }>({ student: '', mood: 'calm', intensity: 5, trigger: '', notes: '', strategies: '' });
  const currentUserData = registeredUsers.find(u => u.username === currentUser);
  const realName = currentUserData?.realName || '';
  const myChildren = students.filter(s => s.parent === realName || s.parent === currentUser);

  const moodCfg: Record<string, { emoji: string; color: string; label: string }> = {
    happy: { emoji: '😊', color: 'bg-[#E8F5E8] text-[#2D6B3F]', label: '开心' },
    calm: { emoji: '😌', color: 'bg-[#E0E8F0] text-[#1565C0]', label: '平静' },
    anxious: { emoji: '😰', color: 'bg-[#FFF0D0] text-[#8B6914]', label: '焦虑' },
    sad: { emoji: '😢', color: 'bg-[#E8E8E8] text-[#5A5A5A]', label: '低落' },
    angry: { emoji: '😠', color: 'bg-[#FFE0D8] text-[#C85A54]', label: '愤怒' },
    excited: { emoji: '🤩', color: 'bg-[#F0E0F0] text-[#7B4A8B]', label: '兴奋' },
  };

  const startEdit = (item: typeof moodJournal[0]) => {
    setEditingId(item.id);
    setEntry({
      student: item.student,
      mood: item.mood,
      intensity: item.intensity,
      trigger: item.trigger,
      notes: item.notes,
      strategies: item.strategies.join(','),
    });
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!entry.student) { openModal('⚠️', '提示', '请选择孩子'); return; }
    if (editingId !== null) {
      updateMoodEntry(editingId, {
        student: entry.student,
        mood: entry.mood as 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'excited',
        intensity: entry.intensity,
        trigger: entry.trigger,
        notes: entry.notes,
        strategies: entry.strategies.split(',').filter(Boolean),
      });
      openModal('✅', '修改成功', '情绪日记已更新');
    } else {
      addMoodEntry({
        student: entry.student,
        date: new Date().toISOString().split('T')[0],
        mood: entry.mood as 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'excited',
        intensity: entry.intensity,
        trigger: entry.trigger,
        notes: entry.notes,
        strategies: entry.strategies.split(',').filter(Boolean),
      });
      openModal('✅', '添加成功', '情绪日记已记录');
    }
    setShowAdd(false);
    setEditingId(null);
    setEntry({ student: '', mood: 'calm', intensity: 5, trigger: '', notes: '', strategies: '' });
  };

  const handleCancel = () => {
    setShowAdd(false);
    setEditingId(null);
    setEntry({ student: '', mood: 'calm', intensity: 5, trigger: '', notes: '', strategies: '' });
  };

  const myJournal = moodJournal.filter(m => myChildren.length === 0 || myChildren.some(c => c.name === m.student));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>情绪日记</h2>
          <p className="text-sm text-[#8B8B80] mt-1">记录孩子每日情绪变化 · 可随时修改更新</p>
        </div>
        {!showAdd && <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">📝 记录情绪</button>}
      </div>

      {showAdd && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
          <h3 className="text-lg font-semibold text-[#2D6B3F] mb-4">{editingId !== null ? '✏️ 编辑情绪记录' : '📝 记录情绪'}</h3>
          <div className="space-y-4">
            <select value={entry.student} onChange={e => setEntry({ ...entry, student: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]">
              <option value="">选择孩子</option>
              {myChildren.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <select value={entry.mood} onChange={e => setEntry({ ...entry, mood: e.target.value as typeof entry.mood })} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]">
              {Object.entries(moodCfg).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
            <div>
              <label className="text-sm text-[#5A5A50] mb-1 block">强度: {entry.intensity}/10</label>
              <input type="range" min="1" max="10" value={entry.intensity} onChange={e => setEntry({ ...entry, intensity: Number(e.target.value) })} className="w-full accent-[#2D6B3F]" />
            </div>
            <input value={entry.trigger} onChange={e => setEntry({ ...entry, trigger: e.target.value })} placeholder="触发因素（如：噪音环境、社交互动等）" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]" />
            <textarea value={entry.notes} onChange={e => setEntry({ ...entry, notes: e.target.value })} placeholder="备注..." rows={3} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 resize-none border border-[#E8E8D8]" />
            <input value={entry.strategies} onChange={e => setEntry({ ...entry, strategies: e.target.value })} placeholder="应对策略（用逗号分隔）" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]" />
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">
                {editingId !== null ? '💾 保存修改' : '保存'}
              </button>
              <button onClick={handleCancel} className="px-6 py-2.5 rounded-full bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8] transition-colors border border-[#E8E8D8]">取消</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {myJournal.map(item => {
          const cfg = moodCfg[item.mood];
          return (
            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8] hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${cfg.color} flex items-center justify-center text-2xl`}>{cfg.emoji}</div>
                <div>
                  <div className="font-semibold text-[#2A2A2A]">{item.student} · {cfg.label}</div>
                  <div className="text-xs text-[#8B8B80]">{item.date}</div>
                </div>
                <div className="ml-auto">
                  <div className="text-2xl font-bold text-[#2D6B3F]">{item.intensity}<span className="text-sm text-[#8B8B80]">/10</span></div>
                </div>
              </div>
              <div className="bg-[#F5F5EE] rounded-xl p-4 mb-3">
                <div className="text-xs text-[#8B8B80] mb-1">触发因素</div>
                <div className="text-sm text-[#2A2A2A]">{item.trigger}</div>
              </div>
              {item.notes && <p className="text-sm text-[#5A5A50] mb-3">{item.notes}</p>}
              {item.strategies.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {item.strategies.map((s, i) => <span key={i} className="px-3 py-1 rounded-full text-xs bg-[#E8F5E8] text-[#2D6B3F]">{s}</span>)}
                </div>
              )}
              <button onClick={() => startEdit(item)} className="px-4 py-2 rounded-xl bg-[#E8F5E8] text-[#2D6B3F] text-xs hover:bg-[#D4E8D4] transition-colors font-medium">
                ✏️ 编辑
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== PARENT CONSULT ===================== */
export function ParentConsultPage() {
  const { experts, consultationRequests, currentUser, setPage, openConfirm, openModal } = useStore();
  const myRequests = consultationRequests.filter(c => c.parent === currentUser);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>专家咨询</h2>
        <p className="text-sm text-[#8B8B80] mt-1">在线预约专家 · 一对一专业指导</p>
      </div>

      <h3 className="text-lg text-[#2D6B3F] font-semibold">专家列表</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {experts.map(e => (
          <div key={e.id} className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={e.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D4A843]/30" />
                <div>
                  <button onClick={() => { useStore.setState({ viewingExpertDetail: e.name }); setPage('expertDetail'); }} className="font-semibold text-[#2A2A2A] hover:text-[#2D6B3F] transition-colors text-left">
                    {e.name}
                  </button>
                  <div className="text-xs text-[#8B8B80]">{e.specialty}</div>
                </div>
              </div>
              <span className="text-[#2D6B3F] font-semibold text-sm">¥{e.rate}/时</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#F5F5EE] rounded-xl p-3"><div className="text-[10px] text-[#8B8B80]">从业经验</div><div className="text-sm font-semibold">{e.experience}年</div></div>
              <div className="bg-[#F5F5EE] rounded-xl p-3"><div className="text-[10px] text-[#8B8B80]">资质认证</div><div className="text-sm font-semibold">{e.certification}</div></div>
            </div>
            <p className="text-sm text-[#5A5A50] mb-4">{e.intro}</p>
            <div className="flex gap-2">
              <button onClick={() => { useStore.setState({ viewingExpertDetail: e.name }); setPage('expertDetail'); }} className="flex-1 px-3 py-2 rounded-xl bg-[#F5F5EE] text-[#5A5A50] text-xs hover:bg-[#E8E8D8] transition-colors text-center">👤 专家详情</button>
              <button onClick={() => { useStore.setState({ currentConsultExpertId: e.id }); openConfirm(`确定要向 ${e.name} 发起咨询请求吗？`, () => { useStore.getState().submitConsultRequest(`希望咨询关于${e.specialty}的相关问题`, '待商议'); openModal('✅', '请求已发送', `已向 ${e.name} 发送咨询请求\n等待专家确认中...`); }); }} className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white text-xs shadow-md hover:shadow-lg transition-all text-center">发起咨询</button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg text-[#2D6B3F] font-semibold mt-8">我的咨询请求</h3>
      {myRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-[#E8E8D8]">
          <div className="text-4xl mb-3 opacity-30">💬</div>
          <div className="text-[#8B8B80]">暂无咨询请求</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myRequests.map(r => (
            <div key={r.id} className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm">
              <div className="flex justify-between mb-3">
                <span className="font-semibold text-[#2A2A2A]">{r.expert}</span>
                <span className={`px-3 py-1 rounded-full text-xs ${r.status === 'pending' ? 'bg-[#FFF0D0] text-[#8B6914]' : r.status === 'accepted' ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#FFE0D8] text-[#C85A54]'}`}>
                  {r.status === 'pending' ? '待处理' : r.status === 'accepted' ? '已接受' : '已拒绝'}
                </span>
              </div>
              <p className="text-sm text-[#5A5A50] mb-2">{r.description}</p>
              {r.status === 'accepted' && (
                <>
                  <div className="text-sm text-[#5A5A50]"><strong>时间：</strong>{r.agreedTime}</div>
                  <div className="text-sm text-[#5A5A50] mb-2"><strong>费用：</strong>¥{r.fee}</div>
                  {!r.isPaid && <button onClick={() => { useStore.getState().payConsultation(r.id); openModal('💰', '支付成功', `已支付 ¥${r.fee} 咨询费用`); }} className="px-5 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">立即支付</button>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
