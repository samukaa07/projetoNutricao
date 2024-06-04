const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Usando mysql2 com suporte a promises
const app = express();
const port = 3000;

// Configuração do banco de dados MySQL
const dbConfig = {
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    database: 'nutricao'
};

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware para servir arquivos CSS estáticos
app.use('/css', express.static('css', { 'extensions': ['css'] }));

// Rotas
app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/sobre.html', (req, res) => {
    res.sendFile(__dirname + '/views/sobre.html');
});

app.get('/cadastro.html', (req, res) => {
    res.sendFile(__dirname + '/views/cadastro.html');
});

app.get('/contato.html', (req, res) => {
    res.sendFile(__dirname + '/views/contato.html');
});

app.get('/endereco.html', (req, res) => {
    res.sendFile(__dirname + '/views/endereco.html');
});

app.get('/clientes.html', (req, res) => {
    res.sendFile(__dirname + '/views/clientes.html');
});

app.get('/clientes-data', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM nutricao'); // Certifique-se de que 'clientes' é o nome correto da sua tabela
        await connection.end();
        
        res.json(rows);
    } catch (err) {
        console.error('Erro ao listar clientes:', err);
        res.status(500).send('Erro ao listar clientes: ' + err.message);
    }
});

app.delete('/excluir-cliente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM nutricao WHERE ID = ?', [id]);
        await connection.end();
        res.json({ message: 'Cliente excluído com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        res.status(500).send('Erro ao excluir cliente: ' + err.message);
    }
});


// Rota para receber dados do formulário de cadastro
app.post('/cadastro', async (req, res) => {
    const nome = req.body.nome || null;
    const cpf = req.body.cpf || null;
    const dataNasc = req.body.dataNasc || null;
    const tel = req.body.tel || null;
    const idade = req.body.idade || null;
    const peso = req.body.peso || null;
    const altura = req.body.altura || null;

    console.log({ nome, cpf, dataNasc, tel, idade, peso, altura });  // Verifique se algum ainda é undefined

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO nutricao (nome, cpf, dataNasc, tel, idade, peso, altura) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nome, cpf, dataNasc, tel, idade, peso, altura]
        );
        await connection.end();
        res.send('Cadastro realizado com sucesso!');
    } catch (err) {
        console.error('Erro ao cadastrar:', err);
        res.status(500).send('Erro ao cadastrar: ' + err.message);
    }
});


// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
