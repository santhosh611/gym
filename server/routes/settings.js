const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/settings
// @desc    Get gym location settings
// @access  Private (All authenticated users can view, only admin can modify)
router.get('/', auth, async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ msg: 'Settings not found' });
        }
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err.message);
        res.status(500).json({ msg: 'Server Error: ' + err.message });
    }
});

// @route   POST /api/settings
// @desc    Update gym location settings
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    const { latitude, longitude } = req.body;
    try {
        let settings = await Settings.findOne();
        if (settings) {
            settings.location.latitude = latitude;
            settings.location.longitude = longitude;
            await settings.save();
            return res.json({ msg: 'Settings updated', settings });
        } else {
            settings = new Settings({ location: { latitude, longitude } });
            await settings.save();
            return res.json({ msg: 'Settings created', settings });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;