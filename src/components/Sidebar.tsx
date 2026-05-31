import { useStore } from '@/store/useStore';
import type { UserRole, MenuItem } from '@/types';

const MENUS: Record<UserRole, MenuItem[]> = {
  teacher: [
    { id: 'home', name: '首页监控', icon: '📊' },
    { id: 'alerts', name: '预警管理', icon: '🔔' },
    { id: 'students', name: '学生管理', icon: '👦' },
    { id: 'devices', name: '设备管理', icon: '⌚' },
    { id: 'chat', name: '家校沟通', icon: '💬' },
    { id: 'medical', name: '病历记录', icon: '📝' },
    { id: 'consultation', name: '远程会诊', icon: '📹' },
    { id: 'iep', name: 'IEP计划', icon: '🎯' },
    { id: 'resources', name: '资源库', icon: '📚' },
    { id: 'expert-forum', name: '专家论坛', icon: '👨‍⚕️' },
  ],
  parent: [
    { id: 'child', name: '孩子监测', icon: '👶' },
    { id: 'mood', name: '情绪日记', icon: '😊' },
    { id: 'medical', name: '病历记录', icon: '📝' },
    { id: 'forum', name: '家长论坛', icon: '👥' },
    { id: 'chat', name: '联系老师', icon: '💬' },
    { id: 'consult', name: '专家咨询', icon: '👨‍⚕️' },
    { id: 'consultation', name: '远程会诊', icon: '📹' },
    { id: 'iep', name: '成长计划', icon: '🎯' },
    { id: 'resources', name: '资源库', icon: '📚' },
  ],
  admin: [
    { id: 'feedback', name: '意见反馈', icon: '📋' },
    { id: 'invite', name: '邀请专家', icon: '📧' },
    { id: 'ai-config', name: 'AI接口配置', icon: '🤖' },
    { id: 'system', name: '系统设置', icon: '⚙️' },
    { id: 'expert-forum', name: '专家论坛', icon: '💬' },
    { id: 'resources', name: '资源管理', icon: '📚' },
    { id: 'api-docs', name: '接口文档', icon: '🔌' },
  ],
  expert: [
    { id: 'center', name: '专家中心', icon: '🏥' },
    { id: 'medical', name: '病历分析', icon: '📊' },
    { id: 'consult', name: '咨询请求', icon: '💬' },
    { id: 'expert-forum', name: '专家论坛', icon: '📋' },
    { id: 'profile', name: '我的专业', icon: '👤' },
    { id: 'resources', name: '资源分享', icon: '📚' },
  ],
};

const ROLE_TITLES: Record<UserRole, string> = { teacher: '教师工作台', parent: '家长守护中心', admin: '管理控制台', expert: '专家工作站' };

export default function Sidebar() {
  const { role, currentPage, setPage, currentUser, logout, registeredUsers, showAvatarPicker, setPage: _ } = useStore();
  if (!role) return null;
  const user = registeredUsers.find(u => u.username === currentUser);
  const menus = MENUS[role] || [];
  const avatar = user?.avatar || `/avatars/${role}.png`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[250px] flex flex-col overflow-hidden" style={{ zIndex: 50, background: 'linear-gradient(180deg, #FAFBF7 0%, #F5F5EE 100%)' }}>
      <div className="absolute right-0 top-0 bottom-0 w-3 pointer-events-none" style={{ background: 'linear-gradient(to right, transparent, rgba(45,107,63,0.03))' }} />
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full shadow-sm" />
        <div><div className="text-[#2D6B3F] font-bold text-sm leading-tight" style={{ fontFamily: '"Noto Serif SC", serif' }}>家校智联</div><div className="text-[10px] text-[#8B6914]">{ROLE_TITLES[role]}</div></div>
      </div>
      <div className="px-5 py-3 border-b border-[#E8E8E0]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D4A843]/30 cursor-pointer hover:ring-[#D4A843]" onClick={() => useStore.setState({ showAvatarPicker: true, avatarTarget: 'self' })} />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#2D6B3F] rounded-full flex items-center justify-center cursor-pointer" onClick={() => useStore.setState({ showAvatarPicker: true, avatarTarget: 'self' })}><span className="text-[8px] text-white">✎</span></div>
          </div>
          <div className="flex-1 min-w-0"><div className="text-[#2A2A2A] text-sm font-medium truncate">{user?.realName || currentUser}</div><div className="text-[#8B6914] text-[10px]">{role === 'teacher' ? '特级干预师' : role === 'parent' ? '守护家长' : role === 'expert' ? '认证专家' : '系统管理员'}</div></div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {menus.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 group ${currentPage === item.id ? 'bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md' : 'text-[#5A5A5A] hover:text-[#2D6B3F] hover:bg-[#E8F5E8]/60'}`}>
            {currentPage === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] flex-shrink-0" />}
            <span className="text-base">{item.icon}</span><span className="font-medium text-[13px]">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="px-3 pb-5 pt-2">
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#5A5A5A] hover:text-red-600 hover:bg-red-50 transition-all">
          <span>🚪</span><span className="text-[13px]">退出登录</span>
        </button>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9998 }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => useStore.setState({ showAvatarPicker: false, avatarTarget: null })} />
          <div className="bg-white rounded-3xl p-6 w-[360px] relative shadow-2xl" style={{ zIndex: 1 }}>
            <h3 className="text-lg font-semibold text-[#2D6B3F] mb-4">选择头像</h3>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {['👨','👩','👦','👧','👨‍⚕️','👩‍⚕️','👨‍🏫','👩‍🏫','🧑','🧒','👴','👵','🧑‍🎓','👶','🧑‍🔬','🧑‍🌾'].map((emoji, i) => (
                <button key={i} onClick={() => {
                  const state = useStore.getState();
                  if (state.avatarTarget === 'self' && state.currentUser) { state.updateUserAvatar(state.currentUser, `https://api.dicebear.com/7.x/avataaars/svg?seed=${emoji}${state.currentUser}`); }
                  else if (state.avatarTarget === 'child' && state.avatarTargetChild) { const child = state.students.find((st: typeof state.students[0]) => st.name === state.avatarTargetChild); if (child) state.updateChildAvatar(child.id, `https://api.dicebear.com/7.x/avataaars/svg?seed=${emoji}${child.name}`); }
                  useStore.setState({ showAvatarPicker: false, avatarTarget: null, avatarTargetChild: null });
                }} className="w-14 h-14 rounded-xl bg-[#F5F5EE] flex items-center justify-center text-2xl hover:bg-[#E8F5E8] hover:ring-2 ring-[#2D6B3F] transition-all">
                  {emoji}
                </button>
              ))}
            </div>
            <button onClick={() => useStore.setState({ showAvatarPicker: false, avatarTarget: null })} className="w-full py-2 rounded-xl bg-[#F5F5EE] text-[#5A5A50] text-sm hover:bg-[#E8E8D8]">取消</button>
          </div>
        </div>
      )}
    </aside>
  );
}
