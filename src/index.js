
const express = require('express'); //external module for using express
const { Client } = require('pg') //external module for using postgres with node
const config = require('./config.js'); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client(config); //creating our database Client with our config values

const getLanguages = async () => {
  await client.connect() //connecting to our database
  const result = await client.query('SELECT * FROM programming_languages');
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
}

app.get('/get-languages', async (req, res) => {
  const languages = await getLanguages();
  res.send(languages);
});

const getLanguage = async (id) => {
  await client.connect() //connecting to our database
  const result = await client.query(`SELECT * FROM programming_languages WHERE id = ${id}`)
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
}

app.get('/get-language/:id', async (req, res) => {
  const language = await getLanguage(req.params.id);
  res.send(language);
});




const deleteLanguage = async (id) => {
await client.connect() //connecting to our database
const result = await client.query(`DELETE FROM programming_languages WHERE id = ${id}`)
console.log(result.rows);
await client.end() //ending the connection to our database
return result.rows;
};

 
app.delete('/delete-language/:id', async (req, res) => {
const language = await deleteLanguage(req.params.id);
res.send(language);
});

const addLanguage = async (languageData) => {
    await client.connect();
    const {
      id,
      name,
      released_year,
      githut_rank,
      pypl_rank,
      tiobe_rank,
      created_at,
      updated_at
    } = languageData;
  
    const result = await client.query(`
      INSERT INTO programming_languages(
        id,
        name,
        released_year,
        githut_rank,
        pypl_rank,
        tiobe_rank,
        created_at,
        updated_at
      ) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [id, name, released_year, githut_rank, pypl_rank, tiobe_rank, created_at, updated_at]);
  
    await client.end();
    return result.rows;
  }
  
  app.post('/add-language', async (req, res) => {
    const language = await addLanguage(req.body);
    res.send(language);
  });


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
  