const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

// Create server
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Create database instance and start server
const adapter = new FileAsync('db.json');
low(adapter)
  .then(db => {
    // Routes
    // GET /questions
    app.get('/questions', (_, res) => {
      console.log('GET /questions');
      const questions = db.get('questions').value();
      res.send(questions);
    });

    // GET /questions/:resource
    app.get('/questions/:resource', (req, res) => {
      const { resource } = req.params;
      console.log(`GET /questions/${resource}`);

      // GET /questions/:id
      // if a question with id exists send that question.
      // else send undefined.
      if (parseInt(resource) > 0) {
        const question = db.get('questions')
          .find({ id: +resource })
          .value();

        res.send(question);
      } else if (resource === 'html' || resource === 'css' || resource === 'js') { // GET /questions/:category
        // if question(s) with category exist, send that(those) question(s)
        // else send empty array
        const questionsByCategory = db.get('questions')
          .filter({ category: resource })
          .sortBy('id')
          .value();

        res.send(questionsByCategory);
      } else {
        res.sendStatus(400);
      }
    });

    // POST /questions
    app.post('/questions', (req, res) => {
      db.get('questions')
        .push(req.body)
        .last()
        .write()
        .then(question => res.send(question));
    });

    // DELETE /questions/:resource
    app.delete('/questions/:resource', (req, res) => {
      const { resource } = req.params;
      console.log(`DELETE /questions/${resource}`);

      // DELETE /questions/:id
      // if a question with id exists, delete & send that question
      // else send empty array
      if (parseInt(resource) > 0) {
        db.get('questions')
          .remove({ id: +resource })
          .write()
          .then(question => res.send(question));
      } else if (resource === 'selected') { // DELETE /questions/selected
        db.get('questions')
          .remove({ selected: true })
          .write()
          .then(question => res.send(question));
      } else {
        res.sendStatus(400);
      }
    });

    // PATCH /questions/:resource
    app.patch('/questions/:id', (req, res) => {
      const { id } = req.params;
      console.log(`PATCH /questions/${id}`);

      // PATCH /questions/:id
      if (parseInt(id) > 0) {
        db.get('questions')
          .find({ id: +req.params.id })
          .assign({ selected: req.body.selected })
          .write()
          .then(question => res.send(question));
      } else {
        res.sendStatus(400);
      }
    });

    // Set db default values
    return db.defaults({ questions: [], users: [] }).write();
  })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'));
  });
