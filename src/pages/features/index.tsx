import { useState } from 'react';
import { useStore } from '@/store/useStore';

/* ===================== IEP PAGE (multi-party creation) ===================== */
export function IEPPage() {
  const { iepGoals, students, currentUser, registeredUsers, role, updateIEPProgress, addIEPGoal, openModal } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showExpertRequest, setShowExpertRequest] = useState(false);
  const [goal, setGoal] = useState({ student: '', area: '', goal: '', objectives: '', startDate: '', targetDate: '' });
  const [filter, setFilter] = useState('all');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [expertRequest, setExpertRequest] = useState({ student: '', area: '', description: '' });

  const currentUserData = registeredUsers.find(u => u.username === currentUser);
  const realName = currentUserData?.realName || '';
  const myChildren = students.filter(s => s.parent === realName || s.parent === currentUser);
  const visibleGoals = role === 'parent' ? iepGoals.filter(g => myChildren.some(c => c.name === g.student)) : filter === 'all' ? iepGoals : iepGoals.filter(g => g.student === filter);

  const statusCfg = { active: { label: '进行中', color: 'bg-[#E8F5E8] text-[#2D6B3F]' }, completed: { label: '已完成', color: 'bg-[#E0E8F0] text-[#1565C0]' }, pending: { label: '待开始', color: 'bg-[#FFF0D0] text-[#8B6914]' } };

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) { openModal('⚠️', '提示', '请输入描述'); return; }
    // Simulate AI response
    const responses = [
      '根据您的描述，建议从以下几个方面制定成长计划：\n\n1. 建立固定的日常程序，让孩子有安全感\n2. 使用视觉提示辅助沟通和理解\n3. 通过游戏化的方式进行社交训练\n4. 设置小步骤目标，逐步提升能力\n5. 家长和老师保持一致的教育方法',
      'AI建议的成长计划：\n\n目标：提升社交互动能力\n\n具体措施：\n- 每日安排15分钟的一对一互动时间\n- 使用社交故事帮助孩子理解社交场景\n- 鼓励孩子参与小组活动，从旁辅助\n- 记录每日社交表现，及时调整策略',
      '基于孩子的特点，建议成长计划如下：\n\n1. 感觉统合：每天进行20分钟感统游戏\n2. 语言沟通：使用图片交换系统练习表达\n3. 情绪管理：教孩子识别和表达情绪\n4. 生活自理：分步骤训练日常生活技能',
    ];
    setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
  };

  const handleAIAddGoal = () => {
    if (!aiPrompt.trim()) return;
    const areas = ['社交沟通', '情绪调节', '语言发展', '注意力训练', '生活自理', '感觉统合'];
    addIEPGoal({
      student: goal.student || myChildren[0]?.name || students[0]?.name || '',
      area: areas[Math.floor(Math.random() * areas.length)],
      goal: `AI辅助制定：${aiPrompt.slice(0, 30)}...`,
      objectives: ['根据AI建议分步实施', '持续观察记录进展', '定期评估调整方案'],
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      progress: 0,
      status: 'pending',
      createdBy: realName || currentUser || '家长',
      source: 'ai',
    });
    setShowAI(false);
    setAiPrompt('');
    setAiResponse('');
    openModal('✅', 'AI方案已添加', 'AI生成的成长计划已添加到您的成长计划列表中');
  };

  const handleExpertRequest = () => {
    if (!expertRequest.student || !expertRequest.area) { openModal('⚠️', '提示', '请填写完整信息'); return; }
    setShowExpertRequest(false);
    openModal('✅', '请求已发送', `已向专家发送成长计划制定请求\n\n学生：${expertRequest.student}\n领域：${expertRequest.area}\n\n专家将在3个工作日内回复，请耐心等待。`);
    setExpertRequest({ student: '', area: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>{role === 'parent' ? '成长计划' : 'IEP计划管理'}</h2>
          <p className="text-sm text-[#8B8B80] mt-1">
            {role === 'parent' ? '个别化教育计划 · 家长可自己制定 / 问AI / 请求专家' : '个别化教育计划 · 目标追踪'}
          </p>
        </div>
        {role === 'parent' && (
          <div className="flex gap-2">
            <button onClick={() => setShowAI(true)} className="px-4 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#7B4A8B] to-[#9C6BB5] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">🤖 问AI</button>
            <button onClick={() => setShowExpertRequest(true)} className="px-4 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#D4A843] to-[#E8C55A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">👨‍⚕️ 请求专家</button>
            <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">🎯 自己制定</button>
          </div>
        )}
        {role !== 'parent' && <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">🎯 新增目标</button>}
      </div>

      {role !== 'parent' && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-xs font-medium ${filter === 'all' ? 'bg-[#2D6B3F] text-white' : 'bg-white border border-[#E8E8D8] text-[#5A5A50]'}`}>全部</button>
          {[...new Set(students.map(s => s.name))].slice(0, 10).map(name => <button key={name} onClick={() => setFilter(name)} className={`px-4 py-2 rounded-full text-xs font-medium ${filter === name ? 'bg-[#2D6B3F] text-white' : 'bg-white border border-[#E8E8D8] text-[#5A5A50]'}`}>{name}</button>)}
        </div>
      )}

      {/* Manual Add */}
      {showAdd && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
          <h3 className="text-lg font-semibold text-[#2D6B3F] mb-4">{role === 'parent' ? '✏️ 自己制定成长计划' : '新增IEP目标'}</h3>
          <div className="space-y-4">
            <select value={goal.student} onChange={e => setGoal({ ...goal, student: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]">
              <option value="">选择学生</option>
              {(role === 'parent' ? myChildren : students).map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
            <input value={goal.area} onChange={e => setGoal({ ...goal, area: e.target.value })} placeholder="发展领域（如：社交沟通）" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <input value={goal.goal} onChange={e => setGoal({ ...goal, goal: e.target.value })} placeholder="目标描述" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <textarea value={goal.objectives} onChange={e => setGoal({ ...goal, objectives: e.target.value })} placeholder="具体目标（逗号分隔）" rows={3} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={goal.startDate} onChange={e => setGoal({ ...goal, startDate: e.target.value })} className="px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
              <input type="date" value={goal.targetDate} onChange={e => setGoal({ ...goal, targetDate: e.target.value })} className="px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { if (goal.student && goal.goal) { addIEPGoal({ student: goal.student, area: goal.area, goal: goal.goal, objectives: goal.objectives.split(',').filter(Boolean), startDate: goal.startDate, targetDate: goal.targetDate, progress: 0, status: 'pending', createdBy: realName || currentUser || '用户', source: role === 'parent' ? 'parent' : role === 'expert' ? 'expert' : 'teacher' }); setShowAdd(false); setGoal({ student: '', area: '', goal: '', objectives: '', startDate: '', targetDate: '' }); openModal('✅', '添加成功', '成长计划已添加'); } else { openModal('⚠️', '提示', '请填写完整信息'); } }} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">保存</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-full bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8] transition-colors border border-[#E8E8D8]">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assist */}
      {showAI && (
        <div className="bg-gradient-to-br from-[#F0E0F0] to-[#F8F0F8] rounded-3xl p-8 shadow-sm border border-[#E8D8E8]">
          <h3 className="text-lg font-semibold text-[#7B4A8B] mb-4">🤖 AI辅助制定成长计划</h3>
          <p className="text-sm text-[#5A5A50] mb-4">描述孩子的当前情况和您希望改善的方面，AI将为您生成个性化的成长计划建议。</p>
          <textarea
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="例如：我的孩子小明今年6岁，有自闭症倾向，不太愿意和其他小朋友玩，语言表达能力也比较弱..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white text-sm border border-[#E8D8E8] resize-none mb-3"
          />
          {aiResponse && (
            <div className="bg-white rounded-2xl p-4 mb-3 border border-[#E8D8E8]">
              <div className="text-xs font-medium text-[#7B4A8B] mb-2">AI建议</div>
              <pre className="text-sm text-[#5A5A50] whitespace-pre-wrap leading-relaxed">{aiResponse}</pre>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={handleAIGenerate} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#7B4A8B] to-[#9C6BB5] text-white shadow-md hover:shadow-lg transition-all">
              {aiResponse ? '🔄 重新生成' : '✨ 生成建议'}
            </button>
            {aiResponse && <button onClick={handleAIAddGoal} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">✅ 采用此方案</button>}
            <button onClick={() => { setShowAI(false); setAiPrompt(''); setAiResponse(''); }} className="px-6 py-2.5 rounded-full bg-white text-[#5A5A50] text-sm hover:bg-[#F5F5EE] transition-colors border border-[#E8D8E8]">取消</button>
          </div>
        </div>
      )}

      {/* Expert Request */}
      {showExpertRequest && (
        <div className="bg-gradient-to-br from-[#FFF8E0] to-[#FFF8F0] rounded-3xl p-8 shadow-sm border border-[#E8E0C8]">
          <h3 className="text-lg font-semibold text-[#8B6914] mb-4">👨‍⚕️ 请求专家制定成长计划</h3>
          <p className="text-sm text-[#5A5A50] mb-4">填写孩子的信息和需求，专家将为您制定个性化的成长计划。</p>
          <div className="space-y-4">
            <select value={expertRequest.student} onChange={e => setExpertRequest({ ...expertRequest, student: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white text-sm border border-[#E8E0C8]">
              <option value="">选择孩子</option>
              {myChildren.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
            <select value={expertRequest.area} onChange={e => setExpertRequest({ ...expertRequest, area: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white text-sm border border-[#E8E0C8]">
              <option value="">选择发展领域</option>
              <option value="社交沟通">社交沟通</option>
              <option value="情绪调节">情绪调节</option>
              <option value="语言发展">语言发展</option>
              <option value="注意力训练">注意力训练</option>
              <option value="生活自理">生活自理</option>
              <option value="感觉统合">感觉统合</option>
            </select>
            <textarea value={expertRequest.description} onChange={e => setExpertRequest({ ...expertRequest, description: e.target.value })} placeholder="补充描述孩子的具体情况和您的期望..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white text-sm border border-[#E8E0C8] resize-none" />
            <div className="flex gap-3">
              <button onClick={handleExpertRequest} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#D4A843] to-[#E8C55A] text-white shadow-md hover:shadow-lg transition-all">📨 发送请求</button>
              <button onClick={() => { setShowExpertRequest(false); setExpertRequest({ student: '', area: '', description: '' }); }} className="px-6 py-2.5 rounded-full bg-white text-[#5A5A50] text-sm hover:bg-[#F5F5EE] transition-colors border border-[#E8E0C8]">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {visibleGoals.map(g => {
          const cfg = statusCfg[g.status];
          const sourceLabel = { parent: '👩 家长制定', expert: '👨‍⚕️ 专家制定', ai: '🤖 AI生成', teacher: '👨‍🏫 老师制定' }[g.source] || '系统生成';
          return (
            <div key={g.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-[#2A2A2A]">{g.student}</span>
                    <span className={`px-3 py-1 rounded-full text-xs ${cfg.color}`}>{cfg.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F5F5EE] text-[#8B8B80]">{sourceLabel}</span>
                  </div>
                  <div className="text-sm text-[#8B8B80]">{g.area} · 制定者：{g.createdBy}</div>
                </div>
                <div className="text-right"><div className="text-2xl font-bold text-[#2D6B3F]">{g.progress}%</div></div>
              </div>
              <h4 className="text-[#2D6B3F] font-medium mb-2 text-sm">{g.goal}</h4>
              <div className="h-3 bg-[#F0F0E8] rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${g.progress}%`, background: g.progress >= 80 ? 'linear-gradient(to right, #2D6B3F, #3A7D4A)' : g.progress >= 40 ? 'linear-gradient(to right, #D4A843, #E8C55A)' : 'linear-gradient(to right, #C85A54, #E07A72)' }} />
              </div>
              <div className="flex flex-wrap gap-2 mb-3">{g.objectives.map((obj, i) => <span key={i} className="px-3 py-1 rounded-full text-xs bg-[#E8F5E8] text-[#2D6B3F]">{obj}</span>)}</div>
              <div className="flex justify-between text-xs text-[#8B8B80] mb-3"><span>开始: {g.startDate}</span><span>目标: {g.targetDate}</span></div>
              {(role !== 'parent' || g.source === 'parent') && (
                <div className="flex gap-2">
                  <button onClick={() => { updateIEPProgress(g.id, g.progress + 10); openModal('✅', '更新成功', '进度已更新'); }} className="px-4 py-2 rounded-xl bg-[#E8F5E8] text-[#2D6B3F] text-xs hover:bg-[#D4E8D4] transition-colors font-medium">+10% 进度</button>
                  <button onClick={() => updateIEPProgress(g.id, g.progress - 10)} className="px-4 py-2 rounded-xl bg-[#FFE0D8] text-[#C85A54] text-xs hover:bg-[#FFCDD2] transition-colors font-medium">-10% 进度</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
