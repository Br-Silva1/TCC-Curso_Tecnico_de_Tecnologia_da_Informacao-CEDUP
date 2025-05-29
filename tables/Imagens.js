const Sequelize = require('sequelize');
const conexao = require('../database/basedados');
const { Cliente } = require('./Cliente');
const Imagens = conexao.define('imagens', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    imagem: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

Cliente.hasOne(Imagens, {
    foreignKey: 'id_cliente',
});
Imagens.belongsTo(Cliente, {
    foreignKey: 'id_cliente',
});

Imagens.sync({force: false});
module.exports = { 
    Cliente,
    Imagens
};