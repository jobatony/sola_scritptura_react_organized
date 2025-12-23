import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

// Common
import Landing from './Screens/common/Landing';

// Participant
import UserPasscode from './Screens/Participants/UserPasscode';
import UserLobby from './Screens/Participants/UserLobby';
import UserQuiz from './Screens/Participants/UserQuiz';
import UserResults from './Screens/Participants/UserResults';

// Moderator
import ModAuth from './Screens/moderators/ModAuth';
import ModDashboard from './Screens/moderators/ModDashboard';
import ModSetup from './Screens/moderators/ModSetup';
import ModLobby from './Screens/moderators/ModLobby';
import ModGameplay from './Screens/moderators/ModGameplay';

export default function App() {
  const navigate = useNavigate(); 

  const Layout = ({ children }) => (
    <>
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
        <button 
            onClick={() => navigate('/')} 
            style={{ background: '#1f2937', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: 0.5, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
            onMouseOver={e => e.currentTarget.style.opacity = 1} 
            onMouseOut={e => e.currentTarget.style.opacity = 0.5}
        >
            EXIT DEMO
        </button>
      </div>
      {children}
    </>
  );

  return (
    <div className="font-sans">
      <Routes>
        {/* --- Landing --- */}
        <Route path="/" element={
            <Landing onSelect={(type) => navigate(type === 'user' ? '/user/passcode' : '/mod/login')} />
        } />

        {/* --- User Flow (Still uses onNext props) --- */}
        <Route path="/user/passcode" element={
            <Layout><UserPasscode onNext={() => navigate('/user/waiting')} /></Layout>
        } />
        <Route path="/user/waiting" element={
            <Layout><UserLobby stage="waiting" onNext={() => navigate('/user/get_questions')} /></Layout>
        } />
        <Route path="/user/get_questions" element={
            <Layout><UserLobby stage="get_questions" onNext={() => navigate('/user/ready')} /></Layout>
        } />
        <Route path="/user/ready" element={
            <Layout><UserLobby stage="ready" onNext={() => navigate('/user/quiz')} /></Layout>
        } />
        <Route path="/user/quiz" element={
            <Layout><UserQuiz onNext={() => navigate('/user/waiting_results')} /></Layout>
        } />
        <Route path="/user/waiting_results" element={
            <Layout><UserResults status="waiting" onNext={() => navigate('/user/qualified')} /></Layout>
        } />
        <Route path="/user/qualified" element={
            <Layout><UserResults status="qualified" onNext={() => navigate('/user/waiting')} /></Layout>
        } />
        <Route path="/user/disqualified" element={
            <Layout><UserResults status="disqualified" onReset={() => navigate('/')} /></Layout>
        } />

        {/* --- Moderator Flow --- */}
        <Route path="/mod/login" element={
            <Layout><ModAuth /></Layout>
        } />
        
        {/* CHANGE 1: Removed onNavigate prop (ModDashboard handles it internally now) */}
        <Route path="/modDashboard" element={
            <Layout><ModDashboard /></Layout>
        } />

        {/* --- Setup Flow --- */}
        {/* CHANGE 2: Removed onNext props (ModSetup handles it internally now) */}
        <Route path="/mod/register" element={
            <Layout><ModSetup step="register" /></Layout>
        } />
        <Route path="/mod/existing" element={
            <Layout><ModSetup step="participants" /></Layout>
        } />
        <Route path="/mod/settings" element={
            <Layout><ModSetup step="settings" /></Layout>
        } />
        <Route path="/mod/participants" element={
            <Layout><ModSetup step="participants" /></Layout>
        } />

        {/* --- Lobby & Gameplay (These still use onNext until you update them) --- */}
        <Route path="/mod/waiting" element={
            <Layout><ModLobby mode="waiting" onNext={() => navigate('/mod/gen_questions')} /></Layout>
        } />
        <Route path="/mod/gen_questions" element={
            <Layout><ModLobby mode="generating" onNext={() => navigate('/mod/quiz')} /></Layout>
        } />
        <Route path="/mod/quiz" element={
            <Layout><ModGameplay mode="live" onNext={() => navigate('/mod/correction')} /></Layout>
        } />
        <Route path="/mod/correction" element={
            <Layout><ModGameplay mode="correction" onNext={() => navigate('/mod/results')} /></Layout>
        } />
        <Route path="/mod/results" element={
            <Layout><ModGameplay mode="results" onNext={() => navigate('/mod/waiting')} /></Layout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}