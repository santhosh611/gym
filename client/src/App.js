import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FighterHomePage from './pages/FighterHomePage';
import FighterAttendancePage from './pages/FighterAttendancePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage';
import AddFighterPage from './pages/AddFighterPage';
import EditFighterPage from './pages/EditFighterPage';
import ViewFighterDetailsPage from './pages/ViewFighterDetailsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAttendancePage from './pages/AdminAttendancePage';
import AdminSidebar from './components/AdminSidebar';
import FighterSidebar from './components/FighterSidebar';
import api from './api/api';
import LoginPage from './pages/LoginPage';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
    }

    const ProtectedRoute = ({ children, role }) => {
        if (!user || (role && user.role !== role)) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    const AdminLayout = ({ children }) => (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <AdminSidebar handleLogout={handleLogout} />
            <div className="flex-grow p-4 md:p-8">
                {children}
            </div>
        </div>
    );

    const FighterLayout = ({ children }) => (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <FighterSidebar handleLogout={handleLogout} />
            <div className="flex-grow p-4 md:p-8">
                {children}
            </div>
        </div>
    );

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage setUser={setUser} />} />

                {/* Admin Routes with Sidebar */}
                <Route path="/admin" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout><AdminDashboardPage /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout><DashboardPage /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/add-fighter" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout><AddFighterPage /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/edit-fighter/:id" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout><EditFighterPage /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/fighter/:id" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout><ViewFighterDetailsPage /></AdminLayout>
                    </ProtectedRoute>
                } />
                 <Route path="/admin/attendance" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout><AdminAttendancePage /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout><AdminSettingsPage /></AdminLayout>
                    </ProtectedRoute>
                } />

                {/* Fighter Route */}
                <Route path="/fighter" element={
                    <ProtectedRoute role="fighter">
                        <FighterLayout><FighterHomePage user={user} /></FighterLayout>
                    </ProtectedRoute>
                } />
                <Route path="/fighter/attendance" element={
                    <ProtectedRoute role="fighter">
                        <FighterLayout><FighterAttendancePage user={user} /></FighterLayout>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<h1 className="text-4xl text-center mt-20">404 - Not Found</h1>} />
            </Routes>
        </Router>
    );
};

export default App;