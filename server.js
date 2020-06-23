const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

// Create server
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Create database instance and start server
const adapter = new FileAsync('db.json');
low(adapter)
  .then(db => {
    // Routes
    // GET /posts/:id
    app.get('/questions/:id', (req, res) => {
      const post = db.get('questions')
        .find({ id: req.params.id })
        .value();

      res.send(post);
    });

    // POST /posts
    app.post('/questions', (req, res) => {
      db.get('questions')
        .push(req.body)
        .write()
        .then(post => res.send(post));
    });

    // Set db default values
    return db.defaults({ questions: [], users: [] }).write();
  })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'));
  });
