import React, { useState, useRef, useEffect } from 'react';
import api from '../api/api';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const AddFighter = ({ onAddSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [faceEncodings, setFaceEncodings] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        loadModels();
    }, []);

    const loadModels = async () => {
        const MODEL_URL = '/models';
        try {
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            setModelsLoaded(true);
        } catch (error) {
            console.error("Error loading models:", error);
            setMessage("Failed to load face recognition models. Please check if the files are in public/models.");
            setIsError(true);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const captureFaceEncoding = async () => {
        setMessage('Capturing face...');
        setLoading(true);
        if (webcamRef.current && modelsLoaded) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const img = await faceapi.fetchImage(imageSrc);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                if (detections) {
                    const faceEncoding = {
                        encoding: Array.from(detections.descriptor),
                        angle: `capture_${faceEncodings.length + 1}`
                    };
                    setFaceEncodings(prev => [...prev, faceEncoding]);
                    setMessage(`Face encoding captured! Total: ${faceEncodings.length + 1}`);
                    setIsError(false);
                } else {
                    setMessage('No face detected. Please try again.');
                    setIsError(true);
                }
            }
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // For testing purposes, allow submission without face encodings
        if (faceEncodings.length === 0) {
            console.warn('No face encodings captured - proceeding anyway for testing');
        }

        try {
            const payload = { 
                ...formData, 
                faceEncodings: faceEncodings.length > 0 ? faceEncodings : [] 
            };
            console.log('Submitting fighter data:', {
                ...payload,
                password: '[HIDDEN]',
                faceEncodings: `${payload.faceEncodings.length} encodings`
            });
            
            await api.post('/fighters/register', payload);
            setMessage('Fighter added successfully!');
            setIsError(false);
            setFormData({ name: '', email: '', password: '' });
            setFaceEncodings([]);
            if (onAddSuccess) onAddSuccess();
        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message);
            setMessage(err.response?.data?.msg || 'Error adding fighter. Please try again.');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-red-600">Add New Fighter</h2>
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
                    <label className="block text-gray-700">Email (for login)</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Face Initialization</label>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-auto rounded-md"
                    />
                    <button
                        type="button"
                        onClick={captureFaceEncoding}
                        className="w-full bg-yellow-500 text-white font-bold py-2 mt-2 rounded-md hover:bg-yellow-600 transition duration-300 disabled:bg-gray-400"
                        disabled={loading || !modelsLoaded}
                    >
                        {loading ? 'Capturing...' : `Capture Face Encoding (${faceEncodings.length})`}
                    </button>
                    <div className="mt-2 text-sm text-gray-500">
                        Capture faces from a few different angles for best results.
                        {faceEncodings.length === 0 && (
                            <div className="text-orange-600 mt-1">
                                ⚠️ Face recognition will be disabled without face encodings
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-between space-x-4">
                    <button type="button" onClick={onCancel} className="w-full bg-gray-500 text-white font-bold py-2 rounded-md hover:bg-gray-600 transition duration-300">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? 'Adding Fighter...' : 'Add Fighter'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFighter;