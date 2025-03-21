// AC2º Trimestre - Banco de Dados em Node Javascript

// Victor Gabriel - Inserção de Dados
// Samantha - Pesquisa por filtração
// Julya Vitória - Visualização de todos os artigos e HTMLS

// Parte Busca Experimento:

const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = 3010;

const BancoPath = path.join(__dirname, 'Banco_de_Dados.json');

let DadosBanco = fs.readFileSync(BancoPath, 'utf-8');
let Experimentos = JSON.parse(DadosBanco);

function BuscarExperimentos(nome){
    return Experimentos.find(experimento =>
        experimento.nome.toLowerCase() === nome.toLowerCase());
}

app.get('/buscar-experimento/:nome', (req, res) => {
    res.sendFile(path.join(__dirname, 'Banco_de_Dados.json'));

    const NomeExperimento = req.params.nome;

    const ExperimentoEncontrado = BuscarExperimentos(NomeExperimento);

    if(ExperimentoEncontrado){
        res.send(`<h1>Experimento encontrado:</h1><pre>
            ${JSON.stringify(ExperimentoEncontrado, null, 2)}</pre>`);
    }
    else{
        res.send('<h1>O experimento solicitado não foi encontrado, por favor, tente novamente.</h1>');
    }
});

// Parte Inserção de Experimentos:

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

function SalvarExperimentos(){
    fs.writeFileSync(BancoPath, JSON.stringify(Experimentos, null, 2));
}

app.get('/adicionar-experimento', (req, res) => {
    res.sendFile(path.join(__dirname, 'Adicionar_Experimento.html'));
});

app.post('/adicionar-experimento', (req, res) => {
    const NovoExperimento = req.body;

    if(Experimentos.find(experimento => experimento.nome.toLowerCase() === NovoExperimento.nome.toLowerCase())){
        res.send('<h1>O experimento que você inseriu já existe no banco de dados. Por favor, insira novas informações e tente novamente.</h1>');
        return;
    }

    Experimentos.push(NovoExperimento);

    SalvarExperimentos();

    res.send('<h1>Novo experimento adicionado com sucesso! Confira o banco de dados e veja seu novo experimento!</h1>');
});

// Parte home:

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home.html'));
});

// Chamando o servidor:

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}/home`);
});