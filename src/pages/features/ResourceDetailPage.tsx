import { useStore } from '@/store/useStore';
import type { ReactElement } from 'react';

export default function ResourceDetailPage() {
  const { resources, viewingResourceId, setPage } = useStore();
  const resource = resources.find(r => r.id === viewingResourceId) || resources[0];
  const typeCfg: Record<string, { icon: string; color: string; label: string }> = {
    article: { icon: '📄', color: 'bg-[#E0E8F0] text-[#1565C0]', label: '文章' },
    video: { icon: '🎬', color: 'bg-[#F0E0F0] text-[#7B4A8B]', label: '视频' },
    tool: { icon: '🛠️', color: 'bg-[#E8F5E8] text-[#2D6B3F]', label: '工具' },
    guide: { icon: '📖', color: 'bg-[#FFF0D0] text-[#8B6914]', label: '指南' },
  };
  const tc = typeCfg[resource?.type || 'article'];

  // Parse markdown-like content to simple HTML
  const renderContent = (content: string) => {
    if (!content) return <p className="text-sm text-[#8B8B80]">暂无详细内容</p>;
    const lines = content.split('\n');
    const elements: ReactElement[] = [];
    let key = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={key++} className="h-3" />);
      } else if (trimmed.startsWith('## ')) {
        elements.push(<h2 key={key++} className="text-lg font-bold text-[#2D6B3F] mt-6 mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>{trimmed.slice(3)}</h2>);
      } else if (trimmed.startsWith('### ')) {
        elements.push(<h3 key={key++} className="text-base font-semibold text-[#3A7D4A] mt-4 mb-2">{trimmed.slice(4)}</h3>);
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        elements.push(<p key={key++} className="text-sm text-[#2A2A2A] font-semibold my-2">{trimmed.slice(2, -2)}</p>);
      } else if (trimmed.startsWith('- ')) {
        elements.push(<li key={key++} className="text-sm text-[#5A5A50] ml-4 my-1">{trimmed.slice(2)}</li>);
      } else if (/^\d+\.\s/.test(trimmed)) {
        elements.push(<li key={key++} className="text-sm text-[#5A5A50] ml-4 my-1">{trimmed.replace(/^\d+\.\s/, '')}</li>);
      } else {
        elements.push(<p key={key++} className="text-sm text-[#5A5A50] leading-relaxed my-1">{trimmed}</p>);
      }
    });
    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => setPage('resources')} className="flex items-center gap-2 text-sm text-[#5A5A50] hover:text-[#2D6B3F] transition-colors">
        ← 返回资源库
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs ${tc.color} bg-white`}>{tc.icon} {tc.label}</span>
          <span className="text-xs opacity-70">{resource?.category}</span>
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>{resource?.title}</h1>
        <p className="text-sm opacity-80 leading-relaxed">{resource?.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {resource?.tags.map(t => <span key={t} className="px-3 py-1 rounded-full text-xs bg-white/20">{t}</span>)}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E8D8]">
        <div className="prose-content">
          {renderContent(resource?.detailContent || '')}
        </div>
      </div>

      {/* Related actions */}
      <div className="flex gap-3">
        <button onClick={() => useStore.getState().openModal('⭐', '收藏成功', `已将「${resource?.title}」添加到收藏夹`)} className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#D4A843] to-[#E8C55A] text-white shadow-md hover:shadow-lg transition-all">⭐ 收藏</button>
        <button onClick={() => useStore.getState().openModal('🔗', '分享', `分享链接已复制：\n家校智联 · ${resource?.title}`)} className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#F5F5EE] text-[#5A5A50] border border-[#E8E8D8] hover:bg-[#E8E8D8] transition-all">🔗 分享</button>
        <button onClick={() => setPage('resources')} className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#F5F5EE] text-[#5A5A50] border border-[#E8E8D8] hover:bg-[#E8E8D8] transition-all">← 返回列表</button>
      </div>
    </div>
  );
}
