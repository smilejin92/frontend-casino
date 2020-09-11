require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create server
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Create database instance and start server
const adapter = new FileAsync('db.json');
low(adapter)
  .then(db => {
    // Routes
    // GET /api/quizzes
    app.get('/api/quizzes', (_, res) => {
      console.log('GET /api/quizzes');
      const quizzes = db.get('quizzes').value();
      res.send(quizzes);
    });

    // GET /api/quizzes/:resource
    app.get('/api/quizzes/:resource', (req, res) => {
      const { resource } = req.params;
      console.log(`GET /api/quizzes/${resource}`);

      // GET /api/quizzes/:id
      // if a quiz with specified id exists, send that quiz.
      // else send status 404.
      if (parseInt(resource) > 0) {
        const quiz = db
          .get('quizzes')
          .find({ id: +resource })
          .value();

        if (quiz) res.send(quiz);
        else res.sendStatus(404);

        return;
      }

      // GET /api/quizzes/:category
      // if question(s) with specified category exist, send that(those) question(s)
      // there might be no question on specified category. In that case, it returns an empty array.
      if (
        resource === 'html' ||
        resource === 'css' ||
        resource === 'javascript'
      ) {
        const quizzesByCategory = db
          .get('quizzes')
          .filter({ category: resource })
          .sortBy('id')
          .value();

        res.send(quizzesByCategory);
        return;
      }

      // Bad Request
      res.sendStatus(400);
    });

    // POST /api/quizzes
    // a quiz must be validated before creating request.
    app.post('/api/quizzes', authenticateToken, (req, res) => {
      console.log('POST /api/quizzes');
      db.get('quizzes')
        .push(req.body)
        .last()
        .write()
        .then(quiz => res.send(quiz));
    });

    // DELETE /api/quizzes/:resource
    app.delete('/api/quizzes/:resource', (req, res) => {
      const { resource } = req.params;
      console.log(`DELETE /api/quizzes/${resource}`);

      // DELETE /api/quizzes/:id
      // if a quiz with specified id exists,
      // delete that quiz, and send an empty object.
      // else send status 404
      if (parseInt(resource) > 0) {
        const quiz = db
          .get('quizzes')
          .find({ id: +resource })
          .value();

        if (!quiz) {
          res.sendStatus(404);
          return;
        }

        db.get('quizzes')
          .remove(quiz)
          .write()
          .then(() => res.send({}));

        return;
      }

      // DELETE /api/quizzes/selected
      // delete selected quiz(zes) and send rest.
      if (resource === 'selected') {
        const filteredQuizzes = db
          .get('quizzes')
          .filter({ selected: false })
          .value();

        db.get('quizzes')
          .remove({ selected: true })
          .write()
          .then(() => res.send(filteredQuizzes));

        return;
      }

      res.sendStatus(400);
    });

    // PATCH /api/quizzes/:id
    // if id is valid number but not exist, send status 404
    // if id is not valid, send status 400
    // else send modified quiz.
    app.patch('/api/quizzes/:id', (req, res) => {
      const { id } = req.params;
      console.log(`PATCH /api/quizzes/${id}`);

      if (parseInt(id) > 0) {
        const quiz = db
          .get('quizzes')
          .find({ id: +id })
          .value();

        if (!quiz) {
          res.sendStatus(404);
          return;
        }

        db.get('quizzes')
          .find(quiz)
          .assign({ selected: req.body.selected })
          .write()
          .then(_quiz => res.send(_quiz));

        return;
      }

      res.sendStatus(400);
    });

    // PUT /api/quizzes/:id
    // if id is valid number but not exist, send status 404
    // if id is not valid, send status 400
    // else send modified quiz.
    app.put('/api/quizzes/:id', (req, res) => {
      const { id } = req.params;
      console.log(`PUT /api/quizzes/${id}`);

      if (parseInt(id) > 0) {
        const quiz = db
          .get('quizzes')
          .find({ id: +id })
          .value();

        if (!quiz) {
          res.sendStatus(404);
          return;
        }

        db.get('quizzes')
          .find(quiz)
          .assign(req.body)
          .write()
          .then(_quiz => res.send(_quiz));

        return;
      }

      res.sendStatus(400);
    });

    // get /users
    app.get('/api/users', (_, res) => {
      console.log('GET /api/users');
      const users = db.get('users').value();
      res.send(users);
    });

    // post /api/admins
    // create admin
    app.post('/api/admins', async (req, res) => {
      console.log('POST /api/admins');
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        db.get('admins')
          .push({ ...req.body, password: hashedPassword })
          .last()
          .write()
          .then(admin => res.status(201).send(admin));
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // post /api/admins/login
    // might wanna remove /login?
    app.post('/api/admins/login', async (req, res) => {
      console.log('POST /api/admins/login');

      const admin = db
        .get('admins')
        .find({ name: req.body.name })
        .value();

      if (!admin) res.status(400).send('Cannot find admin');

      try {
        const validated = await bcrypt.compare(req.body.password, admin.password);
        // if (validated) res.send('login Success'); // should be replaced by token
        // else res.send('Not allowed');
        if (!validated) res.send('Wrong Password');

        // authenticated
        const { name } = req.body;

        // admin obj, secret key
        const accessToken = jwt.sign({ name }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken });
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Set db default values
    return db.defaults({ quizzes: [], users: [], admins: [] }).write();
  })
  .then(() => {
    app.listen(5000, () => console.log('listening on port 5000'));
  });

// middleware
function authenticateToken(req, res, next) {
  const { authorization } = req.headers;
  console.log(authorization);
  const token = authorization && authorization.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, err => {
    if (err) return res.sendStatus(403);
    next();
  });
}
