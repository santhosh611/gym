import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ setUser }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Mutants Academy & AshurasTribe</h2>
                <LoginForm setUser={setUser} />
            </div>
        </div>
    );
};

export default LoginPage;