import React from 'react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

// Handles Live View, Correction, and Results
const ModGameplay = ({ mode, onNext }) => {

  if (mode === 'live') {
    return (
        <ScreenWrapper>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontFamily: 'monospace', background: '#111827', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem' }}>MODERATOR VIEW</span>
                    <div className="pulse" style={{ color: 'var(--danger)', fontWeight: 'bold' }}>LIVE: 00:08</div>
                </div>
                <div style={{ opacity: 0.5, filter: 'grayscale(1)', pointerEvents: 'none' }}>
                    <h3 style={{ marginBottom: '16px' }}>Current Question: John 3:16</h3>
                    <div className="grid-2">
                        <div className="quiz-option" style={{ borderColor: 'var(--primary)', background: 'var(--secondary)' }}>Option A</div>
                        <div className="quiz-option">Option B</div>
                        <div className="quiz-option">Option C</div>
                        <div className="quiz-option">Option D</div>
                    </div>
                </div>
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onNext} variant="secondary">Force End Round (Simulated)</Button>
                </div>
            </Card>
        </ScreenWrapper>
    );
  }

  if (mode === 'correction') {
    return (
        <ScreenWrapper>
            <Card>
                <h2 style={{ marginBottom: '24px' }}>Round Correction</h2>
                <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
                    {[1,2,3,4,5,6].map(q => (
                        <div key={q} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold' }}>Verse {q}</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>85% Correct</span>
                            </div>
                            <p style={{ color: 'var(--success)', fontWeight: 500, margin: '0 0 8px 0' }}>Correct: Option A "For God so loved..."</p>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                                 <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px' }}>Wrong: User 3, User 7</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <Button onClick={onNext} className="w-full">Proceed to Results</Button>
                </div>
            </Card>
        </ScreenWrapper>
    );
  }

  if (mode === 'results') {
    return (
        <ScreenWrapper>
            <Card>
                <h2 style={{ marginBottom: '8px' }}>Round Results & Elimination</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Check users to confirm elimination.</p>
    
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                    {[
                        {name: "Sarah J.", score: 60, status: 'safe'},
                        {name: "Mike T.", score: 50, status: 'safe'},
                        {name: "John D.", score: 20, status: 'danger'},
                        {name: "Lisa M.", score: 10, status: 'danger'},
                    ].map((u, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', background: u.status === 'danger' ? '#fef2f2' : 'white', borderColor: u.status === 'danger' ? '#fee2e2' : '#e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontWeight: 'bold', width: '24px', color: u.status === 'danger' ? 'var(--danger)' : 'inherit' }}>{idx + 1}</span>
                                <span style={{ fontWeight: 500 }}>{u.name}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-muted)' }}>{u.score}pts</span>
                                {u.status === 'danger' && (
                                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--danger)' }} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
    
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button variant="danger" className="w-full">Confirm Eliminations</Button>
                    <Button onClick={onNext} className="w-full" style={{ flex: 2 }}>Push Results & Next Round</Button>
                </div>
            </Card>
        </ScreenWrapper>
    );
  }

  return null;
};

export default ModGameplay;
