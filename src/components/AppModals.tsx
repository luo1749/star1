import { useStore } from '@/store/useStore';

export function AppModal() {
  const { showModal, modalContent, closeModal } = useStore();
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
      <div className="glass-card rounded-3xl p-8 w-[420px] max-w-[90vw] text-center relative" style={{ zIndex: 1 }}>
        <div className="text-5xl mb-4">{modalContent.icon}</div>
        <div className="text-white text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>{modalContent.title}</div>
        <div className="text-white/70 text-sm whitespace-pre-line leading-relaxed mb-6">{modalContent.content}</div>
        <button onClick={closeModal} className="btn-main px-8 py-2.5 text-sm">确定</button>
      </div>
    </div>
  );
}

export function ConfirmModal() {
  const { showConfirmModal, confirmContent, closeConfirm, executeConfirm } = useStore();
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeConfirm} />
      <div className="bg-white rounded-3xl p-8 w-[360px] text-center relative shadow-2xl" style={{ zIndex: 1 }}>
        <div className="text-5xl mb-4">⚠️</div>
        <div className="text-[#2A2A2A] text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>确认操作</div>
        <div className="text-[#5A5A50] text-sm mb-6">{confirmContent}</div>
        <div className="flex gap-3">
          <button onClick={closeConfirm} className="flex-1 py-2.5 rounded-xl bg-[#F5F5EE] text-[#5A5A50] hover:bg-[#E8E8D8] transition-colors text-sm font-medium border border-[#E8E8D8]">取消</button>
          <button onClick={executeConfirm} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] text-white hover:shadow-lg transition-all text-sm font-medium">确定</button>
        </div>
      </div>
    </div>
  );
}
