// app.js
const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const multer = require('multer');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.set('view engine', 'ejs');

// Multer setup
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Routes

// List students
app.get('/', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) throw err;
    res.render('index', { students: results });
  });
});

// Add form
app.get('/add', (req, res) => {
  res.render('add');
});

// Add student
app.post('/add', upload.single('image'), (req, res) => {
  const { name, email, age } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : '';
  db.query('INSERT INTO students SET ?', { name, email, age, image }, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Edit form
app.get('/edit/:id', (req, res) => {
  db.query('SELECT * FROM students WHERE id=?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('edit', { student: results[0] });
  });
});

// Update student
app.post('/edit/:id', upload.single('image'), (req, res) => {
  const { name, email, age } = req.body;
  const id = req.params.id;

  if (req.file) {
    const image = '/uploads/' + req.file.filename;
    db.query('UPDATE students SET name=?, email=?, age=?, image=? WHERE id=?',
      [name, email, age, image, id], (err) => {
        if (err) throw err;
        res.redirect('/');
      });
  } else {
    db.query('UPDATE students SET name=?, email=?, age=? WHERE id=?',
      [name, email, age, id], (err) => {
        if (err) throw err;
        res.redirect('/');
      });
  }
});

// Delete
app.get('/delete/:id', (req, res) => {
  db.query('DELETE FROM students WHERE id=?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(3000, "0.0.0.0" () => console.log('Server started on 3000'));
