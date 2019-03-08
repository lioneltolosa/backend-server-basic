// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Inicializar variables
var app = express();

// bodyParser application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// bodyParser application/json
app.use(bodyParser.json())

// Imports routes
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');


// Coneccion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err ) throw err; // Esto es JavaScript detiene todo el proceso

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Online');
});

// // Routes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);

app.use('/', appRoutes);
// app.get('/', (req, res, next) => {
//     // res.send('Hello World!');
//     res.status(200).json({
//         ok: true,
//         mensaje: 'Peticion realizada correctamete'
//     });
// });

// Listener
app.listen( 3000, () => {
    console.log('Express server in Port 3000: \x1b[32m%s\x1b[0m', 'Online');
})