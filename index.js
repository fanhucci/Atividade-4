import express from 'express';
import path from 'path';
import session from 'express-session';

import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 4000;

let listaProdutos = [];

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(session({
    secret: 'secret',
    resave: true, 
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 10 
    }
}));

app.use(cookieParser()); 


function usuarioEstaAutenticado(requisicao, resposta, next){
    if (requisicao.session.usuarioAutenticado){
        next(); 
    }
    else{
        resposta.redirect('/login.html');
    }
}

function cadastrarUsuario(requisicao, resposta){
    const codigo = requisicao.body.codigo;
    const descricao = requisicao.body.descricao;
    const precoCusto = requisicao.body.precoCusto;
    const precoVenda = requisicao.body.precoVenda;
    const validade = requisicao.body.validade;
    const estoque = requisicao.body.estoque;
    const fabricante = requisicao.body.fabricante;

    if (codigo && descricao && precoCusto && precoVenda && validade && estoque && fabricante) 
    {
        listaProdutos.push({
            codigo: codigo,
            descricao: descricao,
            precoCusto: precoCusto,
            precoVenda: precoVenda,
            validade: validade,
            estoque: estoque,
            fabricante: fabricante
        });
        resposta.redirect('/listarProdutos');
    }
    else
    {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Produtos</title>
             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="/listarProdutos">Produtos</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="cadastroProdutos.html">Cadastrar Produtos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/logout">Sair</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

            <div class="container">
                <h1 class="mt-4 mb-4">Cadastro de Produtos</h1>
                <form method="POST" action="cadastrarProduto">
                    <div class="mb-3">
                        <label for="codigo" class="form-label">Código de Barras</label>
                        <input type="text" class="form-control" id="codigo" name="codigo" value="${codigo}">
                    </div>`);
        if (!codigo){
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Informar o codigo de barras do produto.
                        </div>
            `);
        }
        resposta.write(`<div class="mb-3">
            <label for="descricao" class="form-label">Descrição do Produto</label>
            <input type="text" class="form-control" id="descricao"name="descricao" value="${descricao}">
            </div>`);
        if (!descricao){
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                Informar a descrição do produto.
                            </div>`);
        }        
        resposta.write(`
            <div class="row mb-3">
            <div class="col">
                <label for="precoCusto" class="form-label">Preço de Custo</label>
                <input type="text" class="form-control" id="precoCusto" name="precoCusto" value="${precoCusto}">
             </div>
        `);            
        if (!precoCusto){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Informar o preço de custo do produto.
                            </div>`);
        }
        resposta.write(`    
            <div class="col">
             <label for="precoVenda" class="form-label">Preço de Venda</label>
            <input type="text" class="form-control" id="precoVenda" name="precoVenda" value="${precoVenda}">
            </div>
         </div>`
        );
        if (!precoVenda){
            resposta.write(`<div class="alert alert-danger" role="alert">
                        Informar o preço de venda do produto.
                            </div>`);
        }
        resposta.write(`<div class="mb-3">
      <label for="validade" class="form-label">Data de Validade</label>
      <input type="text" class="form-control" id="validade" name="validade" value="${validade}">
    </div>`
        );
        if (!validade){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Informar a data de validade do produto
                            </div>`);
        }
        resposta.write(` <div class="row mb-3">
        <div class="col">
          <label for="estoque" class="form-label">Quantidade em Estoque</label>
          <input type="text" class="form-control" id="estoque" name="estoque" value="${estoque}">
        </div>`);
        if (!estoque){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Informar a quantidade de estoque do produto.
                            </div>`);
        }
        resposta.write(`
                <div class="col">
                    <label for="fabricante" class="form-label">Nome do Fabricante</label>
                     <input type="text" class="form-control" id="fabricante" name="fabricante" valuie="${fabricante}">
                    </div>
                </div>
        `)
        if(fabricante){
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Informar o nome do fabricante do produto.
                            </div>`);
        }
        resposta.write(`
                <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                </form>
             </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        </body>
    </html>`);
        resposta.end(); 
    }

}

function autenticarUsuario(requisicao, resposta){
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'user' && senha == 'senha'){
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('ultimoAcesso', new Date().toLocaleString(),{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/listarProdutos');
    }
    else{
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha ao realizar login</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/login.html">Voltar</a>');
        if (requisicao.cookies.ultimoAcesso){
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.ultimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}

app.post('/login', autenticarUsuario);

app.get('/login', (req,resp)=>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/listarProdutos');
});


app.use(express.static(path.join(process.cwd(), 'publico')));


app.use(usuarioEstaAutenticado,express.static(path.join(process.cwd(), 'protegido')));


app.post('/cadastrarProduto', usuarioEstaAutenticado, cadastrarUsuario);

app.get('/listarProdutos', usuarioEstaAutenticado, (req,resp)=>{
    let html=`
    <!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Produtos</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="produtos.html">Produtos</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="cadastroProdutos.html">Cadastrar Produtos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/logout">Sair</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container">
  <h1 class="mt-4 mb-4">Lista de Produtos</h1>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th scope="col">Código de Barras</th>
        <th scope="col">Descrição do Produto</th>
        <th scope="col">Preço de Custo</th>
        <th scope="col">Preço de Venda</th>
        <th scope="col">Data de Validade</th>
        <th scope="col">Quantidade em Estoque</th>
        <th scope="col">Nome do Fabricante</th>
      </tr>
    </thead>
    <tbody>
    `;
    for (let i=0; i<listaProdutos.length; i++){
        html+=`
        <tr>
        <td>${listaProdutos[i].codigo}</td>
        <td>${listaProdutos[i].descricao}</td>
        <td>R$ ${listaProdutos[i].precoCusto}</td>
        <td>R$ ${listaProdutos[i].precoVenda}</td>
        <td>${listaProdutos[i].validade}</td>
        <td>${listaProdutos[i].estoque}</td>
        <td>${listaProdutos[i].fabricante}</td>
      </tr>
        `;
    }
    html+=`
    </tbody>
  </table>
</div>
    `;
    resp.write(html);
    if (req.cookies.ultimoAcesso){
        resp.write('<p>');
        resp.write('    Seu último acesso foi em ' + req.cookies.ultimoAcesso);
        resp.write('</p>');
    }
    resp.write(`
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`
    );
    resp.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})