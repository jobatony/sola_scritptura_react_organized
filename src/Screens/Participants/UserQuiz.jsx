// jobatony/sola_scritptura_react_organized/src/Screens/Participants/UserQuiz.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

const UserQuiz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 1. Get Questions and Round from Navigation State
    const questions = location.state?.questions || [];
    const roundNumber = location.state?.round || 1; // Default to 1 if missing

    const [currentIndex, setCurrentIndex] = useState(0);
    
    // 2. Timer State
    const [timeLeft, setTimeLeft] = useState(10);
    const [isAnswered, setIsAnswered] = useState(false); 
    
    // 3. Data Collection
    const answersRef = useRef([]); 
    const timerRef = useRef(null);

    const currentQuestion = questions[currentIndex];

    // Shuffle options only when the current question changes
    const shuffledOptions = useMemo(() => {
        if (!currentQuestion) return [];
        // The backend sends 'options' as an array [wrong1, wrong2, wrong3, correct]
        // We must shuffle them so the answer isn't always the last one.
        return [...currentQuestion.options].sort(() => Math.random() - 0.5);
    }, [currentQuestion]);

    // --- A. TIMER LOGIC ---
    useEffect(() => {
        if (!currentQuestion) return;

        setTimeLeft(10);
        setIsAnswered(false);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Time is fully up
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex]);

    // --- B. HANDLE TIME UP ---
    const handleTimeUp = () => {
        clearInterval(timerRef.current);
        if (!isAnswered) {
            recordAnswer(null, 10); // Null answer implies timeout
        }
        moveToNext();
    };

    // --- C. HANDLE USER SELECTION ---
    const handleOptionClick = (option) => {
        if (isAnswered) return; 
        
        clearInterval(timerRef.current);
        setIsAnswered(true);
        
        const timeTaken = 10 - timeLeft; // Calculate time spent
        recordAnswer(option, timeTaken);
        
        // Immediate transition requested? 
        // If you want ZERO delay, call moveToNext() directly. 
        // A small delay (300ms) is usually better for UX to register the click.
        setTimeout(moveToNext, 300); 
    };

    const recordAnswer = (answer, time) => {
        answersRef.current.push({
            question_id: currentQuestion.id,
            selected_answer: answer, 
            time_taken: time
        });
    };

    // --- D. NEXT QUESTION / FINISH ---
    const moveToNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            submitResults();
        }
    };

    // --- E. SUBMIT TO BACKEND ---
    const submitResults = async () => {
        const compId = localStorage.getItem('current_competition_id');
        const pCode = localStorage.getItem('participant_code');
        // Token auth if required
        // const token = localStorage.getItem('token'); 

        const payload = {
            competition_id: compId,
            participant_code: pCode,
            round_number: roundNumber, // Use the dynamic round number
            answers: answersRef.current
        };

        try {
            await fetch('http://localhost:8000/api/game/submit-round/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // 'Authorization': `Token ${token}` // Uncomment if using tokens
                },
                body: JSON.stringify(payload)
            });
            navigate('/user/waiting-results'); 
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    if (!currentQuestion) return <div>Loading Quiz...</div>;

    return (
        <ScreenWrapper>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span>Question {currentIndex + 1} / {questions.length}</span>
                    <span style={{ color: timeLeft < 4 ? 'red' : 'inherit', fontWeight: 'bold' }}>
                        {timeLeft}s
                    </span>
                </div>

                {/* NOTE: Backend sends 'text', not 'verse_text' */}
                <h3 style={{ minHeight: '80px', fontSize: '1.2rem' }}>
                    {currentQuestion.text} 
                </h3>

                <div className="grid-2" style={{ gap: '12px', marginTop: '20px' }}>
                    {shuffledOptions.map((opt, idx) => (
                        <Button
                            key={idx}
                            variant="outline"
                            onClick={() => handleOptionClick(opt)}
                            disabled={isAnswered}
                            style={{ 
                                width: '100%', 
                                padding: '15px',
                                backgroundColor: isAnswered ? '#e5e7eb' : 'white'
                            }}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            </Card>
        </ScreenWrapper>
    );
}

export default UserQuiz;