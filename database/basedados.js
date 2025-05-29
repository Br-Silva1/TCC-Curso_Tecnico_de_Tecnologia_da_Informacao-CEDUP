const Sequelize = require('sequelize');
const conexao = new Sequelize('tcc', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
    },
    timezone: '-03:00',
});

module.exports = conexao;