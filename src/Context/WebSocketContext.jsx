import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    // We use useRef for the socket so it doesn't trigger re-renders on every internal change
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);

    const connect = (competitionId) => {
        // Prevent multiple connections
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

        // 1. Retrieve BOTH credentials
        const token = localStorage.getItem('token');
        const pCode = localStorage.getItem('participant_code'); // <--- ADD THIS LINE
        const userRole = localStorage.getItem('user_role'); // <--- CHECK THE ROLE


        let wsUrl = `ws://localhost:8000/ws/competition/${competitionId}/`;

        // LOGIC: If I am explicitly a participant, USE THE CODE. 
        // Otherwise, default to token (Moderator).
        if (userRole === 'participant' && pCode) {
            wsUrl += `?code=${pCode}`;
        } else if (token) {
            wsUrl += `?token=${token}`;
        } else {
             console.error("No credentials found! Cannot connect.");
             return;
        }

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("WS Message:", data);
            setLastMessage(data); // Components can listen to this
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
            setIsConnected(false);
        };

        socketRef.current = ws;
    };

    const sendMessage = (data) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(data));
        } else {
            console.error("WebSocket is not open");
        }
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
    };

    // Cleanup on app unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ connect, disconnect, sendMessage, isConnected, lastMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);