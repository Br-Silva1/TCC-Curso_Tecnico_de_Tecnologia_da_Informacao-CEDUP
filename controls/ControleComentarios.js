const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Cliente } = require('../tables/Cliente');
const { Comentarios } = require('../tables/Comentarios');
const { Avaliacao } = require('../tables/Avaliacao');
const conexao = require('../database/basedados');

router.post('/comentar', async (req, res) => {
    try {
        let { nome_cliente, comentario } = req.body;
        let id = req.session.usuario.id

        let cliente = await Cliente.findOne({
            where: { id_usuario: id }
        })
        await Comentarios.create({
            id_cliente: cliente.id_cliente,
            autor: nome_cliente,
            comentario: comentario
        });
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).send('Erro ao criar comentário');
    }
});

router.post('/votar', async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const { id_comentario, tipoVoto } = req.body;
        const cliente = await Cliente.findOne({
            where: { id_usuario: req.session.usuario.id }
        });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const comentario = await Comentarios.findByPk(id_comentario);
        if (!comentario) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }

        // Verifica se o usuário já votou
        let votoExistente = await Avaliacao.findOne({
            where: {
                id_cliente: cliente.id_cliente,
                id_comentario: id_comentario
            }
        });

        await conexao.transaction(async (t) => {
            if (votoExistente) {
                if (votoExistente.tipoVoto === tipoVoto) {
                    // Remove o voto
                    await votoExistente.destroy({ transaction: t });
                    await comentario.decrement(
                        `${tipoVoto}s`,
                        { transaction: t }
                    );
                    votoExistente = null;
                } else {
                    // Muda o tipo de voto
                    await comentario.decrement(
                        `${votoExistente.tipoVoto}s`,
                        { transaction: t }
                    );
                    await comentario.increment(
                        `${tipoVoto}s`,
                        { transaction: t }
                    );
                    votoExistente.tipoVoto = tipoVoto;
                    await votoExistente.save({ transaction: t });
                }
            } else {
                // Cria novo voto
                await Avaliacao.create({
                    id_cliente: cliente.id_cliente,
                    id_comentario: id_comentario,
                    tipoVoto: tipoVoto
                }, { transaction: t });
                await comentario.increment(
                    `${tipoVoto}s`,
                    { transaction: t }
                );
            }
        });

        await comentario.reload();

        res.json({
            success: true,
            upvotes: comentario.upvotes,
            downvotes: comentario.downvotes,
            score: comentario.upvotes - comentario.downvotes
        });
    } catch (error) {
        console.error('Erro ao processar voto:', error);
        res.status(500).json({ error: 'Erro ao processar voto' });
    }
});

module.exports = router;