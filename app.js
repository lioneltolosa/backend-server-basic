// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Coneccion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err ) throw err; // Esto es JavaScript detiene todo el proceso

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Online');
});

// Routes
app.get('/', (req, res, next) => {
    // res.send('Hello World!');
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamete'
    });
});

// Listener
app.listen( 3000, () => {
    console.log('Express server in Port 3000: \x1b[32m%s\x1b[0m', 'Online');
})