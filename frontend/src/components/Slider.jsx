import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div style={{ ...arrowStyle, right: "10px" }} onClick={onClick}>
      ➡️
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div style={{ ...arrowStyle, left: "10px" }} onClick={onClick}>
      ⬅️
    </div>
  );
}

const arrowStyle = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  zIndex: 2,
  fontSize: "2rem",
  color: "#b03b5c",
  cursor: "pointer",
};

const ImageSlider = () => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate("/home");
  };

  const books = [
    {
      image: "b6.jpg",
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
    },
    {
      image: "b1.jpg",
      name: "The Alchemist",
      author: "Paulo Coelho",
    },
    {
      image: "b5.jpg",
      name: "1984",
      author: "George Orwell",
    },
    {
      image: "b2.jpg",
      name: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
    },
    {
      image: "b4.jpg",
      name: "Pride and Prejudice",
      author: "Jane Austen",
    },
  ];

  const bestsellers = [
    {
      image: "b1.jpg",
      name: "The Alchemist",
      author: "Paulo Coelho",
    },
    {
      image: "b2.jpg",
      name: "Harry Potter",
      author: "J.K. Rowling",
    },
    {
      image: "b6.jpg",
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
    },
    {
      image: "b4.jpg",
      name: "Pride and Prejudice",
      author: "Jane Austen",
    },
    {
      image: "b5.jpg",
      name: "1984",
      author: "George Orwell",
    },
  ];

  const newArrivals = [
    {
      image: "a1.jpg",
      name: "It Ends With Us",
      author: "Collen Hover",
    },
    {
      image: "a2.jpg",
      name: "Until Her Last Breath",
      author: "Juleya Thomas",
    },
    {
      image: "a3.jpg",
      name: "The Catcher in the Rye",
      author: "J.D. Salinger",
    },
    {
      image: "a5.jpg",
      name: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
    },
    {
      image: "a6.jpg",
      name: "Animal Farm",
      author: "George Orwell",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const handleShowMore = () => {
    navigate("/home");
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(to right, #ffdde1, #ee9ca7)",
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "80%", position: "relative", marginBottom: "50px" }}>
        <Slider {...settings}>
          {books.map((book, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "20px",
                gap: "30px",
                backgroundColor: "#fff0f5",
                borderRadius: "10px",
              }}
            >
              <img
                src={book.image}
                alt={book.name}
                style={{
                  width: "250px",
                  height: "420px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <div
                style={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h2 style={{ margin: "0 0 10px", color: "#b03b5c" }}>
                  {book.name}
                </h2>
                <h4 style={{ margin: "0 0 20px", color: "#c2185b" }}>
                  by {book.author}
                </h4>
                <button
                  onClick={handleShowMore}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    backgroundColor: "#ec407a",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                >
                  Show More
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div style={{ width: "80%", marginBottom: "40px" }}>
        <h2
          style={{
            color: "#b03b5c",
            marginBottom: "20px",
            borderBottom: "2px solid #b03b5c",
            paddingBottom: "5px",
          }}
        >
          Bestsellers
        </h2>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            padding: "10px 0",
          }}
        >
          {bestsellers.map((book, index) => (
            <div
              key={`bestseller-${index}`}
              style={{ minWidth: "180px", textAlign: "center" }}
            >
              <img
                src={book.image}
                alt={book.name}
                style={{
                  width: "150px",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              />
              <h4 style={{ margin: "10px 0 5px", color: "#c2185b" }}>
                {book.name}
              </h4>
              <p style={{ margin: "0", color: "#b03b5c", fontSize: "14px" }}>
                by {book.author}
              </p>
              <button
                onClick={handleBuyNow}
                style={{
                  padding: "8px 15px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  backgroundColor: "#b03b5c",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: "80%" }}>
        <h2
          style={{
            color: "#b03b5c",
            marginBottom: "20px",
            borderBottom: "2px solid #b03b5c",
            paddingBottom: "5px",
          }}
        >
          New Arrivals
        </h2>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            padding: "10px 0",
          }}
        >
          {newArrivals.map((book, index) => (
            <div
              key={`new-${index}`}
              style={{ minWidth: "180px", textAlign: "center" }}
            >
              <img
                src={book.image}
                alt={book.name}
                style={{
                  width: "150px",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              />
              <h4 style={{ margin: "10px 0 5px", color: "#c2185b" }}>
                {book.name}
              </h4>
              <p style={{ margin: "0", color: "#b03b5c", fontSize: "14px" }}>
                by {book.author}
              </p>
              <button
                onClick={handleBuyNow}
                style={{
                  padding: "8px 15px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  backgroundColor: "#b03b5c",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
