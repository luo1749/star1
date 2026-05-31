import { create } from 'zustand';
import type { User, UserRole, Student, Alert, MedicalRecord, Device, Expert, Consultation, ConsultationRequest, ForumPost, ExpertForumPost, Feedback, HistoricalData, Message, MedicalComment, MoodJournalEntry, IEPGoal, ResourceItem, ActionRecord } from '@/types';

interface AppState {
  currentUser: string | null; role: UserRole | ''; isLoggedIn: boolean;
  login: (u: string, p: string) => boolean; logout: () => void;
  currentPage: string; setPage: (page: string) => void;

  registeredUsers: User[]; students: Student[]; alerts: Alert[];
  medicalRecords: MedicalRecord[]; devices: Device[]; experts: Expert[];
  consultations: Consultation[]; consultationRequests: ConsultationRequest[];
  forumPosts: ForumPost[]; expertForumPosts: ExpertForumPost[];
  feedbacks: Feedback[]; historicalData: Record<string, HistoricalData[]>;
  messages: Record<string, Message[]>; medicalComments: MedicalComment[];
  friends: string[]; moodJournal: MoodJournalEntry[];
  iepGoals: IEPGoal[]; resources: ResourceItem[];

  selectedStudent: Student | null; selectedChat: string;
  selectedChildForParent: Student | null; editingParentSolution: number | null;
  creatingPost: boolean; editingProfile: boolean;
  viewingExpertDetail: string | null; currentConsultExpertId: number | null;
  showModal: boolean; modalContent: { icon: string; title: string; content: string };
  showConfirmModal: boolean; confirmContent: string; confirmCallback: (() => void) | null;
  editingMoodEntryId: number | null;
  viewingResourceId: number | null;
  editingMedicalRecordId: number | null;
  showAvatarPicker: boolean;
  avatarTarget: 'self' | 'child' | null;
  avatarTargetChild: string | null;

