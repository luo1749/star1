import { useState } from 'react';
import { useStore } from '@/store/useStore';

export function AdminFeedbackPage() {
  const { feedbacks, openModal } = useStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = statusFilter === 'all' ? feedbacks : feedbacks.filter(f => f.status === statusFilter);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>意见反馈</h2><p className="text-sm text-[#8B8B80] mt-1">收集各方意见 · 持续优化系统</p></div>
      <div className="flex gap-2">
        {['all', '待处理', '已采纳'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${statusFilter === s ? 'bg-[#2D6B3F] text-white' : 'bg-white border border-[#E8E8D8] text-[#5A5A50]'}`}>{s === 'all' ? '全部' : s}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(f => (
          <div key={f.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8F5E8] to-[#D4E8D4] flex items-center justify-center text-lg">{f.role === '老师' ? '👨‍🏫' : f.role === '家长' ? '👩' : '👨‍⚕️'}</div>
                <div><div className="font-medium text-[#2A2A2A] text-sm">{f.author}</div><span className="text-xs px-2 py-0.5 rounded-full bg-[#E8F5E8] text-[#2D6B3F]">{f.role}</span></div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${f.status === '已采纳' ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#FFF0D0] text-[#8B6914]'}`}>{f.status}</span>
            </div>
            <p className="text-sm text-[#5A5A50] leading-relaxed">{f.content}</p>
            <div className="text-xs text-[#8B8B80] mt-3">{f.time}</div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => openModal('✅', '已采纳', `已将「${f.author}」的反馈标记为「已采纳」，相关功能将在下一版本中优化。`)} className="px-3 py-1.5 rounded-lg bg-[#E8F5E8] text-[#2D6B3F] text-xs hover:bg-[#D4E8D4] transition-colors">采纳</button>
              <button onClick={() => openModal('💬', '回复', `回复「${f.author}」：\n\n感谢您的宝贵建议，我们会认真评估并尽快优化。`)} className="px-3 py-1.5 rounded-lg bg-[#E0E8F0] text-[#1565C0] text-xs hover:bg-[#C8D8E8] transition-colors">回复</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminInvitePage() {
  const [form, setForm] = useState({ name: '', title: '', hospital: '', field: '', experience: '', tags: '' });
  const { openModal } = useStore();

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>邀请专家</h2><p className="text-sm text-[#8B8B80] mt-1">邀请专业人士入驻平台 · 扩充专家资源库</p></div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8] max-w-lg mx-auto">
        {[{ k: 'name', l: '专家姓名' }, { k: 'title', l: '职称' }, { k: 'hospital', l: '所在医院/机构' }, { k: 'field', l: '专业领域' }, { k: 'experience', l: '从业经验' }, { k: 'tags', l: '擅长标签（逗号分隔）' }].map(f => (
          <div key={f.k} className="mb-5">
            <label className="block text-sm text-[#5A5A50] mb-2">{f.l}</label>
            <input value={form[f.k as keyof typeof form]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} placeholder={`请输入${f.l}`}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]" />
          </div>
        ))}
        <button onClick={() => { if (form.name) { openModal('✉️', '邀请已发送', `已向「${form.name} ${form.title || '专家'}」发送入驻邀请\n\n专业领域：${form.field || '待填写'}\n所在机构：${form.hospital || '待填写'}\n\n对方将收到邮件通知，确认后即可入驻平台。`); setForm({ name: '', title: '', hospital: '', field: '', experience: '', tags: '' }); } else { openModal('⚠️', '提示', '请至少填写专家姓名'); } }} className="w-full btn-main py-3">发送邀请</button>
      </div>
    </div>
  );
}

