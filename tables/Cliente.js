const Sequelize = require('sequelize');
const conexao = require('../database/basedados');
const Usuario = require('./Usuario');
const Cliente = conexao.define('cliente', {
    id_cliente: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    numero: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },
    rg: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },
    endereco: {
        type: Sequelize.STRING,
        allowNull: true,
    }
});
Usuario.hasOne(Cliente, {
    foreignKey: 'id_usuario',
});
Cliente.belongsTo(Usuario, {
    foreignKey: 'id_usuario'
});

Cliente.sync({force: false});
module.exports = {
    Usuario,
    Cliente
};