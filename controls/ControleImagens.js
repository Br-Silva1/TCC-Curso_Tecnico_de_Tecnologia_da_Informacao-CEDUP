const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer')
const { Cliente } = require('../tables/Cliente');
const { Imagens } = require('../tables/Imagens');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/editar-imagem", upload.single('imagem_alt'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Nenhuma imagem foi enviada.');
        }

        let imagem = req.file.filename;

        let id = req.session.usuario.id;

        let cliente = await Cliente.findOne({
            where: { id_usuario: id }
        });

        await Imagens.update({
            imagem: imagem,
        }, {
            where: { id_cliente: cliente.id_cliente }
        });

        res.redirect('/perfil');
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro ao processar a solicitação');
    }
});

router.get("/remover-imagem", async (req, res) => {
    try {
        let id = req.session.usuario.id;

        let cliente = await Cliente.findOne({
            where: { id_usuario: id }
        });

        await Imagens.update({
            imagem: 'perfil.png',
        }, {
            where: { id_cliente: cliente.id_cliente }
        });

        res.redirect('/perfil');
    } catch(erro) {
        console.log(erro)
    }
})

module.exports = router;