export function AdminAIConfigPage() {
  const [enabled, setEnabled] = useState(true);
  const { openModal } = useStore();

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>AI接口配置</h2><p className="text-sm text-[#8B8B80] mt-1">智能分析引擎配置 · 行为预测模型管理</p></div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8] space-y-6">
        <h3 className="text-lg font-semibold text-[#2D6B3F]">基本配置</h3>
        {[{ l: 'API Key', p: '输入AI服务API密钥', v: '' }, { l: 'API端点', p: '', v: 'https://api.guardian-ai.com/v2' }, { l: '模型选择', p: '', v: 'guardian-v3' }, { l: '置信度阈值', p: '', v: '0.85' }, { l: '心率异常阈值 (BPM)', p: '', v: '100' }, { l: '体温异常阈值 (°C)', p: '', v: '37.8' }].map(f => (
          <div key={f.l}><label className="block text-sm text-[#5A5A50] mb-2">{f.l}</label><input defaultValue={f.v} placeholder={f.p} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]" /></div>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
        <h3 className="text-lg font-semibold text-[#2D6B3F] mb-4">功能开关</h3>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-[#5A5A50]">启用AI智能分析</span>
          <button onClick={() => setEnabled(!enabled)} className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? 'bg-[#2D6B3F]' : 'bg-[#DDD]'}`}><span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#5A5A50]">启用行为预测</span>
          <button className={`w-12 h-7 rounded-full transition-colors relative bg-[#2D6B3F]`}><span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow translate-x-5`} /></button>
        </div>
      </div>
      <button onClick={() => openModal('✅', '保存成功', 'AI接口配置已保存并生效\n\n系统将在下次数据采集时应用新的配置参数。')} className="btn-main px-8 py-3">保存配置</button>
    </div>
  );
}

export function AdminSystemPage() {
  const { openModal } = useStore();

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>系统设置</h2><p className="text-sm text-[#8B8B80] mt-1">系统参数配置 · 安全策略管理</p></div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8] space-y-6">
        <h3 className="text-lg font-semibold text-[#2D6B3F]">基本设置</h3>
        {[{ l: '系统名称', v: '家校智联·掌上守护——特殊学生身心监测系统' }, { l: '系统版本', v: 'v3.0.0', ro: true }, { l: '数据刷新频率(秒)', v: '3' }, { l: '最大学生数', v: '1000' }].map(f => (
          <div key={f.l}><label className="block text-sm text-[#5A5A50] mb-2">{f.l}</label><input defaultValue={f.v} readOnly={f.ro} className={`w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8] ${f.ro ? 'opacity-60' : ''}`} /></div>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8] space-y-6">
        <h3 className="text-lg font-semibold text-[#2D6B3F]">安全设置</h3>
        {[{ l: '会话超时时间（分钟）', v: '30' }, { l: '密码有效期（天）', v: '90' }, { l: '登录失败锁定次数', v: '5' }, { l: '数据备份频率（小时）', v: '24' }].map(f => (
          <div key={f.l}><label className="block text-sm text-[#5A5A50] mb-2">{f.l}</label><input defaultValue={f.v} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]" /></div>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8] space-y-6">
        <h3 className="text-lg font-semibold text-[#2D6B3F]">微信小程序配置</h3>
        {[{ l: '小程序AppID', v: 'wx_guardian_star_2024' }, { l: 'API密钥', v: '************************' }].map(f => (
          <div key={f.l}><label className="block text-sm text-[#5A5A50] mb-2">{f.l}</label><input defaultValue={f.v} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]" /></div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] rounded-3xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">📚 接口文档</h3>
        <p className="text-sm opacity-80 mb-4">查看和管理系统API接口文档，包括微信小程序、移动APP等接口规范。</p>
        <button onClick={() => useStore.setState({ currentPage: 'api-docs' })} className="px-6 py-2.5 rounded-full text-sm font-medium bg-white text-[#2D6B3F] shadow-md hover:shadow-lg transition-all">
          查看接口文档 →
        </button>
      </div>
      <button onClick={() => openModal('✅', '保存成功', '系统设置已保存并生效。')} className="px-8 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">保存设置</button>
    </div>
  );
}
