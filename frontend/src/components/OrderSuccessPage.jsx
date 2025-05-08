import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#dcfce7",
          color: "#166534",
          padding: "1rem",
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          margin: "0 auto 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#166534",
        }}
      >
        Order Placed Successfully!
      </h1>

      <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
        Thank you for your purchase. Your order has been confirmed.
      </p>

      <div
        style={{
          backgroundColor: "#f0fdf4",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ color: "#555" }}>Order ID:</span>
          <span style={{ fontWeight: "500" }}>#{state.orderId}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ color: "#555" }}>Total Amount:</span>
          <span style={{ fontWeight: "500" }}>
            ₹{state.totalAmount.toFixed(2)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#555" }}>Estimated Delivery:</span>
          <span style={{ fontWeight: "500" }}>
            {new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          onClick={() => navigate("/orders")}
          style={{
            padding: "0.75rem",
            backgroundColor: "#166534",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          View Order Details
        </button>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "0.75rem",
            backgroundColor: "white",
            color: "#166534",
            border: "1px solid #166534",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
