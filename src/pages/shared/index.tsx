import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';

/* ===================== CHAT ===================== */
export function ChatPage() {
  const { messages, currentUser, role, friends, addFriend, sendMessage } = useStore();
  const [input, setInput] = useState('');
  const [activeChat, setActiveChat] = useState('陈女士');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatPartners = role === 'teacher' ? ['陈女士', '刘女士', '陈医生'] : role === 'parent' ? friends.length ? friends : ['李老师'] : ['陈女士'];
  const currentMessages = messages[activeChat] || [];

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [currentMessages]);

  const handleSend = () => { if (!input.trim() || !activeChat) return; sendMessage(activeChat, input.trim()); setInput(''); };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm overflow-hidden border border-[#E8E8D8]">
      <div className="w-64 border-r border-[#F0F0E8] flex flex-col">
        <div className="p-4 border-b border-[#F0F0E8]"><h3 className="text-[#2D6B3F] font-semibold text-sm">通讯录</h3></div>
        <div className="flex-1 overflow-y-auto">
          {chatPartners.map(cp => (
            <button key={cp} onClick={() => setActiveChat(cp)} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${activeChat === cp ? 'bg-[#E8F5E8]' : 'hover:bg-[#FAFAF5]'}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8F5E8] to-[#D4E8D4] flex items-center justify-center text-sm">{cp.includes('老师') ? '👨‍🏫' : cp.includes('医生') || cp.includes('专家') || cp.includes('教授') ? '👨‍⚕️' : cp.includes('女士') ? '👩' : '👨'}</div>
              <div className="flex-1 min-w-0"><div className="text-sm font-medium text-[#2A2A2A] truncate">{cp}</div><div className="text-[10px] text-[#8B8B80] truncate">{messages[cp]?.length ? messages[cp]![messages[cp]!.length - 1].content.slice(0, 15) + '...' : '点击开始聊天'}</div></div>
            </button>
          ))}
          {role === 'parent' && ['王老师', '赵老师'].map(name => (
            <button key={name} onClick={() => addFriend(name)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFF0D0] transition-colors text-left opacity-70 hover:opacity-100">
              <div className="w-9 h-9 rounded-full bg-[#FFF0D0] flex items-center justify-center text-sm">👨‍🏫</div>
              <div className="text-sm text-[#5A5A50]">{name} <span className="text-xs text-[#D4A843]">+ 添加</span></div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-[#F0F0E8] flex items-center justify-between">
          <div className="font-semibold text-[#2A2A2A] text-sm">{activeChat}</div>
          <div className="flex gap-2">
            <button onClick={() => useStore.getState().openModal('📞', '语音通话', `正在向「${activeChat}」发起语音通话...`)} className="w-8 h-8 rounded-full hover:bg-[#F5F5EE] flex items-center justify-center text-[#5A5A50] text-sm">📞</button>
            <button onClick={() => useStore.getState().openModal('📹', '视频通话', `正在向「${activeChat}」发起视频通话...`)} className="w-8 h-8 rounded-full hover:bg-[#F5F5EE] flex items-center justify-center text-[#5A5A50] text-sm">📹</button>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentMessages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-[#8B8B80]"><div className="text-5xl mb-4">💬</div><div>开始与 {activeChat} 的对话</div></div> : currentMessages.map(m => (
            <div key={m.id} className={`flex gap-3 ${m.sender === currentUser ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8F5E8] to-[#D4E8D4] flex items-center justify-center text-xs flex-shrink-0">{m.sender === currentUser ? '👤' : activeChat?.includes('老师') ? '👨‍🏫' : '👩'}</div>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${m.sender === currentUser ? 'bg-gradient-to-br from-[#2D6B3F] to-[#3A7D4A] text-white rounded-br-md' : 'bg-[#F5F5EE] text-[#2A2A2A] rounded-bl-md'}`}>
                {m.content}<div className={`text-[10px] mt-1 ${m.sender === currentUser ? 'text-white/60' : 'text-[#8B8B80]'}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-[#F0F0E8]">
          <div className="flex gap-3">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="输入消息..." className="flex-1 px-5 py-3 rounded-full bg-[#F5F5EE] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30 border border-[#E8E8D8]" />
            <button onClick={handleSend} className="px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">发送</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== FORUM ===================== */
export function ForumPage() {
  const { forumPosts, toggleLike, currentUser, createPost, addComment, openModal } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [activeComment, setActiveComment] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>家长论坛</h2><p className="text-sm text-[#8B8B80] mt-1">分享经验 · 互助成长</p></div>
        <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">✏️ 发布帖子</button>
      </div>
      {showCreate && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
          <h3 className="text-lg font-semibold text-[#2D6B3F] mb-4">发布新帖</h3>
          <div className="space-y-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="内容..." rows={4} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] resize-none" />
            <div className="flex gap-3">
              <button onClick={() => { if (title && content) { createPost(title, content); setShowCreate(false); setTitle(''); setContent(''); } else { openModal('⚠️', '提示', '请填写标题和内容'); } }} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">发布</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-full bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8] transition-colors border border-[#E8E8D8]">取消</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {forumPosts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8F5E8] to-[#D4E8D4] flex items-center justify-center text-lg">{post.avatar}</div>
              <div><div className="font-semibold text-[#2A2A2A] text-sm">{post.author}</div><div className="text-xs text-[#8B8B80]">{post.time}</div></div>
            </div>
            <h3 className="text-[#2D6B3F] font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-[#5A5A50] mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm ${post.likedBy.includes(currentUser || '') ? 'text-[#C85A54]' : 'text-[#8B8B80]'} hover:text-[#C85A54] transition-colors`}>❤️ {post.likes}</button>
              <button onClick={() => setActiveComment(activeComment === post.id ? null : post.id)} className="flex items-center gap-1.5 text-sm text-[#8B8B80] hover:text-[#2D6B3F] transition-colors">💬 {post.comments.length}</button>
            </div>
            {activeComment === post.id && (
              <div className="mt-4 pt-4 border-t border-[#F0F0E8]">
                {post.comments.map(c => (
                  <div key={c.id} className="flex gap-3 mb-3"><div className="w-7 h-7 rounded-full bg-[#F5F5EE] flex items-center justify-center text-xs flex-shrink-0">{c.author[0]}</div><div className="bg-[#F8F8F0] rounded-2xl px-4 py-2 text-sm"><span className="font-medium text-[#2A2A2A]">{c.author}：</span><span className="text-[#5A5A50]">{c.content}</span><div className="text-[10px] text-[#8B8B80] mt-1">{c.time}</div></div></div>
                ))}
                <div className="flex gap-2 mt-3">
                  <input value={commentInputs[post.id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })} onKeyDown={e => e.key === 'Enter' && commentInputs[post.id]?.trim() && (addComment(post.id, commentInputs[post.id]!), setCommentInputs({ ...commentInputs, [post.id]: '' }))} placeholder="写下你的评论..." className="flex-1 px-4 py-2 rounded-full bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
                  <button onClick={() => { if (commentInputs[post.id]?.trim()) { addComment(post.id, commentInputs[post.id]!); setCommentInputs({ ...commentInputs, [post.id]: '' }); } }} className="px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white">发送</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== EXPERT FORUM ===================== */
export function ExpertForumPage() {
  const { expertForumPosts, toggleExpertLike, currentUser, createExpertPost, addExpertComment, setPage } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [activeComment, setActiveComment] = useState<number | null>(null);

  const handleExpertClick = (name: string) => {
    useStore.setState({ viewingExpertDetail: name });
    setPage('expertDetail');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>专家论坛</h2><p className="text-sm text-[#8B8B80] mt-1">专家分享 · 专业指导</p></div>
        <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#D4A843] to-[#E8C55A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">✏️ 发布</button>
      </div>
      {showCreate && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
          <h3 className="text-lg font-semibold text-[#2D6B3F] mb-4">发布专家帖</h3>
          <div className="space-y-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="标签（逗号分隔）" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="内容..." rows={4} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] resize-none" />
            <label className="flex items-center gap-2 text-sm text-[#5A5A50]"><input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="rounded" /> 公开可见</label>
            <div className="flex gap-3">
              <button onClick={() => { if (title && content) { createExpertPost(title, tags, content, isPublic); setShowCreate(false); setTitle(''); setContent(''); setTags(''); } }} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#D4A843] to-[#E8C55A] text-white shadow-md hover:shadow-lg transition-all">发布</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-full bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8] transition-colors border border-[#E8E8D8]">取消</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {expertForumPosts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
            <div className="flex items-center gap-3 mb-4">
              <img src={post.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <button onClick={() => handleExpertClick(post.author)} className="font-semibold text-[#2A2A2A] text-sm hover:text-[#2D6B3F] transition-colors">
                  {post.author} 👤
                </button>
                <div className="text-xs text-[#8B8B80]">{post.time}</div>
              </div>
              {post.tags.map(t => <span key={t} className="ml-auto px-3 py-1 rounded-full text-xs bg-[#E8F5E8] text-[#2D6B3F]">{t}</span>)}
            </div>
            <h3 className="text-[#2D6B3F] font-semibold mb-2">{post.title}</h3>
            <p className="text-sm text-[#5A5A50] mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleExpertLike(post.id)} className={`flex items-center gap-1.5 text-sm ${post.likedBy.includes(currentUser || '') ? 'text-[#C85A54]' : 'text-[#8B8B80]'} hover:text-[#C85A54] transition-colors`}>❤️ {post.likes}</button>
              <button onClick={() => setActiveComment(activeComment === post.id ? null : post.id)} className="flex items-center gap-1.5 text-sm text-[#8B8B80] hover:text-[#2D6B3F] transition-colors">💬 {post.comments.length}</button>
              {!post.isPublic && <span className="ml-auto px-2 py-0.5 rounded text-xs bg-[#F5F5EE] text-[#8B8B80]">仅专家可见</span>}
            </div>
            {activeComment === post.id && (
              <div className="mt-4 pt-4 border-t border-[#F0F0E8]">
                {post.comments.map(c => (
                  <div key={c.id} className="flex gap-3 mb-3"><div className="w-7 h-7 rounded-full bg-[#F5F5EE] flex items-center justify-center text-xs flex-shrink-0">{c.author[0]}</div><div className="bg-[#F8F8F0] rounded-2xl px-4 py-2 text-sm"><span className="font-medium text-[#2A2A2A]">{c.author}：</span><span className="text-[#5A5A50]">{c.content}</span><div className="text-[10px] text-[#8B8B80] mt-1">{c.time}</div></div></div>
                ))}
                <div className="flex gap-2 mt-3">
                  <input value={commentInputs[post.id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })} onKeyDown={e => e.key === 'Enter' && commentInputs[post.id]?.trim() && (addExpertComment(post.id, commentInputs[post.id]!), setCommentInputs({ ...commentInputs, [post.id]: '' }))} placeholder="写下你的评论..." className="flex-1 px-4 py-2 rounded-full bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
                  <button onClick={() => { if (commentInputs[post.id]?.trim()) { addExpertComment(post.id, commentInputs[post.id]!); setCommentInputs({ ...commentInputs, [post.id]: '' }); } }} className="px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white">发送</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== MEDICAL PAGE (three-party action records) ===================== */
export function MedicalPage() {
  const { medicalRecords, students, role, currentUser, registeredUsers, addMedicalAction, toggleMedicalRecordPublic, openModal } = useStore();
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionInputs, setActionInputs] = useState<Record<number, string>>({});

  const currentUserData = registeredUsers.find(u => u.username === currentUser);
  const realName = currentUserData?.realName || '';
  const myChildren = students.filter(s => s.parent === realName || s.parent === currentUser);
  const canAddAction = role === 'teacher' || role === 'parent' || role === 'expert';
  const myRole = role as 'teacher' | 'parent' | 'expert';

  const visibleRecords = role === 'parent'
    ? medicalRecords.filter(r => myChildren.some(c => c.name === r.student) || r.isPublic)
    : filter === 'all' ? medicalRecords : medicalRecords.filter(r => r.student === filter);

  const classes = [...new Set(students.map(s => s.name))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>病历记录</h2>
        <p className="text-sm text-[#8B8B80] mt-1">多方协作记录 · 老师/家长/专家均可添加措施</p>
      </div>

      {role !== 'parent' && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-xs font-medium ${filter === 'all' ? 'bg-[#2D6B3F] text-white' : 'bg-white border border-[#E8E8D8] text-[#5A5A50]'}`}>全部</button>
          {classes.slice(0, 10).map(name => <button key={name} onClick={() => setFilter(name)} className={`px-4 py-2 rounded-full text-xs font-medium ${filter === name ? 'bg-[#2D6B3F] text-white' : 'bg-white border border-[#E8E8D8] text-[#5A5A50]'}`}>{name}</button>)}
        </div>
      )}

      <div className="space-y-4">
        {visibleRecords.map(record => {
          const isExpanded = expandedId === record.id;
          const hasTeacherActions = record.teacherActions && record.teacherActions.length > 0;
          const hasParentActions = record.parentActions && record.parentActions.length > 0;
          const hasExpertActions = record.expertActions && record.expertActions.length > 0;
          const totalActions = (record.teacherActions?.length || 0) + (record.parentActions?.length || 0) + (record.expertActions?.length || 0);

          return (
            <div key={record.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#2A2A2A]">{record.student}</span>
                    <span className="text-xs text-[#8B8B80]">{record.date}</span>
                    {record.isPublic ? <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E8F5E8] text-[#2D6B3F]">公开</span> : <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FFE0D8] text-[#C85A54]">私密</span>}
                  </div>
                  <h4 className="text-[#2D6B3F] font-medium text-sm">{record.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {totalActions > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E8F5E8] text-[#2D6B3F]">{totalActions} 条措施</span>}
                  <button onClick={() => setExpandedId(isExpanded ? null : record.id)} className="px-3 py-1.5 rounded-xl bg-[#F5F5EE] text-xs text-[#5A5A50] hover:bg-[#E8E8D8] transition-colors">
                    {isExpanded ? '收起' : '展开'}
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#5A5A50] mb-3">{record.content}</p>

              {/* AI & Expert Solutions */}
              <div className="bg-[#F0F7F0] rounded-2xl p-4 mb-3">
                <div className="text-xs font-medium text-[#2D6B3F] mb-1">🤖 AI分析建议</div>
                <p className="text-xs text-[#5A5A50]">{record.aiSolution}</p>
              </div>
              {record.expertSolution && (
                <div className="bg-[#FFF8E0] rounded-2xl p-4 mb-3">
                  <div className="text-xs font-medium text-[#8B6914] mb-1">👨‍⚕️ {record.expertName} · 专家建议</div>
                  <p className="text-xs text-[#5A5A50]">{record.expertSolution}</p>
                </div>
              )}
              {record.parentSolution && (
                <div className="bg-[#E8F0F8] rounded-2xl p-4 mb-3">
                  <div className="text-xs font-medium text-[#1565C0] mb-1">👩 家长反馈</div>
                  <p className="text-xs text-[#5A5A50]">{record.parentSolution}</p>
                </div>
              )}

              {/* Expanded: Action Records */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#F0F0E8] space-y-4">
                  {/* Teacher Actions */}
                  {hasTeacherActions && (
                    <div>
                      <h5 className="text-xs font-medium text-[#2D6B3F] mb-2">👨‍🏫 老师采取措施 ({record.teacherActions!.length})</h5>
                      <div className="space-y-2">
                        {record.teacherActions!.map(a => (
                          <div key={a.id} className="bg-[#E8F5E8] rounded-xl p-3">
                            <div className="flex justify-between mb-1"><span className="text-xs font-medium text-[#2D6B3F]">{a.author}</span><span className="text-[10px] text-[#8B8B80]">{a.time}</span></div>
                            <p className="text-xs text-[#5A5A50]">{a.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Parent Actions */}
                  {hasParentActions && (
                    <div>
                      <h5 className="text-xs font-medium text-[#1565C0] mb-2">👩 家长采取措施 ({record.parentActions!.length})</h5>
                      <div className="space-y-2">
                        {record.parentActions!.map(a => (
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
                      <h5 className="text-xs font-medium text-[#8B6914] mb-2">👨‍⚕️ 专家采取措施 ({record.expertActions!.length})</h5>
                      <div className="space-y-2">
                        {record.expertActions!.map(a => (
                          <div key={a.id} className="bg-[#FFF8E0] rounded-xl p-3">
                            <div className="flex justify-between mb-1"><span className="text-xs font-medium text-[#8B6914]">{a.author}</span><span className="text-[10px] text-[#8B8B80]">{a.time}</span></div>
                            <p className="text-xs text-[#5A5A50]">{a.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Action */}
                  {canAddAction && (
                    <div className="pt-2">
                      <div className="flex gap-2">
                        <input
                          value={actionInputs[record.id] || ''}
                          onChange={e => setActionInputs({ ...actionInputs, [record.id]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && actionInputs[record.id]?.trim() && (addMedicalAction(record.id, actionInputs[record.id]!, myRole), setActionInputs({ ...actionInputs, [record.id]: '' }), openModal('✅', '添加成功', '措施记录已添加'))}
                          placeholder={`作为${myRole === 'teacher' ? '老师' : myRole === 'parent' ? '家长' : '专家'}输入采取措施...`}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]"
                        />
                        <button
                          onClick={() => { if (actionInputs[record.id]?.trim()) { addMedicalAction(record.id, actionInputs[record.id]!, myRole); setActionInputs({ ...actionInputs, [record.id]: '' }); openModal('✅', '添加成功', '措施记录已添加'); } }}
                          className="px-5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all"
                        >
                          添加措施
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-[#F0F0E8]">
                {role === 'parent' && (
                  <button onClick={() => { toggleMedicalRecordPublic(record.id); openModal('✅', record.isPublic ? '已设为私密' : '已设为公开', record.isPublic ? '该病历仅自己可见' : '该病历对所有家长可见'); }} className="px-3 py-1.5 rounded-xl bg-[#F5F5EE] text-xs text-[#5A5A50] hover:bg-[#E8E8D8] transition-colors">
                    {record.isPublic ? '🔒 设为私密' : '🔓 设为公开'}
                  </button>
                )}
                {role === 'parent' && (
                  <button onClick={() => { useStore.setState({ editingParentSolution: record.id }); openModal('💬', '添加家长反馈', '请在下方输入您的反馈：\n\n您在家观察到的孩子表现、采取的措施、以及需要老师配合的地方。'); }} className="px-3 py-1.5 rounded-xl bg-[#E8F0F8] text-xs text-[#1565C0] hover:bg-[#D0E0F0] transition-colors">
                    💬 添加反馈
                  </button>
                )}
                <span className="ml-auto text-[10px] text-[#8B8B80] self-center">共 {totalActions} 条措施记录</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== CONSULTATION PAGE ===================== */
export function ConsultationPage() {
  const { consultations, currentUser, role, openModal, startConsultation, viewConsultationDetail, createNewConsultation } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<{ student: string; expert: string; type: string; scheduledTime: string; topic: string; notes: string }>({ student: '', expert: '', type: 'video', scheduledTime: '', topic: '', notes: '' });

  const visible = role === 'parent' ? consultations.filter(c => c.parent === currentUser) : role === 'expert' ? consultations.filter(c => c.expert === currentUser) : consultations;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>会诊管理</h2><p className="text-sm text-[#8B8B80] mt-1">远程会诊 · 专家指导</p></div>
        {role !== 'expert' && <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">📅 新建会诊</button>}
      </div>
      {showCreate && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
          <h3 className="text-lg font-semibold text-[#2D6B3F] mb-4">新建会诊</h3>
          <div className="space-y-4">
            <input value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} placeholder="学生姓名" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <input value={form.expert} onChange={e => setForm({ ...form, expert: e.target.value })} placeholder="专家姓名" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'video' | 'audio' | 'chat' })} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]"><option value="video">视频会诊</option><option value="audio">语音会诊</option><option value="chat">文字会诊</option></select>
            <input type="datetime-local" value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="会诊主题" className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8]" />
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="情况说明..." rows={3} className="w-full px-4 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] resize-none" />
            <div className="flex gap-3">
              <button onClick={() => { if (form.student && form.expert && form.topic) { createNewConsultation({ ...form, type: form.type as 'video' | 'audio' | 'chat' }); setShowCreate(false); setForm({ student: '', expert: '', type: 'video', scheduledTime: '', topic: '', notes: '' }); openModal('✅', '创建成功', '会诊已创建'); } }} className="px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">创建</button>
              <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-full bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8] transition-colors border border-[#E8E8D8]">取消</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {visible.map(c => (
          <div key={c.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: c.type === 'video' ? 'linear-gradient(135deg, #2D6B3F, #3A7D4A)' : c.type === 'audio' ? 'linear-gradient(135deg, #1565C0, #42A5F5)' : 'linear-gradient(135deg, #D4A843, #E8C55A)' }}>{c.type === 'video' ? '📹' : c.type === 'audio' ? '📞' : '💬'}</div>
              <div><div className="font-semibold text-[#2A2A2A] text-sm">{c.topic}</div><div className="text-xs text-[#8B8B80]">{c.student} · {c.expert} · {new Date(c.scheduledTime).toLocaleString('zh-CN')}</div></div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs ${c.status === 'completed' ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#FFF0D0] text-[#8B6914]'}`}>{c.status === 'completed' ? '已完成' : '待开始'}</span>
              {c.status === 'scheduled' && <button onClick={() => startConsultation(c.id)} className="px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all">开始</button>}
              <button onClick={() => viewConsultationDetail(c.id)} className="px-3 py-2 rounded-xl bg-[#F5F5EE] text-xs text-[#5A5A50] hover:bg-[#E8E8D8] transition-colors">详情</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== RESOURCES PAGE (click to detail) ===================== */
export function ResourcesPage() {
  const { resources, setPage } = useStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const categories = ['all', '自闭症', '感统训练', '辅助工具', '社交训练', '言语治疗', '情绪管理', '沟通训练', '注意力', '睡眠', '饮食'];
  const filtered = resources.filter(r => { const mc = filter === 'all' || r.category === filter || r.tags.some(t => t.includes(filter)); const ms = !search || r.title.includes(search) || r.description.includes(search); return mc && ms; });
  const typeCfg: Record<string, { icon: string; color: string; label: string }> = { article: { icon: '📄', color: 'bg-[#E0E8F0] text-[#1565C0]', label: '文章' }, video: { icon: '🎬', color: 'bg-[#F0E0F0] text-[#7B4A8B]', label: '视频' }, tool: { icon: '🛠️', color: 'bg-[#E8F5E8] text-[#2D6B3F]', label: '工具' }, guide: { icon: '📖', color: 'bg-[#FFF0D0] text-[#8B6914]', label: '指南' } };

  const handleCardClick = (id: number) => {
    useStore.setState({ viewingResourceId: id });
    setPage('resourceDetail');
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>资源库</h2><p className="text-sm text-[#8B8B80] mt-1">专业康复资源 · 持续更新 · 点击卡片查看详情</p></div>
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E8D8]">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索资源..." className="w-full px-5 py-3 rounded-xl bg-[#F5F5EE] text-sm border border-[#E8E8D8] focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === c ? 'bg-[#2D6B3F] text-white' : 'bg-white text-[#5A5A50] border border-[#E8E8D8] hover:border-[#D4A843]'}`}>{c === 'all' ? '全部' : c}</button>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(r => {
          const tc = typeCfg[r.type];
          return (
            <div key={r.id} className="rounded-3xl p-6 bg-[#FAFBF7] border border-[#E8E8E0] shadow-sm hover:shadow-lg transition-all cursor-pointer group" onClick={() => handleCardClick(r.id)}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs ${tc.color} flex items-center gap-1`}>{tc.icon} {tc.label}</span>
                <span className="text-xs text-[#8B8B80] opacity-0 group-hover:opacity-100 transition-opacity">查看详情 →</span>
              </div>
              <h3 className="font-semibold text-[#2D6B3F] mb-2 group-hover:text-[#3A7D4A] transition-colors text-sm">{r.title}</h3>
              <p className="text-sm text-[#5A5A50] mb-4 leading-relaxed">{r.description}</p>
              <div className="flex flex-wrap gap-2">{r.tags.map(t => <span key={t} className="px-2 py-1 rounded-full text-[10px] bg-[#F5F5EE] text-[#5A5A50]">{t}</span>)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
