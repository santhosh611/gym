const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Fighter = require('../models/Fighter');
const Admin = require('../models/Admin');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, passwordLength: password?.length });
    
    try {
        // First check if user exists in Fighter collection
        let user = await Fighter.findOne({ email });
        let userType = 'fighter';
        console.log('Fighter search result:', user ? 'Found' : 'Not found');
        
        // If not found in Fighter, check Admin collection
        if (!user) {
            user = await Admin.findOne({ email });
            userType = 'admin';
            console.log('Admin search result:', user ? 'Found' : 'Not found');
        }

        if (!user) {
            console.log('No user found with email:', email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role || userType } };
        
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ msg: 'Server configuration error' });
        }
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT signing error:', err);
                throw err;
            }
            console.log('Login successful for user:', email);
            res.json({ 
                token, 
                user: { 
                    role: user.role || userType, 
                    profile_completed: user.profile_completed || false, 
                    email: user.email 
                } 
            });
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/user
// @desc    Get user data by token
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        let user;
        if (req.user.role === 'admin') {
            user = await Admin.findById(req.user.id).select('-password');
        } else {
            user = await Fighter.findById(req.user.id).select('-password');
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, (req, res) => {
    res.json({ msg: 'User logged out successfully' });
});

module.exports = router;