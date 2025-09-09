const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    fighterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fighter',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        enum: ['rfid', 'face-recognition'],
        required: true
    },
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);