var express = require('express');
var bcrypt = require('bcryptjs');

// var jwt = require('jsonwebtoken');

// var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

// // Routes (THIS CODE SHOW ALL)
// app.get('/', (req, res, next) => {
//     Usuario.find( {}, (err, usuarios) => {
//         if( err ) {
//             return  res.status(200).json({
//                 ok: true,
//                 mensaje: 'Error cargando usuarios',
//                 errors: err
//             });
//         } 
//         res.status(200).json({
//             ok: true,
//             usuarios: usuarios
//         });
//     });
// });

// // Routes  ( THIS CODE SHOW ONLY 'name email img role' AND NEXT EXEC)
app.get('/', (req, res, next) => {
    Usuario.find( {}, 'name email img role')
    .exec ( 
        (err, usuarios) => {
            if( err ) {
                return  res.status(500).json({
                    ok: true,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            } 
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
    });



    // Post

    app.post('/', (req, res) => {

        var body = req.body;
    
        var usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            img: body.img,
            role: body.role
        });
    
        usuario.save((err, usuarioGuardado) => {
    
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear usuario',
                    errors: err
                });
            }
    
            res.status(201).json({   // 201 USUARIO CREADO
                ok: true,
                // body: body
                usuario: usuarioGuardado,
                // usuariotoken: req.usuario
            });
    
    
        });
    
    });

module.exports = app;