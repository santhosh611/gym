const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Settings = require('../models/Settings');
const Fighter = require('../models/Fighter');
const auth = require('../middleware/authMiddleware');

// Utility function to calculate distance between two coordinates in meters
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371e3; // metres
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
    const deltaLat = toRad(coords2.latitude - coords1.latitude);
    const deltaLon = toRad(coords2.longitude - coords1.longitude);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

// @route   GET /api/attendance/fighter/:id
// @desc    Get attendance records for a specific fighter
// @access  Private (Fighter can view own records, Admin can view any)
router.get('/fighter/:id', auth, async (req, res) => {
    try {
        const fighterId = req.params.id;
        
        // Check if user has permission to view these records
        if (req.user.role !== 'admin' && req.user.id !== fighterId) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        
        // Verify fighter exists
        const fighter = await Fighter.findById(fighterId);
        if (!fighter) {
            return res.status(404).json({ msg: 'Fighter not found' });
        }
        
        // Fetch attendance records for the fighter
        const attendanceRecords = await Attendance.find({ fighterId })
            .sort({ date: -1 })
            .limit(50); // Limit to last 50 records
        
        res.json(attendanceRecords);
    } catch (err) {
        console.error('Error fetching attendance records:', err.message);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   GET /api/attendance/fighter
// @desc    Get attendance records for the current fighter (using token)
// @access  Private (Fighter only)
router.get('/fighter', auth, async (req, res) => {
    if (req.user.role !== 'fighter') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    
    try {
        // Fetch attendance records for the authenticated fighter
        const attendanceRecords = await Attendance.find({ fighterId: req.user.id })
            .sort({ date: -1 })
            .limit(50); // Limit to last 50 records
        
        res.json(attendanceRecords);
    } catch (err) {
        console.error('Error fetching attendance records:', err.message);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST /api/attendance/fighter
// @desc    Fighter logs their attendance
// @access  Private (Fighter only)
router.post('/fighter', auth, async (req, res) => {
    console.log('Attendance logging attempt:', {
        userId: req.user.id,
        userRole: req.user.role,
        body: req.body
    });
    
    if (req.user.role !== 'fighter') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { latitude, longitude, method } = req.body;
    
    // Validate required fields
    if (!latitude || !longitude) {
        return res.status(400).json({ msg: 'Location coordinates are required' });
    }
    
    if (!method) {
        return res.status(400).json({ msg: 'Attendance method is required' });
    }

    try {
        // Check if settings exist
        const settings = await Settings.findOne();
        if (!settings) {
            console.log('No gym settings found');
            return res.status(404).json({ msg: 'Gym location not set by admin.' });
        }

        const gymLocation = settings.location;
        const fighterLocation = { latitude, longitude };

        console.log('Calculating distance:', {
            gymLocation,
            fighterLocation
        });

        const distance = haversineDistance(gymLocation, fighterLocation);
        console.log('Distance calculated:', distance, 'meters');

        if (distance > 100) {
            return res.status(400).json({ 
                msg: 'You are too far from the gym to log attendance.',
                distance: Math.round(distance),
                maxDistance: 100
            });
        }

        // Create new attendance record
        const newAttendance = new Attendance({
            fighterId: req.user.id,
            method,
            location: { latitude, longitude }
        });

        await newAttendance.save();
        console.log('Attendance logged successfully:', newAttendance._id);

        res.json({ 
            msg: 'Attendance successfully logged!', 
            attendance: newAttendance,
            distance: Math.round(distance)
        });
    } catch (err) {
        console.error('Attendance logging error:', err.message);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST /api/attendance/admin/rfid
// @desc    Admin logs attendance using a fighter ID (RFID)
// @access  Private (Admin only)
router.post('/admin/rfid', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { fighterId } = req.body;
    if (!fighterId) {
        return res.status(400).json({ msg: 'Fighter ID is required.' });
    }

    try {
        const fighter = await Fighter.findById(fighterId);
        if (!fighter) {
            return res.status(404).json({ msg: 'Fighter not found.' });
        }

        const newAttendance = new Attendance({
            fighterId: fighter._id,
            method: 'rfid'
        });

        await newAttendance.save();

        res.json({ msg: 'Attendance logged via RFID!', attendance: newAttendance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/attendance/admin/face-recognition
// @desc    Admin logs attendance using face recognition
// @access  Private (Admin only)
router.post('/admin/face-recognition', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { detectedEncoding } = req.body;
    if (!detectedEncoding) {
        return res.status(400).json({ msg: 'Face encoding is required.' });
    }

    try {
        const fighters = await Fighter.find({ 'faceEncodings.0': { '$exists': true } });
        
        let matchFound = false;
        let matchedFighter = null;

        // Simple distance-based matching (for demonstration)
        // In a real application, a more robust library would be used.
        for (const fighter of fighters) {
            for (const storedEncoding of fighter.faceEncodings) {
                const distance = calculateEuclideanDistance(detectedEncoding, storedEncoding.encoding);
                if (distance < 0.6) { // A threshold for a positive match
                    matchFound = true;
                    matchedFighter = fighter;
                    break;
                }
            }
            if (matchFound) break;
        }

        if (!matchFound) {
            return res.status(404).json({ msg: 'No matching fighter found.' });
        }

        const newAttendance = new Attendance({
            fighterId: matchedFighter._id,
            method: 'face-recognition'
        });

        await newAttendance.save();
        res.json({ msg: 'Attendance logged via Face Recognition!', fighter: matchedFighter.name, attendance: newAttendance });
    } catch (err) {
            console.error('Face recognition error:', err.message);
            res.status(500).send('Server Error: ' + err.message);
    }
});

// Utility function to calculate Euclidean distance (for face matching)
function calculateEuclideanDistance(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error("Arrays must have the same length");
    }
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        sum += Math.pow(arr1[i] - arr2[i], 2);
    }
    return Math.sqrt(sum);
}

module.exports = router;