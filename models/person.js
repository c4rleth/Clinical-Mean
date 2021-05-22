const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const options = { discriminatorKey: 'kind' };

//Person Schema
const PersonSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, options)

const Person = module.exports = mongoose.model('Person', PersonSchema);