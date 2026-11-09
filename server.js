const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/bookStore';

// Import models
const Order = require('./models/order');
const User = require('./models/user');
const Book = require('./models/book');
const Cart = require('./models/cart');
const Contact = require('./models/contact');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(DATABASE_URL)
  .then(async () => {
    console.log('✅ MongoDB connection is successful!');
    await seedAdmin();
    await seedBooks();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Healthcheck
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// ===================== ADMIN SEED =====================
const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const newAdmin = new User({
        email: adminEmail,
        username: adminUsername,
        password: adminPassword,
        isAdmin: true,
      });
      await newAdmin.save();
      console.log('✅ Admin user created:', adminEmail);
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
  }
};

// ===================== SAMPLE BOOKS SEED =====================
const seedBooks = async () => {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      const defaultBooks = [
        { name: "The Alchemist", author: "Paulo Coelho", price: "349", image: "/uploads/1746266929639-b1.jpg" },
        { name: "To Kill a Mockingbird", author: "Harper Lee", price: "399", image: "/uploads/1746351264841-b5.jpg" },
        { name: "1984", author: "George Orwell", price: "450", image: "/uploads/1746352314975-b11.jpg" },
        { name: "The Great Gatsby", author: "F. Scott Fitzgerald", price: "499", image: "/uploads/1746357148292-b6.jpg" },
        { name: "Pride and Prejudice", author: "Jane Austen", price: "299", image: "/uploads/1746515700535-b12.jpg" },
        { name: "The Hobbit", author: "J.R.R. Tolkien", price: "599", image: "/uploads/1746516016961-b10.jpg" },
        { name: "Harry Potter", author: "J.K. Rowling", price: "699", image: "/uploads/1746516091425-b9.jpg" },
        { name: "War and Peace", author: "Leo Tolstoy", price: "799", image: "/uploads/1746516150518-b8.jpg" },
        { name: "Crime and Punishment", author: "Fyodor Dostoevsky", price: "550", image: "/uploads/1746516206047-b7.jpg" },
        { name: "The Catcher in the Rye", author: "J.D. Salinger", price: "420", image: "/uploads/1746516267783-b4.jpg" },
        { name: "Brave New World", author: "Aldous Huxley", price: "480", image: "/uploads/1746516301704-b2.jpg" },
        { name: "The Little Prince", author: "Antoine de Saint-Exupéry", price: "250", image: "/uploads/1746516356575-b3.jpg" },
      ];
      await Book.insertMany(defaultBooks);
      console.log(`✅ Seeded ${defaultBooks.length} sample books`);
    }
  } catch (err) {
    console.error('❌ Error seeding books:', err);
  }
};

// ===================== MULTER CONFIG =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ===================== AUTHENTICATION =====================
app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, username, password, isAdmin: false });
    await newUser.save();
    res.status(201).json({ message: 'Signup successful!', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful!',
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// ===================== USER ROUTES =====================
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// ===================== BOOK ROUTES =====================
app.post('/books', upload.single('image'), async (req, res) => {
  const { name, author, price } = req.body;

  if (!name || !author || !price || !req.file) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const image = `/uploads/${req.file.filename}`;
    const newBook = new Book({
      name,
      author,
      price,
      image
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
});

app.put('/books/:id', upload.single('image'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const { name, author, price } = req.body;
    const updates = {
      name: name || book.name,
      author: author || book.author,
      price: price || book.price
    };

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
});

// ===================== CART ROUTES =====================
app.post('/cart', async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ message: 'User ID and Book ID are required' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let cartItem = await Cart.findOne({ userId, bookId });
    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = new Cart({ userId, bookId, quantity: quantity || 1 });
      await cartItem.save();
    }

    res.status(200).json({ message: 'Book added to cart', cartItem });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
});

app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const cartItems = await Cart.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('bookId');
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart items', error: err.message });
  }
});

app.put('/cart/:id', async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  try {
    const cartItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    ).populate('bookId');

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart updated', cartItem });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
});

app.delete('/cart/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from cart', error: err.message });
  }
});

// ===================== ORDER ROUTES =====================
app.post('/orders', async (req, res) => {
  const { userEmail, username, cartItems, totalAmount, paymentMethod, orderTime } = req.body;

  if (!userEmail || !username || !cartItems || !totalAmount || !paymentMethod) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const order = new Order({
      userEmail,
      username,
      books: cartItems.map(item => ({
        bookId: item.bookId ? (item.bookId._id || item.bookId) : (item._id || null),
        name: item.name || (item.bookId && item.bookId.name) || 'Book',
        author: item.author || (item.bookId && item.bookId.author) || 'Author',
        price: item.price || (item.bookId && item.bookId.price) || 0,
        quantity: item.quantity || 1,
        image: item.image || (item.bookId && item.bookId.image) || ''
      })),
      totalAmount,
      paymentMethod,
      orderTime: orderTime || new Date().toISOString()
    });

    await order.save();
    if (req.body.userId) {
      await Cart.deleteMany({ userId: req.body.userId });
    }

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

app.get('/orders/:email', async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// ===================== CONTACT ROUTE =====================
app.post('/contact', async (req, res) => {
  console.log("Invoked route: '/contact'");
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill all fields.' });
  }

  try {
    // Save to Database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Optionally send email if credentials configured
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: email,
          to: process.env.GMAIL_USER,
          subject: `Contact Form Submission from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });
      } catch (mailErr) {
        console.warn('Nodemailer notice (email delivery failed, but message recorded):', mailErr.message);
      }
    }

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error in /contact:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// ===================== STATIC FRONTEND SERVING =====================
const publicDir = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, 'frontend', 'dist');

if (fs.existsSync(publicDir)) {
  console.log(`Serving static frontend from: ${publicDir}`);
  app.use(express.static(publicDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BookStore unified server running on port ${PORT}`);
});
