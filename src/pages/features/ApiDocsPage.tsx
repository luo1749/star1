import { useState } from 'react';
import { useStore } from '@/store/useStore';

const API_ENDPOINTS = [
  {
    category: '智能手表数据采集',
    endpoints: [
      { method: 'POST', path: '/api/v2/watch/data/upload', desc: '上传智能手表实时数据（心率、体温、步数、GPS）', params: 'student_id, heart_rate, body_temp, steps, latitude, longitude, timestamp, battery', response: '{ "code": 200, "message": "数据上传成功" }' },
      { method: 'GET', path: '/api/v2/watch/data/{student_id}', desc: '获取指定学生的最新手表数据', params: 'student_id (路径参数)', response: '{ "heart_rate": 85, "body_temp": 36.5, "steps": 1250, "location": "教室A", "battery": 85, "timestamp": "2024-05-28T10:30:00Z" }' },
      { method: 'GET', path: '/api/v2/watch/data/{student_id}/history', desc: '获取历史数据（支持时间范围筛选）', params: 'student_id, start_date, end_date, page, page_size', response: '{ "total": 365, "data": [...], "page": 1, "page_size": 30 }' },
      { method: 'POST', path: '/api/v2/watch/alert', desc: '手表端异常自动上报', params: 'student_id, alert_type, level, message, data_snapshot', response: '{ "code": 200, "alert_id": 12345 }' },
      { method: 'GET', path: '/api/v2/watch/devices', desc: '获取所有绑定设备列表', params: 'page, page_size, status (online/offline)', response: '{ "total": 24, "devices": [...] }' },
    ]
  },
  {
    category: '微信小程序接口',
    endpoints: [
      { method: 'POST', path: '/api/v2/wechat/login', desc: '微信小程序登录（code换取token）', params: 'wx_code, user_type (parent/teacher)', response: '{ "token": "eyJhbG...", "user_info": { ... } }' },
      { method: 'GET', path: '/api/v2/wechat/child/{student_id}', desc: '获取孩子实时监测数据', params: 'student_id, token (Header)', response: '{ "name": "小明", "heart_rate": 85, "body_temp": 36.5, "emotion": "平静", "location": "教室A" }' },
      { method: 'GET', path: '/api/v2/wechat/alerts', desc: '获取预警通知列表', params: 'token, status (unread/read)', response: '{ "unread_count": 3, "alerts": [...] }' },
      { method: 'POST', path: '/api/v2/wechat/mood', desc: '记录情绪日记', params: 'token, student_id, mood, intensity, trigger, notes', response: '{ "code": 200, "entry_id": 123 }' },
      { method: 'GET', path: '/api/v2/wechat/experts', desc: '获取专家列表', params: 'token, specialty (可选筛选)', response: '{ "experts": [ { "id": 1, "name": "陈医生", ... } ] }' },
      { method: 'POST', path: '/api/v2/wechat/consult', desc: '发起专家咨询预约', params: 'token, expert_id, description, preferred_time', response: '{ "code": 200, "request_id": 456 }' },
      { method: 'GET', path: '/api/v2/wechat/forum', desc: '获取家长论坛帖子', params: 'token, page, page_size', response: '{ "posts": [ ... ], "total": 128 }' },
      { method: 'POST', path: '/api/v2/wechat/forum/post', desc: '发布论坛帖子', params: 'token, title, content', response: '{ "code": 200, "post_id": 789 }' },
    ]
  },
  {
    category: '移动APP接口',
    endpoints: [
      { method: 'POST', path: '/api/v2/app/auth/login', desc: 'APP账号密码登录', params: 'username, password, device_id', response: '{ "token": "eyJhbG...", "refresh_token": "...", "expires_in": 7200 }' },
      { method: 'POST', path: '/api/v2/app/auth/refresh', desc: '刷新Token', params: 'refresh_token', response: '{ "token": "eyJhbG...", "expires_in": 7200 }' },
      { method: 'GET', path: '/api/v2/app/dashboard', desc: '获取首页仪表盘数据', params: 'token', response: '{ "students_count": 24, "online_devices": 22, "pending_alerts": 3, "today_consultations": 2 }' },
      { method: 'GET', path: '/api/v2/app/students', desc: '获取学生列表', params: 'token, class_id (可选)', response: '{ "students": [ { "id": 1, "name": "小明", ... } ] }' },
      { method: 'GET', path: '/api/v2/app/student/{id}/realtime', desc: '获取学生实时数据（WebSocket连接前）', params: 'token, student_id', response: '{ "heart_rate": 85, "body_temp": 36.5, "emotion": "平静", "location": "教室A", "steps": 1250 }' },
      { method: 'POST', path: '/api/v2/app/push/register', desc: '注册推送设备（FCM/APNs）', params: 'token, push_token, platform (ios/android)', response: '{ "code": 200, "message": "推送注册成功" }' },
      { method: 'GET', path: '/api/v2/app/notifications', desc: '获取推送通知历史', params: 'token, page, page_size', response: '{ "notifications": [ ... ], "unread": 5 }' },
      { method: 'GET', path: '/api/v2/app/iep/{student_id}', desc: '获取IEP计划', params: 'token, student_id', response: '{ "goals": [ { "id": 1, "area": "社交沟通", ... } ] }' },
    ]
  },
  {
    category: 'WebSocket实时推送',
    endpoints: [
      { method: 'WS', path: 'wss://api.guardian.com/v2/ws/realtime', desc: '建立实时数据WebSocket连接', params: 'token (Query参数), student_ids (订阅学生ID列表)', response: '{ "type": "heart_rate", "student_id": 1, "value": 85, "timestamp": "..." }' },
      { method: 'WS', path: 'wss://api.guardian.com/v2/ws/alerts', desc: '预警实时推送通道', params: 'token, alert_levels (1,2,3)', response: '{ "type": "alert", "alert_id": 123, "level": 2, "student_name": "小明", "message": "..." }' },
      { method: 'WS', path: 'wss://api.guardian.com/v2/ws/location', desc: 'GPS位置实时推送', params: 'token, student_id', response: '{ "type": "location", "student_id": 1, "latitude": 39.9, "longitude": 116.4, "accuracy": 10 }' },
    ]
  },
  {
    category: '数据导出与报告',
    endpoints: [
      { method: 'GET', path: '/api/v2/report/weekly/{student_id}', desc: '生成周报告', params: 'token, student_id, week (YYYY-WW格式)', response: '{ "download_url": "https://.../report_2024W22.pdf", "expires_at": "..." }' },
      { method: 'GET', path: '/api/v2/report/monthly/{student_id}', desc: '生成月度报告', params: 'token, student_id, month (YYYY-MM格式)', response: '{ "download_url": "https://.../report_202405.pdf" }' },
      { method: 'GET', path: '/api/v2/data/export', desc: '导出原始数据(CSV)', params: 'token, student_ids, start_date, end_date, metrics (heart_rate,steps,...)', response: '{ "download_url": "https://.../data_export.csv" }' },
      { method: 'POST', path: '/api/v2/data/batch', desc: '批量导入学生数据', params: 'token, file (CSV/Excel)', response: '{ "code": 200, "imported": 24, "failed": 0 }' },
    ]
  }
];

export default function ApiDocsPage() {
  const [expandedCat, setExpandedCat] = useState<string | null>('智能手表数据采集');
  const [expandedEp, setExpandedEp] = useState<string | null>(null);
  const { openModal } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#2D6B3F] font-bold" style={{ fontFamily: '"Noto Serif SC", serif' }}>接口文档</h2>
        <p className="text-sm text-[#8B8B80] mt-1">智能手表 · 微信小程序 · 移动APP · WebSocket API</p>
      </div>

      <div className="bg-gradient-to-r from-[#2D6B3F] to-[#3A7D4A] rounded-3xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">📡 系统接入说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="font-medium mb-1">⌚ 智能手表/手环</div>
            <div className="text-white/70 text-xs">支持蓝牙4.0+连接，心率、体温、步数、GPS每3秒上报</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="font-medium mb-1">📱 微信小程序</div>
            <div className="text-white/70 text-xs">家长端查看孩子数据、情绪记录、专家预约</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="font-medium mb-1">📲 移动APP</div>
            <div className="text-white/70 text-xs">教师端实时监测、预警管理、学生管理</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-white/60">Base URL: https://api.guardian.com/v2 | WebSocket: wss://api.guardian.com/v2/ws</div>
      </div>

      <div className="space-y-3">
        {API_ENDPOINTS.map(cat => (
          <div key={cat.category} className="bg-white rounded-3xl shadow-sm border border-[#E8E8D8] overflow-hidden">
            <button onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAFAF5] transition-colors">
              <span className="font-semibold text-[#2D6B3F]">{cat.category}</span>
              <span className="text-[#8B8B80] text-sm">{cat.endpoints.length} 个接口</span>
            </button>
            {expandedCat === cat.category && (
              <div className="border-t border-[#F0F0E8]">
                {cat.endpoints.map((ep, i) => (
                  <div key={i} className="border-b border-[#F0F0E8] last:border-0">
                    <button onClick={() => setExpandedEp(expandedEp === `${cat.category}-${i}` ? null : `${cat.category}-${i}`)}
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-[#FAFAF5] transition-colors text-left">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ep.method === 'GET' ? 'bg-[#E0E8F0] text-[#1565C0]' : ep.method === 'POST' ? 'bg-[#E8F5E8] text-[#2D6B3F]' : 'bg-[#F0E0F0] text-[#7B4A8B]'}`}>{ep.method}</span>
                      <span className="text-sm font-mono text-[#2A2A2A]">{ep.path}</span>
                      <span className="text-xs text-[#8B8B80] flex-1 truncate ml-2">{ep.desc}</span>
                    </button>
                    {expandedEp === `${cat.category}-${i}` && (
                      <div className="px-6 pb-4 bg-[#FAFAF5]">
                        <div className="mb-3"><div className="text-xs text-[#8B8B80] mb-1">请求参数</div><pre className="text-xs bg-white rounded-xl p-3 border border-[#E8E8D8] overflow-x-auto">{ep.params}</pre></div>
                        <div><div className="text-xs text-[#8B8B80] mb-1">响应示例</div><pre className="text-xs bg-white rounded-xl p-3 border border-[#E8E8D8] overflow-x-auto">{ep.response}</pre></div>
                        <button onClick={() => openModal('📋', '测试接口', `接口：${ep.method} ${ep.path}\n\n描述：${ep.desc}\n\n参数：${ep.params}\n\n点击「发送请求」进行测试。`)} className="mt-3 px-4 py-2 rounded-xl bg-[#2D6B3F] text-white text-xs hover:bg-[#3A7D4A] transition-colors">🧪 测试接口</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
