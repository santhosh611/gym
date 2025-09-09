const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    // Technical Advantage scores
    stance: { type: Object },
    jab: { type: Object },
    // ... all other technical skills
    // Skill Advantage scores
    stamina: { type: Object },
    speed: { type: Object },
    // ... all other skill advantages
    specialGradeScore: { type: Number },
    // Other fields from the assessment form
});

const fighterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'fighter' },
    profile_completed: { type: Boolean, default: false },
    // Personal Info
    name: { type: String },
    fighterBatchNo: { type: String },
    age: { type: Number },
    gender: { type: String },
    phNo: { type: String },
    address: { type: String },
    // Fighter Details
    height: { type: String },
    weight: { type: String },
    bloodGroup: { type: String },
    occupation: { type: String },
    dateOfJoining: { type: Date, default: Date.now },
    package: { type: String },
    previousExperience: { type: String },
    medicalIssue: { type: String },
    motto: { type: String },
    martialArtsKnowledge: { type: String },
    // Goals & Referral
    goals: { type: [String] },
    referral: { type: String },
    // Agreement
    agreement: { type: Boolean },
    // Nested Assessment Object
    assessment: assessmentSchema,
    // Face recognition data - simplified structure
    faceEncodings: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('Fighter', fighterSchema);