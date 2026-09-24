import { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders"
        );

        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  function formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (loading) {
    return (
      <div className="order-history">
        <h2>🧾 Order History</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-history">

      <div className="order-history-header">
        <h2>🧾 Order History</h2>

        <span>
          {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders yet</h3>
          <p>
            Your confirmed orders will appear here.
          </p>
        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order, index) => (

            <div
              className="order-card"
              key={order._id}
            >

              <div className="order-card-header">

                <div>
                  <h3>
                    Order #{orders.length - index}
                  </h3>

                  <p>
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span className="order-status">
                  {order.status}
                </span>

              </div>


              <div className="order-items">

                {order.items.map((item) => (

                  <div
                    className="order-item"
                    key={item.foodId}
                  >

                    <span>
                      {item.name}
                    </span>

                    <span>
                      × {item.quantity}
                    </span>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                  </div>

                ))}

              </div>


              <div className="order-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{order.totalAmount}
                </strong>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default OrderHistory;