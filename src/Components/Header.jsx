import React from 'react';
import { BookOpen, LogOut } from 'lucide-react';

const Header = ({ title, subtitle, showLogout, onLogout }) => (
  <div className="header">
    <div className="header-icon-box">
      <BookOpen color="white" size={32} />
    </div>
    <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>{title}</h1>
    {subtitle && <p style={{ margin: 0, color: 'var(--text-muted)' }}>{subtitle}</p>}
    {showLogout && (
      <button 
        onClick={onLogout} 
        style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
      >
        <LogOut size={24} />
      </button>
    )}
  </div>
);

export default Header;