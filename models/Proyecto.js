const Sequelize = require('sequelize');

const slug = require('slug');
const shortid = require('shortid');

const db = require('../config/db');

//proyectos es el nombre de la tabla en la db
const Proyectos =  db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    url: Sequelize.STRING
}, {
    //HOOK
    hooks: {
        beforeCreate(proyecto) {
            console.log('Antes de insertar en la DB');
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        },

    }
});

module.exports = Proyectos;