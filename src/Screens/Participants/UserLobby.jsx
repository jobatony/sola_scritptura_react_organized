// jobatony/sola_scritptura_react_organized/src/Screens/Participants/UserLobby.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Users, CheckCircle } from 'lucide-react';
import { useWebSocket } from '../../Context/WebSocketContext';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Header from '../../Components/Header';
import Button from '../../Components/Button';

const UserLobby = () => {
  const [internalStage, setInternalStage] = useState('waiting'); 
  const [gameData, setGameData] = useState(null);
  
  const navigate = useNavigate();
  const { connect, isConnected, lastMessage, sendMessage } = useWebSocket();

  // 1. Connect on Mount
  useEffect(() => {
    const compId = localStorage.getItem('current_competition_id');
    if (compId) connect(compId, 'participant');
    
    // Attempt to load existing game data on mount (in case of refresh)
    const savedData = localStorage.getItem('quiz_game_data');
    if (savedData) {
        setGameData(JSON.parse(savedData));
    }
  }, []);

  // 2. WEBSOCKET LISTENER
  useEffect(() => {
    if (!lastMessage) return;

    console.log("📨 [User Received]:", lastMessage.type, lastMessage);

    // EVENT A: Moderator sends the questions
    if (lastMessage.type === 'game_questions_update') {
      console.log("Questions received:", lastMessage.payload);
      setGameData(lastMessage.payload);
      localStorage.setItem('quiz_game_data', JSON.stringify(lastMessage.payload));
      setInternalStage('get_questions');
    }

    // EVENT B: Moderator triggers the start
    if (lastMessage.type === 'start_round_trigger') {
      console.log("Moderator started the round! Navigating...");
      
      const dataToPass = gameData || JSON.parse(localStorage.getItem('quiz_game_data'));

      if (dataToPass && dataToPass.questions) {
          navigate('/user/quiz', { 
              state: { 
                  questions: dataToPass.questions, 
                  round: dataToPass.round 
              } 
          });
      } else {
          console.error("Cannot start round: Missing Question Data");
      }
    }
  }, [lastMessage, gameData, navigate]);

  // 3. HANDLER: User clicks "I'm Ready"
  const handleUserReady = () => {
    sendMessage({ type: 'player_ready', status: true });
    setInternalStage('locked_in');
  };

  // --- UI RENDER ---

  if (internalStage === 'locked_in') {
    return (
      <ScreenWrapper style={{ backgroundColor: '#312e81', color: 'white' }}>
        <div className="text-center">
          <div className="mb-6">
            <CheckCircle size={80} color="#34d399" style={{ margin: '0 auto', opacity: 0.5 }} />
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>You are Ready!</h1>
          <p style={{ color: '#c7d2fe', fontSize: '1.2rem', marginBottom: '48px' }}>
            Waiting for the host to start the game...
          </p>
          <div className="spin" style={{ width: '24px', height: '24px', border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
        </div>
      </ScreenWrapper>
    );
  }

  if (internalStage === 'ready') {
    return (
      <ScreenWrapper style={{ backgroundColor: '#312e81', color: 'white' }}>
        <div className="text-center">
          <div className="mb-6 pulse">
            <CheckCircle size={80} color="#34d399" style={{ margin: '0 auto' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 16px 0' }}>Questions Ready!</h1>
          <p style={{ color: '#c7d2fe', fontSize: '1.2rem', marginBottom: '48px' }}>
            Click below when you are ready to begin.
          </p>
          <Button variant="outline" onClick={handleUserReady} style={{ borderColor: '#fff', color: '#fff', padding: '20px 40px' }}>
            I'm Ready
          </Button>
        </div>
      </ScreenWrapper>
    );
  }

  if (internalStage === 'get_questions') {
    return (
      <ScreenWrapper>
        <Card className="text-center">
          <Header title="Round One" subtitle="Prepare yourself" />
          <div style={{ padding: '40px 0' }}>
            <Button onClick={() => setInternalStage('ready')} className="w-full" style={{ padding: '24px', fontSize: '1.2rem' }}>
              Get Questions
            </Button>
          </div>
        </Card>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Card className="text-center">
        <div style={{ margin: '40px auto', position: 'relative', width: '80px', height: '80px' }}>
          <div className="spin" style={{ position: 'absolute', inset: 0, border: '4px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Users color="var(--primary)" />
          </div>
        </div>
        <h2 className="mb-2">Waiting for Host</h2>
        <p style={{ color: 'var(--text-muted)' }}>
            {isConnected ? "Connected. Waiting for questions..." : "Connecting..."}
        </p>
      </Card>
    </ScreenWrapper>
  );
};

export default UserLobby;