const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Usuario = require('../tables/Usuario');
const { Cliente } = require('../tables/Cliente');
const { Imagens } = require('../tables/Imagens');
const { Consultas } = require('../tables/Consultas');
const { Comentarios } = require('../tables/Comentarios');
const { Avaliacao } = require('../tables/Avaliacao');
const verificaAdm = require('../middleware/middlewareAdm');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/controle-usuarios", async (req,res)=>{
    let usuarios = await Usuario.findAll()
    res.render("usuarios/admin/usuarios/controle_usuarios", { usuarios });
});

router.get("/pesquisar-usuarios", async (req,res)=>{
    try {
        const { query } = req.query;
        const usuarios = await Usuario.findAll({
            where: {
                [Op.or]: [
                    { id_usuario: { [Op.like]: `%${query}%` } },
                    { nome: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { permissao: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro na busca de usuários' });
    }
});

router.get("/editar-usuario/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.render('usuarios/admin/usuarios/editar_usuario', { usuario });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar página de edição' });
    }
});

router.post("/editar-usuario/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        const { nome, email, permissao } = req.body;
        
        const [updated] = await Usuario.update(
            { nome, email, permissao },
            { where: { id_usuario: id } }
        );

        if (updated) {
            res.redirect('/controle-usuarios');
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
})

router.delete("/deletar-usuario/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const deleted = await Usuario.destroy({
            where: { id_usuario: id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
})

router.get("/controle-clientes", async (req,res)=>{
    let clientes = await Cliente.findAll()
    res.render("usuarios/admin/clientes/controle_clientes", { clientes });
})

router.get("/pesquisar-clientes", async (req,res)=>{
    try {
        const { query } = req.query;
        const clientes = await Cliente.findAll({
            where: {
                [Op.or]: [
                    { id_cliente: { [Op.like]: `%${query}%` } },
                    { id_usuario: { [Op.like]: `%${query}%` } },
                    { numero: { [Op.like]: `%${query}%` } },
                    { cpf: { [Op.like]: `%${query}%` } },
                    { rg: { [Op.like]: `%${query}%` } },
                    { endereco: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro na busca de clientes' });
    }
});

router.get("/editar-cliente/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.render('usuarios/admin/clientes/editar_cliente', { cliente });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar página de edição' });
    }
});

router.post("/editar-cliente/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        const { id_usuario, numero, cpf, rg, endereco } = req.body;
        
        const [updated] = await Cliente.update(
            { id_usuario, numero, cpf, rg, endereco },
            { where: { id_cliente: id } }
        );

        if (updated) {
            res.redirect('/controle-clientes');
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
})

router.delete("/deletar-cliente/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const deleted = await Cliente.destroy({
            where: { id_cliente: id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Cliente deletado com sucesso' });
        } else {
            res.status(404).send('Cliente não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar Cliente' });
    }
})

router.get("/controle-imagens", async (req,res)=>{
    let imagens = await Imagens.findAll()
    res.render("usuarios/admin/imagens/controle_imagens", { imagens });
})

router.get("/pesquisar-imagens", async (req,res)=>{
    try {
        const { query } = req.query;
        const imagens = await Imagens.findAll({
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${query}%` } },
                    { id_cliente: { [Op.like]: `%${query}%` } },
                    { imagem: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json(imagens);
    } catch (error) {
        res.status(500).json({ error: 'Erro na busca de imagens' });
    }
});

router.get("/editar-imagem/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const imagens = await Imagens.findByPk(id);
        if (!imagens) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.render('usuarios/admin/imagens/editar_imagem', { imagens });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar página de edição' });
    }
});

router.post("/editar-imagem/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        const { id_cliente, imagem } = req.body;
        
        const [updated] = await Imagens.update(
            { id_cliente, imagem },
            { where: { id: id } }
        );

        if (updated) {
            res.redirect('/controle-imagens');
        } else {
            res.status(404).send('Imagem não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
})

router.delete("/deletar-imagem/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const deleted = await Imagens.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Imagens deletado com sucesso' });
        } else {
            res.status(404).send('Imagem não encontrada');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar imagem' });
    }
})

router.get("/controle-consultas", async (req,res)=>{
    let consultas = await Consultas.findAll()
    res.render("usuarios/admin/consultas/controle_consultas", { consultas });
})

router.get("/pesquisar-consultas", async (req,res)=>{
    try {
        const { query } = req.query;
        const consultas = await Consultas.findAll({
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${query}%` } },
                    { id_cliente: { [Op.like]: `%${query}%` } },
                    { data_consulta: { [Op.like]: `%${query}%` } },
                    { horario_consulta: { [Op.like]: `%${query}%` } },
                    { descricao_consulta: { [Op.like]: `%${query}%` } },
                    { status: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json(consultas);
    } catch (error) {
        res.status(500).json({ error: 'Erro na busca de consultas' });
    }
});

router.get("/editar-consulta/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const consulta = await Consultas.findByPk(id);
        if (!consulta) {
            return res.status(404).send('Consulta não encontrado');
        }
        res.render('usuarios/admin/consultas/editar_consulta', { consulta });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar página de edição' });
    }
});

router.post("/editar-consulta/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        const { id_cliente, data_consulta, horario_consulta, descricao, status } = req.body;
        
        const [updated] = await Consultas.update(
            { id_cliente, data_consulta, horario_consulta, descricao, status },
            { where: { id: id } }
        );

        if (updated) {
            res.redirect('/controle-consultas');
        } else {
            res.status(404).send('Consulta não encontrada');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar consulta' });
    }
})

router.delete("/deletar-consulta/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const deleted = await Consultas.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Consulta deletado com sucesso' });
        } else {
            res.status(404).send('Consulta não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar consulta' });
    }
})

