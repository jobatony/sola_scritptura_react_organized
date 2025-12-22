import React from 'react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Header from '../../Components/Header';
import Button from '../../Components/Button';

const UserPasscode = ({ onNext }) => (
  <ScreenWrapper>
    <Card className="text-center">
      <Header title="Sola Scriptura" subtitle="Enter your access code to join the competition" />
      <div style={{ margin: '40px 0' }}>
        <input 
          type="text" 
          placeholder="0 0 0 0" 
          className="input-field passcode-input"
          maxLength={4}
        />
      </div>
      <Button onClick={onNext} className="w-full">Enter Competition</Button>
    </Card>
  </ScreenWrapper>
);

export default UserPasscode;