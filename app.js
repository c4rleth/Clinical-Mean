const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); //substitui o app.use
const passport = require('passport');
const mongoose = require('mongoose');

// Database Address and Status
mongoose.connect('mongodb://localhost:27017/meanauth');
mongoose.connection.on("connected", () => {
    console.log("Banco de dados conectado")
})
mongoose.connection.on("error", (err) => {
    console.log("Erro no Banco de dados" + err)
})

const app = express();

const users = require('./routes/users');
const doctors = require('./routes/doctors');

//Port Number (Angular 12 = 4200)
const port = 3000;

//CORS Middleware 
app.use(cors()); 

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser deprecated (substituido pelo express) Middleware
app.use(express.json())

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session())

require('./config/passport')(passport);

app.use('/users', users);
app.use('/doctors', doctors);

//Index Route
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

// Start Server
app.listen(port, () => {
    console.log('Server rodando da porta ' + port)
})

