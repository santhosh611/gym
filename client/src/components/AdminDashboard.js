import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [fighters, setFighters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFighters = async () => {
            try {
                const res = await api.get('/fighters/roster');
                setFighters(res.data);
            } catch (err) {
                console.error('Error fetching fighter roster:', err);
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
        return <div className="p-8 text-center text-gray-500">Loading fighter roster...</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-600">View Fighters</h2>
            
            {fighters.length === 0 ? (
                <p className="text-gray-600 text-center">No fighters registered yet. Add a new fighter to get started.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Batch No.</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-center">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                            {fighters.map(fighter => (
                                <tr key={fighter._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 whitespace-nowrap">{fighter.name}</td>
                                    <td className="py-3 px-6">{fighter.fighterBatchNo}</td>
                                    <td className="py-3 px-6">{fighter.email}</td>
                                    <td className="py-3 px-6 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fighter.profile_completed ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {fighter.profile_completed ? 'Completed' : 'Incomplete'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-center whitespace-nowrap">
                                        <Link to={`/admin/edit-fighter/${fighter._id}`} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">Edit</Link>
                                        <button onClick={() => handleDelete(fighter._id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;