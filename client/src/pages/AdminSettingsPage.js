import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AdminSettingsPage = () => {
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setLocation(res.data.location);
            } catch (err) {
                console.error('Error fetching settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setLocation({ ...location, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await api.post('/settings', location);
            setMessage('Gym location updated successfully!');
        } catch (err) {
            setMessage('Error updating location. Please try again.');
            console.error('Error updating settings:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Gym Settings</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <div>
                    <label className="block text-gray-700">Gym Latitude</label>
                    <input type="number" name="latitude" value={location.latitude} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-gray-700">Gym Longitude</label>
                    <input type="number" name="longitude" value={location.longitude} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Location'}
                </button>
            </form>
        </div>
    );
};

export default AdminSettingsPage;