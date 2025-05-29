function verificaAdm(req,res,next){
    if(req.session.usuario && req.session.usuario.permissao == true) {
        next();
    } else {
        res.redirect("/");
    }
}

module.exports = verificaAdm;