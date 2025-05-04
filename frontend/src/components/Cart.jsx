const Cart = ({ cartItems }) => {
    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  
    return (
      <div style={{ padding: '20px' }}>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cartItems.map((book, i) => (
                <li key={i} style={{ marginBottom: '10px' }}>
                  {book.name} - ₹{book.price}
                </li>
              ))}
            </ul>
            <h3>Total: ₹{total}</h3>
            <button>Proceed to Checkout</button>
          </>
        )}
      </div>
    );
  };
  
  export default Cart;
  