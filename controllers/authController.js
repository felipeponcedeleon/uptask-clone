
const passport = require('passport');

const Usuarios = require('../models/Usuarios');

const crypto = require('crypto');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const bcrypt = require('bcrypt-nodejs');

const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

//funcion para revisar si el usuario está logeado
exports.usuarioAutenticado = (req, res, next) => {

    //si el usuario está autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }

    //si no está autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

exports.resetToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email
        }
    })

    //si usuario no existe
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    //si usuario existe
    //generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    console.log(usuario.token);

    //generar expiracion de una hora
    usuario.expiracion = Date.now() + 3600000;

    //guardar en la db
    //como ya existe el objeto usuario solo lo llamamos y guardamos con save
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    req.flash('correcto', 'se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarPassword = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //usuario no encontrado
    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña'
    })
}

//cambia el password por uno nuevo
exports.actualizarPassword = async(req, res) => {
    //verifica token válido y fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })

    //verifica si el usuario existe
    if(!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    //hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    

    //guardar nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha actualizado!')
    res.redirect('/iniciar-sesion');

}