const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');  

const app = express();

require('./connection');  

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Temporary storage for users and books
const users = [];
const books = [];

// Seed admin user
const seedAdmin = () => {
  const adminEmail = 'admin@example.com';
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  const existingAdmin = users.find(user => user.email === adminEmail);

  if (!existingAdmin) {
    users.push({
      email: adminEmail,
      username: adminUsername,
      password: adminPassword,
      isAdmin: true,
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin already exists');
  }
};

seedAdmin();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Signup route
app.post('/signup', (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ email, username, password, isAdmin: false });
  console.log('Current users:', users);
  return res.status(200).json({ message: 'Signup successful!' });
});

// Login route (UPDATED)
app.post('/login', (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = users.find(user => user.email === email && user.username === username);

  if (!user) {
    return res.status(404).json({ message: 'User not found. Please sign up first.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  return res.status(200).json({
    message: 'Login successful!',
    user: {
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin || false
    }
  });
});

// Admin: Get all users
app.get('/users', (req, res) => {
  return res.status(200).json(users);
});

// Admin: Add book with image
app.post('/add-book', upload.single('image'), (req, res) => {
  const { name, author, price, imageUrl } = req.body;

  if (!name || !author || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let image;
  if (req.file) {
    image = 'C:/Users/MyPc/Desktop/P1/login-backend/uploads/' + req.file.filename;
  } else if (imageUrl) {
    image = imageUrl;
  }

  const newBook = {
    _id: uuidv4(),  
    name,
    author,
    price,
    image,
  };

  books.push(newBook);

  return res.status(200).json({ message: 'Book added successfully', book: newBook });
});

// Get all books
app.get('/books', (req, res) => {
  return res.status(200).json(books);
});

// Admin: Delete book
app.delete('/delete-book/:id', (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex(book => book._id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const imagePath = path.join(__dirname, 'uploads', books[bookIndex].image);
  if (fs.existsSync(imagePath) && !books[bookIndex].image.startsWith('http')) {
    fs.unlinkSync(imagePath);
  }

  books.splice(bookIndex, 1);
  res.json({ message: 'Book deleted successfully' });
});

// Admin: Update book
app.put('/update-book/:id', upload.single('image'), (req, res) => {
  const bookId = req.params.id;
  const { name, author, price, imageUrl } = req.body;

  const book = books.find(book => book._id === bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  book.name = name || book.name;
  book.author = author || book.author;
  book.price = price || book.price;

  if (req.file) {
    const oldImagePath = path.join(__dirname, 'uploads', book.image);
    if (fs.existsSync(oldImagePath) && !book.image.startsWith('http')) {
      fs.unlinkSync(oldImagePath);
    }
    book.image = req.file.filename;
  } else if (imageUrl) {
    book.image = imageUrl;
  }

  res.json({ message: 'Book updated successfully', book });
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
