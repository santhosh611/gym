import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const FighterAttendancePage = ({ user }) => {
    const [gymLocation, setGymLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGymLocation();
    }, []);

    const fetchGymLocation = async () => {
        try {
            const res = await api.get('/settings');
            setGymLocation(res.data.location);
        } catch (err) {
            console.error('Error fetching gym location:', err);
            setMessage('Error: Could not fetch gym location.');
        }
    };

    const handleAttendance = () => {
        if (navigator.geolocation) {
            setLoading(true);
            setMessage('Fetching your location...');
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    
                    try {
                        console.log('Submitting attendance with location:', { latitude, longitude });
                        const res = await api.post('/attendance/fighter', {
                            latitude,
                            longitude,
                            method: 'face-recognition'
                        });
                        setMessage(`✅ ${res.data.msg}${res.data.distance ? ` (Distance: ${res.data.distance}m)` : ''}`);
                    } catch (err) {
                        console.error('Attendance error:', err.response?.data || err.message);
                        const errorMsg = err.response?.data?.msg || 'Attendance could not be logged. Please try again.';
                        const distance = err.response?.data?.distance;
                        setMessage(`❌ ${errorMsg}${distance ? ` (Distance: ${distance}m)` : ''}`);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLoading(false);
                    let errorMessage = 'Error: Geolocation is required for attendance.';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Error: Location access denied. Please enable location services.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Error: Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Error: Location request timed out.';
                            break;
                    }
                    setMessage(errorMessage);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            setMessage('Error: Geolocation is not supported by your browser.');
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Attendance Management</h2>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <FaMapMarkerAlt className="text-6xl text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Punch Attendance</h3>
                <p className="text-gray-600 mb-6">
                    Stand within 100 meters of the gym and click the button below to log your attendance.
                </p>

                <button
                    onClick={handleAttendance}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Logging Attendance...' : 'Log My Attendance'}
                </button>
                
                {message && (
                    <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FighterAttendancePage;