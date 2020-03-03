const express = require('express');
const routes = express.Router();


//importar express validator
const { body } = require('express-validator/check');


//importar controlador
const Controller = require('../controllers/controller');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    //ruta para el home
    routes.get('/', 
        authController.usuarioAutenticado,
        Controller.home
    );

    routes.get('/nosotros', Controller.nosotros);

    routes.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        Controller.formularioProyecto
    );

    routes.post('/nuevo-proyecto', 
                body('nombre')
                    .not().isEmpty()
                    .trim()
                    .escape(),
                authController.usuarioAutenticado,
                Controller.nuevoProyecto
    );

    //listar proyecto
    routes.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        Controller.proyectoPorUrl
    );

    //actualizar el proyecto
    routes.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,    
        Controller.formularioEditar
    );

    //guardar los cambios
    routes.post('/nuevo-proyecto/:id', 
                body('nombre')
                    .not().isEmpty()
                    .trim()
                    .escape(),
                authController.usuarioAutenticado,
                Controller.actualizarProyecto
    );

    //Eliminar Proyecto
    routes.delete('/proyectos/:url', 
        authController.usuarioAutenticado,    
        Controller.eliminarProyecto
    );

    //tareas
    routes.post('/proyectos/:url', 
                body('nombre')
                    .not().isEmpty()
                    .trim()
                    .escape(),
                authController.usuarioAutenticado,
                tareasController.crearTarea
    );

    //actualizar tarea
    routes.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );     
    
    //eliminar tarea
    routes.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );   

    //crear nueva cuenta
    routes.get('/crear-cuenta', usuariosController.formCrearUsuario);
    routes.post('/crear-cuenta', usuariosController.crearCuenta);

    routes.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    routes.post('/iniciar-sesion', authController.autenticarUsuario);

    routes.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //cerrar-sesion
    routes.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer contraseña
    routes.get('/reestablecer', usuariosController.formRestablecerPassword);
    routes.post('/reestablecer', authController.resetToken);
    routes.get('/reestablecer/:token', authController.validarPassword);
    routes.post('/reestablecer/:token', authController.actualizarPassword);
                
    return routes;
}
