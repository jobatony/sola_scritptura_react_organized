import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Users, CheckCircle } from 'lucide-react';
import { useWebSocket } from '../../Context/WebSocketContext';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Header from '../../Components/Header';
import Button from '../../Components/Button';

const UserLobby = () => {
  const [internalStage, setInternalStage] = useState('waiting'); // 'waiting' | 'get_questions' | 'ready' | 'locked_in'
  const [questions, setQuestions] = useState([]); // Store questions temporarily
  
  const navigate = useNavigate();
  const { connect, isConnected, lastMessage, sendMessage } = useWebSocket(); // Ensure sendMessage is exposed from your Context

  // 1. Connect on Mount
  useEffect(() => {
    const compId = localStorage.getItem('current_competition_id');
    if (compId) connect(compId);
  }, []);

  // 2. WEBSOCKET LISTENER (The Brain)
  useEffect(() => {
    if (!lastMessage) return;

    // EVENT A: Moderator sends the questions (Step 1)
    if (lastMessage.type === 'game_questions_update') {
      console.log("Questions received:", lastMessage.payload);
      
      // Save data immediately
      setQuestions(lastMessage.payload);
      localStorage.setItem('quiz_questions', JSON.stringify(lastMessage.payload));
      
      // Update UI to let user "Get" them
      setInternalStage('get_questions');
    }

    // EVENT B: Moderator triggers the actual start (Step 3 - The "GO" signal)
    if (lastMessage.type === 'start_round') {
      console.log("Moderator started the round! Navigating...");
      
      // Grab questions from state or fallback to storage
      const questionsToPass = questions.length > 0 
        ? questions 
        : JSON.parse(localStorage.getItem('quiz_questions'));

      // ACTUAL NAVIGATION HAPPENS HERE
      navigate('user/quiz', { state: { questions: questionsToPass } });
    }

  }, [lastMessage]);

  // 3. HANDLER: User clicks "I'm Ready"
  const handleUserReady = () => {
    // A. Send signal to Moderator
    sendMessage({
        type: 'player_ready',
        status: true
    });

    // B. Lock the UI so they know they are waiting
    setInternalStage('locked_in');
  };

  // --- UI RENDER ---

  // STAGE 4: LOCKED IN (Waiting for Mod to press Start)
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
          <div className="spin" style={{ 
              width: '24px', height: '24px', 
              border: '3px solid white', borderTopColor: 'transparent', 
              borderRadius: '50%', margin: '0 auto' 
          }}></div>
        </div>
      </ScreenWrapper>
    );
  }

  // STAGE 3: READY (User has reviewed, needs to confirm readiness)
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
          <Button 
            variant="outline" 
            onClick={handleUserReady} // <--- Triggers WebSocket message, NOT navigation
            style={{ borderColor: '#fff', color: '#fff', padding: '20px 40px' }}
          >
            I'm Ready
          </Button>
        </div>
      </ScreenWrapper>
    );
  }

  // STAGE 2: GET QUESTIONS (Transition)
  if (internalStage === 'get_questions') {
    return (
      <ScreenWrapper>
        <Card className="text-center">
          <Header title="Round One" subtitle="Prepare yourself" />
          <div style={{ padding: '40px 0' }}>
            <Button 
              onClick={() => setInternalStage('ready')} 
              className="w-full"
              style={{ padding: '24px', fontSize: '1.2rem' }}
            >
              Get Questions
            </Button>
          </div>
        </Card>
      </ScreenWrapper>
    );
  }

  // STAGE 1: WAITING
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