const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Consultas } = require('../tables/Consultas');
const Usuario = require('../tables/Usuario');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/agendar-consulta", async (req, res) => {
    try{
        let { id_cliente, data, horarios, descricao } = req.body;

        if (!req.session || !req.session.usuario) {
            return res.status(401).send("Usuário não autenticado");
        }

        if (!data || !horarios) {
            return res.status(400).send("Preencha todos os campos obrigatórios");
        }

        let cons = await Consultas.findOne({
            where: { data_consulta: data, horario_consulta: horarios, status: 'Ativo' }
        })

        if(cons){
            return res.status(400).send("Horário já agendado");
        }

        let consA = await Consultas.findOne({
            where: { id_cliente: id_cliente, data_consulta: data, status: 'Ativo' }
        })

        if(consA){
            return res.status(400).send("Você já possui uma consulta agendada para esse dia");
        }
        
        await Consultas.create({
            id_cliente: req.session.usuario.id,
            data_consulta: data,
            horario_consulta: horarios,
            descricao: descricao,
            status: 'Ativo'
        });

        res.redirect("/");
    } catch(erro) {
        console.log(erro);
        res.status(500).send("Erro ao agendar consulta");
    }
});

router.post("/cancelar-agendamento", async (req, res) => {
    try {
        let { data_agendament, hora_agendament, senha } = req.body;

        const usuario = await Usuario.findByPk(req.session.usuario.id);

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).send("Senha incorreta");
        }

        await Consultas.update({
            status: 'Cancelado',
        },{
            where: { data_consulta: data_agendament, horario_consulta: hora_agendament },
        });

        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.status(500).send("Ocorreu um erro ao cancelar a consulta");
    }
});

module.exports = router;