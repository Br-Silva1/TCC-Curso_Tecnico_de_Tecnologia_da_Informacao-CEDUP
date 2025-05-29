const Sequelize = require('sequelize');
const conexao = require('../database/basedados');
const Usuario = conexao.define('usuario', {
    id_usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    permissao: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
    },{
        timestamps: true,
        createdAt: 'data_criacao',
        updatedAt: 'data_atualizacao'
});


Usuario.sync({force: false});
module.exports = Usuario;