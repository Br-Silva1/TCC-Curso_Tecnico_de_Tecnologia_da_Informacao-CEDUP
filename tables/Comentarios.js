const Sequelize = require('sequelize');
const conexao = require('../database/basedados');
const { Cliente } = require('./Cliente');
const Comentarios = conexao.define('comentarios', {
    id_comentario:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    autor:{
        type: Sequelize.STRING,
        allowNull: false
    },
    comentario: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    upvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    downvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},{
    timestamps: true,
});
Cliente.hasMany(Comentarios, {
    foreignKey: 'id_cliente',
});
Comentarios.belongsTo(Cliente, {
    foreignKey: 'id_cliente'
});

Comentarios.sync({force: false});
module.exports = {
    Cliente,
    Comentarios
};