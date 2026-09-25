import React, { useState, useEffect } from 'react';
import { User, HistoryItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { HomePlannerView } from './components/HomePlannerView';
import { PartyPlannerView } from './components/PartyPlannerView';
import { JewelryPlannerView } from './components/JewelryPlannerView';
import { HistoryView } from './components/HistoryView';
import { AuthModal } from './components/AuthModal';
import { RecommendationModal } from './components/RecommendationModal';
import { VsCodeGuideModal } from './components/VsCodeGuideModal';

export default function App() {
  // Current logged in user (default to demo user 'sai' so reviewers immediately see full dashboard & history)
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user_sai_101',
    username: 'sai',
    email: 'sai@example.com',
    fullName: 'Sai Kumar',
  });

  // Current view state
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // History list
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Modals state
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);
  const [vsCodeGuideOpen, setVsCodeGuideOpen] = useState(false);

  // Fetch recommendation history from backend API
  const fetchHistory = async () => {
    try {
      const username = currentUser ? currentUser.username : 'sai';
      const res = await fetch(`/api/history?username=${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.history) {
          setHistory(data.history);
        }
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser?.username }),
      });
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    fetchHistory();
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        currentUser={currentUser}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onLogout={handleLogout}
        onOpenVsCodeGuide={() => setVsCodeGuideOpen(true)}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={(view) => setCurrentView(view)}
            onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            user={currentUser}
            onNavigate={(view) => setCurrentView(view)}
            recentHistory={history}
            onSelectHistoryItem={(item) => setSelectedHistoryItem(item)}
          />
        )}

        {currentView === 'dashboard' && !currentUser && (
          <LandingView
            onNavigate={(view) => setCurrentView(view)}
            onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
          />
        )}

        {currentView === 'home_planner' && (
          <HomePlannerView onPlanCreated={fetchHistory} />
        )}

        {currentView === 'party_planner' && (
          <PartyPlannerView onPlanCreated={fetchHistory} />
        )}

        {currentView === 'jewelry_planner' && (
          <JewelryPlannerView onPlanCreated={fetchHistory} />
        )}

        {currentView === 'history' && (
          <HistoryView
            history={history}
            onSelectItem={(item) => setSelectedHistoryItem(item)}
            onDeleteItem={handleDeleteHistoryItem}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleAuthSuccess}
      />

      <RecommendationModal
        item={selectedHistoryItem}
        onClose={() => setSelectedHistoryItem(null)}
      />

      <VsCodeGuideModal
        isOpen={vsCodeGuideOpen}
        onClose={() => setVsCodeGuideOpen(false)}
      />
    </div>
  );
}
