const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Usuario = require('../tables/Usuario');
const { Cliente } = require('../tables/Cliente');
const { Imagens } = require('../tables/Imagens');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/login", (req, res) => {
    res.render("usuarios/login_usuario");
});
router.get("/cadastro", (req, res) => {
    res.render("usuarios/cad_usuario");
});

router.post("/logar-usuario", async (req, res) => {
    try {
        const { email, senha } = await req.body;
        const usuario = await Usuario.findOne({
            where: {email: email}
        });
        if(!usuario){
            return res.status(400).send("Usuário não encontrado")
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if(!senhaCorreta) {
            return res.status(400).send("Senha incorreta");
        }

        req.session.usuario = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            permissao: usuario.permissao
        };

        res.redirect("/")
    } catch(erro) {
        console.log(erro);
        res.status(500).send("Erro no servidor")
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

router.post("/cadastrar-usuario", async (req, res) => {
    try{
        let { nome, senha, email } = req.body;
        
        let usuarioExistente = await Usuario.findOne({ where: { email:email } })
        if(usuarioExistente) {
            return res.status(400).send("Usuário já existente")
        }

        let senhaCriptografada = await bcrypt.hash(senha, 10);
        await Usuario.create({
            nome: nome,
            senha: senhaCriptografada,
            email: email,
            permissao: false
        });

        let usuario = await Usuario.findOne({
            where: {email: email}
        });

        await Cliente.create({
            id_usuario: usuario.id_usuario,
        })

        const cliente = await Cliente.findOne({
            where: { id_usuario: usuario.id_usuario }
        });

        await Imagens.create({
            id_cliente: cliente.id_cliente,
            imagem: 'perfil.png'
        });

        res.redirect("/login");
    } catch(erro) {
        console.log(erro);
        res.status(500).send("Erro ao cadastrar usuário");
    }
});

router.get("/perfil", async (req, res) => {
    let id = req.session.usuario.id;
    let cliente = [];

    try{
        cliente = await Cliente.findOne({
            where: { id_usuario: id }
        });
    
        imagens = await Imagens.findOne({
            where: { id_cliente: cliente.id_cliente }
        })

    }catch(erro){
        console.log(erro);
    }
    res.render("usuarios/perfil", { cliente, imagens });
});

module.exports = router;