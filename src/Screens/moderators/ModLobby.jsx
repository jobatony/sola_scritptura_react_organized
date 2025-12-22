import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

// Merges "Waiting Room" and "Question Generation" states
const ModLobby = ({ mode, onNext }) => {
  const [step, setStep] = useState(0);

  // For Question Gen Animation
  useEffect(() => {
    if (mode === 'generating') {
        const t1 = setTimeout(() => setStep(1), 1000); 
        const t2 = setTimeout(() => setStep(2), 2500); 
        return () => { clearTimeout(t1); clearTimeout(t2); }
    }
  }, [mode]);

  if (mode === 'generating') {
    return (
        <ScreenWrapper>
            <Card className="text-center" style={{ padding: '48px 24px' }}>
                {step === 0 && (
                     <>
                        <div className="spin" style={{ width: '48px', height: '48px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px auto' }}></div>
                        <h2 style={{ fontSize: '1.25rem' }}>Generating Random Questions...</h2>
                     </>
                )}
                {step === 1 && (
                     <>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                            <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                            <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animationDelay: '0.4s' }}></div>
                        </div>
                        <h2 style={{ fontSize: '1.25rem' }}>Dispersing to Devices...</h2>
                        <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>User 1 [OK]... User 2 [OK]...</div>
                     </>
                )}
                {step === 2 && (
                    <div className="fade-in">
                        <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 16px auto' }} />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Ready to Start</h2>
                        <Button onClick={onNext} className="w-full">Start Round Now</Button>
                    </div>
                )}
            </Card>
        </ScreenWrapper>
    );
  }

  // Default Waiting Room
  return (
    <ScreenWrapper>
      <Card className="text-center">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Waiting for Participants</h2>
          <div style={{ display: 'flex', alignItems: 'center', color: '#047857', background: '#d1fae5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
            <span className="pulse" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginRight: '8px' }}></span>
            Live Socket Active
          </div>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', marginBottom: '32px' }}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} style={{ padding: '16px', borderRadius: '12px', border: i < 6 ? '2px solid #10b981' : '2px solid #f3f4f6', background: i < 6 ? '#ecfdf5' : 'transparent', color: i < 6 ? 'inherit' : '#9ca3af' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{i < 6 ? 'Connected' : 'Waiting...'}</div>
              <div style={{ fontSize: '0.8rem' }}>{i < 6 ? 'Sarah J.' : '-'}</div>
            </div>
          ))}
        </div>

        <Button onClick={onNext} className="w-full" style={{ padding: '16px' }}>
           Generate Questions
        </Button>
      </Card>
    </ScreenWrapper>
  );
};

export default ModLobby;