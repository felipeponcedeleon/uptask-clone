const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

require('dotenv').config({path: '../variables.env'});

//helpers
const helpers = require('./helpers');

//conexión a DB
const db = require('./config/db');

//importar modelo
require('./models/Proyecto');
require('./models/Tareas');
require('./models/Usuarios');

//conectar y sincronizar con db
db.sync()
    .then(() => console.log('Conectado a la DB'))
    .catch(error => console.log(error))

//crear una app de express
const app = express();

//cargar archivos estáticos
app.use(express.static('public'));

//template engine
app.set('view engine', 'pug');

//habilitar bodyParser para leer datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends: true}));

//agregamos express validator a toda la app
//app.use(expressValidator());

//añadir carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

app.use(cookieParser());

//sessiones 
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//flash messages
app.use(flash());

//pasar var dump a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})

app.use('/', routes());

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor está funcionando')
});
