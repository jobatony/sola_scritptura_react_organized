import React from 'react';
import { ChevronRight, Send, Play } from 'lucide-react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

// Merges Register, Settings, and Participant List screens based on 'step' prop
const ModSetup = ({ step, onNext }) => {
  
  if (step === 'register') {
      return (
        <ScreenWrapper>
            <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <Button variant="secondary" style={{ padding: '8px 16px' }} onClick={() => {}}>Back</Button>
                <h2 style={{ margin: 0 }}>Register Competition</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                <label className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Event / Church Name</label>
                <input type="text" className="input-field" placeholder="e.g. Grace Fellowship Youth" />
                </div>
                
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginTop: '16px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Add Participant</h3>
                <div className="grid-2" style={{ marginBottom: '16px' }}>
                    <input type="text" className="input-field" placeholder="Full Name" />
                    <input type="text" className="input-field" placeholder="Age" />
                    <input type="text" className="input-field" placeholder="Class / Level" />
                    <input type="text" className="input-field" placeholder="Unit / Fellowship" />
                </div>
                <input type="email" className="input-field mb-4" placeholder="Email (Optional)" />
                <Button variant="secondary" className="w-full" style={{ borderStyle: 'dashed' }}>+ Add Another Participant</Button>
                </div>
            </div>
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onNext}>Next: Settings <ChevronRight size={16} /></Button>
            </div>
            </Card>
        </ScreenWrapper>
      );
  }

  if (step === 'settings') {
      return (
        <ScreenWrapper>
            <Card>
            <h2 style={{ marginBottom: '24px' }}>Gameplay Settings</h2>
            
            <div className="mb-6">
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Number of Rounds</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                {[1, 2, 3, 5, 10].map(n => (
                    <button key={n} style={{ width: '48px', height: '48px', borderRadius: '12px', border: 'none', background: n === 3 ? 'var(--primary)' : '#f3f4f6', color: n === 3 ? 'white' : 'inherit', fontWeight: 'bold', cursor: 'pointer' }}>
                    {n}
                    </button>
                ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <Button variant="secondary" className="w-full">Save for Later</Button>
                <Button onClick={onNext} className="w-full">Start Now</Button>
            </div>
            </Card>
        </ScreenWrapper>
      );
  }

  if (step === 'participants') {
    return (
        <ScreenWrapper className="container-lg">
            <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Registered Participants</h2>
                <Button variant="secondary" style={{ fontSize: '0.9rem', padding: '8px 16px' }}><Send size={16} style={{ marginRight: '8px' }} /> Email Codes to All</Button>
            </div>
            
            <div className="table-container mb-6">
                <table>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Access Code</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {[1,2,3].map((i) => (
                    <tr key={i}>
                        <td style={{ fontWeight: 500 }}>Participant {i}</td>
                        <td style={{ color: 'var(--text-muted)' }}>Youth Choir</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--primary)' }}>{1000 + i}</td>
                        <td><span className="status-badge status-pending">Pending</span></td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onNext}>Proceed to Gameplay <Play size={16} style={{ marginLeft: '8px' }} /></Button>
            </div>
            </Card>
        </ScreenWrapper>
    );
  }

  return null;
};

export default ModSetup;