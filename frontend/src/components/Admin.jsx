import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [view, setView] = useState('none');
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [bookData, setBookData] = useState({
    name: '',
    author: '',
    price: '',
    image: '',
    imageFile: null, // for image file upload
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
      imageFile: e.target.files[0], // store the file object
    }));
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', bookData.name);
    formData.append('author', bookData.author);
    formData.append('price', bookData.price);
    
    // If image is uploaded as a file, append the file
    if (bookData.imageFile) {
      formData.append('image', bookData.imageFile);
    } else {
      // If using image URL, append the URL directly
      formData.append('image', bookData.image);
    }

    const url = editingBook
      ? `http://localhost:3000/update-book/${editingBook._id}`
      : 'http://localhost:3000/add-book';

    const method = editingBook ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: formData,
    });

    const result = await res.json();
    alert(result.message || 'Success');
    setBookData({ name: '', author: '', price: '', image: '', imageFile: null });
    setEditingBook(null);
    fetchBooks();
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    const res = await fetch(`http://localhost:3000/delete-book/${bookId}`, {
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
      image: book.image || '',
      imageFile: null, // reset file on edit
    });
    setView('addBook');
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const styles = {
    container: {
      background: 'linear-gradient(to right, #1f4037, #99f2c8)',
      minHeight: '100vh',
      color: '#fff',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      fontSize: '36px',
      marginBottom: '30px',
      color: '#ffe600',
    },
    buttonGroup: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    button: {
      margin: '0 10px',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#ff6f61',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: '0.3s',
    },
    logoutButton: {
      backgroundColor: '#f44336',
    },
    buttonHover: {
      backgroundColor: '#ff3b2f',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#222',
      color: 'white',
      marginTop: '20px',
    },
    th: {
      backgroundColor: '#444',
      padding: '10px',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #666',
    },
    form: {
      backgroundColor: '#333',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '500px',
      margin: 'auto',
    },
    input: {
      padding: '10px',
      width: '100%',
      marginBottom: '10px',
      borderRadius: '5px',
      border: 'none',
    },
    submitButton: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    bookCard: {
      backgroundColor: '#111',
      color: 'white',
      borderRadius: '10px',
      padding: '15px',
      margin: '10px',
      width: '220px',
    },
    bookContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      borderRadius: '5px',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📚 Admin Dashboard</h1>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={fetchUsers}>Show Users</button>
        <button style={styles.button} onClick={() => { setEditingBook(null); setView('addBook'); }}>Add Book</button>
        <button style={styles.button} onClick={fetchBooks}>View Books</button>
        <button style={{ ...styles.button, ...styles.logoutButton }} onClick={handleLogout}>Logout</button>
      </div>

      {view === 'users' && (
        <div>
          <h2 style={{ textAlign: 'center', color: '#ffe600' }}>Signed-in Users</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Password</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i}>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'addBook' && (
        <form onSubmit={handleBookSubmit} style={styles.form}>
          <h2 style={{ textAlign: 'center', color: '#ffe600' }}>
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h2>
          <input type="text" name="name" placeholder="Book Name" value={bookData.name} onChange={handleBookInputChange} required style={styles.input} />
          <input type="text" name="author" placeholder="Author Name" value={bookData.author} onChange={handleBookInputChange} required style={styles.input} />
          <input type="number" name="price" placeholder="Price" value={bookData.price} onChange={handleBookInputChange} required style={styles.input} />
          
          {/* Image URL input */}
          <input type="text" name="image" placeholder="Image URL" value={bookData.image} onChange={handleBookInputChange} style={styles.input} />
          
          {/* Image Upload input */}
          <input type="file" onChange={handleImageChange} style={styles.input} />
          
          <button type="submit" style={styles.submitButton}>
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      )}

      {view === 'books' && (
        <div>
          <h2 style={{ textAlign: 'center', color: '#ffe600' }}>All Books</h2>
          <div style={styles.bookContainer}>
            {books.map((book, i) => (
              <div key={i} style={styles.bookCard}>
                <img src={book.image} alt={book.name} style={styles.image} />
                <h4>{book.name}</h4>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Price:</strong> ₹{book.price}</p>
                <button onClick={() => handleEditBook(book)} style={{ ...styles.button, marginRight: '5px' }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteBook(book._id)} style={{ ...styles.button, backgroundColor: '#dc3545' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
