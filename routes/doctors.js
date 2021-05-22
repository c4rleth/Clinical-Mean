const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');


// Register
router.post('/register', (req, res, next) => {
    let newDoctor = new Doctor({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        crm: req.body.crm,
        tel: req.body.tel,
        speciality: req.body.speciality
    });

    Doctor.addDoctor(newDoctor, (err, doctor) => {
        if(err){
            res.json({success: false, msg: 'Erro ao cadastrar o médico.'});

        }
        else{
            res.json({success: true, msg: 'Médico cadastrado.'})
        }
    })
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    Doctor.getDoctorByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: "Médico não encontrado"})
        }

        Doctor.comparePassword(password, doctor.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), 'secret', {
                    expiresIn: 604800  // 1 semana
                });

                res.json({
                    success: true, 
                    token: 'JWT ' + token,
                    doctor: {
                        id: user._id,
                        name: user.name,
                        email: user.email, 
                        username: user.username
                    
                    }
                })
            } else{
                return res.json({success: false, msg: "Senha incorreta"})

            }
        })
    })
});

// Profile (só é permitido entrar caso o usuario esteja logado(verificação atraves do passport e token JWT))
router.get('/profile', passport.authenticate('jwt', {session: false}) ,(req, res, next) => {
    res.json({doctor: req.doctor});

});



module.exports = router;