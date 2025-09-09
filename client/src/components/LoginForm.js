import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginForm = ({ setUser }) => {
    const [loginType, setLoginType] = useState(null); // 'admin' or 'fighter'
    const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
    const [fighterCredentials, setFighterCredentials] = useState({ password: '' });
    const [fighters, setFighters] = useState([]);
    const [selectedFighter, setSelectedFighter] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (loginType === 'fighter') {
            const fetchFighters = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/fighters/list');
                    setFighters(res.data);
                } catch (err) {
                    setError('Failed to fetch fighter list.');
                    console.error(err);
                }
            };
            fetchFighters();
        }
    }, [loginType]);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { ...adminCredentials, role: 'admin' });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            window.location.href = '/admin';
        } catch (err) {
            setError('Invalid admin credentials.');
            console.error(err);
        }
    };

    const handleFighterLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email: selectedFighter.email, password: fighterCredentials.password, role: 'fighter' });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            window.location.href = '/fighter';
        } catch (err) {
            setError('Invalid password for fighter.');
            console.error(err);
        }
    };

    const handleFighterSelect = (fighter) => {
        setSelectedFighter(fighter);
        setFighterCredentials({ password: '' });
    };

    return (
        <>
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
                    <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">Login</button>
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
                                <input type="password" value={fighterCredentials.password} onChange={(e) => setFighterCredentials({ password: e.target.value })} placeholder="Password" className="w-full px-3 py-2 border rounded-md" required />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">Login</button>
                            <button type="button" onClick={() => setSelectedFighter(null)} className="mt-4 text-sm text-gray-500 hover:underline">Go back to fighter list</button>
                        </form>
                    )}
                    <button type="button" onClick={() => setLoginType(null)} className="mt-4 text-sm text-gray-500 hover:underline">Back to main login</button>
                </div>
            )}
        </>
    );
};

export default LoginForm;