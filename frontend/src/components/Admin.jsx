import React, { useState } from 'react';

const Admin = () => {
  const [view, setView] = useState('none');
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [bookData, setBookData] = useState({
    name: '',
    author: '',
    price: '',
    imageFile: null,
  });

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/users');
    const data = await res.json();
    setUsers(data);
    setView('users');
  };

  const fetchBooks = async () => {
    const res = await fetch('http://localhost:3000/books');
    const data = await res.json();
    setBooks(data);
    setView('books');
  };

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:3000/orders');
    const data = await res.json();
    setOrders(data);
    setView('orders');
  };

  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setBookData((prev) => ({
      ...prev,
      imageFile: e.target.files[0],
    }));
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', bookData.name);
    formData.append('author', bookData.author);
    formData.append('price', bookData.price);
    formData.append('image', bookData.imageFile);

    const url = editingBook
      ? `http://localhost:3000/books/${editingBook._id}`
      : 'http://localhost:3000/books';

    const method = editingBook ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: formData,
    });

    const result = await res.json();
    alert(result.message || 'Success');
    setBookData({ name: '', author: '', price: '', imageFile: null });
    setEditingBook(null);
    fetchBooks();
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    const res = await fetch(`http://localhost:3000/books/${bookId}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    alert(result.message);
    fetchBooks();
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookData({
      name: book.name,
      author: book.author,
      price: book.price,
      imageFile: null,
    });
    setView('addBook');
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '30px',
        background: 'linear-gradient(to right, #1f4037, #99f2c8)',
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '36px', color: '#ffe600' }}>
        📚 Admin Dashboard
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button style={buttonStyle()} onClick={fetchUsers}>Show Users</button>
        <button style={buttonStyle()} onClick={() => {
          setEditingBook(null);
          setBookData({ name: '', author: '', price: '', imageFile: null });
          setView('addBook');
        }}>Add Book</button>
        <button style={buttonStyle()} onClick={fetchBooks}>View Books</button>
        <button style={buttonStyle()} onClick={fetchOrders}>View Orders</button>
        <button style={buttonStyle('#f44336')} onClick={handleLogout}>Logout</button>
      </div>

      {view === 'users' && (
        <div>
          <h2 style={{ textAlign: 'center', color: '#ffe600' }}>Signed-in Users</h2>
          <table style={tableStyle()}>
            <thead>
              <tr>
                <th style={thStyle()}>Username</th>
                <th style={thStyle()}>Email</th>
                
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i}>
                  <td style={tdStyle()}>{user.username}</td>
                  <td style={tdStyle()}>{user.email}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'addBook' && (
        <form onSubmit={handleBookSubmit} style={{
          backgroundColor: '#333',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '500px',
          margin: 'auto',
        }}>
          <h2 style={{ textAlign: 'center', color: '#ffe600' }}>
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <input type="text" name="name" placeholder="Book Name" value={bookData.name} onChange={handleBookInputChange} required style={inputStyle()} />
          <input type="text" name="author" placeholder="Author Name" value={bookData.author} onChange={handleBookInputChange} required style={inputStyle()} />
          <input type="number" name="price" placeholder="Price" value={bookData.price} onChange={handleBookInputChange} required style={inputStyle()} />
          <input type="file" accept="image/*" onChange={handleImageChange} required style={inputStyle()} />
          <button type="submit" style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      )}

      {view === 'books' && (
        <div>
          <h2 style={{ textAlign: 'center', color: '#ffe600' }}>All Books</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {books.map((book, i) => (
              <div key={i} style={{
                backgroundColor: '#111',
                color: 'white',
                borderRadius: '10px',
                padding: '15px',
                margin: '10px',
                width: '220px',
              }}>
                <img src={book.image} alt={book.name} style={{
                  width: '100%',
                  borderRadius: '5px',
                  marginBottom: '10px',
                }} />
                <h4>{book.name}</h4>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Price:</strong> ₹{book.price}</p>
                <button onClick={() => handleEditBook(book)} style={{ ...buttonStyle(), marginRight: '5px' }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteBook(book._id)} style={{ ...buttonStyle('#dc3545') }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'orders' && (
        <div>
          <h2 style={{ textAlign: 'center', color: '#ffe600' }}>User Orders</h2>
          <table style={tableStyle()}>
            <thead>
              <tr>
                <th style={thStyle()}>Username</th>
                <th style={thStyle()}>Email</th>
                <th style={thStyle()}>Books</th>
                <th style={thStyle()}>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i}>
                  <td style={tdStyle()}>{order.username}</td>
                  <td style={tdStyle()}>{order.userEmail}</td>
                  <td style={tdStyle()}>
                    <ul>
                      {order.books.map((b, j) => (
                        <li key={j}>{b.name} x {b.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={tdStyle()}>{new Date(order.orderTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Inline style helpers
const buttonStyle = (bg = '#ff6f61') => ({
  margin: '0 10px 10px 10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: bg,
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: '0.3s',
});

const tableStyle = () => ({
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#222',
  color: 'white',
  marginTop: '20px',
});

const thStyle = () => ({
  backgroundColor: '#444',
  padding: '10px',
});

const tdStyle = () => ({
  padding: '10px',
  borderBottom: '1px solid #666',
});

const inputStyle = () => ({
  padding: '10px',
  width: '100%',
  marginBottom: '10px',
  borderRadius: '5px',
  border: 'none',
});

export default Admin;
