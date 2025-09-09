import React, { useState, useEffect } from 'react';
import api from '../api/api';
import FighterList from '../components/FighterList';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    const [fighters, setFighters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFighters = async () => {
            try {
                const fightersRes = await api.get('/fighters/roster');
                setFighters(fightersRes.data);
            } catch (err) {
                console.error('Error fetching fighters:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFighters();
    }, []);

    const handleDelete = async (fighterId) => {
        if (window.confirm('Are you sure you want to delete this fighter?')) {
            try {
                await api.delete(`/fighters/${fighterId}`);
                setFighters(fighters.filter(fighter => fighter._id !== fighterId));
                alert('Fighter deleted successfully!');
            } catch (err) {
                console.error('Error deleting fighter:', err);
                alert('Error deleting fighter.');
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading fighters...</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-600">All Fighters</h2>
                <div className="flex space-x-2">
                    <Link
                        to="/admin/settings"
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
                    >
                        Settings
                    </Link>
                    <Link
                        to="/admin/attendance"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
                    >
                        Attendance
                    </Link>
                    <Link
                        to="/admin/add-fighter"
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                    >
                        + Add Fighter
                    </Link>
                </div>
            </div>
            <FighterList fighters={fighters} handleDelete={handleDelete} />
        </div>
    );
};

export default AdminDashboardPage;