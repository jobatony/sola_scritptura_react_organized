import React from 'react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Header from '../../Components/Header';
import Button from '../../Components/Button';

const ModAuth = ({ onLogin }) => (
  <ScreenWrapper>
    <Card>
      <Header title="Moderator Portal" subtitle="Sign in to manage competitions" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>Username</label>
          <input type="text" className="input-field" placeholder="admin" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>Password</label>
          <input type="password" className="input-field" placeholder="••••••••" />
        </div>
        <Button onClick={onLogin} className="w-full mt-4">Login</Button>
      </div>
    </Card>
  </ScreenWrapper>
);

export default ModAuth;
