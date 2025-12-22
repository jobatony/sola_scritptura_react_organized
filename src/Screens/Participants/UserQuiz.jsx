import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

const UserQuiz = ({ onNext }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentVerse, setCurrentVerse] = useState(1);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <ScreenWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', width: '100%', fontWeight: 'bold', color: 'var(--primary)' }}>
        <span>Verse {currentVerse}/6</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--secondary)', padding: '8px 16px', borderRadius: '20px' }}>
          <Clock size={20} />
          <span>{timeLeft}s</span>
        </div>
      </div>
      
      <Card className="mb-6 text-center" style={{ borderTop: '4px solid var(--primary)' }}>
        <p style={{ fontSize: '1.25rem', fontFamily: 'serif', fontStyle: 'italic', lineHeight: '1.6' }}>
          "For God so loved the world that he gave his one and only Son..."
        </p>
      </Card>

      <div className="grid-2 w-full">
        {[1, 2, 3, 4].map((opt) => (
          <button key={opt} className="quiz-option">
            <span className="quiz-option-letter">
              {['A', 'B', 'C', 'D'][opt-1]}
            </span>
            <span style={{ fontWeight: 500 }}>John 3:16</span>
          </button>
        ))}
      </div>
      
      {timeLeft === 0 && (
        <div className="fade-in" style={{ marginTop: '32px', textAlign: 'center' }}>
           <Button onClick={onNext}>Next Question / Finish</Button>
        </div>
      )}
    </ScreenWrapper>
  );
};

export default UserQuiz;