import React, { useState, useEffect } from 'react';
import { Users, CheckCircle } from 'lucide-react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Header from '../../Components/Header';
import Button from '../../Components/Button';

// This component handles "Waiting", "Get Questions", and "Ready" states
const UserLobby = ({ stage, onNext }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (stage === 'get_questions') {
        const timer = setTimeout(() => setActive(true), 2000);
        return () => clearTimeout(timer);
    }
  }, [stage]);

  if (stage === 'ready') {
    return (
      <ScreenWrapper style={{ backgroundColor: '#312e81', color: 'white' }}>
        <div className="text-center">
          <div className="mb-6 pulse">
            <CheckCircle size={80} color="#34d399" style={{ margin: '0 auto' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 16px 0' }}>Questions Ready!</h1>
          <p style={{ color: '#c7d2fe', fontSize: '1.2rem', marginBottom: '48px' }}>Keep your eyes on the screen.</p>
          <Button variant="outline" onClick={onNext}>Dev: Start Quiz</Button>
        </div>
      </ScreenWrapper>
    );
  }

  if (stage === 'get_questions') {
    return (
      <ScreenWrapper>
        <Card className="text-center">
          <Header title="Round One" subtitle="Prepare yourself" />
          <div style={{ padding: '40px 0' }}>
            <Button 
              onClick={onNext} 
              disabled={!active} 
              className="w-full"
              style={{ padding: '24px', fontSize: '1.2rem', opacity: active ? 1 : 0.5 }}
            >
              {active ? 'Get Questions' : 'Waiting for Moderator...'}
            </Button>
          </div>
        </Card>
      </ScreenWrapper>
    );
  }

  // Default: Waiting for participants
  return (
    <ScreenWrapper>
      <Card className="text-center">
        <div style={{ margin: '40px auto', position: 'relative', width: '80px', height: '80px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--secondary)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent' }} className="spin"></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Users color="var(--primary)" />
          </div>
        </div>
        <h2 className="mb-2">Waiting for Participants</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Please wait while others join the session...</p>
        <Button variant="secondary" onClick={onNext} style={{ fontSize: '0.9rem' }}>Dev: Simulate All Ready</Button>
      </Card>
    </ScreenWrapper>
  );
};

export default UserLobby;