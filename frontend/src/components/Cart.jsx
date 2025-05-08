import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10) || 1;
      return !isNaN(price) && !isNaN(quantity) ? acc + price * quantity : acc;
    }, 0);
  };

  const removeFromCart = (bookId) => {
    const updatedCart = cartItems.filter((item) => item._id !== bookId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, phoneNumber, address } = userDetails;
    if (name && phoneNumber && address) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!isFormValid) {
      alert("Please fill in all details before proceeding.");
      return;
    }

    setIsProcessing(true);
    const total = getTotal();
    setFinalAmount(total);

    setTimeout(() => {
      setOrderPlaced(true);
      setIsProcessing(false);
      navigate("/payment", {
        state: {
          cartItems,
          totalAmount: total,
          userEmail: user?.email,
          username: user?.username,
          userDetails,
        },
      });
    }, 2000);
  };

  const cartStyles = {
    container: {
      padding: "1rem",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#333",
      borderBottom: "1px solid #eee",
      paddingBottom: "0.5rem",
    },
    cartItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #ddd",
      padding: "0.5rem",
      marginBottom: "0.5rem",
      borderRadius: "0.25rem",
      backgroundColor: "#ffffffaa",
    },
    button: {
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "0.25rem",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
    },
    removeButton: {
      color: "#ef4444",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "0.875rem",
    },
    total: {
      marginTop: "1rem",
      fontWeight: "bold",
      fontSize: "1.125rem",
      padding: "0.5rem",
      backgroundColor: "#ffffffcc",
      borderRadius: "0.25rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginTop: "1rem",
      backgroundColor: "#ffffffcc",
      padding: "1rem",
      borderRadius: "0.25rem",
    },
    formInput: {
      padding: "0.75rem",
      fontSize: "1rem",
      borderRadius: "0.25rem",
      border: "1px solid #ddd",
    },
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #ffdde1, #ee9ca7)",
        minHeight: "100vh",
        paddingTop: "2rem",
      }}
    >
      <div style={cartStyles.container}>
        <h1 style={cartStyles.title}>Your Cart</h1>

        {orderPlaced ? (
          <div
            style={{
              textAlign: "center",
              background: "#ffffffcc",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Order Placed!
            </h2>
            <p>Total Amount: ₹{finalAmount}</p>
            <p>Your order has been placed and will arrive within 7 days.</p>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => navigate("/orders")}
                style={{
                  backgroundColor: "#16a34a",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View My Orders
              </button>
              <p>
                Or{" "}
                <span
                  onClick={() => navigate("/home")}
                  style={{
                    color: "#3b82f6",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  continue shopping
                </span>
                .
              </p>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <p
            style={{
              color: "#666",
              backgroundColor: "#ffffffaa",
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            Your cart is empty. Add some books to your cart before proceeding.
          </p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item._id} style={cartStyles.cartItem}>
                <div>
                  <h2 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                    {item.name}
                  </h2>
                  <p style={{ color: "#555", fontSize: "0.875rem" }}>
                    Author: {item.author}
                  </p>
                  <p style={{ color: "#555", fontSize: "0.875rem" }}>
                    Price: ₹{item.price}
                  </p>
                  <p style={{ color: "#555", fontSize: "0.875rem" }}>
                    Quantity: {item.quantity || 1}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={cartStyles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
            <div style={cartStyles.total}>Total: ₹{getTotal()}</div>

            <div style={cartStyles.form}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={userDetails.name}
                onChange={handleInputChange}
                onBlur={validateForm}
                style={cartStyles.formInput}
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={userDetails.phoneNumber}
                onChange={handleInputChange}
                onBlur={validateForm}
                style={cartStyles.formInput}
              />
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={userDetails.address}
                onChange={handleInputChange}
                onBlur={validateForm}
                rows="4"
                style={cartStyles.formInput}
              />
            </div>
            <button
              onClick={handleCheckout}
              style={cartStyles.button}
              disabled={isProcessing || !isFormValid}
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
