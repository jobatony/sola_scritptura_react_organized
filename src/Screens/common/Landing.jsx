import React from 'react';
import { BookOpen, Users, Settings } from 'lucide-react';

const Landing = ({ onSelect }) => (
  <div className="landing-page">
    <div className="container text-center">
      <div style={{ marginBottom: '40px' }}>
          <BookOpen color="#a5b4fc" size={96} style={{ margin: '0 auto 24px auto' }} />
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-1px' }}>Sola Scriptura</h1>
          <p style={{ color: '#c7d2fe', fontSize: '1.25rem', fontWeight: 300 }}>Digital Bible Quiz Competition Platform</p>
      </div>

      <div className="landing-grid">
        <button 
          onClick={() => onSelect('user')}
          className="landing-card"
        >
          <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)' }}>
            <Users color="white" size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>Participant App</h2>
          <p style={{ color: '#c7d2fe', margin: 0, lineHeight: 1.5 }}>Enter code, join lobby, answer verses, and track your qualification status.</p>
        </button>

        <button 
          onClick={() => onSelect('mod')}
          className="landing-card"
        >
          <div style={{ width: '48px', height: '48px', background: '#f59e0b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}>
            <Settings color="white" size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>Moderator App</h2>
          <p style={{ color: '#c7d2fe', margin: 0, lineHeight: 1.5 }}>Create events, manage users, disperse questions, and control eliminations.</p>
        </button>
      </div>
      <p style={{ marginTop: '48px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Interactive Prototype • React • CSS</p>
    </div>
  </div>
);

export default Landing;
