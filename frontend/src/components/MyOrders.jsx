import { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params =
          user?.email && user?.role !== "admin"
            ? { userEmail: user.email }
            : {};
        const res = await axios.get(
          `http://localhost:3000/orders/${user?.email}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user?.email, user?.role]);

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
    orderCard: {
      border: "1px solid #ddd",
      padding: "1rem",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      backgroundColor: "#f9f9f9",
    },
    orderDate: {
      fontWeight: "600",
      marginBottom: "0.75rem",
      color: "#444",
    },
    bookItem: {
      border: "1px solid #ccc",
      padding: "0.5rem",
      borderRadius: "0.25rem",
      marginBottom: "0.5rem",
      backgroundColor: "#fff",
    },
    error: {
      color: "red",
      textAlign: "center",
      marginTop: "1rem",
    },
    empty: {
      color: "#555",
      textAlign: "center",
      marginTop: "1rem",
    },
    loading: {
      color: "#333",
      textAlign: "center",
      marginTop: "2rem",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : orders.length === 0 ? (
          <p style={styles.empty}>You haven't placed any orders yet.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} style={styles.orderCard}>
              <p style={styles.orderDate}>
                Order Date: {new Date(order.orderTime).toLocaleString()}
              </p>
              {order.books.map((item, idx) => (
                <div key={idx} style={styles.bookItem}>
                  <strong>{item.name}</strong>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
