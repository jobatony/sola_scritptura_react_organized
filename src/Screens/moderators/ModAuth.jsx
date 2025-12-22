import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added Import
import Screenwrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

// 2. Removed 'navigateTo' from props
const ModAuth = () => {
  // 3. Initialized hook and named it 'navigateTo' to match your existing code
  const navigateTo = useNavigate(); 
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Ensure this URL matches your Django backend URL
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Optional: Store token or user data if your backend returns it
        // localStorage.setItem('user', JSON.stringify(data));
        navigateTo('/modDashboard'); // Note: Added '/' to ensure it goes to the correct route
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screenwrapper>
      <Card title="Moderator Login">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="p-3 border rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-lg bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            text={isLoading ? "Logging in..." : "Login"} 
            onClick={handleLogin} 
            fullWidth 
            disabled={isLoading}
          />
          <button 
            onClick={() => navigateTo('/')} // Changed 'landing' to '/' for home
            className="text-gray-500 text-sm hover:text-gray-700 mt-2"
          >
            Back to Home
          </button>
        </div>
      </Card>
    </Screenwrapper>
  );
};

export default ModAuth;