import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users } from 'lucide-react';
import { useWebSocket } from '../../Context/WebSocketContext';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

const ModLobby = ({ onNext }) => {

    const navigate = useNavigate();
    // 1. Data State
    const [allParticipants, setAllParticipants] = useState([]);
    const [onlineCodes, setOnlineCodes] = useState(new Set());
    const [readyCodes, setReadyCodes] = useState(new Set()); // New: Track who is ready
    const [questions, setQuestions] = useState([]);
    const { competitionId } = useParams();
    // 2. UI State
    const [mode, setMode] = useState('lobby'); // 'lobby' | 'generating'
    const [step, setStep] = useState(0); // 0=Spin, 1=Disperse, 2=ReadyMonitor

    const { lastMessage, connect, sendMessage } = useWebSocket();

    // --- A. INITIAL LOAD (HTTP) ---
    useEffect(() => {
        const fetchParticipants = async () => {
            const compId = localStorage.getItem('current_competition_id');
            const token = localStorage.getItem('token');
            if (!compId) return;

            try {
                // Fetch Master List
                const response = await fetch(`http://localhost:8000/api/auth/competitions/${compId}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                const data = await response.json();
                if (data.participants) {
                    setAllParticipants(data.participants);
                }
                
                // Connect WebSocket
                connect(compId);
                
            } catch (err) {
                console.error("Error loading participants:", err);
            }
        };
        fetchParticipants();
    }, []);

    // --- B. LIVE UPDATES (WebSocket) ---
    useEffect(() => {
        if (!lastMessage) return;

        // 1. Connection Status Updates
        if (lastMessage.type === 'initial_state') {
            setOnlineCodes(new Set(lastMessage.active_players));
        }
        if (lastMessage.type === 'player_joined') {
            const newCode = lastMessage.payload.code;
            setOnlineCodes(prev => new Set(prev).add(newCode));
        }
        
        // 2. Ready Status Updates (NEW)
        if (lastMessage.type === 'player_ready_update') {
             // Expecting payload: { code: "1234", status: true }
            const { code, status } = lastMessage.payload;
            setReadyCodes(prev => {
                const newSet = new Set(prev);
                if (status) newSet.add(code);
                else newSet.delete(code);
                return newSet;
            });
        }
        
    }, [lastMessage]);

    // --- C. ACTIONS ---

    // Action 1: Distribute Questions (Start Animation)
    const handleDistribute = async () => {
        setMode('generating');
        const token = localStorage.getItem('token');
        console.log({token})
        console.log("Starting game for ID:", competitionId);

        const finalId = competitionId || localStorage.getItem('current_competition_id');

        
        if (!token) {
        alert("You are not logged in! (No token found)");
        return;
        }

        try {
            // Trigger Backend Generation & Broadcast
            // Ensure your backend sends 'game_questions_update' to users upon success
            const response = await fetch('http://localhost:8000/api/game/generate-questions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`,
                 },
                
                body: JSON.stringify({ competition_id: compId })
            });
            
            if (response.ok) {
                // Animation Sequence
                setStep(0); // Generating...
                setTimeout(() => setStep(1), 1500); // Dispersing...
                setTimeout(() => setStep(2), 4000); // Monitoring Readiness

                const data = await response.json();
            
                console.log("Questions Generated:", data);
                
                // 👇 ADD THIS LINE to save the questions
                setQuestions(data.questions); 
                
                alert("Questions distributed successfully!");

                setCurrentRound(data.round); 

                console.log("Round generated:", data.round);
                alert(`Round ${data.round} generated!`);
            }
            
        } catch (err) {
            console.error("Generation failed", err);
            setMode('lobby'); // Revert on error
        }
    };

    // Action 2: Start The Round (Trigger Navigation)
    // In ModLobby.jsx

const handleStartGame = () => {
    // 1. Send the WebSocket Signal (Triggers Users)
    sendMessage({
        type: 'start_round', // <--- CRITICAL: Must match UserLobby
        payload: { 
            round: currentRound
        }
    });

    // 2. Navigate the Moderator (Triggers Mod Screen)
    // Ensure you pass the 'questions' data so ModGameplay doesn't crash
    navigate('/mod/gameplay', { 
        state: { 
            questions: questions, // Ensure this variable exists in ModLobby
            competitionId: finalId,
            round: currentRound 
        } 
    });
};

    // Computed Checks
    const allJoined = allParticipants.length > 0 && allParticipants.every(p => onlineCodes.has(p.access_code));
    const readyCount = readyCodes.size;
    const totalCount = allParticipants.length;
    // For testing, you might want allowStart if readyCount > 0, strict mode requires readyCount === totalCount
    const canStart = totalCount > 0 && readyCount === totalCount; 


    // --- D. RENDER: GENERATING / MONITORING MODE ---
    if (mode === 'generating') {
        return (
            <ScreenWrapper>
                <Card className="text-center" style={{ padding: '48px 24px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    
                    {/* STEP 0: GENERATING */}
                    {step === 0 && (
                        <div className="fade-in">
                            <div className="spin" style={{ width: '48px', height: '48px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px auto' }}></div>
                            <h2 style={{ fontSize: '1.25rem' }}>Generating Random Questions...</h2>
                        </div>
                    )}

                    {/* STEP 1: DISPERSING */}
                    {step === 1 && (
                        <div className="fade-in">
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                                <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                                <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                                <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.4s' }}></div>
                            </div>
                            <h2 style={{ fontSize: '1.25rem' }}>Dispersing to Devices...</h2>
                            <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#6b7280' }}>Syncing with participants...</p>
                        </div>
                    )}

                    {/* STEP 2: MONITORING READINESS (New Logic) */}
                    {step === 2 && (
                        <div className="fade-in">
                            <CheckCircle size={64} color={canStart ? "#10b981" : "#fbbf24"} style={{ margin: '0 auto 16px auto', transition: 'color 0.3s' }} />
                            
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                                {canStart ? "Everyone is Ready!" : "Waiting for Players..."}
                            </h2>
                            
                            <p className="mb-6 text-xl font-bold text-gray-600">
                                {readyCount} / {totalCount} Ready
                            </p>

                            {/* Mini List of who is still waiting */}
                            {!canStart && (
                                <div className="mb-6 text-sm text-gray-400">
                                    Waiting for: {allParticipants.filter(p => !readyCodes.has(p.access_code)).map(p => p.full_name.split(' ')[0]).join(', ')}
                                </div>
                            )}

                            <Button 
                                onClick={handleStartGame} 
                                className="w-full"
                                disabled={!canStart} // Enforce readiness
                                style={{ opacity: canStart ? 1 : 0.5 }}
                            >
                                Start Round Now
                            </Button>
                        </div>
                    )}
                </Card>
            </ScreenWrapper>
        );
    }

    // --- E. RENDER: WAITING LOBBY (Default) ---
    return (
        <ScreenWrapper>
            <Card className="text-center">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Waiting for Participants</h2>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#047857', background: '#d1fae5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
                        <span className="pulse" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginRight: '8px' }}></span>
                        Live Socket Active
                    </div>
                </div>

                {/* Grid Section */}
                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', marginBottom: '32px' }}>
                    
                    {allParticipants.length === 0 ? <p>No registered participants found.</p> : 
                     allParticipants.map((p) => {
                        const isOnline = onlineCodes.has(p.access_code);
                        const isReady = readyCodes.has(p.access_code); // Check readiness

                        // Dynamic Styles
                        let borderColor = '#f3f4f6'; // Default Gray
                        let bgColor = 'transparent';
                        let textColor = '#9ca3af';

                        if (isOnline) {
                            borderColor = '#10b981'; // Green Border
                            textColor = 'inherit';
                            bgColor = '#ecfdf5'; // Light Green
                        }
                        if (isReady) {
                            borderColor = '#059669'; // Darker Green
                            bgColor = '#10b981'; // Solid Green
                            textColor = 'white';
                        }

                        return (
                            <div key={p.id} style={{ 
                                padding: '16px', 
                                borderRadius: '12px', 
                                transition: 'all 0.3s ease',
                                border: `2px solid ${borderColor}`, 
                                background: bgColor, 
                                color: textColor,
                                transform: isOnline ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: isOnline ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                    {isReady ? <CheckCircle size={14} /> : null}
                                    {isReady ? 'Ready' : (isOnline ? 'Online' : 'Offline')}
                                </div>
                                <div style={{ fontSize: '0.8rem' }}>{p.full_name.split(' ')[0]}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Status Text */}
                <p className="mb-4 text-sm text-gray-500">
                    {onlineCodes.size} / {allParticipants.length} Connected
                </p>

                {/* Action Button */}
                <Button 
                    onClick={handleDistribute} 
                    className="w-full" 
                    style={{ padding: '16px' }}
                    disabled={!allJoined} // Wait for connections
                >
                    {allJoined ? "Distribute Questions" : "Waiting for All Players..."}
                </Button>
            </Card>
        </ScreenWrapper>
    );
};

export default ModLobby;