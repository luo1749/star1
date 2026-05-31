import { useState } from 'react';
import { useStore } from '@/store/useStore';

/* ===================== EXPERT CENTER ===================== */
export function ExpertCenterPage() {
  const { medicalRecords, consultationRequests, medicalComments, currentUser, openModal } = useStore();
  const pendingReqs = consultationRequests.filter(c => c.status === 'pending' && c.expert === currentUser);
  const activeReqs = consultationRequests.filter(c => c.status === 'accepted' && c.expert === currentUser);
  const myComments = medicalComments.filter(c => c.expert === currentUser);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>专家中心</h2><p className="text-sm text-[#8B8B80] mt-1">个人工作台 · 数据概览 · 病历协作</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '📊', value: medicalRecords.filter(r => r.isPublic).length, label: '公开病历' },
          { icon: '💬', value: pendingReqs.length, label: '待处理咨询' },
          { icon: '🤝', value: activeReqs.length, label: '进行中咨询' },
          { icon: '📝', value: myComments.length, label: '提供意见' },
        ].map((s, i) => (
          <div key={i} className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 bg-gradient-to-br from-[#2D6B3F] to-[#3A7D4A] text-white shadow-sm">{s.icon}</div>
            <div className="text-3xl font-bold text-[#2A2A2A] mb-1" style={{ fontFamily: '"Inter", monospace' }}>{s.value}</div>
            <div className="text-sm text-[#8B8B80]">{s.label}</div>
          </div>
        ))}
      </div>

      <h3 className="text-lg text-[#2D6B3F] font-semibold mt-6">待处理咨询</h3>
      {pendingReqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-[#E8E8D8]"><div className="text-4xl mb-3 opacity-30">🎉</div><div className="text-[#8B8B80]">暂无待处理咨询</div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingReqs.map(c => (
            <div key={c.id} className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm">
              <div className="flex justify-between mb-3"><span className="font-semibold text-[#2A2A2A]">{c.parent} · {c.student}</span><span className="px-3 py-1 rounded-full text-xs bg-[#FFF0D0] text-[#8B6914]">待处理</span></div>
              <p className="text-sm text-[#5A5A50] mb-1">{c.description}</p>
              <div className="text-xs text-[#8B8B80] mb-3">{c.requestTime}</div>
              <div className="flex gap-2">
                <button onClick={() => { useStore.setState({ currentPage: 'consult' }); }} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white text-xs shadow-md hover:shadow-lg transition-all">接受咨询</button>
                <button onClick={() => { useStore.getState().rejectConsultation(c.id); openModal('❌', '已拒绝', `已拒绝「${c.parent}」的咨询请求`); }} className="flex-1 px-4 py-2 rounded-xl bg-[#F5F5EE] text-[#5A5A50] text-xs hover:bg-[#FFE0D8] transition-colors">拒绝</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Medical Records Needing Attention */}
      <h3 className="text-lg text-[#2D6B3F] font-semibold mt-6">需要关注的病历</h3>
      <div className="space-y-3">
        {medicalRecords.filter(r => r.isPublic).slice(0, 5).map(r => (
          <div key={r.id} className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E8D8]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-[#2A2A2A] text-sm">{r.student}</span>
                <span className="text-xs text-[#8B8B80] ml-2">{r.date}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E8F5E8] text-[#2D6B3F]">公开</span>
            </div>
            <h4 className="text-[#2D6B3F] font-medium text-sm mb-1">{r.title}</h4>
            <p className="text-xs text-[#5A5A50] line-clamp-2">{r.content}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] text-[#8B8B80]">老师措施：{r.teacherActions?.length || 0}</span>
              <span className="text-[10px] text-[#8B8B80]">家长措施：{r.parentActions?.length || 0}</span>
              <span className="text-[10px] text-[#8B8B80]">专家措施：{r.expertActions?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== EXPERT MEDICAL PAGE (with action records) ===================== */
export function ExpertMedicalPage() {
  const { medicalRecords, medicalComments, addMedicalComment, addMedicalAction, openModal } = useStore();
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [publicFlags, setPublicFlags] = useState<Record<number, boolean>>({});
  const [actionInputs, setActionInputs] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const visibleRecords = medicalRecords.filter(r => r.isPublic);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>病历分析</h2>
        <p className="text-sm text-[#8B8B80] mt-1">查看公开病历 · 提供专业意见 · 添加专家措施</p>
      </div>

      {visibleRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-[#E8E8D8]"><div className="text-4xl mb-3 opacity-30">📋</div><div className="text-[#8B8B80]">暂无公开病历</div></div>
      ) : (
        <div className="space-y-4">
          {visibleRecords.map(r => {
            const comments = medicalComments.filter(c => c.recordId === r.id);
            const isExpanded = expandedId === r.id;
            const hasExpertActions = r.expertActions && r.expertActions.length > 0;

            return (
              <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#2A2A2A]">{r.student}</span>
                      <span className="text-xs text-[#8B8B80]">{r.date}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E8F5E8] text-[#2D6B3F]">公开</span>
                    </div>
                    <h3 className="text-[#2D6B3F] font-medium text-sm">{r.title}</h3>
                  </div>
                  <button onClick={() => setExpandedId(isExpanded ? null : r.id)} className="px-3 py-1.5 rounded-xl bg-[#F5F5EE] text-xs text-[#5A5A50] hover:bg-[#E8E8D8] transition-colors">
                    {isExpanded ? '收起' : '展开'}
                  </button>
                </div>

                <p className="text-sm text-[#5A5A50] mb-3">{r.content}</p>

                <div className="bg-[#E8F5E8] rounded-xl p-3 mb-2">
                  <div className="text-xs text-[#2D6B3F] font-medium mb-1">🤖 AI分析</div>
                  <p className="text-xs text-[#5A5A50]">{r.aiSolution}</p>
                </div>

                {r.parentSolution && (
                  <div className="bg-[#E8F0F8] rounded-xl p-3 mb-2">
                    <div className="text-xs text-[#1565C0] font-medium mb-1">👩 家长反馈</div>
                    <p className="text-xs text-[#5A5A50]">{r.parentSolution}</p>
                  </div>
                )}

                <div className="bg-[#FFF0D0] rounded-xl p-3 mb-3">
                  <div className="text-xs text-[#8B6914] font-medium mb-1">👨‍⚕️ {r.expertName}建议</div>
                  <p className="text-xs text-[#5A5A50]">{r.expertSolution}</p>
                </div>

                {/* Expert Comments */}
                {comments.length > 0 && comments.map(c => (
                  <div key={c.id} className={`rounded-xl p-3 mb-2 ${c.isPublic ? 'bg-[#E8F5E8]' : 'bg-[#FFF0D0]'}`}>
                    <div className="flex justify-between mb-1"><strong className="text-xs">{c.expert}</strong><span className="text-[10px] text-[#8B8B80]">{c.isPublic ? '公开' : '私密'}</span></div>
                    <p className="text-xs text-[#5A5A50]">{c.content}</p>
                  </div>
                ))}

                {/* Expanded: All Actions + Add Expert Action */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#F0F0E8] space-y-4">
                    {/* Teacher Actions */}
                    {r.teacherActions && r.teacherActions.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-[#2D6B3F] mb-2">👨‍🏫 老师采取措施 ({r.teacherActions.length})</h5>
                        <div className="space-y-2">
                          {r.teacherActions.map(a => (
                            <div key={a.id} className="bg-[#E8F5E8] rounded-xl p-3">
                              <div className="flex justify-between mb-1"><span className="text-xs font-medium text-[#2D6B3F]">{a.author}</span><span className="text-[10px] text-[#8B8B80]">{a.time}</span></div>
                              <p className="text-xs text-[#5A5A50]">{a.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Parent Actions */}
                    {r.parentActions && r.parentActions.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-[#1565C0] mb-2">👩 家长采取措施 ({r.parentActions.length})</h5>
                        <div className="space-y-2">
                          {r.parentActions.map(a => (
                            <div key={a.id} className="bg-[#E8F0F8] rounded-xl p-3">
                              <div className="flex justify-between mb-1"><span className="text-xs font-medium text-[#1565C0]">{a.author}</span><span className="text-[10px] text-[#8B8B80]">{a.time}</span></div>
                              <p className="text-xs text-[#5A5A50]">{a.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expert Actions */}
                    {hasExpertActions && (
                      <div>
                        <h5 className="text-xs font-medium text-[#8B6914] mb-2">👨‍⚕️ 专家采取措施 ({r.expertActions!.length})</h5>
                        <div className="space-y-2">
                          {r.expertActions!.map(a => (
                            <div key={a.id} className="bg-[#FFF8E0] rounded-xl p-3">
                              <div className="flex justify-between mb-1"><span className="text-xs font-medium text-[#8B6914]">{a.author}</span><span className="text-[10px] text-[#8B8B80]">{a.time}</span></div>
                              <p className="text-xs text-[#5A5A50]">{a.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Expert Action */}
                    <div className="pt-2">
                      <div className="flex gap-2">
                        <input
                          value={actionInputs[r.id] || ''}
                          onChange={e => setActionInputs({ ...actionInputs, [r.id]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && actionInputs[r.id]?.trim() && (addMedicalAction(r.id, actionInputs[r.id]!, 'expert'), setActionInputs({ ...actionInputs, [r.id]: '' }), openModal('✅', '添加成功', '专家措施已添加'))}
                          placeholder="作为专家输入建议采取的措施..."
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]"
                        />
                        <button
                          onClick={() => { if (actionInputs[r.id]?.trim()) { addMedicalAction(r.id, actionInputs[r.id]!, 'expert'); setActionInputs({ ...actionInputs, [r.id]: '' }); openModal('✅', '添加成功', '专家措施已添加'); } }}
                          className="px-5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-[#8B6914] to-[#D4A843] text-white shadow-md hover:shadow-lg transition-all"
                        >
                          添加措施
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Comment */}
                <div className="mt-3 pt-3 border-t border-[#F0F0E8]">
                  <textarea value={commentInputs[r.id] || ''} onChange={e => setCommentInputs(p => ({ ...p, [r.id]: e.target.value }))} placeholder="分享您的专业意见..." rows={2} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 resize-none border border-[#E8E8D8] mb-2" />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-[#5A5A50]"><input type="checkbox" checked={publicFlags[r.id] ?? true} onChange={e => setPublicFlags(p => ({ ...p, [r.id]: e.target.checked }))} /> 公开此意见</label>
                    <button onClick={() => { const c = commentInputs[r.id]; if (!c?.trim()) return; addMedicalComment(r.id, c.trim(), publicFlags[r.id] ?? true); setCommentInputs(p => ({ ...p, [r.id]: '' })); openModal('✅', '提交成功', '您的专业意见已提交'); }} className="px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">提交意见</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ===================== EXPERT CONSULT PAGE ===================== */
export function ExpertConsultPage() {
  const { consultationRequests, currentUser, acceptConsultation, rejectConsultation, openModal } = useStore();
  const [agreedTimes, setAgreedTimes] = useState<Record<number, string>>({});
  const [fees, setFees] = useState<Record<number, string>>({});
  const [payments, setPayments] = useState<Record<number, string>>({});

  const pending = consultationRequests.filter(c => c.status === 'pending' && c.expert === currentUser);
  const active = consultationRequests.filter(c => c.status === 'accepted' && c.expert === currentUser);

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>咨询请求</h2><p className="text-sm text-[#8B8B80] mt-1">管理家长咨询请求 · 安排咨询时间</p></div>

      <h3 className="text-lg text-[#2D6B3F] font-semibold">待处理 ({pending.length})</h3>
      {pending.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-[#E8E8D8]"><div className="text-4xl mb-3 opacity-30">🎉</div><div className="text-[#8B8B80]">暂无待处理请求</div></div>
      ) : (
        <div className="space-y-4">
          {pending.map(c => (
            <div key={c.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
              <div className="flex justify-between mb-3"><span className="font-semibold text-[#2A2A2A]">{c.parent} · {c.student}</span><span className="px-3 py-1 rounded-full text-xs bg-[#FFF0D0] text-[#8B6914]">待处理</span></div>
              <p className="text-sm text-[#5A5A50] mb-1"><strong>问题：</strong>{c.description}</p>
              <p className="text-sm text-[#5A5A50] mb-4"><strong>首选时间：</strong>{c.preferredTime}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input value={agreedTimes[c.id] || ''} onChange={e => setAgreedTimes(p => ({ ...p, [c.id]: e.target.value }))} placeholder="约定咨询时间" className="px-4 py-2 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
                <input value={fees[c.id] || ''} onChange={e => setFees(p => ({ ...p, [c.id]: e.target.value }))} placeholder="咨询费用" type="number" className="px-4 py-2 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
              </div>
              <select value={payments[c.id] || '支付宝'} onChange={e => setPayments(p => ({ ...p, [c.id]: e.target.value }))} className="w-full px-4 py-2 rounded-xl bg-[#F5F5EE] text-sm mb-4 border border-[#E8E8D8]"><option>支付宝</option><option>微信支付</option><option>银行转账</option></select>
              <div className="flex gap-2">
                <button onClick={() => { const t = agreedTimes[c.id]; const f = Number(fees[c.id]); if (!t || !f || f <= 0) { openModal('⚠️', '提示', '请填写有效的咨询时间和费用'); return; } acceptConsultation(c.id, t, f, payments[c.id] || '支付宝'); openModal('✅', '已接受', `已接受「${c.parent}」的咨询请求\n约定时间：${t}\n咨询费用：¥${f}`); }} className="px-6 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">接受咨询</button>
                <button onClick={() => { rejectConsultation(c.id); openModal('❌', '已拒绝', `已拒绝「${c.parent}」的咨询请求`); }} className="px-6 py-2 rounded-xl bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#FFE0D8] transition-colors">拒绝</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg text-[#2D6B3F] font-semibold mt-6">进行中 ({active.length})</h3>
      {active.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-[#E8E8D8]"><div className="text-4xl mb-3 opacity-30">💬</div><div className="text-[#8B8B80]">暂无进行中咨询</div></div>
      ) : (
        <div className="space-y-4">
          {active.map(c => (
            <div key={c.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
              <div className="flex justify-between mb-3"><span className="font-semibold text-[#2A2A2A]">{c.parent} · {c.student}</span><span className="px-3 py-1 rounded-full text-xs bg-[#E8F5E8] text-[#2D6B3F]">进行中</span></div>
              <p className="text-sm text-[#5A5A50] mb-1"><strong>问题：</strong>{c.description}</p>
              <p className="text-sm text-[#5A5A50] mb-1"><strong>时间：</strong>{c.agreedTime}</p>
              <p className="text-sm text-[#5A5A50] mb-3"><strong>费用：</strong>¥{c.fee} · {c.isPaid ? '✅ 已支付' : '⏳ 待支付'}</p>
              <button onClick={() => openModal('🎥', '开始咨询', `正在启动与「${c.parent}」的视频咨询...\n\n学生：${c.student}\n问题：${c.description}`)} className="px-6 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">开始咨询</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== EXPERT PROFILE PAGE ===================== */
export function ExpertProfilePage() {
  const { currentUser, experts, expertForumPosts, editingProfile, openModal } = useStore();
  const expert = experts.find(e => e.name === currentUser);
  const myPosts = expertForumPosts.filter(p => p.author === currentUser);

  if (editingProfile) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>编辑专业资料</h2>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8] max-w-lg">
          {[{ k: 'specialty', l: '专业领域' }, { k: 'experience', l: '从业经验（年）', type: 'number' }, { k: 'rate', l: '咨询费率', type: 'number' }, { k: 'certification', l: '资质认证' }].map(f => (
            <div key={f.k} className="mb-4"><label className="block text-sm text-[#5A5A50] mb-2">{f.l}</label><input type={f.type || 'text'} defaultValue={String(expert?.[f.k as keyof typeof expert] || '')} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" /></div>
          ))}
          <div className="mb-4"><label className="block text-sm text-[#5A5A50] mb-2">个人简介</label><textarea defaultValue={expert?.intro || ''} rows={4} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 resize-none" /></div>
          <div className="flex gap-3">
            <button onClick={() => { useStore.setState({ editingProfile: false }); openModal('✅', '保存成功', '专业资料已更新'); }} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">保存</button>
            <button onClick={() => useStore.setState({ editingProfile: false })} className="px-6 py-2.5 rounded-full bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8] transition-colors border border-[#E8E8D8]">取消</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>我的专业</h2><p className="text-sm text-[#8B8B80] mt-1">个人资料 · 专业展示</p></div>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <img src={expert?.avatar || '/avatars/expert.png'} alt="" className="w-20 h-20 rounded-full object-cover ring-4 ring-[#D4A843]/30" />
            <button onClick={() => useStore.setState({ showAvatarPicker: true, avatarTarget: 'self' })} className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs shadow-md hover:scale-110 transition-transform">📷</button>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2A2A2A]">{currentUser}</div>
            <div className="text-[#2D6B3F]">认证专家 · {expert?.specialty}</div>
            <div className="text-xs text-[#8B8B80] mt-1">🏥 {expert?.hospital} · 🎓 {expert?.education}</div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#2D6B3F] font-semibold text-sm">专业信息</h3>
          <button onClick={() => useStore.setState({ editingProfile: true })} className="px-4 py-2 rounded-xl bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8] transition-colors border border-[#E8E8D8]">编辑</button>
        </div>
        <div className="space-y-3">
          {[
            { k: '专业领域', v: expert?.specialty },
            { k: '从业经验', v: `${expert?.experience || 0}年` },
            { k: '咨询费率', v: `¥${expert?.rate || 0}/小时`, h: true },
            { k: '资质认证', v: expert?.certification },
            { k: '所属医院', v: expert?.hospital },
            { k: '出诊时间', v: expert?.workSchedule },
          ].map(item => (
            <div key={item.k} className="flex justify-between py-2 border-b border-[#F0F0E8] last:border-0">
              <span className="text-[#8B8B80] text-sm">{item.k}</span>
              <span className={`font-medium text-sm ${item.h ? 'text-[#2D6B3F]' : 'text-[#2A2A2A]'}`}>{item.v || '暂无'}</span>
            </div>
          ))}
        </div>
        {expert?.intro && <p className="text-sm text-[#5A5A50] mt-4 leading-relaxed">{expert.intro}</p>}
      </div>

      {/* Publications */}
      {expert?.publications && expert.publications.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
          <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">📚 学术成果</h3>
          <div className="space-y-3">
            {expert.publications.map((pub, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#F5F5EE] rounded-xl p-3">
                <span className="text-[#D4A843] font-bold text-sm">{i + 1}</span>
                <span className="text-sm text-[#2A2A2A]">{pub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
        <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">我的见解 ({myPosts.length})</h3>
        {myPosts.length === 0 ? <div className="text-center py-8 text-[#8B8B80]">暂无发布的见解</div> : (
          <div className="space-y-3">{myPosts.map(p => (
            <div key={p.id} className="bg-[#F5F5EE] rounded-xl p-4">
              <div className="flex justify-between"><span className="font-medium text-sm">{p.title}</span><span className="text-xs text-[#8B8B80]">{p.isPublic ? '公开' : '私密'}</span></div>
              <p className="text-xs text-[#5A5A50] mt-1">{p.content.slice(0, 100)}...</p>
              <div className="flex gap-4 mt-2 text-xs text-[#8B8B80]"><span>❤️ {p.likes}</span><span>💬 {p.comments?.length || 0}</span></div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
