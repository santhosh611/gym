import React, { useState, useRef, useEffect } from 'react';
import api from '../api/api';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { FaFingerprint, FaCamera } from 'react-icons/fa';

const AdminAttendancePage = () => {
    const [attendanceMethod, setAttendanceMethod] = useState(null); // 'rfid' or 'face-recognition'
    const [fighterId, setFighterId] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        if (attendanceMethod === 'face-recognition') {
            loadModels();
        }
    }, [attendanceMethod]);

    const loadModels = async () => {
        const MODEL_URL = '/models';
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
    };

    const handleRFIDSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            await api.post('/attendance/admin/rfid', { fighterId });
            setMessage('Attendance logged successfully via RFID!');
            setFighterId('');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Error logging attendance via RFID.';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleFaceRecognition = async () => {
        setMessage('Detecting face...');
        setLoading(true);
        if (webcamRef.current && modelsLoaded) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const img = await faceapi.fetchImage(imageSrc);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                if (detections) {
                    const detectedEncoding = Array.from(detections.descriptor);
                    try {
                        const res = await api.post('/attendance/admin/face-recognition', { detectedEncoding });
                        setMessage(`Attendance logged for ${res.data.fighter} via Face Recognition!`);
                    } catch (err) {
                        const errorMsg = err.response?.data?.msg || 'Face not recognized. Please try again.';
                        setMessage(errorMsg);
                    }
                } else {
                    setMessage('No face detected. Please ensure your face is clearly visible.');
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Attendance Management</h2>
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setAttendanceMethod('rfid')}
                    className={`w-1/2 flex items-center justify-center py-3 rounded-md transition duration-300 font-bold ${attendanceMethod === 'rfid' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    <FaFingerprint className="mr-2" /> RFID (ID)
                </button>
                <button
                    onClick={() => setAttendanceMethod('face-recognition')}
                    className={`w-1/2 flex items-center justify-center py-3 rounded-md transition duration-300 font-bold ${attendanceMethod === 'face-recognition' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    <FaCamera className="mr-2" /> Face Recognition
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('Error') || message.includes('not') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {attendanceMethod === 'rfid' && (
                <form onSubmit={handleRFIDSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <label className="block text-gray-700">Enter Fighter Batch No. (RFID)</label>
                    <input
                        type="text"
                        value={fighterId}
                        onChange={(e) => setFighterId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="e.g., ASHURA-A1B2C3D4"
                        required
                    />
                    <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400" disabled={loading}>
                        {loading ? 'Logging...' : 'Log Attendance'}
                    </button>
                </form>
            )}

            {attendanceMethod === 'face-recognition' && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4 text-center">
                    {!modelsLoaded ? (
                        <p className="text-gray-500">Loading face recognition models...</p>
                    ) : (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-auto rounded-md"
                            />
                            <button
                                onClick={handleFaceRecognition}
                                className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
                                disabled={loading}
                            >
                                {loading ? 'Recognizing...' : 'Log Attendance by Face'}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminAttendancePage;