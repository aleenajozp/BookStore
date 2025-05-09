const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const DATABASE_URL = 'mongodb://localhost:27017/bookStore';

// Import models
const Order = require('./model/order');
const User = require('./model/user');
const Book = require('./model/book');
const Cart = require('./model/cart');

// Connect to MongoDB
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('MongoDB connection is successful!');
    seedAdmin();
  })
  .catch(err => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ===================== ADMIN SEED =====================
const seedAdmin = async () => {
  const adminEmail = 'admin@example.com';
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

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
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
  }
};

// ===================== MULTER CONFIG =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
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
  const { name, author, price} = req.body;

  if (!name || !author || !price || !req.file) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const image = `http://localhost:3000/uploads/${req.file.filename}`;
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

    const { name, author, price} = req.body;
    const updates = {
      name: name || book.name,
      author: author || book.author,
      price: price || book.price
    };

    if (req.file) {
      updates.image = `http://localhost:3000/uploads/${req.file.filename}`;
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
    const cartItems = await Cart.find({ userId: mongoose.Types.ObjectId(userId) }).populate('bookId');
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
  console.log( req.body);
  const { userEmail, username, cartItems, totalAmount, paymentMethod,orderTime} = req.body;

  if (!userEmail || !username || !cartItems || !totalAmount || !paymentMethod) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const order = new Order({
      userEmail,
      username,
      books: cartItems.map(item => ({
        bookId: item.bookId._id,
        name: item.bookId.name,
        author: item.bookId.author,
        price: item.bookId.price,
        quantity: item.quantity,
        image: item.bookId.image
      })),
      totalAmount,
      paymentMethod,
      orderTime
    });

    await order.save();
    await Cart.deleteMany({ userId: req.body.userId });

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

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
