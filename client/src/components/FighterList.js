import React from 'react';
import { Link } from 'react-router-dom';

const FighterList = ({ fighters, handleDelete }) => {
    return (
        <>
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
                                        <Link to={`/admin/fighter/${fighter._id}`} className="mr-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs">View</Link>
                                        <Link to={`/admin/edit-fighter/${fighter._id}`} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs">Edit</Link>
                                        <button onClick={() => handleDelete(fighter._id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default FighterList;