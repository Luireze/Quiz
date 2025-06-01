  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const fs = require('fs');
  const jwt = require('jsonwebtoken');

  const app = express();
  const PORT = process.env.PORT || 3000;
  const SECRET = 'secret123';

  app.use(cors());
  app.use(bodyParser.json());

  const getUsers = () => {
    if (!fs.existsSync('users.json')) return [];
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
  };

  const saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  };

  app.post('/api/auth/signup', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const exists = users.find(u => u.username === username);
    if (exists) return res.status(400).json({ msg: 'Username already exists.' });

    users.push({ username, password });
    saveUsers(users);
    res.status(201).json({ msg: 'Account created successfully!' });
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ msg: 'Invalid credentials.' });

    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token, user: { username } });
  });

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
