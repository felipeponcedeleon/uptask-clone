const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        //done es como el callback o next, algo que finaliza la ejecución
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //el usuario existe, password incorrecto
                
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message : 'Password Incorrecto'
                    });
                } 

                //caso contrario, password correcto
                //don maneja 3 parametros: el primero es error, segundo retorno de algo, tercero mensaje
                //console.log("Resultado:", usuario);
                return done(null, usuario);

            } catch(error) {
                //ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe.'
                });
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;