const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        cpf: req.body.cpf
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Erro ao cadastrar o usuario.'});

        }
        else{
            res.json({success: true, msg: 'Usuario cadastrado.'})
        }
    })
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: "Usuário não encontrado"})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), 'secret', {
                    expiresIn: 604800  // 1 semana
                });

                res.json({
                    success: true, 
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email, 
                        username: user.username,
                        cpf: user.cpf
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
    res.json({user: req.user});

});



module.exports = router;