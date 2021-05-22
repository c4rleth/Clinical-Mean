const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Person = require('./person');

const options = { discriminatorKey: 'kind' };

//User Schema
const UserSchema = mongoose.Schema({
    cpf: {
        type: String,
        required: true
    },
    
})

const User = module.exports = Person.discriminator('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    //Criptografia para senha
    bcrypt.genSalt((err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
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