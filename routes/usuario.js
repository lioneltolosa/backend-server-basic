var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autentication');

// Inicializar variables
var app = express();
var Usuario = require('../models/usuario');

// Routes (THIS CODE SHOW ALL)

// GET OBTENER USUARIO
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

// GET USER
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde =  Number(desde);

    Usuario.find({}, 'name email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                })
            });
        });

// PUt USER
app.put('/:id', mdAutenticacion.verificationToken, (req, res) => {

    var id = req.params.id
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({  // 500 Internal Server Error
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el' + id + 'no existe',
                errors: { mensaje: 'No existe un usuraio con ese ID' }
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

// POST USER 
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
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});

// DELETE USER FOR ID

// DELETE USER 
app.delete('/:id', mdAutenticacion.verificationToken, (req, res) => {
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