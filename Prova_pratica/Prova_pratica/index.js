const express = require('express');
const exphbs = require('express-handlebars');
const mysql2 = require('mysql2');
const PORT = 3333;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json());

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const db = mysql2.createPool({
  host: 'localhost',
  user: 'aluno_medio',
  password: '@lunoSenai23.',
  database: 'produtos' 
});
app.get('/', (request, response) => {
  response.render('home');
});

app.get('/produtos', (request, response) => {
  const mostrarRes = `SELECT * FROM tb_produtos;`
  db.query(mostrarRes, (error, result) => {
      if(error){
          console.error(error);
          return {error: error};
      }
      const produtoR = result
      return response.render('produtos', { produtoR })
  });
});
app.get('/produtos/delete/:id', (request, response) => {
  const {id} = request.params
  const deleteP = `DELETE FROM tb_produtos WHERE id='${id}'`
  db.query(deleteP, (error, result) => {
      if(error){
          console.error(error);
          return {error: error};
      }
      return response.redirect('/produtos')
  });
});

app.post("/cadastrar", (request, response) => {
  const { titulo,categoria, descricao, preco, disponibilidade } = request.body;
  const insertSQL = `INSERT INTO tb_produtos( titulo,categoria, descricao, preco, disponibilidade) VALUES('${titulo}', '${categoria}', '${descricao}', '${preco}','${disponibilidade}');`;
  db.query(insertSQL, (error, result) => {
      if(error){
          console.error(error);
          return response.status(500).json({ error: "Erro ao inserir o produto" });
      }
      return response.redirect('/produtos');
  });
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
});