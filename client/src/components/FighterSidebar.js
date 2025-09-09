import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';

const FighterSidebar = ({ handleLogout }) => {
    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
            <div className="text-xl font-bold mb-8">Fighter Panel</div>
            <nav className="flex-grow">
                <ul>
                    <li className="mb-2">
                        <NavLink to="/fighter" className={({ isActive }) => `block py-2 px-4 rounded-md transition duration-200 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                            <div className="flex items-center">
                                <FaUser className="mr-3" /> Dashboard
                            </div>
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink to="/fighter/attendance" className={({ isActive }) => `block py-2 px-4 rounded-md transition duration-200 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                            <div className="flex items-center">
                                <FaCheckCircle className="mr-3" /> Attendance
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <button onClick={handleLogout} className="mt-auto w-full py-2 px-4 bg-gray-600 rounded-md hover:bg-gray-700 transition duration-200 flex items-center justify-center">
                <FaSignOutAlt className="mr-2" /> Logout
            </button>
        </div>
    );
};

export default FighterSidebar;