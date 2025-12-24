import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Header from '../../Components/Header';
import Button from '../../Components/Button';

const UserPasscode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    // Basic validation
    if (code.length < 4) {
        setError("Please enter a valid 4-digit code.");
        return;
    }
    
    setLoading(true);
    setError('');

    try {
        // 1. Verify Code via HTTP API
        const response = await fetch('http://localhost:8000/api/game/join/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_code: code })
        });

        const data = await response.json();

        if (response.ok) {
            // 2. Store Identity for the WebSocket connection
            localStorage.setItem('user_role', 'participant');
            localStorage.setItem('current_competition_id', data.competition_id);
            localStorage.setItem('participant_id', data.participant_id);
            localStorage.setItem('participant_name', data.participant_name);
            localStorage.setItem('participant_code', code); // We will send this to WS

            // 3. Go to Lobby (Where the WS connection actually happens)
            navigate('/user/waiting');
        } else {
            setError(data.error || 'Invalid code.');
        }
    } catch (err) {
        console.error(err);
        setError("Network error. Is the server running?");
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Card className="text-center">
        <Header title="Sola Scriptura" subtitle="Enter your access code to join" />
        
        <div style={{ margin: '40px 0' }}>
          <input 
            type="text" 
            placeholder="0 0 0 0" 
            className={`input-field passcode-input text-center text-3xl tracking-widest font-bold ${error ? 'border-red-500' : ''}`}
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Numbers only
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <Button onClick={handleJoin} className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Enter Competition'}
        </Button>
      </Card>
    </ScreenWrapper>
  );
};

export default UserPasscode;