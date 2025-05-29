const express = require('express');
const session = require('express-session');
const app = express();
const { Op, literal } = require('sequelize');
const conexao = require('./database/basedados');
const Usuario = require('./tables/Usuario');
const { Cliente } = require('./tables/Cliente')
const { Consultas } = require('./tables/Consultas');
const { Imagens } = require('./tables/Imagens');
const { Comentarios } = require('./tables/Comentarios');
const { Avaliacao } = require('./tables/Avaliacao');
const controleUsuario = require('./controls/ControleUsuario');
const controleCliente = require('./controls/ControleCliente');
const controleConsultas = require('./controls/ControleConsultas');
const controleImagens = require('./controls/ControleImagens');
const controleComentarios = require('./controls/ControleComentarios');
const controleAdmin = require('./controls/controleAdmin');
const verificaSessão = require('./middleware/middlewareUsuario');
const verificaAdm = require('./middleware/middlewareAdm');

app.set("view engine", "ejs");
app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
}));

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'kaciely_psicologia',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 43830 * 60 * 1000 //um mes em milissegundos
    }
}))
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.get("/", async (req, res) => {
    try {
        let cliente = [];
        let consultas = [];
        let consultasCliente = [];
        let avaliacoesCliente = [];
        let avaliacoes = await Avaliacao.findAll();

        const orderType = req.query.order || 'recent';
        
        let orderConfig;
        if (orderType === 'upvotes') {
            orderConfig = [
                [literal('(upvotes - downvotes)'), 'DESC'],
                ['createdAt', 'DESC']
            ];
        } else {
            orderConfig = [['createdAt', 'DESC']];
        }

        let comentarios = await Comentarios.findAll({
            order: orderConfig,
            include: [
                {
                    model: Avaliacao,
                    required: false,
                },
                {
                    model: Cliente,
                    required: false,
                    include: [{
                        model: Imagens,
                        required: false
                    }]
                }
            ]
        });

        comentarios = comentarios.map(comentario => {
            const plainComentario = comentario.get({ plain: true });
            return {
                ...plainComentario,
                imagemPerfil: plainComentario.cliente?.imagen?.imagem || 'perfil.png'
            };
        });

        let data_atual = await new Date();
        data_atual.setDate(data_atual.getDate()+7);
        data_atual = data_atual.toISOString().split('T')[0];

        let imagemUsuarioAtual = { imagem:'perfil.png'};

        if (req.session.usuario != undefined) {
            var id = req.session.usuario.id;

            cliente = await Cliente.findOne({
                where: { id_usuario: id },
            });

            consultasCliente = await Consultas.findAll({
                where: { id_cliente: cliente.id_cliente }
            });

            avaliacoesCliente = await Avaliacao.findAll({
                where: { id_cliente: cliente.id_cliente }
            });

            imagemUsuarioAtual = await Imagens.findOne({
                where: { id_cliente: cliente.id_cliente }
            })

            if(imagemUsuarioAtual.imagem == null){
                imagemUsuarioAtual = { imagem:'perfil.png'}
            }

            consultas = await Consultas.findAll();
        }

        res.render("primeiro", { 
            consultas, 
            consultasCliente, 
            data_atual, 
            cliente, 
            avaliacoesCliente, 
            comentarios, 
            avaliacoes,
            orderType,
            imagemUsuarioAtual
        });
    } catch (error) {
        console.error('Erro na rota principal:', error);
        res.status(500).send('Erro ao carregar a página');
    }
});

app.get('/api/get-data/:data_agend', async ( req, res) => {
    const data_agend = req.params.data_agend;
    console.log(data_agend);
    try{
        const consultas = await Consultas.findAll({
            where: { data_consulta: data_agend, status: 'Ativo' }
        });

        if(consultas){
            res.json(consultas)
        }
        console.log(consultas)
    } catch(erro) {
        console.log(erro);
    }
});

app.use("/", (req, res, next) => {
    if(req.path == "/login" || req.path == "/cadastro" || req.path == "/logar-usuario" || req.path == "/cadastrar-usuario"){
        return next();
    }
    verificaSessão(req, res, next);
})

app.use("/", controleUsuario);
app.use("/", controleCliente);
app.use("/", controleConsultas);
app.use("/", controleImagens);
app.use("/", controleComentarios);
app.use("/", verificaAdm, controleAdmin);

conexao.authenticate().then(() => {
    console.log("CONECTADO COM O BANCO");
}).catch((erroMsg) => {
    console.log(erroMsg);
});

app.listen(3000, () => {
    console.log("SERVIDOR RODANDO")
});