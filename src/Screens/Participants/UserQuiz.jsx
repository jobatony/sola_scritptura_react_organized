// jobatony/sola_scritptura_react_organized/src/Screens/Participants/UserQuiz.jsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

const UserQuiz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get Questions and Round from Navigation State
    const questions = location.state?.questions || [];
    const roundNumber = location.state?.round || 1; 

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isAnswered, setIsAnswered] = useState(false); 
    
    const answersRef = useRef([]); 
    const timerRef = useRef(null);

    const currentQuestion = questions[currentIndex];

    // Shuffle options when the current question changes
    const shuffledOptions = useMemo(() => {
        if (!currentQuestion || !currentQuestion.options) return [];
        return [...currentQuestion.options].sort(() => Math.random() - 0.5);
    }, [currentQuestion]);

    // --- A. TIMER SETUP ---
    useEffect(() => {
        if (!currentQuestion) return;

        // Reset state for the new question
        setTimeLeft(10);
        setIsAnswered(false);

        // Start the timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Cleanup interval on unmount or when moving to next question
        return () => clearInterval(timerRef.current);
    }, [currentIndex, currentQuestion]); // Re-run only when index changes

    // --- B. MONITOR TIME UP ---
    // This separate effect handles the "Time Up" logic safely
    useEffect(() => {
        if (timeLeft === 0 && !isAnswered) {
            handleTimeUp();
        }
    }, [timeLeft, isAnswered]);

    // --- C. HANDLERS ---
    const handleTimeUp = () => {
        clearInterval(timerRef.current);
        // Only record if we haven't already answered
        if (!isAnswered) {
            recordAnswer(null, 10); // Null answer implies timeout
            moveToNext();
        }
    };

    const handleOptionClick = (option) => {
        if (isAnswered) return; // Prevent double clicking
        
        setIsAnswered(true); // Lock the answer immediately
        clearInterval(timerRef.current); // Stop timer
        
        const timeTaken = 10 - timeLeft; 
        recordAnswer(option, timeTaken);
        
        // Short delay for UX, then move
        setTimeout(moveToNext, 500); 
    };

    const recordAnswer = (answer, time) => {
        answersRef.current.push({
            question_id: currentQuestion.id,
            selected_answer: answer, 
            time_taken: time
        });
    };

    const moveToNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            submitResults();
        }
    };

    const submitResults = async () => {
        const compId = localStorage.getItem('current_competition_id');
        const pCode = localStorage.getItem('participant_code');

        const payload = {
            competition_id: compId,
            participant_code: pCode,
            round_number: roundNumber,
            answers: answersRef.current
        };

        try {
            await fetch('http://localhost:8000/api/game/submit-round/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            navigate('/user/waiting-results'); 
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    // Prevent crashing if questions are empty or loading
    if (!currentQuestion) {
        return (
            <ScreenWrapper>
                <Card>
                    <div className="text-center">
                        <h2>Loading Quiz...</h2>
                        <p>Setting up your questions.</p>
                    </div>
                </Card>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span>Question {currentIndex + 1} / {questions.length}</span>
                    <span style={{ color: timeLeft < 4 ? 'red' : 'inherit', fontWeight: 'bold' }}>
                        {timeLeft}s
                    </span>
                </div>

                <h3 style={{ minHeight: '80px', fontSize: '1.2rem', marginBottom: '20px' }}>
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
                                // Ensure text is visible (black) and background changes on answer
                                color: isAnswered ? '#666' : 'black', 
                                borderColor: '#ccc',
                                backgroundColor: isAnswered ? '#e5e7eb' : 'white',
                                cursor: isAnswered ? 'not-allowed' : 'pointer'
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