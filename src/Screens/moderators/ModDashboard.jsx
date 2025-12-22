import React from 'react';
import { Users, BookOpen } from 'lucide-react';
import ScreenWrapper from '../../Components/Screenwrapper';

const ModDashboard = ({ onNavigate }) => (
  <ScreenWrapper className="container-lg">
    <div className="grid-2 w-full">
      <button onClick={() => onNavigate('register')} className="card" style={{ cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
        <div style={{ width: '56px', height: '56px', background: 'var(--secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Users color="var(--primary)" />
        </div>
        <h3 className="mb-2" style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>New Competition</h3>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Register a new event and setup participants.</p>
      </button>

      <button onClick={() => onNavigate('existing')} className="card" style={{ cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--success)'} onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}>
        <div style={{ width: '56px', height: '56px', background: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <BookOpen color="var(--success)" />
        </div>
        <h3 className="mb-2" style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Existing Events</h3>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage or start previously created competitions.</p>
      </button>
    </div>
  </ScreenWrapper>
);

export default ModDashboard;
