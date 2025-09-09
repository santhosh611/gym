import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

const EditFighter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        fighterBatchNo: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFighter = async () => {
            try {
                const res = await api.get(`/fighters/${id}`);
                setFormData({
                    name: res.data.name,
                    fighterBatchNo: res.data.fighterBatchNo,
                    email: res.data.email,
                });
            } catch (err) {
                setMessage('Error fetching fighter data.');
                setIsError(true);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFighter();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/fighters/${id}`, formData);
            setMessage('Fighter updated successfully!');
            setIsError(false);
            setTimeout(() => navigate('/admin'), 2000);
        } catch (err) {
            setMessage('Error updating fighter. Please try again.');
            setIsError(true);
            console.error(err);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading fighter data for editing...</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Edit Fighter</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                {message && (
                    <div className={`p-3 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                <div>
                    <label className="block text-gray-700">Fighter Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-gray-700">Batch Number</label>
                    <input type="text" name="fighterBatchNo" value={formData.fighterBatchNo} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-gray-700">Email (for login)</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">Save Changes</button>
            </form>
        </div>
    );
};

export default EditFighter;