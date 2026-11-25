import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';
import LandingPage from './pages/LandingPage';
import StudentDirectory from './pages/StudentDirectory';
import MaterialsFeed from './pages/MaterialsFeed';
import AdminConsole from './pages/AdminConsole';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginInitialRole, setLoginInitialRole] = useState('student');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const openLoginModal = (role = 'student') => {
    setLoginInitialRole(role);
    setLoginModalOpen(true);
  };

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          openLoginModal={openLoginModal}
          openProfileModal={() => setProfileModalOpen(true)}
        />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {activePage === 'landing' && (
            <LandingPage setActivePage={setActivePage} openLoginModal={openLoginModal} />
          )}
          {activePage === 'students' && <StudentDirectory openLoginModal={openLoginModal} />}
          {activePage === 'feed' && <MaterialsFeed openLoginModal={openLoginModal} />}
          {activePage === 'admin' && <AdminConsole />}
        </main>

        <Footer setActivePage={setActivePage} />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          initialRole={loginInitialRole}
        />

        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      </div>
    </AppProvider>
  );
}
