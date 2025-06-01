const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET = 'secret123'; // dùng để tạo token

app.use(cors());
app.use(bodyParser.json());

// Đọc danh sách người dùng từ file JSON
const getUsers = () => {
  if (!fs.existsSync('users.json')) return [];
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
};

// Ghi danh sách người dùng vào file JSON
const saveUsers = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Đăng ký
app.post('signup.html', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ msg: 'Tên người dùng đã tồn tại.' });

  const newUser = { username, password }; // (mật khẩu chưa mã hoá, chỉ dùng demo)
  users.push(newUser);
  saveUsers(users);
  res.status(201).json({ msg: 'Tạo tài khoản thành công!' });
});

// Đăng nhập
app.post('login.html', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ msg: 'Sai tên đăng nhập hoặc mật khẩu.' });

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token, user: { username } });
});

app.listen(PORT, () => {
  console.log(``);
});
