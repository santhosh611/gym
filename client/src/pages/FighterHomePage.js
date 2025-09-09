import React, { useState, useEffect } from 'react';
import FighterDashboard from '../components/FighterDashboard';
import AttendanceList from '../components/AttendanceList';
import api from '../api/api';

const FighterHomePage = ({ user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(true);

    useEffect(() => {
        if (user && activeTab === 'attendance') {
            fetchAttendance();
        }
    }, [user, activeTab]);

    const fetchAttendance = async () => {
        try {
            // Use the new endpoint that gets records for the authenticated fighter
            const res = await api.get('/attendance/fighter');
            setAttendanceRecords(res.data);
        } catch (err) {
            console.error('Error fetching attendance records:', err);
            // If the endpoint returns 404, it means no records exist yet
            if (err.response?.status === 404) {
                setAttendanceRecords([]);
            }
        } finally {
            setLoadingAttendance(false);
        }
    };

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return <FighterDashboard user={user} />;
        }
        if (activeTab === 'attendance') {
            if (loadingAttendance) {
                return <div className="p-8 text-center text-gray-500">Loading attendance records...</div>;
            }
            return <AttendanceList records={attendanceRecords} />;
        }
        return null;
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <div className="p-4 md:p-8 w-full">
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-2 px-4 font-semibold text-lg ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`py-2 px-4 font-semibold text-lg ${activeTab === 'attendance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    >
                        Attendance
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default FighterHomePage;