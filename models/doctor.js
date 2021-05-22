const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Person = require('./person');

const options = { discriminatorKey: 'kind' };

//Doctor Schema
const DoctorSchema = mongoose.Schema({
    crm: {
        type: String,
        required: true
    },
    tel: {
        type: String,
    },
    speciality: {
        type: String,
        required: true
    }
    
})

const Doctor = module.exports = Person.discriminator('Doctor', DoctorSchema);

module.exports.getDoctorById = function(id, callback) {
    Doctor.findById(id, callback);
}

module.exports.getDoctorByUsername = function(username, callback){
    const query = {username: username}
    Doctor.findOne(query, callback);
}

module.exports.addDoctor = function(newDoctor, callback){
    //Criptografia para senha
    bcrypt.genSalt((err, salt) => {
        bcrypt.hash(newDoctor.password, salt, (err, hash) => {
            if(err) throw err;
            newDoctor.password = hash;
            newDoctor.save(callback);
        })
    })
}

//Confere se a senha digitada é a que está cadastrada
module.exports.comparePassword = function(candidatePassword, hash, callback)  {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
}