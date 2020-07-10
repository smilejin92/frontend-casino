const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

// Create server
const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('dist'));
app.use(express.urlencoded({ extended: true }));

// Create database instance and start server
const adapter = new FileAsync('db.json');
low(adapter)
  .then(db => {
    // Routes
    // GET /quizzes
    app.get('/quizzes', (_, res) => {
      console.log('GET /quizzes');
      const quizzes = db.get('quizzes').value();
      res.send(quizzes);
    });

    // GET /quizzes/:resource
    app.get('/quizzes/:resource', (req, res) => {
      const { resource } = req.params;
      console.log(`GET /quizzes/${resource}`);

      // GET /quizzes/:id
      // if a question with id exists send that question.
      // else send undefined.
      if (parseInt(resource) > 0) {
        const question = db.get('quizzes')
          .find({ id: +resource })
          .value();

        res.send(question);
      } else if (resource === 'html' || resource === 'css' || resource === 'js') { // GET /quizzes/:category
        // if question(s) with category exist, send that(those) question(s)
        // else send empty array
        const quizzesByCategory = db.get('quizzes')
          .filter({ category: resource })
          .sortBy('id')
          .value();

        res.send(quizzesByCategory);
      } else {
        res.sendStatus(400);
      }
    });

    // POST /quizzes
    app.post('/quizzes', (req, res) => {
      console.log('POST /quizzes');
      db.get('quizzes')
        .push(req.body)
        .last()
        .write()
        .then(question => res.send(question));
    });

    // DELETE /quizzes/:resource
    app.delete('/quizzes/:resource', (req, res) => {
      const { resource } = req.params;
      console.log(`DELETE /quizzes/${resource}`);

      // DELETE /quizzes/:id
      // if a question with id exists, delete & send that question
      // else send empty array
      if (parseInt(resource) > 0) {
        db.get('quizzes')
          .remove({ id: +resource })
          .write()
          .then(() => res.send({}));
      } else if (resource === 'selected') { // DELETE /quizzes/selected
        const filteredQuizzes = db.get('quizzes')
          .filter({ selected: false })
          .value();

        db.get('quizzes')
          .remove({ selected: true })
          .write()
          .then(() => res.send(filteredQuizzes));
      } else {
        res.sendStatus(400);
      }
    });

    // PATCH /quizzes/:resource
    app.patch('/quizzes/:id', (req, res) => {
      let { id } = req.params;
      id = +id;
      console.log(`PATCH /quizzes/${id}`);

      // PATCH /quizzes/:id
      if (id > 0) {
        db.get('quizzes')
          .find({ id })
          .assign({ selected: req.body.selected })
          .write()
          .then(question => res.send(question));
      } else {
        res.sendStatus(400);
      }
    });

    // put /quizzes/:id
    app.put('/quizzes/:id', (req, res) => {
      const { id } = req.params;
      console.log(`PUT /quizzes/${id}`);

      // PATCH /quizzes/:id
      if (parseInt(id) > 0) {
        db.get('quizzes')
          .find({ id: +req.params.id })
          .assign(req.body)
          .write()
          .then(question => res.send(question));
      } else {
        res.sendStatus(400);
      }
    });

    // Set db default values
    return db.defaults({ quizzes: [], users: [] }).write();
  })
  .then(() => {
    app.listen(3000, () => console.log('listening on port 3000'));
  });
