import { useStore } from '@/store/useStore';

export default function ExpertDetailPage() {
  const { experts, viewingExpertDetail, setPage, openModal, openConfirm } = useStore();
  const expert = experts.find(e => e.name === viewingExpertDetail) || experts[0];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => setPage('expert-forum')} className="flex items-center gap-2 text-sm text-[#5A5A50] hover:text-[#2D6B3F] transition-colors">
        ← 返回专家论坛
      </button>

      {/* Expert Profile Header */}
      <div className="bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] rounded-3xl p-8 text-white">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
            {expert?.avatar ? <img src={expert.avatar} className="w-full h-full object-cover" alt="" /> : '👨‍⚕️'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>{expert?.name}</h1>
            <p className="text-sm opacity-80 mb-3">{expert?.specialty}</p>
            <div className="flex flex-wrap gap-3 text-xs opacity-70">
              <span>🏥 {expert?.hospital || '暂无医院信息'}</span>
              <span>🎓 {expert?.education || '暂无学历信息'}</span>
              <span>📞 {expert?.contact || '暂无联系方式'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">¥{expert?.rate}</div>
            <div className="text-xs opacity-70">/小时</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Basic Info */}
        <div className="space-y-6">
          {/* Professional Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
            <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">👨‍⚕️ 专业信息</h3>
            <div className="space-y-3">
              {[
                { k: '专业领域', v: expert?.specialty },
                { k: '从业经验', v: `${expert?.experience} 年` },
                { k: '资质认证', v: expert?.certification },
                { k: '所属医院', v: expert?.hospital },
                { k: '最高学历', v: expert?.education },
                { k: '咨询费率', v: `¥${expert?.rate}/小时` },
                { k: '出诊时间', v: expert?.workSchedule },
              ].map(item => (
                <div key={item.k} className="flex justify-between py-2 border-b border-[#F0F0E8] last:border-0">
                  <span className="text-[#8B8B80] text-sm">{item.k}</span>
                  <span className="font-medium text-sm text-[#2A2A2A]">{item.v || '暂无'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
            <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">📞 联系方式</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-[#8B8B80] text-sm">电话</span>
                <span className="font-medium text-sm text-[#2A2A2A]">{expert?.contact || '暂无'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8B8B80] text-sm">工作单位</span>
                <span className="font-medium text-sm text-[#2A2A2A]">{expert?.hospital || '暂无'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8B8B80] text-sm">出诊安排</span>
                <span className="font-medium text-sm text-[#2A2A2A]">{expert?.workSchedule || '暂无'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Intro & Publications */}
        <div className="space-y-6">
          {/* Introduction */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
            <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">📝 专家介绍</h3>
            <p className="text-sm text-[#5A5A50] leading-relaxed">{expert?.intro || '暂无介绍'}</p>
          </div>

          {/* Publications */}
          {expert?.publications && expert.publications.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
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

          {/* Work Schedule */}
          {expert?.workSchedule && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E8D8]">
              <h3 className="text-[#2D6B3F] font-semibold mb-4 text-sm">📅 出诊时间</h3>
              <div className="bg-[#F5F5EE] rounded-xl p-4 text-center">
                <p className="text-sm text-[#2A2A2A] font-medium">{expert.workSchedule}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            useStore.setState({ currentConsultExpertId: expert?.id || 0 });
            openConfirm(`确定要向 ${expert?.name} 发起咨询请求吗？`, () => {
              useStore.getState().submitConsultRequest(`希望咨询关于${expert?.specialty}的相关问题`, '待商议');
              openModal('✅', '请求已发送', `已向 ${expert?.name} 发送咨询请求\n等待专家确认中...`);
            });
          }}
          className="px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          💬 发起咨询
        </button>
        <button onClick={() => openModal('📞', '预约电话', `${expert?.name} 的联系方式：\n${expert?.contact || '暂无电话'}\n\n工作时间：${expert?.workSchedule || '待确认'}`)} className="px-6 py-3 rounded-full text-sm font-medium bg-[#F5F5EE] text-[#5A5A50] border border-[#E8E8D8] hover:bg-[#E8E8D8] transition-all flex items-center gap-2">
          📞 预约电话
        </button>
        <button onClick={() => setPage('expert-forum')} className="px-6 py-3 rounded-full text-sm font-medium bg-[#F5F5EE] text-[#5A5A50] border border-[#E8E8D8] hover:bg-[#E8E8D8] transition-all">
          ← 返回论坛
        </button>
      </div>
    </div>
  );
}