router.get("/controle-comentarios", async (req,res)=>{
    let comentarios = await Comentarios.findAll()
    res.render("usuarios/admin/comentarios/controle_comentarios", { comentarios });
})

router.get("/pesquisar-comentarios", async (req,res)=>{
    try {
        const { query } = req.query;
        const comentarios = await Comentarios.findAll({
            where: {
                [Op.or]: [
                    { id_comentario: { [Op.like]: `%${query}%` } },
                    { id_cliente: { [Op.like]: `%${query}%` } },
                    { autor: { [Op.like]: `%${query}%` } },
                    { comentario: { [Op.like]: `%${query}%` } },
                    { upvotes: { [Op.like]: `%${query}%` } },
                    { downvotes: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ error: 'Erro na busca de comentários' });
    }
});

router.get("/editar-comentario/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const comentario = await Comentarios.findByPk(id);
        if (!comentario) {
            return res.status(404).send('Comentário não encontrado');
        }
        res.render('usuarios/admin/comentarios/editar_comentario', { comentario });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar página de edição' });
    }
});

router.post("/editar-comentario/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        const { id_cliente, id_comentario, tipoVoto } = req.body;
        
        const [updated] = await Comentarios.update(
            { id_cliente, id_comentario, tipoVoto },
            { where: { id: id } }   
        );

        if (updated) {
            res.redirect('/controle-comentarios');
        } else {
            res.status(404).send('Comentário não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
})

router.delete("/deletar-comentario/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const deleted = await Comentarios.destroy({
            where: { id_comentario: id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Comentário deletado com sucesso' });
        } else {
            res.status(404).send('Comentário não encontrado');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
})

router.get("/controle-avaliacoes", async (req,res)=>{
    let avalicaoes = await Avaliacao.findAll()
    res.render("usuarios/admin/avaliacao/controle_avaliacao", { avalicaoes });
})

router.get("/pesquisar-avaliacoes", async (req,res)=>{
    try {
        const { query } = req.query;
        const avaliacoes = await Avaliacao.findAll({
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${query}%` } },
                    { id_cliente: { [Op.like]: `%${query}%` } },
                    { id_comentario: { [Op.like]: `%${query}%` } },
                    { tipoVoto: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json(avaliacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro na busca de avaliações' });
    }
});

router.get("/editar-avaliacao/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const avaliacao = await Avaliacao.findByPk(id);
        if (!avaliacao) {
            return res.status(404).send('Avaliação não encontrada');
        }
        res.render('usuarios/admin/avaliacao/editar_avaliacao', { avaliacao });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar página de edição' });
    }
});

router.post("/editar-avaliacao/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        const { id_cliente, id_comentario, tipoVoto } = req.body;
        
        const [updated] = await Avaliacao.update(
            { id_cliente, id_comentario, tipoVoto },
            { where: { id: id } }   
        );

        if (updated) {
            res.redirect('/controle-avaliacoes');
        } else {
            res.status(404).send('Avaliação não encontrada');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar avaliação' });
    }
})

router.delete("/deletar-avaliacao/:id", async (req,res)=>{
    try {
        const { id } = req.params;
        const deleted = await Avaliacao.destroy({
            where: { id: id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Avalicação deletada com sucesso' });
        } else {
            res.status(404).send('Avaliação não encontrada');
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar avaliação' });
    }
})

module.exports = router;