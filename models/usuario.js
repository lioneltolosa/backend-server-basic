var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    name: { type: String, require: [true, 'The name is necessary']},
    email: { type: String, unique: true, require: [true, 'The email is necessary']},
    password: { type: String, require: [true, 'The password is necessary']},
    img: { type: String, require: false},
    role: { type: String, require: true, default: 'USER_ROLE', enum: rolesValidos },
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} El correo debe de ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);