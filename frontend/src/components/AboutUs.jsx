import { Typography } from "@mui/material";
import React from "react";

const AboutUs = () => {
  const featuredBooks = [
    {
      id: 1,
      title: "The Alchemist",
      image: "b1.jpg",
      category: "Adventure Fiction",
    },
    {
      id: 2,
      title: "Harry Potter",
      image: "b2.jpg",
      category: "Fantasy Fiction",
    },
    {
      id: 3,
      title: "Matilda",
      image: "b3.jpg",
      category: "Childrens Literature",
    },
  ];
  return (
    <div
      style={{
        background: "linear-gradient(to right, #ffdde1, #ee9ca7)",
        minHeight: "100vh",
        py: 5,
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        About Our Bookstore
      </Typography>

      <Typography variant="body1" paragraph>
        Welcome to Our Bookstore! We offer a wide selection of books from
        various genres including fiction, non-fiction, and classics. Our goal is
        to make reading accessible and enjoyable for everyone. Below are some of
        our featured books:
      </Typography>
      <div className="featured-books">
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "red" }}>
          Featured Books
        </h2>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {featuredBooks.map((book) => (
            <div
              key={book.id}
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "8px",
                width: "120px",
                textAlign: "center",
              }}
            >
              <img
                src={book.image}
                alt={book.title}
                style={{ width: "100px", height: "120px" }}
              />
              <p
                style={{ marginTop: "10px", fontWeight: "bold", color: "blue" }}
              >
                {book.title}
              </p>
              <p style={{ fontSize: "12px", color: "default" }}>
                {book.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
