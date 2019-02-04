var express = require('express');

// Inicializar variables
var app = express();

// Routes
app.get('/', (req, res, next) => {
    // res.send('Hello World!');
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamete'
    });
});

module.exports = app;