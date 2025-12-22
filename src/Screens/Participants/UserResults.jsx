import React from 'react';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

// Handles Waiting, Qualified, and Disqualified logic
const UserResults = ({ status, onNext, onReset }) => {
  
  if (status === 'qualified') {
    return (
      <ScreenWrapper style={{ backgroundColor: 'var(--success)', color: 'white' }}>
        <Card className="text-center">
          <div style={{ width: '80px', height: '80px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <CheckCircle size={40} color="var(--success)" />
          </div>
          <h1 style={{ color: '#064e3b', margin: '0 0 8px 0' }}>Qualified!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You placed <span className="text-success" style={{ fontWeight: 'bold' }}>#4</span> in this round.</p>
          <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
            <p style={{ color: '#065f46', margin: 0, fontWeight: 500 }}>Prepare for Round 2</p>
          </div>
          <Button onClick={onNext} variant="success" className="w-full">
            Join Next Round
          </Button>
        </Card>
      </ScreenWrapper>
    );
  }

  if (status === 'disqualified') {
    return (
      <ScreenWrapper style={{ backgroundColor: 'var(--danger)', color: 'white' }}>
        <Card className="text-center">
          <div style={{ width: '80px', height: '80px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <XCircle size={40} color="var(--danger)" />
          </div>
          <h1 style={{ color: '#7f1d1d', margin: '0 0 8px 0' }}>Eliminated</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>You placed <span className="text-danger" style={{ fontWeight: 'bold' }}>#12</span>. Thank you for participating!</p>
          <Button onClick={onReset} variant="outline" style={{ color: '#9ca3af', borderColor: '#e5e7eb' }}>
            Back to Home
          </Button>
        </Card>
      </ScreenWrapper>
    );
  }

  // Default: Waiting for results
  return (
    <ScreenWrapper>
      <Card className="text-center">
        <div style={{ margin: '0 auto 24px auto', display: 'inline-block' }}>
          <Award size={80} color="var(--primary)" />
        </div>
        <h2 className="mb-2">Calculating Results</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The moderator is reviewing the round...</p>
        <Button variant="secondary" onClick={onNext} style={{ fontSize: '0.9rem' }}>Dev: Results Ready</Button>
      </Card>
    </ScreenWrapper>
  );
};

export default UserResults;
