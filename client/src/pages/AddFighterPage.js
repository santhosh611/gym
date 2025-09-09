import React from 'react';
import AddFighter from './AddFighter';
import { useNavigate } from 'react-router-dom';

const AddFighterPage = () => {
    const navigate = useNavigate();

    const handleAddSuccess = () => {
        navigate('/admin');
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <AddFighter 
            onAddSuccess={handleAddSuccess} 
            onCancel={handleCancel} 
        />
    );
};

export default AddFighterPage;