  // Actions
  addFriend: (name: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  handleAlert: (id: number) => void;
  toggleLike: (postId: number) => void;
  toggleExpertLike: (postId: number) => void;
  addComment: (postId: number, content: string) => void;
  addExpertComment: (postId: number, content: string) => void;
  addMedicalComment: (recordId: number, content: string, isPublic: boolean) => void;
  createPost: (title: string, content: string) => void;
  createExpertPost: (title: string, tags: string, content: string, isPublic: boolean) => void;
  acceptConsultation: (id: number, t: string, f: number, p: string) => void;
  rejectConsultation: (id: number) => void;
  payConsultation: (id: number) => void;
  submitConsultRequest: (d: string, pt: string) => void;
  saveParentSolution: (rid: number, sol: string) => void;
  registerUser: (u: Omit<User, 'role'> & { role: Exclude<UserRole, 'admin'> }) => boolean;
  openModal: (icon: string, title: string, content: string) => void;
  closeModal: () => void;
  openConfirm: (msg: string, cb: () => void) => void;
  closeConfirm: () => void;
  executeConfirm: () => void;
  selectStudent: (s: Student | null) => void;
  selectChildForParent: (s: Student | null) => void;
  addMoodEntry: (e: Omit<MoodJournalEntry, 'id'>) => void;
  updateMoodEntry: (id: number, e: Partial<MoodJournalEntry>) => void;
  addIEPGoal: (g: Omit<IEPGoal, 'id'>) => void;
  updateIEPProgress: (id: number, p: number) => void;
  createNewConsultation: (d: Partial<Consultation>) => void;
  startConsultation: (id: number) => void;
  viewConsultationDetail: (id: number) => void;
  fluctuateData: () => void;
  // New actions
  addMedicalAction: (recordId: number, content: string, role: 'teacher' | 'parent' | 'expert') => void;
  toggleMedicalRecordPublic: (recordId: number) => void;
  updateUserAvatar: (username: string, avatar: string) => void;
  updateChildAvatar: (studentId: number, avatar: string) => void;
}

const now = new Date();
const today = now.toISOString().split('T')[0];
const C = ['自闭症','唐氏综合征','多动症','发育迟缓','脑瘫','智力障碍','语言障碍','感统失调','癫痫','阿斯伯格综合征'];
const CLS = ['一年级(1)班','一年级(2)班','二年级(1)班','二年级(2)班','三年级(1)班','三年级(2)班','四年级(1)班','四年级(2)班','五年级(1)班'];
const P = ['陈女士','刘女士','赵先生','孙女士','周女士','吴先生','郑女士','黄先生','朱女士','杨先生','何女士','罗先生'];
const E = ['李老师','王老师','张老师','陈老师','刘老师','赵老师','孙老师','周老师'];
const EM = ['平静','开心','兴奋','焦虑','低落','激动','疲惫','专注'];
const LOC = ['教室A','教室B','教室C','操场','休息室','图书馆','食堂','走廊','感统训练室','心理咨询室','医务室','音乐教室','美术教室','舞蹈室'];
const NAMES = ['小明','小红','小华','小芳','小强','小丽','小文','小军','小敏','小波','小燕','小龙','小琴','小鹏','小雪','小东','小英','小伟','小静','小辉','小霞','小超','小兰','小洋'];

const genStudents = (): Student[] => NAMES.map((name, i) => ({
  id: i + 1, name, class: CLS[i % CLS.length], condition: C[i % C.length],
  heartRate: 65 + Math.floor(Math.random() * 40), bodyTemp: parseFloat((36.0 + Math.random() * 1.5).toFixed(1)),
  emotion: EM[Math.floor(Math.random() * EM.length)], location: LOC[Math.floor(Math.random() * LOC.length)],
  steps: Math.floor(200 + Math.random() * 3000), battery: Math.floor(15 + Math.random() * 85),
  deviceStatus: (Math.random() > 0.15 ? 'online' : 'offline') as 'online' | 'offline',
  parent: P[i % P.length], teachers: [E[i % E.length], E[(i + 3) % E.length]], hasCondition: Math.random() > 0.35,
  avatar: `/avatars/child${(i % 5) + 1}.png`, sleepHours: parseFloat((5.5 + Math.random() * 4).toFixed(1)),
  screenTime: Math.round(20 + Math.random() * 100), socialInteraction: Math.round(Math.random() * 12),
  appetite: ['较差','一般','良好','很好'][Math.floor(Math.random() * 4)], medicationTaken: Math.random() > 0.15,
}));

const students = genStudents();

const genHD = (): Record<string, HistoricalData[]> => {
  const d: Record<string, HistoricalData[]> = {};
  NAMES.slice(0, 15).forEach(name => {
    const arr: HistoricalData[] = [];
    for (let i = 60; i >= 0; i--) { const dt = new Date(now); dt.setDate(dt.getDate() - i); arr.push({ date: dt.toISOString().split('T')[0], heartRate: Math.round(68 + Math.random() * 30), bodyTemp: parseFloat((36.0 + Math.random() * 1.2).toFixed(1)), steps: Math.round(500 + Math.random() * 2500), emotion: EM[Math.floor(Math.random() * EM.length)], sleepHours: parseFloat((5.5 + Math.random() * 4).toFixed(1)), screenTime: Math.round(20 + Math.random() * 100), medicationTaken: Math.random() > 0.15, therapyMinutes: Math.round(Math.random() * 90), alertCount: Math.floor(Math.random() * 4), socialInteraction: Math.round(Math.random() * 12), appetite: ['较差','一般','良好','很好'][Math.floor(Math.random() * 4)] }); }
    d[name] = arr;
  });
  return d;
};

const genAlerts = (): Alert[] => {
  const types = [
    { t: '心率异常', l: 1, s: '建议让孩子休息5分钟，观察心率变化。如持续升高请通知家长和校医。', m: (n: string) => `${n}心率突然升高至${100 + Math.floor(Math.random() * 20)}BPM` },
    { t: '情绪激动', l: 2, s: '建议立即安抚孩子情绪，使用 calming strategies，同时联系家长。', m: (n: string) => `${n}出现情绪激动症状，需要立即处理` },
    { t: '体温异常', l: 1, s: '请测量体温，让孩子多喝水休息在阴凉处。持续监测体温变化。', m: (n: string) => `${n}体温升至${(37.5 + Math.random() * 1.5).toFixed(1)}℃` },
    { t: '位置异常', l: 2, s: '请立即确认孩子位置，确保安全。联系家长说明情况。', m: (n: string) => `${n}离开安全区域超过${5 + Math.floor(Math.random() * 10)}分钟` },
    { t: '突发癫痫', l: 3, s: '立即拨打急救电话！保持孩子侧卧，移开周围危险物品，通知家长和校医。', m: (n: string) => `${n}突发癫痫症状，情况紧急！` },
    { t: '长时间静止', l: 1, s: '孩子长时间未活动，建议检查孩子状态。', m: (n: string) => `${n}已超过${20 + Math.floor(Math.random() * 30)}分钟无明显活动` },
    { t: '步数异常偏低', l: 1, s: '今日运动量明显偏低，建议鼓励孩子适当活动。', m: (n: string) => `${n}今日运动量低于正常水平` },
    { t: '设备离线', l: 1, s: '智能手环信号丢失，请检查设备电量和佩戴情况。', m: (n: string) => `${n}的智能手环已离线` },
  ];
  const alerts: Alert[] = [];
  for (let i = 0; i < 28; i++) { const tp = types[i % types.length]; const st = students[i % students.length]; alerts.push({ id: i + 1, level: tp.l as 1|2|3, student: st.name, type: tp.t, message: tp.m(st.name), time: `${String(7 + Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, solution: tp.s, handled: i < 12 }); }
  return alerts;
};

const genMR = (): MedicalRecord[] => {
  const templates = [
    { title: '社交退缩记录', content: '在集体活动中表现明显退缩，不愿与其他同学交流，独自坐在角落。', ai: '建议安排一对一互动时间，使用感兴趣的物品作为媒介，慢慢建立社交连接。', expert: '社交训练需要循序渐进。建议从共同关注开始，逐渐过渡到简单的互动游戏。' },
    { title: '感官刺激反应', content: '教室的火警警报测试时，表现出极度不安，捂住耳朵尖叫，需要安抚30分钟。', ai: '提前预告可能的感官刺激，使用降噪耳机保护听力，建立安全冷静区域。', expert: '感官敏感是常见特征。建议制定感官友好方案，提供安静空间。' },
    { title: '情绪激动记录', content: '在课堂上突然情绪激动，表现为哭闹不止，拒绝配合教学活动。持续约20分钟。', ai: '建议立即转移到安静环境，使用视觉安抚卡进行引导，监测身体指标。', expert: '情绪激动时，首先要保持环境安静，避免过多刺激，使用熟悉的安抚物品。' },
    { title: '课堂行为异常', content: '课堂上频繁离开座位，干扰其他同学学习，注意力无法集中超过5分钟。', ai: '将座位调整到靠近老师的位置，使用视觉时间表帮助理解课堂流程。', expert: '需要结构化的学习环境。建议采用分段教学法，配合即时奖励机制。' },
    { title: '语言沟通困难', content: '在语言表达上存在明显迟缓，无法完整表达需求，经常用手势代替语言。', ai: '建议增加一对一语言训练时间，使用图片交流板帮助表达。', expert: '语言训练需要耐心和持续性。建议结合图片沟通系统(PECS)进行训练。' },
    { title: '刻板行为观察', content: '观察到反复旋转手中的物品，持续约15分钟，无论老师如何引导都无法停止。', ai: '用功能性替代行为满足感官需求，如提供减压玩具。', expert: '刻板行为是自我调节方式。建议了解行为背后的功能，提供替代方式。' },
    { title: '睡眠问题记录', content: '夜间睡眠质量差，频繁醒来，白天表现为注意力不集中和易怒。', ai: '建立固定的睡前程序，减少晚间屏幕使用，营造安静舒适的睡眠环境。', expert: '睡眠障碍需要系统干预。建议记录睡眠日记，必要时寻求专业评估。' },
    { title: '饮食行为问题', content: '对某些食物质地极度抗拒，仅接受少数几种食物，营养摄入不均衡。', ai: '逐步引入新食物，每次只添加一种，与喜欢的食物搭配呈现。', expert: '饮食问题常与感觉处理困难相关。建议循序渐进，避免强迫进食。' },
  ];
  return students.slice(0, 15).map((s, i) => {
    const t = templates[i % templates.length];
    const daysAgo = 1 + Math.floor(Math.random() * 45);
    const d = new Date(now); d.setDate(d.getDate() - daysAgo);
    return { id: i + 1, student: s.name, date: d.toISOString().split('T')[0], title: t.title, content: `今日${s.name}${t.content}`, aiSolution: `AI分析建议：${t.ai}`, parentSolution: Math.random() > 0.4 ? `我在家发现${s.name}在安静环境下表现更好，会尝试建立固定的日常程序。` : '', expertName: ['陈医生','刘教授','张专家'][i % 3], expertSolution: `专家建议：${t.expert}`, teacherActions: [{ id: 1, author: E[i % E.length], role: '老师', content: '已在课堂上将学生座位调至前排，安排同桌辅助。', time: d.toISOString().split('T')[0] }], parentActions: Math.random() > 0.5 ? [{ id: 1, author: s.parent, role: '家长', content: `在家也注意到了这个情况，会配合老师的方案。`, time: d.toISOString().split('T')[0] }] : [], expertActions: [], isPublic: Math.random() > 0.3 };
  });
};

const genMJ = (): MoodJournalEntry[] => {
  const entries: MoodJournalEntry[] = [];
  const moods = ['happy','calm','anxious','sad','angry','excited'] as const;
  students.slice(0, 10).forEach((s, si) => {
    for (let i = 0; i < 5; i++) { const d = new Date(now); d.setDate(d.getDate() - i * 3); const mood = moods[Math.floor(Math.random() * moods.length)]; entries.push({ id: si * 5 + i + 1, student: s.name, date: d.toISOString().split('T')[0], mood, intensity: 3 + Math.floor(Math.random() * 7), trigger: ['课堂活动','噪音环境','社交互动','饮食时间','户外活动','休息时间'][Math.floor(Math.random() * 6)], notes: `${s.name}在${mood}状态下度过了一段时间。`, strategies: ['深呼吸练习','安静空间','安抚物品','音乐疗法','感官游戏'].slice(0, 1 + Math.floor(Math.random() * 3)) }); }
  });
  return entries;
};

const genIEP = (): IEPGoal[] => {
  const goals = [
    { area: '社交沟通', goal: '能在引导下与同伴进行5分钟互动游戏', objectives: ['建立共同注意力','学习轮流等待','理解简单游戏规则'] },
    { area: '情绪调节', goal: '能使用 calming strategies 在5分钟内平复情绪', objectives: ['识别情绪信号','使用深呼吸','请求帮助'] },
    { area: '语言发展', goal: '能使用3-5个词组成的句子表达需求', objectives: ['扩展词汇量','练习句子结构','日常对话练习'] },
    { area: '注意力训练', goal: '能专注完成任务15分钟', objectives: ['分段学习','视觉提示','即时奖励'] },
    { area: '生活自理', goal: '能独立完成穿衣、洗漱等日常活动', objectives: ['分解步骤教学','视觉提示卡','重复练习'] },
    { area: '感觉统合', goal: '能接受至少5种不同质地的食物', objectives: ['脱敏训练','游戏化引入','渐进式接触'] },
  ];
  return students.slice(0, 12).map((s, i) => {
    const g = goals[i % goals.length];
    const src = ['parent','expert','ai','teacher'][Math.floor(Math.random() * 4)] as 'parent' | 'expert' | 'ai' | 'teacher';
    return { id: i + 1, student: s.name, area: g.area, goal: g.goal, objectives: g.objectives, startDate: '2024-01-01', targetDate: `2024-${String(6 + Math.floor(Math.random() * 6)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`, progress: Math.floor(Math.random() * 80), status: ['active','active','active','completed','pending'][Math.floor(Math.random() * 5)] as 'active'|'completed'|'pending', createdBy: src === 'expert' ? '陈医生' : src === 'teacher' ? '李老师' : s.parent, source: src };
  });
};

const resources: ResourceItem[] = [
  { id: 1, title: '自闭症家庭干预指南', category: '自闭症', type: 'guide', description: '全面的家庭干预方法指南，涵盖日常训练技巧和策略', tags: ['自闭症','家庭干预','早期训练'], detailContent: '## 第一章：认识自闭症\n\n自闭症谱系障碍（ASD）是一种神经发育障碍，主要表现为社交沟通障碍和限制性、重复性行为模式。\n\n## 第二章：家庭干预基本原则\n\n1. **早期干预**：越早开始干预，效果越好。3岁前是黄金干预期。\n2. **个性化方案**：每个孩子的表现和需求都不同，需要制定个性化的干预计划。\n3. **家庭参与**：家长是最重要的干预者，日常生活中处处都是干预机会。\n4. **持续性**：干预是一个长期的过程，需要耐心和坚持。\n\n## 第三章：日常训练技巧\n\n### 3.1 社交技能训练\n- 从眼神接触开始\n- 使用社交故事\n- 角色扮演游戏\n- 逐步扩展社交场景\n\n### 3.2 语言沟通训练\n- 跟随孩子的兴趣\n- 使用图片交换系统（PECS）\n- 创造沟通机会\n- 庆祝每一个进步\n\n### 3.3 行为管理\n- 建立清晰的规则和预期\n- 使用视觉时间表\n- 正向强化\n- 冷静角的使用\n\n## 第四章：感觉统合活动\n\n### 4.1 触觉活动\n- 触觉箱探索\n- 不同质地的物品触摸\n- 指画活动\n\n### 4.2 前庭觉活动\n- 荡秋千\n- 旋转游戏\n- 平衡木\n\n### 4.3 本体觉活动\n- 推拉重物\n- 跳床\n- 攀爬活动' },
  { id: 2, title: '感觉统合训练视频系列', category: '感统训练', type: 'video', description: '专业OT治疗师演示的感觉统合训练动作', tags: ['感统','OT','训练视频'], detailContent: '## 视频目录\n\n### 第1集：感觉统合基础（15分钟）\n- 什么是感觉统合\n- 感觉统合失调的表现\n- 家庭评估方法\n\n### 第2集：触觉训练（20分钟）\n- 触觉脱敏训练\n- 触觉箱制作与使用\n- 日常触觉游戏\n\n### 第3集：前庭觉训练（18分钟）\n- 安全的前庭刺激活动\n- 平衡训练\n- 旋转类游戏\n\n### 第4集：本体觉训练（22分钟）\n- 大肌肉群训练\n- 精细动作训练\n- 身体意识游戏\n\n### 第5集：家庭训练计划制定（25分钟）\n- 如何制定每日训练计划\n- 训练时间的合理安排\n- 记录与评估方法' },
  { id: 3, title: '视觉时间表制作工具', category: '辅助工具', type: 'tool', description: '在线制作可视化日程表，帮助特殊儿童理解日常安排', tags: ['视觉辅助','日程管理','免费工具'], detailContent: '## 工具介绍\n\n视觉时间表是一种将抽象的时间概念转化为具体、可见的图片或符号的工具，特别适合自闭症和其他特殊需要儿童使用。\n\n## 使用方法\n\n### 步骤1：选择模板\n- 一日时间表\n- 一周时间表\n- 任务分解表\n- 过渡提示卡\n\n### 步骤2：添加活动\n- 从图库选择活动图标\n- 上传自定义图片\n- 添加文字标签\n- 设置时间\n\n### 步骤3：个性化设置\n- 选择颜色主题\n- 调整图标大小\n- 添加完成标记\n- 设置提醒\n\n### 步骤4：导出使用\n- 打印成卡片\n- 导出为PDF\n- 分享到微信\n- 设置为壁纸\n\n## 图库包含\n200+日常活动图标，涵盖：\n- 晨起 routine（起床、刷牙、洗脸、穿衣）\n- 用餐（早餐、午餐、晚餐、零食）\n- 学习活动（上课、作业、阅读）\n- 游戏时间（室内、室外）\n- 睡前 routine（洗澡、换睡衣、讲故事）' },
  { id: 4, title: '社交故事模板库', category: '社交训练', type: 'article', description: '各种场景的社交故事模板，帮助孩子学习社交技能', tags: ['社交故事','ASD','社交技能'], detailContent: '## 什么是社交故事\n\n社交故事（Social Story）是由Carol Gray开发的一种教学方法，通过简短的故事来描述社交场景、预期行为和适当反应。\n\n## 模板库\n\n### 学校场景\n- **第一次上学**：描述上学第一天的流程和感受\n- **课堂举手**：什么时候举手、如何举手\n- **课间休息**：如何与同学玩耍\n- **食堂用餐**：排队、选择食物、用餐礼仪\n- **遇到困难**：如何向老师求助\n\n### 家庭场景\n- **家庭聚会**：如何与亲戚互动\n- **有客人来访**：如何打招呼和招待\n- **兄弟姐妹相处**：分享和轮流\n\n### 社区场景\n- **去公园**：如何与其他孩子玩耍\n- **去超市**：购物流程和行为规范\n- **去医院**：看医生的流程\n- **去理发**：理发的步骤\n\n### 情绪管理\n- **感到生气时**：如何表达和管理愤怒\n- **感到害怕时**：如何寻求帮助\n- **感到难过时**：如何安慰自己\n\n## 编写指南\n1. 使用第一人称或第三人称\n2. 描述性句子为主\n3. 配以清晰的插图\n4. 保持积极正面的语气' },
  { id: 5, title: '言语治疗家庭练习手册', category: '言语治疗', type: 'guide', description: '可在家里进行的言语治疗练习活动', tags: ['言语治疗','语言发展','家庭练习'], detailContent: '## 第一章：了解语言发展\n\n### 正常语言发展里程碑\n- 12个月：会说1-2个词\n- 18个月：会说20个左右的词\n- 2岁：会组合2个词\n- 3岁：会说3-5个词的句子\n\n### 常见语言障碍类型\n- 语言发育迟缓\n- 构音障碍\n- 口吃\n- 社交语用障碍\n\n## 第二章：口腔肌肉训练\n\n### 2.1 唇部运动\n- 嘟嘴\n- 咧嘴笑\n- 吹蜡烛\n- 抿嘴唇\n\n### 2.2 舌部运动\n- 伸舌头\n- 舌头左右移动\n- 舔嘴唇\n- 顶脸颊\n\n### 2.3 呼吸训练\n- 深呼吸\n- 吹泡泡\n- 吹纸片\n- 吹乐器\n\n## 第三章：日常练习活动\n\n### 3.1 命名游戏\n- 指认家中物品\n- 说出物品用途\n- 分类命名\n\n### 3.2 对话练习\n- 问与答\n- 描述图片\n- 讲故事\n\n### 3.3 发音练习\n- 从易到难的音素\n- 日常词汇练习\n- 句子练习' },
  { id: 6, title: '情绪调节工具箱', category: '情绪管理', type: 'tool', description: '帮助儿童识别和调节情绪的可视化工具', tags: ['情绪管理','自我调节','可视化'], detailContent: '## 工具箱内容\n\n### 1. 情绪温度计\n- 1-3级：平静/开心（绿色）\n- 4-6级：有点不安（黄色）\n- 7-8级：很生气/害怕（橙色）\n- 9-10级：情绪失控（红色）\n\n### 2. 冷静策略卡\n- 深呼吸（闻花香吹蜡烛）\n- 数数到10\n- 挤压减压球\n- 去冷静角\n- 听舒缓音乐\n- 抱毛绒玩具\n\n### 3. 情绪表达卡\n- 开心、难过、生气、害怕、惊讶、厌恶\n- 配以表情图片和情境示例\n\n### 4. 问题解决步骤\n1. 停下来，深呼吸\n2. 说出我的感受\n3. 想想解决办法\n4. 选择最好的方法\n5. 试试看\n\n### 5. 冷静角设置指南\n- 选择安静的角落\n- 放置舒适的坐垫\n- 准备安抚物品\n- 张贴冷静策略海报\n- 设置计时器' },
  { id: 7, title: 'PECS图片沟通系统入门', category: '沟通训练', type: 'guide', description: '图片交换沟通系统的使用教程和素材包', tags: ['PECS','沟通','自闭症'], detailContent: '## 什么是PECS\n\nPECS（Picture Exchange Communication System，图片交换沟通系统）是一种使用图片来辅助沟通的方法，特别适合尚未发展出语言的儿童。\n\n## 六阶段训练法\n\n### 阶段1：以物换图\n- 用喜欢的物品交换图片\n- 建立"给图片→得到物品"的联系\n\n### 阶段2：距离和坚持\n- 增加与沟通伙伴的距离\n- 在不同场景中使用\n\n### 阶段3：图片辨别\n- 从多张图片中选择正确的\n- 从2张逐渐增加到多张\n\n### 阶段4：句子结构\n- 使用"我要..."的句式\n- 组合多张图片\n\n### 阶段5：回应性请求\n- 回答"你要什么？"\n- 主动发起对话\n\n### 阶段6：评论和表达\n- 描述看到的事物\n- 表达感受和意见\n\n## 素材包包含\n- 300+常用物品图片\n- 动词图片\n- 情感表情图片\n- 句型模板' },
  { id: 8, title: '注意力训练游戏集', category: '注意力', type: 'video', description: '提高注意力的趣味游戏和训练方法', tags: ['注意力','ADHD','游戏'], detailContent: '## 视频课程\n\n### 第1集：注意力基础理论（12分钟）\n- 注意力的类型（选择性、持续性、分配性）\n- ADHD儿童的注意力特点\n- 训练原则\n\n### 第2集：桌面游戏（18分钟）\n- 找不同\n- 连连看\n- 拼图游戏\n- 记忆翻牌\n\n### 第3集：身体游戏（20分钟）\n- 红灯绿灯停\n- Simon Says\n- 平衡木行走\n- 投球游戏\n\n### 第4集：日常生活训练（15分钟）\n- 番茄工作法（ adapted for kids）\n- 任务分解法\n- 环境整理\n\n### 第5集：家庭训练计划（22分钟）\n- 每日15分钟训练方案\n- 进度记录方法\n- 奖励机制设置' },
  { id: 9, title: '特殊儿童睡眠指导', category: '睡眠', type: 'article', description: '帮助特殊儿童建立健康睡眠习惯的方法', tags: ['睡眠','作息','感统'], detailContent: '## 睡眠问题概述\n\n研究显示，约40-80%的自闭症儿童存在睡眠问题，常见表现包括：\n- 入睡困难\n- 夜间频繁醒来\n- 早醒\n- 睡眠质量差\n\n## 影响因素\n\n### 生理因素\n- 褪黑素分泌异常\n- 感觉过敏（对声音、光线、触觉）\n- 胃肠道问题\n\n### 环境因素\n- 睡前使用电子设备\n- 不规律的作息时间\n- 不适宜的睡眠环境\n\n## 干预策略\n\n### 1. 建立固定的睡前程序\n- 每天同一时间开始睡前准备\n- 使用视觉时间表\n- 步骤：洗澡→换睡衣→刷牙→上厕所→阅读→关灯\n\n### 2. 优化睡眠环境\n- 使用遮光窗帘\n- 白噪音机\n- 重力毯\n- 适宜的室温\n\n### 3. 调整日间活动\n- 增加日间运动量\n- 限制午睡时间\n- 避免傍晚摄入咖啡因\n\n### 4. 褪黑素补充\n- 咨询医生后使用\n- 从低剂量开始\n- 结合行为干预' },
  { id: 10, title: '饮食脱敏训练手册', category: '饮食', type: 'guide', description: '针对挑食和感觉性饮食障碍的渐进式训练方案', tags: ['饮食','脱敏','感统'], detailContent: '## 饮食问题概述\n\n许多特殊需要儿童存在饮食问题，主要表现为：\n- 食物种类极度有限\n- 对食物质地敏感\n- 拒绝尝试新食物\n- 进食仪式化行为\n\n## 脱敏训练十步法\n\n### 第1步：食物出现在房间\n- 只是让食物出现在孩子的视线范围内\n- 不要强迫接触或食用\n- 持续3-5天\n\n### 第2步：食物出现在桌面\n- 将食物放在孩子的餐盘中\n- 与其他喜欢的食物放在一起\n- 持续3-5天\n\n### 第3步：触摸食物\n- 鼓励孩子用手指触碰食物\n- 可以用游戏化的方式\n- 给予积极强化\n\n### 第4步：拿起食物\n- 鼓励孩子拿起食物\n- 可以闻一闻\n- 不强迫放入口中\n\n### 第5步：食物靠近嘴巴\n- 鼓励孩子将食物放到嘴边\n- 可以舔一舔\n- 逐步接受\n\n### 第6-10步：逐步增加摄入量\n- 小口吃→正常吃→整份吃\n- 每个步骤之间留出充足的时间\n- 记录进展并庆祝进步' },
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: null, role: '', isLoggedIn: false, currentPage: '',

  registeredUsers: [
    { username: '李老师', password: '123456', role: 'teacher', phone: '13800138001', realName: '李明', avatar: '/avatars/teacher.png' },
    { username: '王老师', password: '123456', role: 'teacher', phone: '13800138002', realName: '王芳', avatar: '/avatars/teacher.png' },
    { username: '陈老师', password: '123456', role: 'parent', phone: '13800138003', realName: '陈雪', avatar: '/avatars/parent.png' },
    { username: '刘女士', password: '123456', role: 'parent', phone: '13800138004', realName: '刘梅', avatar: '/avatars/parent.png' },
    { username: '赵先生', password: '123456', role: 'parent', phone: '13800138005', realName: '赵刚', avatar: '/avatars/parent.png' },
    { username: '孙女士', password: '123456', role: 'parent', phone: '13800138006', realName: '孙丽', avatar: '/avatars/parent.png' },
    { username: '周女士', password: '123456', role: 'parent', phone: '13800138007', realName: '周婷', avatar: '/avatars/parent.png' },
    { username: '陈医生', password: '123456', role: 'expert', phone: '13800138008', realName: '陈建国', avatar: '/avatars/expert.png' },
    { username: '刘教授', password: '123456', role: 'expert', phone: '13800138009', realName: '刘婷', avatar: '/avatars/expert.png' },
    { username: '张专家', password: '123456', role: 'expert', phone: '13800138010', realName: '张华', avatar: '/avatars/expert.png' },
    { username: 'admin', password: 'admin', role: 'admin', phone: '13800138000', realName: '管理员', avatar: '/avatars/admin.png' },
  ],

  students, alerts: genAlerts(), medicalRecords: genMR(),
  devices: students.map((s, i) => ({ id: `D${String(i + 1).padStart(3, '0')}`, name: `智能手环-${s.name}`, type: '手环', status: s.deviceStatus, battery: s.battery, lastSync: `${today} ${String(7 + Math.floor(Math.random() * 14)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, student: s.name })),
  experts: [
    { id: 1, name: '陈医生', avatar: '/avatars/expert.png', specialty: '儿童行为问题与干预', experience: 15, rate: 200, certification: 'NSEAI认证', intro: '专注于儿童行为障碍干预15年，擅长行为疗法、社交技能训练和感觉统合治疗。', isPublic: true, posts: [], hospital: '市儿童医院', education: '北京大学医学博士', publications: ['特殊儿童行为干预实务','感觉统合治疗指南'], workSchedule: '周一三五全天，周二四上午', contact: '13800138008' },
    { id: 2, name: '刘教授', avatar: '/avatars/expert.png', specialty: '语言发育迟缓', experience: 20, rate: 250, certification: '特殊教育博士', intro: '语言病理学专家，在儿童语言发展领域有深厚造诣，擅长PECS图片沟通系统训练。', isPublic: true, posts: [], hospital: '省康复医院', education: '复旦大学语言学博士', publications: ['语言发育迟缓的评估与干预','AAC辅助沟通技术'], workSchedule: '周二四六全天', contact: '13800138009' },
    { id: 3, name: '张专家', avatar: '/avatars/expert.png', specialty: '自闭症谱系障碍', experience: 12, rate: 180, certification: 'BCBA认证', intro: '应用行为分析(ABA)专家，擅长自闭症儿童的早期干预和地板时光疗法。', isPublic: true, posts: [], hospital: '市精神卫生中心', education: '华东师范大学特殊教育硕士', publications: ['ABA应用行为分析入门','地板时光疗法实践'], workSchedule: '周一二四全天', contact: '13800138010' },
    { id: 4, name: '李专家', avatar: '/avatars/expert.png', specialty: '感觉统合治疗', experience: 10, rate: 160, certification: 'OT注册治疗师', intro: '职业治疗师，专注感觉统合障碍评估与治疗，帮助儿童改善感觉处理能力。', isPublic: true, posts: [], hospital: '市康复医院', education: '四川大学康复治疗硕士', publications: ['感觉统合活动设计100例'], workSchedule: '周三五全天', contact: '13800138011' },
    { id: 5, name: '王专家', avatar: '/avatars/expert.png', specialty: '儿童心理评估', experience: 18, rate: 220, certification: '临床心理学博士', intro: '儿童心理评估专家，擅长ADHD、自闭症等发育障碍的综合评估与诊断。', isPublic: true, posts: [], hospital: '市心理卫生中心', education: '中科院心理研究所博士', publications: ['儿童心理评估工具集','ADHD诊断与治疗'], workSchedule: '周一三五六全天', contact: '13800138012' },
  ],
  consultations: [
    { id: 1, student: '小明', parent: '陈女士', expert: '陈医生', type: 'video', scheduledTime: new Date(now.getTime() + 2 * 86400000).toISOString(), status: 'scheduled', topic: '自闭症儿童社交能力培养', notes: '希望专家能提供具体的社交训练方法', expertNotes: null, prescription: null, followUp: true, followUpDate: new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0] },
    { id: 2, student: '小红', parent: '刘女士', expert: '刘教授', type: 'audio', scheduledTime: new Date(now.getTime() - 3 * 86400000).toISOString(), status: 'completed', topic: '唐氏综合征儿童语言发展', notes: '小红语言发展较为缓慢', expertNotes: '建议加强口腔肌肉训练，使用PECS系统', prescription: '每日进行10分钟口腔按摩', followUp: true, followUpDate: new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0] },
  ],
  consultationRequests: [
    { id: 1, student: '小明', parent: '陈女士', expert: '陈医生', description: '希望专家能分析小明近期的情绪波动原因', requestTime: '2024-05-28 10:00', preferredTime: '每周二下午', agreedTime: '', fee: null, paymentMethod: null, isPaid: false, status: 'pending' },
    { id: 2, student: '小华', parent: '赵先生', expert: '张专家', description: '想咨询关于多动症治疗的最新方案', requestTime: '2024-05-27 16:30', preferredTime: '每周四下午', agreedTime: '每周四下午4点', fee: 180, paymentMethod: '微信支付', isPaid: true, status: 'accepted' },
  ],
  forumPosts: [
    { id: 1, author: '陈女士', avatar: '👩', time: '2024-05-28 08:30', title: '分享一个帮助孩子安静下来的小技巧', content: '我家孩子情绪激动时，我会播放他喜欢的轻音乐，同时让他捏减压球，效果很好。坚持了一周，现在孩子能更快地平静下来了。', likes: 42, likedBy: [], comments: [{ id: 1, author: '刘女士', content: '这个方法我也试试！', time: '2024-05-28 09:15' }, { id: 2, author: '李老师', content: '感谢分享，这个方法很实用，我会在课堂上也尝试。', time: '2024-05-28 10:00' }] },
    { id: 2, author: '刘女士', avatar: '👩', time: '2024-05-27 15:20', title: '关于孩子饮食的一些心得', content: '经过两个月的尝试，我发现减少孩子饮食中的糖分摄入后，他的注意力明显改善了。另外增加富含Omega-3的食物也有帮助。', likes: 28, likedBy: [], comments: [{ id: 1, author: '赵先生', content: '请问您具体减少了哪些食物？', time: '2024-05-27 16:30' }] },
    { id: 3, author: '赵先生', avatar: '👨', time: '2024-05-26 10:15', title: '寻求康复训练资源推荐', content: '请问有没有家长推荐一些好的康复训练机构或资源？最好是有感统训练课程的。', likes: 15, likedBy: [], comments: [{ id: 1, author: '陈女士', content: '我们去了市儿童医院的感觉统合训练中心，效果不错。', time: '2024-05-26 11:00' }] },
    { id: 4, author: '孙女士', avatar: '👩', time: '2024-05-25 20:00', title: '今天孩子在学校的进步', content: '今天老师反馈说小明主动和同学分享了他的画笔，这是他第一次主动发起社交互动，老母亲感动哭了。', likes: 67, likedBy: [], comments: [{ id: 1, author: '李老师', content: '真的为他感到高兴！这需要很大的勇气。', time: '2024-05-25 20:30' }] },
    { id: 5, author: '周女士', avatar: '👩', time: '2024-05-24 14:30', title: '关于睡眠问题的求助', content: '孩子最近夜里总是醒，翻身很多次，白天就精神状态不好。大家有什么好的建议吗？', likes: 22, likedBy: [], comments: [{ id: 1, author: '陈医生', content: '建议先建立固定的睡前程序，减少晚间屏幕使用。', time: '2024-05-24 15:00' }] },
    { id: 6, author: '陈女士', avatar: '👩', time: '2024-05-23 09:00', title: '感统训练小工具推荐', content: '推荐几个在家就能做的感统训练小工具：平衡垫、触觉球、弹跳床。这些对孩子的前庭觉和本体觉都很有帮助。', likes: 35, likedBy: [], comments: [{ id: 1, author: '周女士', content: '弹跳床在哪里买的？', time: '2024-05-23 10:00' }] },
  ],
  expertForumPosts: [
    { id: 1, author: '陈医生', avatar: '/avatars/expert.png', time: '2024-05-27 10:30', title: '儿童情绪管理的实用策略', content: '在处理特殊儿童情绪问题时，建议采用以下策略：1. 提前预警让孩子有心理准备；2. 使用视觉时间表；3. 提供安全角落；4. 教授情绪词汇。这些策略需要长期坚持。', tags: ['情绪管理','行为干预'], isPublic: true, likes: 56, likedBy: [], comments: [] },
    { id: 2, author: '刘教授', avatar: '/avatars/expert.png', time: '2024-05-26 14:20', title: '语言发育迟缓的家庭训练方法', content: '家长可以在日常生活中进行以下训练：1. 跟随孩子的兴趣；2. 扩展孩子的表达；3. 创造沟通机会；4. 使用手势辅助。建议每天进行15-20分钟。', tags: ['语言训练','家庭干预'], isPublic: true, likes: 42, likedBy: [], comments: [{ id: 1, author: '陈女士', content: '很有用的建议！', time: '2024-05-26 15:00' }] },
    { id: 3, author: '张专家', avatar: '/avatars/expert.png', time: '2024-05-25 09:00', title: '感觉统合训练在家也能做', content: '简单的感统训练活动：1. 跳床或蹦床活动；2. 触觉箱游戏；3. 平衡木行走；4. 推拉重物。每天20-30分钟，循序渐进。', tags: ['感统训练','家庭康复'], isPublic: true, likes: 38, likedBy: [], comments: [] },
  ],
  feedbacks: [
    { id: 1, author: '李老师', role: '老师', content: '建议增加更多数据分析功能，方便老师快速了解学生状态变化趋势。', time: '2024-05-28 09:00', status: '待处理' },
    { id: 2, author: '陈女士', role: '家长', content: '希望能够查看孩子的历史数据图表，更好地了解孩子的成长情况。', time: '2024-05-27 14:30', status: '已采纳' },
    { id: 3, author: '陈医生', role: '专家', content: '建议增加专家远程会诊功能，方便专家及时提供专业意见。', time: '2024-05-26 11:00', status: '待处理' },
    { id: 4, author: '王老师', role: '老师', content: '智能手表数据刷新频率可以适当提高，以便更及时地发现异常。', time: '2024-05-25 16:00', status: '待处理' },
  ],
  historicalData: genHD(),
  messages: {
    '陈女士': [{ id: 1, sender: '陈女士', content: '李老师您好，小明今天情绪怎么样？', time: '08:30' }, { id: 2, sender: '李老师', content: '小明今天上午表现很好，一直在安静地画画', time: '08:32' }, { id: 3, sender: '陈女士', content: '太好了，谢谢老师！', time: '08:35' }],
    '刘女士': [{ id: 1, sender: '刘女士', content: '李老师，小红今天有没有按时吃药？', time: '10:15' }, { id: 2, sender: '李老师', content: '放心，已经按时服药了。上午的心率也正常。', time: '10:18' }],
    '陈医生': [{ id: 1, sender: '陈医生', content: '李老师，关于小明的干预方案，建议增加感觉统合训练环节。', time: '14:00' }, { id: 2, sender: '李老师', content: '好的陈医生，我会安排的。', time: '14:30' }],
  },
  medicalComments: [], friends: ['陈女士','刘女士'], moodJournal: genMJ(), iepGoals: genIEP(), resources,

  selectedStudent: null, selectedChat: '陈女士', selectedChildForParent: null,
  editingParentSolution: null, creatingPost: false, editingProfile: false,
  viewingExpertDetail: null, currentConsultExpertId: null,
  showModal: false, modalContent: { icon: '', title: '', content: '' },
  showConfirmModal: false, confirmContent: '', confirmCallback: null,
  editingMoodEntryId: null, viewingResourceId: null, editingMedicalRecordId: null,
  showAvatarPicker: false, avatarTarget: null, avatarTargetChild: null,

  login: (username: string, password: string) => {
    const s = get(); const u = s.registeredUsers.find(u => u.username === username && u.password === password);
    if (u) { set({ currentUser: u.username, role: u.role, isLoggedIn: true, currentPage: u.role === 'parent' ? 'child' : u.role === 'expert' ? 'center' : u.role === 'admin' ? 'feedback' : 'home' }); return true; }
    return false;
  },
  logout: () => set({ currentUser: null, role: '', isLoggedIn: false, currentPage: '' }),
  setPage: (page: string) => set({ currentPage: page }),
  addFriend: (name: string) => { const s = get(); if (!s.friends.includes(name)) set({ friends: [...s.friends, name] }); },
  sendMessage: (chatId: string, content: string) => { const s = get(); const msgs = s.messages[chatId] || []; set({ messages: { ...s.messages, [chatId]: [...msgs, { id: Date.now(), sender: s.currentUser || '未知', content, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }] } }); },
  handleAlert: (id: number) => { const s = get(); set({ alerts: s.alerts.map(a => a.id === id ? { ...a, handled: !a.handled } : a) }); },
  toggleLike: (postId: number) => { const s = get(); set({ forumPosts: s.forumPosts.map(p => { if (p.id !== postId) return p; const liked = p.likedBy.includes(s.currentUser || ''); return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? p.likedBy.filter(u => u !== s.currentUser) : [...p.likedBy, s.currentUser || ''] }; }) }); },
  toggleExpertLike: (postId: number) => { const s = get(); set({ expertForumPosts: s.expertForumPosts.map(p => { if (p.id !== postId) return p; const liked = p.likedBy.includes(s.currentUser || ''); return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? p.likedBy.filter(u => u !== s.currentUser) : [...p.likedBy, s.currentUser || ''] }; }) }); },
  addComment: (postId: number, content: string) => { const s = get(); set({ forumPosts: s.forumPosts.map(p => p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), author: s.currentUser || '匿名', content, time: new Date().toLocaleString('zh-CN') }] } : p) }); },
  addExpertComment: (postId: number, content: string) => { const s = get(); set({ expertForumPosts: s.expertForumPosts.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), { id: Date.now(), author: s.currentUser || '匿名', content, time: new Date().toLocaleString('zh-CN') }] } : p) }); },
  addMedicalComment: (recordId: number, content: string, isPublic: boolean) => { const s = get(); set({ medicalComments: [...s.medicalComments, { id: Date.now(), recordId, expert: s.currentUser || '匿名', content, isPublic, time: new Date().toLocaleString('zh-CN') }] }); },
  createPost: (title: string, content: string) => { const s = get(); set({ forumPosts: [{ id: Date.now(), author: s.currentUser || '匿名', avatar: '👤', time: new Date().toLocaleString('zh-CN'), title, content, likes: 0, likedBy: [], comments: [] }, ...s.forumPosts], creatingPost: false }); },
  createExpertPost: (title: string, tags: string, content: string, isPublic: boolean) => { const s = get(); set({ expertForumPosts: [{ id: Date.now(), author: s.currentUser || '匿名', avatar: '/avatars/expert.png', time: new Date().toLocaleString('zh-CN'), title, content, tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [], isPublic, likes: 0, likedBy: [], comments: [] }, ...s.expertForumPosts], creatingPost: false }); },
  acceptConsultation: (id: number, agreedTime: string, fee: number, paymentMethod: string) => { const s = get(); set({ consultationRequests: s.consultationRequests.map(r => r.id === id ? { ...r, status: 'accepted' as const, agreedTime, fee, paymentMethod } : r) }); },
  rejectConsultation: (id: number) => { const s = get(); set({ consultationRequests: s.consultationRequests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r) }); },
  payConsultation: (id: number) => { const s = get(); set({ consultationRequests: s.consultationRequests.map(r => r.id === id ? { ...r, isPaid: true } : r) }); },
  submitConsultRequest: (description: string, preferredTime: string) => { const s = get(); const expert = s.experts.find(e => e.id === s.currentConsultExpertId); if (!expert) return; set({ consultationRequests: [...s.consultationRequests, { id: Date.now(), parent: s.currentUser || '匿名', expert: expert.name, status: 'pending', requestTime: new Date().toLocaleString('zh-CN'), description, preferredTime: preferredTime || '待商议', agreedTime: null, fee: null, paymentMethod: null, isPaid: false, student: s.selectedChildForParent?.name || s.students[0]?.name || '' }], currentConsultExpertId: null }); },
  saveParentSolution: (recordId: number, solution: string) => { const s = get(); set({ medicalRecords: s.medicalRecords.map(r => r.id === recordId ? { ...r, parentSolution: solution } : r), editingParentSolution: null }); },
  registerUser: (user) => { const s = get(); if (s.registeredUsers.find(u => u.username === user.username)) return false; if (s.registeredUsers.find(u => u.phone === user.phone)) return false; set({ registeredUsers: [...s.registeredUsers, user as User] }); return true; },
  openModal: (icon: string, title: string, content: string) => set({ showModal: true, modalContent: { icon, title, content } }),
  closeModal: () => set({ showModal: false, modalContent: { icon: '', title: '', content: '' } }),
  openConfirm: (message: string, onConfirm: () => void) => set({ showConfirmModal: true, confirmContent: message, confirmCallback: onConfirm }),
  closeConfirm: () => set({ showConfirmModal: false, confirmContent: '', confirmCallback: null }),
  executeConfirm: () => { const s = get(); s.confirmCallback?.(); set({ showConfirmModal: false, confirmContent: '', confirmCallback: null }); },
  selectStudent: (student) => set({ selectedStudent: student }),
  selectChildForParent: (student) => set({ selectedChildForParent: student }),
  addMoodEntry: (entry) => { const s = get(); set({ moodJournal: [...s.moodJournal, { ...entry, id: Date.now() }] }); },
  updateMoodEntry: (id, data) => { const s = get(); set({ moodJournal: s.moodJournal.map(e => e.id === id ? { ...e, ...data } : e), editingMoodEntryId: null }); },
  addIEPGoal: (goal) => { const s = get(); set({ iepGoals: [...s.iepGoals, { ...goal, id: Date.now() }] }); },
  updateIEPProgress: (id, progress) => { const s = get(); set({ iepGoals: s.iepGoals.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g) }); },
  createNewConsultation: (data) => { const s = get(); set({ consultations: [...s.consultations, { id: Date.now(), student: data.student || '', parent: s.role === 'parent' ? (s.currentUser || '') : '待分配', expert: data.expert || '', type: data.type || 'video', scheduledTime: data.scheduledTime || new Date().toISOString(), status: 'scheduled', topic: data.topic || '', notes: data.notes || '', expertNotes: null, prescription: null, followUp: false, followUpDate: null }] }); },
  startConsultation: (id: number) => { const s = get(); const c = s.consultations.find(x => x.id === id); if (!c) return; s.openModal('🎥', '正在连接会诊...', `正在连接到${c.expert}的会诊房间...\n\n主题：${c.topic}\n学生：${c.student}\n类型：${c.type === 'video' ? '视频会诊' : c.type === 'audio' ? '语音会诊' : '文字会诊'}\n\n正在初始化音视频设备...`); },
  viewConsultationDetail: (id: number) => { const s = get(); const c = s.consultations.find(x => x.id === id); if (!c) return; s.openModal('📋', '会诊详情', `主题：${c.topic}\n学生：${c.student}\n专家：${c.expert}\n家长：${c.parent}\n类型：${c.type}\n状态：${c.status === 'completed' ? '已完成' : '待开始'}\n\n情况说明：${c.notes}\n\n专家建议：${c.expertNotes || '暂无'}\n处方建议：${c.prescription || '暂无'}\n\n${c.followUp ? `复诊时间：${c.followUpDate}` : ''}`); },
  fluctuateData: () => { const s = get(); set({ students: s.students.map(st => st.deviceStatus === 'online' ? { ...st, heartRate: Math.max(50, Math.min(140, st.heartRate + Math.floor((Math.random() - 0.5) * 8))), bodyTemp: Math.max(35.5, Math.min(39, parseFloat((st.bodyTemp + (Math.random() - 0.5) * 0.3).toFixed(1)))), steps: st.steps + Math.floor(Math.random() * 15), battery: Math.max(0, st.battery - (Math.random() > 0.8 ? 1 : 0)) } : st) }); },

  // New actions
  addMedicalAction: (recordId, content, role) => { const s = get(); const user = s.registeredUsers.find(u => u.username === s.currentUser); const author = user?.realName || s.currentUser || '匿名'; const action: ActionRecord = { id: Date.now(), author, role: role === 'teacher' ? '老师' : role === 'parent' ? '家长' : '专家', content, time: new Date().toLocaleString('zh-CN') }; set({ medicalRecords: s.medicalRecords.map(r => r.id === recordId ? { ...r, [`${role}Actions`]: [...(r[`${role}Actions` as keyof MedicalRecord] as ActionRecord[] || []), action] } : r) }); },
  toggleMedicalRecordPublic: (recordId) => { const s = get(); set({ medicalRecords: s.medicalRecords.map(r => r.id === recordId ? { ...r, isPublic: !r.isPublic } : r) }); },
  updateUserAvatar: (username, avatar) => { const s = get(); set({ registeredUsers: s.registeredUsers.map(u => u.username === username ? { ...u, avatar } : u) }); },
  updateChildAvatar: (studentId, avatar) => { const s = get(); set({ students: s.students.map(st => st.id === studentId ? { ...st, avatar } : st) }); },
}));
