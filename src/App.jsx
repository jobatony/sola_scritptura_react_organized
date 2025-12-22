import React, { useState } from 'react';

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
  const [view, setView] = useState('landing'); 

  const renderView = () => {
    switch(view) {
      // User Flow
      case 'landing': return <Landing onSelect={(type) => setView(type === 'user' ? 'user_passcode' : 'mod_login')} />;
      case 'user_passcode': return <UserPasscode onNext={() => setView('user_waiting')} />;
      case 'user_waiting': return <UserLobby stage="waiting" onNext={() => setView('user_get_questions')} />;
      case 'user_get_questions': return <UserLobby stage="get_questions" onNext={() => setView('user_ready')} />;
      case 'user_ready': return <UserLobby stage="ready" onNext={() => setView('user_quiz')} />;
      case 'user_quiz': return <UserQuiz onNext={() => setView('user_waiting_results')} />;
      case 'user_waiting_results': return <UserResults status="waiting" onNext={() => setView('user_qualified')} />; 
      case 'user_qualified': return <UserResults status="qualified" onNext={() => setView('user_waiting')} />;
      case 'user_disqualified': return <UserResults status="disqualified" onReset={() => setView('landing')} />;

      // Moderator Flow
      case 'mod_login': return <ModAuth onLogin={() => setView('mod_dashboard')} />;
      case 'mod_dashboard': return <ModDashboard onNavigate={(dest) => setView(dest === 'register' ? 'mod_register' : 'mod_existing')} />;
      
      // Setup Flow
      case 'mod_register': return <ModSetup step="register" onNext={() => setView('mod_settings')} />;
      case 'mod_settings': return <ModSetup step="settings" onNext={() => setView('mod_participants')} />;
      case 'mod_participants': return <ModSetup step="participants" onNext={() => setView('mod_waiting')} />;
      case 'mod_existing': return <ModSetup step="participants" onNext={() => setView('mod_waiting')} />; 

      // Lobby & Gameplay
      case 'mod_waiting': return <ModLobby mode="waiting" onNext={() => setView('mod_gen_questions')} />;
      case 'mod_gen_questions': return <ModLobby mode="generating" onNext={() => setView('mod_quiz')} />;
      case 'mod_quiz': return <ModGameplay mode="live" onNext={() => setView('mod_correction')} />;
      case 'mod_correction': return <ModGameplay mode="correction" onNext={() => setView('mod_results')} />;
      case 'mod_results': return <ModGameplay mode="results" onNext={() => setView('mod_waiting')} />; 

      default: return <Landing onSelect={(type) => setView(type === 'user' ? 'user_passcode' : 'mod_login')} />;
    }
  };

  return (
    <div className="font-sans">
        {view !== 'landing' && (
            <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
                <button onClick={() => setView('landing')} style={{ background: '#1f2937', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: 0.5, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.5}>
                    EXIT DEMO
                </button>
            </div>
        )}
        {renderView()}
    </div>
  );
}