const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Settings', settingsSchema);