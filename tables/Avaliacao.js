const Sequelize = require('sequelize');
const conexao = require('../database/basedados');
const { Cliente } = require('./Cliente');
const { Comentarios } = require('./Comentarios');
const Avaliacao = conexao.define('avaliacao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_comentario: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tipoVoto: {
        type: Sequelize.ENUM('upvote', 'downvote'),
        allowNull: true
    }
});
Cliente.hasMany(Avaliacao, {
    foreignKey: 'id_cliente',
})
Avaliacao.belongsTo(Cliente, {
    foreignKey: 'id_cliente',
})
Comentarios.hasMany(Avaliacao, {
    foreignKey: 'id_comentario',
});
Avaliacao.belongsTo(Comentarios, {
    foreignKey: 'id_comentario'
});

Avaliacao.sync({force: false});
module.exports = {
    Comentarios,
    Avaliacao
};