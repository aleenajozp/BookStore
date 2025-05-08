import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    // Log to check if state is properly received
    console.log("State received in PaymentPage:", state);

    if (!state) {
      console.error("State is missing! Redirecting to cart.");
      navigate("/cart"); // Redirect to Cart if no state
    }
  }, [state, navigate]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const updatedData = (data) => {
    const newArray = [];
    data.forEach((el) => {
      newArray.push({
        bookId: {
          _id: el._id,
          name: el.name,
          author: el.author,
          price: el.price,
          image: el.image,
        },
        quantity: el.quantity,
      });
    });
    return newArray;
  };

  const handlePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const orderData = {
        userId: "60d22a2f4d60f56c7f4e2d76",
        userEmail: user?.email,
        username: user?.username,
        cartItems: updatedData(state?.cartItems || []),
        totalAmount: state?.totalAmount || 0,
        paymentMethod,
        orderTime: new Date().toISOString(),
      };

      console.log("Order data being sent:", orderData);

      if (paymentMethod !== "cod") {
        setIsProcessing(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to place order");
      const order = await response.json();
      console.log("Order placed successfully:", order);

      localStorage.removeItem("cartItems");

      navigate("/order-success", {
        state: {
          orderId: order._id,
          totalAmount: state?.totalAmount || 0,
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed.");
    } finally {
      if (paymentMethod !== "cod") {
        setIsProcessing(false);
      }
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to right, #ffdde1, #ee9ca7)",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#333",
      textAlign: "center",
    },
    orderSummary: {
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    orderItem: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.5rem",
      fontSize: "0.95rem",
    },
    totalAmount: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
      fontSize: "1.1rem",
      paddingTop: "0.5rem",
      borderTop: "1px solid #ddd",
    },
    paymentMethodSection: {
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    paymentMethodOption: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.75rem",
      borderRadius: "6px",
      cursor: "pointer",
    },
    activePaymentMethod: {
      backgroundColor: "#e6f2ff",
      border: "1px solid #3b82f6",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "1rem",
    },
    submitButton: {
      width: "100%",
      padding: "1rem",
      backgroundColor: isProcessing ? "#94a3b8" : "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: isProcessing ? "not-allowed" : "pointer",
      transition: "background-color 0.2s",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Complete Your Purchase</h1>

        <div style={styles.orderSummary}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#444",
            }}
          >
            Order Summary
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            {state?.cartItems?.map((item) => (
              <div key={item._id} style={styles.orderItem}>
                <span>
                  {item.name} (x{item.quantity || 1})
                </span>
                <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={styles.totalAmount}>
            <span>Total Amount:</span>
            <span>₹{state?.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        <div style={styles.paymentMethodSection}>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "#444",
            }}
          >
            Select Payment Method
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <label
              style={{
                ...styles.paymentMethodOption,
                ...(paymentMethod === "credit"
                  ? styles.activePaymentMethod
                  : {}),
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "credit"}
                onChange={() => setPaymentMethod("credit")}
                style={{ transform: "scale(1.2)" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>Credit/Debit Card</div>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>
                  Visa, Mastercard, Rupay
                </div>
              </div>
            </label>

            <label
              style={{
                ...styles.paymentMethodOption,
                ...(paymentMethod === "upi" ? styles.activePaymentMethod : {}),
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
                style={{ transform: "scale(1.2)" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>UPI</div>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>
                  Google Pay, PhonePe, Paytm
                </div>
              </div>
            </label>

            <label
              style={{
                ...styles.paymentMethodOption,
                ...(paymentMethod === "cod" ? styles.activePaymentMethod : {}),
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                style={{ transform: "scale(1.2)" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>Cash on Delivery</div>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>
                  Pay when you receive the order
                </div>
              </div>
            </label>
          </div>

          {paymentMethod === "credit" && (
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    color: "#555",
                  }}
                >
                  Card Number
                </label>
                <input
                  type="text"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  style={styles.input}
                />
              </div>

              <div
                style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    color: "#555",
                  }}
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  placeholder="John Doe"
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    color: "#555",
                  }}
                >
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  style={styles.input}
                />
              </div>
            </div>
          )}
        </div>

        <button
          style={styles.submitButton}
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
