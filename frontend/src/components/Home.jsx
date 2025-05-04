import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  // Debugging: Log the current path and user status
  console.log('Rendering Home component');
  console.log('Current user:', localStorage.getItem('user'));

  useEffect(() => {
    console.log('Fetching books...');
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3000/books');
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Books data:', data);
          setBooks(data);
        } else {
          console.error('Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    console.log('Add to cart clicked for book:', book.name);
    const user = localStorage.getItem('user');
    console.log('User status:', user ? 'Logged in' : 'Not logged in');

    if (user) {
      console.log('User is logged in, proceeding to cart');
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      console.log('Existing cart:', existingCart);
      
      const isAlreadyInCart = existingCart.some((item) => item._id === book._id);
      if (!isAlreadyInCart) {
        existingCart.push(book);
        localStorage.setItem('cart', JSON.stringify(existingCart));
        console.log('Updated cart:', existingCart);
      }
      navigate('/cart');
      console.log('Navigating to cart');
    } else {
      console.log('User not logged in, showing message and redirecting');
      setShowLoginMessage(true);
      setTimeout(() => {
        console.log('Redirecting to login');
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <div>
      <h2>Books</h2>
      {showLoginMessage && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          textAlign: 'center',
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: '80%',
          maxWidth: '400px'
        }}>
          Please login first to add items to your cart
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {books.map((book, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
              width: '200px',
              textAlign: 'center',
            }}
          >
            <img 
              src={book.image} 
              alt={book.name} 
              style={{ width: '100px', height: '150px' }} 
              onError={(e) => {
                console.error('Image failed to load:', book.image);
                e.target.src = 'fallback-image-url';
              }}
            />
            <h3>{book.name}</h3>
            <p>Author: {book.author}</p>
            <p>Price: ${book.price}</p>
            <button 
              onClick={() => handleAddToCart(book)}
              style={{ cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;