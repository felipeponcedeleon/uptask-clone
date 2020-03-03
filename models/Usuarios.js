const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

const Proyectos = require('../models/Proyecto');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false ,
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido.'
            },
            notEmpty: {
                msg: 'El e-mail no puede ir vacio.'
            }
        },
        unique:{
            args: true,
            msg: 'Usuario ya registrado.'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio.'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, 
{
    hooks: {
        beforeCreate(usuario) {
            console.log(usuario);
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        },
    }
});

//metodo personalizado
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}


Usuarios.hasMany(Proyectos);

module.exports = Usuarios;