import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      style={{ ...arrowStyle, right: "10px" }}
      onClick={onClick}
    >
      ➡️
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      style={{ ...arrowStyle, left: "10px" }}
      onClick={onClick}
    >
      ⬅️
    </div>
  );
}

// Common Arrow Style
const arrowStyle = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  zIndex: 2,
  fontSize: "2rem",
  color: "black",
  cursor: "pointer",
};

const ImageSlider = () => {
  const navigate = useNavigate();

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
    }
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
    navigate('/home');
  };

  return (
    <div style={{ width: "80%", margin: "auto", position: "relative", paddingTop: "10px" }}>
      <Slider {...settings}>
        {books.map((book, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", padding: "20px", gap: "30px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
            <img
              src={book.image}
              alt={book.name}
              style={{ width: "250px", height: "420px", objectFit: "cover", borderRadius: "10px" }}
            />
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
              <h2 style={{ margin: "0 0 10px" }}>{book.name}</h2>
              <h4 style={{ margin: "0 0 20px", color: "#666" }}>by {book.author}</h4>
              <button
                onClick={handleShowMore}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  width: "fit-content"
                }}
              >
                Show More
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;