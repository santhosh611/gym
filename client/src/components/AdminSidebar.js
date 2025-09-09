import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaAngleDown, FaAngleUp, FaCog, FaCalendarCheck } from 'react-icons/fa';

const AdminSidebar = ({ handleLogout }) => {
    const [isManageFightersOpen, setIsManageFightersOpen] = useState(false);

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
            <div className="text-xl font-bold mb-8">Admin Panel</div>
            <nav className="flex-grow">
                <ul>
                    <li className="mb-2">
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `block py-2 px-4 rounded-md transition duration-200 ${isActive ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
                            📊 Dashboard
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <button
                            onClick={() => setIsManageFightersOpen(!isManageFightersOpen)}
                            className="w-full flex justify-between items-center py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
                        >
                            <span>Manage Fighters</span>
                            {isManageFightersOpen ? <FaAngleUp /> : <FaAngleDown />}
                        </button>
                        {isManageFightersOpen && (
                            <ul className="pl-4 mt-2 space-y-1">
                                <li>
                                    <NavLink to="/admin" className={({ isActive }) => `block py-2 px-4 rounded-md transition duration-200 ${isActive ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
                                        View Fighters
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/add-fighter" className={({ isActive }) => `block py-2 px-4 rounded-md transition duration-200 ${isActive ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
                                        Add New Fighter
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="mb-2">
                        <NavLink to="/admin/attendance" className={({ isActive }) => `block py-2 px-4 rounded-md transition duration-200 ${isActive ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
                            <div className="flex items-center">
                                <FaCalendarCheck className="mr-3" /> Attendance
                            </div>
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink to="/admin/settings" className={({ isActive }) => `block py-2 px-4 rounded-md transition duration-200 ${isActive ? 'bg-red-600' : 'hover:bg-gray-700'}`}>
                            <div className="flex items-center">
                                <FaCog className="mr-3" /> Settings
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <button onClick={handleLogout} className="mt-auto w-full py-2 px-4 bg-gray-600 rounded-md hover:bg-gray-700 transition duration-200">
                Logout
            </button>
        </div>
    );
};

export default AdminSidebar;    