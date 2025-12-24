import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

const UserQuiz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 1. Get Questions from Navigation State
    const questions = location.state?.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // 2. Timer State
    const [timeLeft, setTimeLeft] = useState(10);
    const [isAnswered, setIsAnswered] = useState(false); // Lock selection
    
    // 3. Data Collection
    const answersRef = useRef([]); // Store results without re-rendering
    const timerRef = useRef(null);

    const currentQuestion = questions[currentIndex];

    // --- A. TIMER LOGIC ---
    useEffect(() => {
        if (currentIndex >= questions.length) return;

        setTimeLeft(10);
        setIsAnswered(false);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex]);

    // --- B. HANDLE TIME UP (Auto Advance) ---
    const handleTimeUp = () => {
        clearInterval(timerRef.current);
        
        // Record 'No Answer' if they didn't pick one
        if (!isAnswered) {
            recordAnswer(null, 10);
        }
        
        moveToNext();
    };

    // --- C. HANDLE USER SELECTION ---
    const handleOptionClick = (option) => {
        if (isAnswered) return; // Prevent changing answer
        
        clearInterval(timerRef.current);
        setIsAnswered(true);
        
        const timeTaken = 10 - timeLeft;
        recordAnswer(option, timeTaken);
        
        // Optional: Small delay before next question so they see what they clicked
        setTimeout(moveToNext, 500); 
    };

    const recordAnswer = (answer, time) => {
        answersRef.current.push({
            question_id: currentQuestion.id,
            selected_answer: answer, // e.g., "Genesis" or null
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
        const token = localStorage.getItem('token');

        const payload = {
            competition_id: compId,
            participant_code: pCode,
            round_number: 1, // You might want to pass this dynamically too
            answers: answersRef.current
        };

        try {
            await fetch('http://localhost:8000/api/game/submit-round/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(payload)
            });
            // Navigate to waiting screen
            navigate('/user/waiting-results'); 
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    if (!currentQuestion) return <div>Loading Quiz...</div>;

    // Combine options: correct + wrongs (You should shuffle these ideally)
    const options = [
        currentQuestion.correct_book, 
        currentQuestion.wrong_option_1, 
        currentQuestion.wrong_option_2, 
        currentQuestion.wrong_option_3
    ].sort(() => Math.random() - 0.5);

    return (
        <ScreenWrapper>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span>Question {currentIndex + 1} / {questions.length}</span>
                    <span style={{ color: timeLeft < 4 ? 'red' : 'inherit', fontWeight: 'bold' }}>
                        {timeLeft}s
                    </span>
                </div>

                <h3 style={{ minHeight: '80px', fontSize: '1.2rem' }}>
                    {currentQuestion.verse_text}
                </h3>

                <div className="grid-2" style={{ gap: '12px', marginTop: '20px' }}>
                    {options.map((opt, idx) => (
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
};

export default UserQuiz;