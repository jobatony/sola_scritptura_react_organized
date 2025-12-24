import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import Hook
import { ChevronRight, Send, Play, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useWebSocket } from '../../Context/WebSocketContext';
import ScreenWrapper from '../../Components/Screenwrapper';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

const ModSetup = ({ step }) => {
  const navigate = useNavigate();
  const { connect } = useWebSocket();
  const [loading, setLoading] = useState(false);

  // --- STEP 1: REGISTER ---
  
  const [name, setName] = useState('');
  const [churchName, setChurchName] = useState('');

  // Participant Entry State
  const [participants, setParticipants] = useState([]); 
  const [pName, setPName] = useState('');
  const [pAge, setPAge] = useState('');
  const [pUnit, setPUnit] = useState('');
  const [pEmail, setPEmail] = useState('');

  // --- STATE: Settings Step ---
  const [rounds, setRounds] = useState(3);
  const [updating, setUpdating] = useState(false);

  // --- STATE: Participants View Step ---
  const [fetchedParticipants, setFetchedParticipants] = useState([]);

  
  const handleAddParticipant = () => {
    if (!pName) return alert("Name is required");

    const newPerson = {
        full_name: pName,
        age: pAge ? parseInt(pAge) : null,
        unit_fellowship: pUnit,
        email: pEmail
    };

    setParticipants([...participants, newPerson]);
    // Reset small inputs
    setPName(''); setPAge(''); setPUnit(''); setPEmail('');
  };

  const handleRemoveParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };
  
  const handleRegister = async () => {
      if (!name) return alert("Competition Name is required");
      setLoading(true);

      // 1. Retrieve the token we saved earlier
        const token = localStorage.getItem('token');
        console.log("MY TOKEN IS:", token);

      // Check if token exists (optional safety check)
        if (!token) {
        alert("You are not logged in!");
        navigate('/mod/login');
        return;
        }

      try {
        // 1. Send Data to Django
        const response = await fetch('http://localhost:8000/api/auth/competitions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 2. FIX: Add the Authorization header
                'Authorization': `Token ${token}` 
            },
            body: JSON.stringify({ 
                name: name, 
                church_name: churchName,
                participants: participants 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 2. Save the ID for the next steps
            localStorage.setItem('current_competition_id', data.id);
            // 3. Move to next page
            navigate('/mod/settings');
        } else {
            alert('Error creating competition');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (step === 'register') {
      return (
        <ScreenWrapper>
            <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <Button variant="secondary" style={{ padding: '8px 16px' }} onClick={() => navigate('/modDashboard')}>Back</Button>
                <h2 style={{ margin: 0 }}>Register Competition</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Competition Info */}
                <div>
                    <label className="mb-2" style={{ display: 'block', fontWeight: 500 }}>Event / Church Name</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Grace Fellowship Youth" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input 
                        type="text" 
                        className="input-field mt-2" 
                        placeholder="Church Name (Optional)" 
                        value={churchName}
                        onChange={(e) => setChurchName(e.target.value)}
                    />
                </div>
                
                {/* Add Participant Form */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginTop: '16px' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Add Participant</h3>
                        <span className="text-sm text-gray-500">{participants.length} added</span>
                    </div>

                    <div className="grid-2" style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input value={pName} onChange={e=>setPName(e.target.value)} type="text" className="input-field" placeholder="Full Name" />
                        <input value={pAge} onChange={e=>setPAge(e.target.value)} type="number" className="input-field" placeholder="Age" />
                        <input value={pUnit} onChange={e=>setPUnit(e.target.value)} type="text" className="input-field" placeholder="Unit / Class" />
                        <input value={pEmail} onChange={e=>setPEmail(e.target.value)} type="email" className="input-field" placeholder="Email (Opt)" />
                    </div>
                    
                    <Button variant="secondary" className="w-full" style={{ borderStyle: 'dashed' }} onClick={handleAddParticipant}>
                        <Plus size={16} className="mr-2" /> Add Another Participant
                    </Button>

                    {/* Temporary List Preview */}
                    {participants.length > 0 && (
                        <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
                            <h4 className="font-bold text-gray-500 mb-2">Queue:</h4>
                            {participants.map((p, i) => (
                                <div key={i} className="flex justify-between border-b py-1">
                                    <span>{p.full_name}</span>
                                    <Trash2 size={14} className="text-red-500 cursor-pointer" onClick={() => handleRemoveParticipant(i)}/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleRegister} disabled={loading}>
                    {loading ? 'Creating...' : 'Next: Settings'} <ChevronRight size={16} />
                </Button>
            </div>
            </Card>
        </ScreenWrapper>
      );
  }



  // --- STEP 2: SETTINGS ---
  
    const handleUpdateSettings = async (nextDestination) => {
      setUpdating(true);
      
      // Retrieve the ID we saved in the "Register" step
      const compId = localStorage.getItem('current_competition_id');
      const token = localStorage.getItem('token');

      if (!compId) {
        alert("No competition found. Please register first.");
        navigate('/mod/register');
        return;
      }

      try {
        // 2. Use PATCH to update the specific competition
        // Note the URL includes the ID: /competitions/${compId}/
        const response = await fetch(`http://localhost:8000/api/auth/competitions/${compId}/`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({ 
                number_of_rounds: parseInt(rounds) // Ensure it's a number
            })
        });

        if (response.ok) {
            // 3. Navigate based on which button was clicked
            if (nextDestination === 'home') {
                navigate('/modDashboard');
            } else {
                navigate('/mod/participants'); // or wherever "Start Now" goes
            }
        } else {
            alert('Failed to update settings');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUpdating(false);
      }
    };


    if (step === 'settings') {
        return (
        <ScreenWrapper>
            <Card>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="secondary" onClick={() => navigate('/mod/register')} style={{ padding: '8px 12px' }}>
                <ArrowLeft size={16} />
                </Button>
                <h2 className="text-2xl font-bold m-0">Gameplay Settings</h2>
            </div>
            
            <div className="mb-8">
                <label className="block font-medium mb-3 text-gray-700">Number of Rounds</label>
                
                {/* 4. The New Input Field */}
                <input 
                    type="number" 
                    min="1" 
                    max="20"
                    className="input-field text-lg font-bold" // Reuse your input-field class
                    style={{ maxWidth: '150px' }}
                    value={rounds}
                    onChange={(e) => setRounds(e.target.value)}
                />
                <p className="text-gray-500 text-sm mt-2">
                    Enter the total number of rounds for this competition.
                </p>
            </div>

            <div className="flex gap-4">
                {/* "Save for Later" updates the DB, then goes Home */}
                <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={() => handleUpdateSettings('home')}
                    disabled={updating}
                >
                    {updating ? 'Saving...' : 'Save for Later'}
                </Button>
                
                {/* "Start Now" updates the DB, then goes to Participants */}
                <Button 
                    onClick={() => handleUpdateSettings('next')} 
                    className="w-full"
                    disabled={updating}
                >
                    {updating ? 'Saving...' : 'Start Now'}
                </Button>
            </div>
            </Card>
        </ScreenWrapper>
        );
    }

  // --- STEP 3: PARTICIPANTS ---
  
  useEffect(() => {
    if (step === 'participants') {

        const fetchData = async () => {
            const compId = localStorage.getItem('current_competition_id');
            const token = localStorage.getItem('token');
            
            if (!compId || !token) return; // Safety check

            try {
                // GET request to: /api/auth/competitions/5/
                const response = await fetch(`http://localhost:8000/api/auth/competitions/${compId}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                
                const data = await response.json();
                
                // The Serializer returns: { id: 1, name: "...", participants: [...] }
                // We only care about the list inside it.
                if (response.ok && data.participants) {
                    setFetchedParticipants(data.participants);
                }
            } catch (err) {
                console.error("Failed to load participants", err);
            }
        };
        fetchData();
    }
  }, [step]);
  
  if (step === 'participants') {

    const handleProceed = () => {
            const compId = localStorage.getItem('current_competition_id');
            
            // A. Open the connection
            connect(compId); 
            
            // B. Navigate to the Lobby
            navigate('/mod/waiting'); 
        };

    return (
      <ScreenWrapper>
        <Card>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
                {/* Back Button goes to Settings */}
                <Button variant="secondary" onClick={() => navigate('/mod/settings')} style={{ padding: '8px 12px' }}>
                    <ArrowLeft size={16} />
                </Button>
                <h2 className="text-2xl font-bold m-0">Registered Participants</h2>
            </div>
            <Button variant="secondary" className="text-sm">
              <Send size={16} className="mr-2" /> Email Codes to All
            </Button>
          </div>
          
          <div className="overflow-x-auto mb-6 border border-gray-100 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Unit</th>
                  <th className="p-4 border-b">Access Code</th>
                  <th className="p-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fetchedParticipants.length === 0 ? (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">No participants found.</td></tr>
                ) : (
                    // DYNAMIC LIST RENDERING STARTS HERE
                    fetchedParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        {/* 1. Name */}
                        <td className="p-4 font-medium text-gray-900">{p.full_name}</td>
                        
                        {/* 2. Unit (handles empty values) */}
                        <td className="p-4 text-gray-500">{p.unit_fellowship || '-'}</td>
                        
                        {/* 3. Access Code (Generated by Backend) */}
                        <td className="p-4">
                            <span className="font-mono font-bold text-blue-600 bg-blue-50 rounded px-2 py-1">
                                {p.access_code}
                            </span>
                        </td>
                        
                        {/* 4. Status */}
                        <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase
                            ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {p.status}
                        </span>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            {/* Next Button goes to Waiting Room */}
            <Button onClick={handleProceed}>
              Proceed to Gameplay <Play size={16} className="ml-2" />
            </Button>
          </div>
        </Card>
      </ScreenWrapper>
    );
  }

  return null;
};

export default ModSetup;