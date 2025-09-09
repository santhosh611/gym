import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/api';

const Login = ({ setUser }) => {
    const [loginType, setLoginType] = useState(null); // 'admin' or 'fighter'
    const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
    const [fighterCredentials, setFighterCredentials] = useState({ email: '', password: '' });
    const [fighters, setFighters] = useState([]);
    const [selectedFighter, setSelectedFighter] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (loginType === 'fighter') {
            const fetchFighters = async () => {
                try {
                    const res = await api.get('/fighters/list');
                    setFighters(res.data);
                } catch (err) {
                    setError('Failed to fetch fighter list.');
                    console.error('Error fetching fighters:', err);
                }
            };
            fetchFighters();
        }
    }, [loginType]);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            const res = await api.post('/auth/login', { 
                email: adminCredentials.email, 
                password: adminCredentials.password 
            });
            
            // Store token
            localStorage.setItem('token', res.data.token);
            
            // Get user data to set state
            const userRes = await api.get('/auth/user');
            setUser(userRes.data);
            
            // Navigate to admin dashboard
            navigate('/admin');
        } catch (err) {
            setError('Invalid admin credentials.');
            console.error('Admin login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFighterLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            const res = await api.post('/auth/login', { 
                email: selectedFighter.email, 
                password: fighterCredentials.password 
            });
            
            // Store token
            localStorage.setItem('token', res.data.token);
            
            // Get user data to set state
            const userRes = await api.get('/auth/user');
            setUser(userRes.data);
            
            // Navigate to fighter dashboard
            navigate('/fighter');
        } catch (err) {
            setError('Invalid password for fighter.');
            console.error('Fighter login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFighterSelect = (fighter) => {
        setSelectedFighter(fighter);
        setFighterCredentials({ email: fighter.email, password: '' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Mutants Academy & AshurasTribe</h2>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                {!loginType && (
                    <div className="space-y-4">
                        <button onClick={() => setLoginType('admin')} className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">Admin Login</button>
                        <button onClick={() => setLoginType('fighter')} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">Fighter Login</button>
                    </div>
                )}

                {loginType === 'admin' && (
                    <form onSubmit={handleAdminLogin} className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Admin Login</h3>
                        <div className="mb-4">
                            <input type="email" value={adminCredentials.email} onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-6">
                            <input type="password" value={adminCredentials.password} onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })} placeholder="Password" className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <button type="button" onClick={() => setLoginType(null)} className="mt-4 text-sm text-gray-500 hover:underline">Back</button>
                    </form>
                )}

                {loginType === 'fighter' && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Fighter Login</h3>
                        {!selectedFighter ? (
                            <ul className="max-h-64 overflow-y-auto border rounded-md p-2">
                                {fighters.map(fighter => (
                                    <li key={fighter._id} onClick={() => handleFighterSelect(fighter)} className="py-2 px-3 hover:bg-gray-100 cursor-pointer rounded-md text-left">
                                        {fighter.name} <span className="text-sm text-gray-500">({fighter.fighterBatchNo})</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <form onSubmit={handleFighterLogin}>
                                <h4 className="text-md mb-2">Login as: <span className="font-bold">{selectedFighter.name}</span></h4>
                                <div className="mb-4">
                                    <input type="password" value={fighterCredentials.password} onChange={(e) => setFighterCredentials({ ...fighterCredentials, password: e.target.value })} placeholder="Password" className="w-full px-3 py-2 border rounded-md" required />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                <button type="button" onClick={() => setSelectedFighter(null)} className="mt-4 text-sm text-gray-500 hover:underline">Go back to fighter list</button>
                            </form>
                        )}
                        <button type="button" onClick={() => setLoginType(null)} className="mt-4 text-sm text-gray-500 hover:underline">Back to main login</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;