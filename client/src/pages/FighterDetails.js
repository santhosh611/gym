import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import AdminAssessment from '../components/AdminAssessment';

const FighterDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fighterData, setFighterData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFighterDetails = async () => {
            try {
                const res = await api.get(`/fighters/${id}`);
                setFighterData(res.data);
            } catch (err) {
                console.error('Error fetching fighter details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFighterDetails();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading fighter details...</div>;
    }

    if (!fighterData) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">Fighter not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-red-600">Fighter Profile: {fighterData.name}</h1>
                    <button onClick={handleLogout} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Logout</button>
                </div>

                {/* Profile Details */}
                <h2 className="text-2xl font-semibold border-b pb-2 mb-4 text-gray-800">Profile Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-8">
                    <div><strong>Batch No:</strong> {fighterData.fighterBatchNo}</div>
                    <div><strong>Age:</strong> {fighterData.age}</div>
                    <div><strong>Gender:</strong> {fighterData.gender}</div>
                    <div><strong>Joining Date:</strong> {new Date(fighterData.dateOfJoining).toLocaleDateString()}</div>
                    <div><strong>Height:</strong> {fighterData.height}</div>
                    <div><strong>Weight:</strong> {fighterData.weight}</div>
                    <div className="col-span-1 md:col-span-2"><strong>Motto:</strong> {fighterData.motto}</div>
                </div>

                {/* Assessment Form */}
                <AdminAssessment fighterId={fighterData._id} />
            </div>
        </div>
    );
};

export default FighterDetails;