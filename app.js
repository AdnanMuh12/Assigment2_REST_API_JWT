

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Baca data dari teachers.json
const teachersData = JSON.parse(fs.readFileSync('teachers.json'));

// Baca data dari users.json
const usersData = JSON.parse(fs.readFileSync('users.json'));

// Secret key untuk JWT
const secretKey = 'secret-key'; // Gantilah dengan kunci yang kuat dalam produksi.

// Middleware untuk verifikasi token JWT
function verifyToken(req, res, next) {
  const token = req.header('authorization');

  if (!token) {
    return res.status(403).send('Token is not provided');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = decoded;
    next();
  });
}

// API untuk login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usersData.find((user) => user.username === username && user.password === password);

  if (!user) {
    res.status(401).json({ message: 'password atau username salah' });
  } else {
    const token = jwt.sign({ username }, secretKey);
    res.json({ token });
  }
});

// API untuk mendapatkan semua data guru (memerlukan autentikasi)
app.get('/teachers', verifyToken, (req, res) => {
  res.json(teachersData);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



