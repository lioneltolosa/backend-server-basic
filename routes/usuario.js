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




    // PUt Actualizar usuario
    app.put('/:id', (req, res) => {

        var id = req.params.id
        var body = req.body;

        Usuario.findById( id, (err, usuario) => {

            if (err) {
                return res.status(500).json({  // 500 Internal Server Error
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if( !usuario) {
                return res.status(400).json ({
                    ok: false,
                    mensaje: 'El usuario con el' + id + 'no existe',
                    errors: {mensaje: 'No existe un usuraio con ese ID'}
                })
            }

            usuario.name = body.name;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, usuarioGuardado) => {
    
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }

                usuarioGuardado.password = ':)';
        
                res.status(200).json({ 
                    ok: true,
                    usuario: usuarioGuardado,
                });
            });
        });
    });









    // Post   Crear nuevo usuario

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




//   Borrar un usuario por el id

// app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
app.delete('/:id', (req, res) => {


    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;