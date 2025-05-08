import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  const handleAddToCart = (book) => {
    const user = localStorage.getItem("user");

    if (user) {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = existingCart.findIndex(
        (item) => item._id === book._id
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push({ ...book, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      navigate("/cart");
    } else {
      setShowLoginMessage(true);
      setTimeout(() => {
        navigate("/signup");
      }, 1500);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ffe4ec, #f9c5d1, #fce4ec)",
        }}
      >
        <div>Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ffe4ec, #f9c5d1, #fce4ec)",
        }}
      >
        <div style={{ color: "red" }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(to right, #ffdde1, #ee9ca7)",
        fontFamily: "sans-serif",
      }}
    >
      <h2
        className="text-2xl font-bold mb-4"
        style={{ textAlign: "center", color: "#b03b5c" }}
      >
        Discover Your Favourite Books
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 15px",
            width: "60%",
            maxWidth: "500px",
            borderRadius: "20px",
            border: "1px solid #f48fb1",
            outline: "none",
            fontSize: "16px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {showLoginMessage && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "4px",
            textAlign: "center",
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "80%",
            maxWidth: "400px",
          }}
        >
          Please login first to add items to your cart
        </div>
      )}

      {filteredBooks.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h3 style={{ color: "#c2185b" }}>
            No books found matching your search
          </h3>
          <button
            onClick={() => setSearchTerm("")}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#ec407a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
            padding: "0 20px",
          }}
        >
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              style={{
                border: "1px solid #f8bbd0",
                padding: "15px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
              onClick={() => handleBookClick(book._id)}
            >
              <div
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={book.image}
                  alt={book.name}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150x200?text=No+Image";
                  }}
                />
              </div>
              <h3
                style={{
                  color: "#c2185b",
                  marginBottom: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  height: "40px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {book.name}
              </h3>
              <p
                style={{
                  color: "#7b1fa2",
                  marginBottom: "5px",
                  fontSize: "14px",
                }}
              >
                {book.author}
              </p>
              <p
                style={{
                  color: "#e91e63",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                ₹{book.price}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(book);
                }}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  backgroundColor: "#ec407a",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#d81b60",
                  },
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
