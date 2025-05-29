const Sequelize = require('sequelize');
const conexao = require('../database/basedados');
const { Cliente } = require('./Cliente');
const Consultas = conexao.define('consultas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    data_consulta: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    horario_consulta:{
        type: Sequelize.TIME,
        allowNull: false,
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.ENUM('Ativo', 'Cancelado', 'Realizado'),
        allowNull: false,
    }
},{
    timestamps: true,
    createdAt: 'data_agendamento',
    updatedAt: 'data_atualizacao',
});
Cliente.hasMany(Consultas, {
    foreignKey: 'id_cliente',
});
Consultas.belongsTo(Cliente, {
    foreignKey: 'id_cliente'
});

Consultas.sync({force: false});
module.exports = {
    Cliente,
    Consultas
};