import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/Sidebar';
import FlowingBackground from '@/components/FlowingBackground';
import { AppModal, ConfirmModal } from '@/components/AppModals';
import gsap from 'gsap';

import { TeacherHome, TeacherAlerts, TeacherStudents, TeacherDevices } from './teacher';
import { ParentChildPage, MoodJournalPage, ParentConsultPage } from './parent';
import { AdminFeedbackPage, AdminInvitePage, AdminAIConfigPage, AdminSystemPage } from './admin';
import { ExpertCenterPage, ExpertConsultPage, ExpertProfilePage } from './expert';
import { ChatPage, ForumPage, ExpertForumPage, MedicalPage, ConsultationPage, ResourcesPage } from './shared';
import { IEPPage } from './features';
import ApiDocsPage from './features/ApiDocsPage';
import ResourceDetailPage from './features/ResourceDetailPage';
import ExpertDetailPage from './features/ExpertDetailPage';

export default function Dashboard() {
  const { currentPage, role, fluctuateData } = useStore();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => fluctuateData(), 3000);
    return () => clearInterval(interval);
  }, [fluctuateData]);

  useEffect(() => {
    if (contentRef.current) gsap.fromTo(contentRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
  }, [currentPage]);

  const renderPage = () => {
    const p = currentPage;
    if (p === 'home') return <TeacherHome />;
    if (p === 'alerts') return <TeacherAlerts />;
    if (p === 'students') return <TeacherStudents />;
    if (p === 'devices') return <TeacherDevices />;
    if (p === 'child') return <ParentChildPage />;
    if (p === 'mood') return <MoodJournalPage />;
    if (p === 'consult') return role === 'parent' ? <ParentConsultPage /> : role === 'expert' ? <ExpertConsultPage /> : <div />;
    if (p === 'feedback') return <AdminFeedbackPage />;
    if (p === 'invite') return <AdminInvitePage />;
    if (p === 'ai-config') return <AdminAIConfigPage />;
    if (p === 'system') return <AdminSystemPage />;
    if (p === 'center') return <ExpertCenterPage />;
    if (p === 'medical') return <MedicalPage />;
    if (p === 'profile') return <ExpertProfilePage />;
    if (p === 'chat') return <ChatPage />;
    if (p === 'forum') return <ForumPage />;
    if (p === 'expert-forum') return <ExpertForumPage />;
    if (p === 'consultation') return <ConsultationPage />;
    if (p === 'iep') return <IEPPage />;
    if (p === 'resources') return <ResourcesPage />;
    if (p === 'api-docs') return <ApiDocsPage />;
    if (p === 'resourceDetail') return <ResourceDetailPage />;
    if (p === 'expertDetail') return <ExpertDetailPage />;
    return <TeacherHome />;
  };

  return (
    <div className="min-h-screen relative">
      <FlowingBackground />
      <Sidebar />
      <main className="ml-[250px] min-h-screen relative" style={{ zIndex: 1 }}>
        <div className="p-6 max-w-[1440px]">
          <div ref={contentRef} className="page-transition">
            {renderPage()}
          </div>
        </div>
      </main>
      <AppModal />
      <ConfirmModal />
    </div>
  );
}
