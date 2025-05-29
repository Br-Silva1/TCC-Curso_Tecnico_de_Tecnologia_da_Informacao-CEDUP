const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');
const Usuario = require('../tables/Usuario');
const { Cliente } = require('../tables/Cliente');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/editar", async (req, res) => {
    try {
        let { nome, email, numero, cpf, rg, endereco, senha } = await req.body;
        let id = req.session.usuario.id;

        const usuario = await Usuario.findByPk(id);

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaCorreta) {
            return;
        }else{
            await Usuario.update({
                nome: nome,
                email: email,
            }, {
                where: { id_usuario: id }
            });

            req.session.usuario = {
                ...req.session.usuario,
                nome: usuario.nome,
                email: usuario.email
            };    
    
            const cliente = await Cliente.findOne({
                where: { 
                    [Op.or]:[
                        { cpf: cpf },
                        { rg: rg }
                    ]
                 }
            });

            if(cliente){
                return res.status(400).send("Credenciais já existentes")
            }
    
            await Cliente.update({
                numero: numero,
                cpf: cpf,
                rg: rg,
                endereco: endereco
            }, {
                where: { id_usuario: id }
            });
                
            res.redirect("/perfil");
        }
    } catch (erro) {
        console.log(erro);
    }
})

module.exports = router;