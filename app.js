const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Universe@123',
  database: 'staff_management',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/staffregistration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'staffregistration.html'));
  });
app.get('/staffregistration', (req, res) => {
  db.query('SELECT * FROM staff', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/staffregistration', (req, res) => {
  const { name, qualifications, role, contact, password } = req.body;
  const sql = 'INSERT INTO staff (name, qualifications, role, contact,password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, qualifications, role, contact, password], (err, result) => {
    if (err) throw err;
    res.redirect('/'); 
  });
});



app.post('/stafflogin/login', (req, res) => {
    const { name, password } = req.body;
  
    const sql = 'SELECT id, name, password FROM staff WHERE name = ?';
    db.query(sql, [name], (err, results) => {
      if (err) throw err;
  
      if (results.length > 0) {
        const staffMember = results[0];
  
        if (password === staffMember.password) {
          res.redirect(`/stafflogin/${staffMember.id}`);
        } else {
          res.send('Invalid password.');
        }
      } else {
        res.send('Staff member not found.');
      }
    });
  });
  
  
app.get('/stafflogin/:id', (req, res) => {
    const staffId = req.params.id;
  
    const sql = `
      SELECT staff.name AS staff_name, training.activity_name, training.date, training.duration_hours, training.description
      FROM staff
      LEFT JOIN training ON staff.id = training.staff_id
      WHERE staff.id = ?
    `;
  
    db.query(sql, [staffId], (err, results) => {
      if (err) throw err;
      res.render('staffDashboard', { staff: results });
    });
  });


app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  });
  
  app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      res.redirect('/admin/dashboard');
    } else {
      res.send('Invalid username or password.');
    }
  });
  app.get('/admin/dashboard', (req, res) => {
    db.query('SELECT * FROM staff', (err, staffResults) => {
      if (err) throw err;
  
      db.query('SELECT * FROM training', (err, trainingResults) => {
        if (err) throw err;
  
        res.render('dashboard', { staff: staffResults, training: trainingResults });
      });
    });
  });
  app.post('/admin/approve/:id', (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
  
    const status = action === 'approve' ? 'approved' : 'rejected';
    const sql = 'UPDATE staff SET status=? WHERE id=?';
    db.query(sql, [status, id], (err, result) => {
      if (err) throw err;
      res.redirect('/admin/dashboard');
    });
  });
  
  app.post('/admin/training/add', (req, res) => {
    const { staff_id, activity_name, date, duration_hours, description } = req.body;
  
    const sql = 'INSERT INTO training (staff_id, activity_name, date, duration_hours, description) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [staff_id, activity_name, date, duration_hours, description], (err, result) => {
      if (err) throw err;
      res.redirect('/admin/dashboard');
    });
  });
  

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
