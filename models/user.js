const mongoose = require('mongoose');
const Drink = require('../models/drink');

let userSchema = new mongoose.Schema({

    name: { type: String, required: true },

    email: { type: String, required: true },
    
    password: { type: String, required: true },


}, { __v: false });


userSchema.set('toObject', { virtuals: true })

module.exports  = mongoose.model('User', userSchema);