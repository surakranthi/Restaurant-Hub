import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import OrderHistory from "./OrderHistory";

function App() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // ================= FETCH FOOD =================

  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/foods"
        );

        setFoods(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch food:",
          error
        );
      }
    }

    fetchFoods();
  }, []);

  // ================= CATEGORIES =================

  const categories = [
    "All",
    ...new Set(
      foods.map((food) => food.category)
    ),
  ];

  // ================= ADD TO CART =================

  function handleAddToCart(food) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item._id === food._id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item._id === food._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  }

  // ================= INCREASE =================

  function handleIncrease(foodId) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item._id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  // ================= DECREASE =================

  function handleDecrease(foodId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  }

  // ================= REMOVE =================

  function handleRemove(foodId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item._id !== foodId
      )
    );
  }

  // ================= TOTAL ITEMS =================

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // ================= TOTAL PRICE =================

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  // ================= CONFIRM ORDER =================

  async function handleConfirmOrder() {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),

        totalAmount: totalPrice,
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData
      );

      alert(response.data.message);

      setCart([]);

      setShowCart(false);
    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      alert(
        "Failed to place order. Please try again."
      );
    }
  }

  // ================= FILTER FOOD =================

  const filteredFoods = foods.filter(
    (food) => {
      const matchesCategory =
        selectedCategory === "All" ||
        food.category ===
          selectedCategory;

      const matchesSearch =
        food.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );

  return (
    <BrowserRouter>

      <div className="app">

        {/* ================= HEADER ================= */}

        <header className="header">

          <Link
            to="/"
            className="logo"
          >
            🍴 <span>Restaurant Hub</span>
          </Link>

          <nav className="nav-links">

            <Link to="/">
              🏠 Home
            </Link>

            <Link to="/orders">
              🧾 Orders
            </Link>

            <button
              className="cart-button"
              onClick={() =>
                setShowCart(true)
              }
            >
              🛒 Cart ({totalItems})
            </button>

          </nav>

        </header>


        {/* ================= PAGES ================= */}

        <Routes>

          {/* ================= HOME ================= */}

          <Route
            path="/"
            element={
              <>
                {/* HERO */}

                <section className="hero">

                  <div>

                    <h1>
                      Delicious food,
                      delivered to you 🍔
                    </h1>

                    <p>
                      Discover your favourite
                      food and order it from
                      Restaurant Hub.
                    </p>

                  </div>

                  <input
                    type="text"
                    placeholder="Search for food..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                </section>


                {/* CATEGORIES */}

                <section className="categories-section">

                  <h2>
                    Explore Categories
                  </h2>

                  <div className="categories">

                    {categories.map(
                      (category) => (

                        <button
                          key={category}
                          className={
                            selectedCategory ===
                            category
                              ? "category active"
                              : "category"
                          }
                          onClick={() =>
                            setSelectedCategory(
                              category
                            )
                          }
                        >
                          {category}
                        </button>

                      )
                    )}

                  </div>

                </section>


                {/* FOOD */}

                <section className="food-section">

                  <div className="section-header">

                    <h2>
                      Popular Food
                    </h2>

                    <span>
                      {
                        filteredFoods.length
                      }{" "}
                      items
                    </span>

                  </div>


                  <div className="food-grid">

                    {filteredFoods.map(
                      (food) => (

                        <div
                          className="food-card"
                          key={food._id}
                        >

                          <img
                            src={food.image}
                            alt={food.name}
                          />

                          <div className="food-info">

                            <div className="food-title">

                              <h3>
                                {food.name}
                              </h3>

                              <span className="rating">
                                ⭐{" "}
                                {food.rating}
                              </span>

                            </div>

                            <p className="food-category">
                              {food.category}
                            </p>

                            <div className="food-bottom">

                              <span className="price">
                                ₹{food.price}
                              </span>

                              <button
                                className="add-button"
                                onClick={() =>
                                  handleAddToCart(
                                    food
                                  )
                                }
                              >
                                + Add
                              </button>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>


                  {filteredFoods.length ===
                    0 && (

                    <div className="no-food">

                      <h3>
                        No food found 😕
                      </h3>

                      <p>
                        Try searching for
                        something else.
                      </p>

                    </div>

                  )}

                </section>
              </>
            }
          />


          {/* ================= ORDER HISTORY ================= */}

          <Route
            path="/orders"
            element={
              <OrderHistory />
            }
          />

        </Routes>


        {/* ================= CART ================= */}

        {showCart && (

          <div
            className="cart-overlay"
            onClick={() =>
              setShowCart(false)
            }
          >

            <div
              className="cart-panel"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="cart-header">

                <h2>
                  🛒 Your Cart
                </h2>

                <button
                  className="close-cart"
                  onClick={() =>
                    setShowCart(false)
                  }
                >
                  ✕
                </button>

              </div>


              {/* EMPTY CART */}

              {cart.length === 0 ? (

                <div className="empty-cart">

                  <div>🛒</div>

                  <h3>
                    Your cart is empty
                  </h3>

                  <p>
                    Add some delicious food
                    to continue.
                  </p>

                </div>

              ) : (

                <>

                  {/* CART ITEMS */}

                  <div className="cart-items">

                    {cart.map((item) => (

                      <div
                        className="cart-item"
                        key={item._id}
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                        />


                        <div className="cart-item-info">

                          <h3>
                            {item.name}
                          </h3>

                          <p>
                            ₹{item.price} each
                          </p>


                          <div className="quantity-controls">

                            <button
                              onClick={() =>
                                handleDecrease(
                                  item._id
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleIncrease(
                                  item._id
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>


                        <div className="cart-item-right">

                          <strong>
                            ₹
                            {item.price *
                              item.quantity}
                          </strong>

                          <button
                            className="remove-button"
                            onClick={() =>
                              handleRemove(
                                item._id
                              )
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>


                  {/* CART SUMMARY */}

                  <div className="cart-summary">

                    <div>

                      <span>
                        Total Items
                      </span>

                      <strong>
                        {totalItems}
                      </strong>

                    </div>


                    <div className="cart-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹{totalPrice}
                      </strong>

                    </div>


                    <button
                      className="checkout-button"
                      onClick={
                        handleConfirmOrder
                      }
                    >
                      Confirm Order
                    </button>

                  </div>

                </>

              )}

            </div>

          </div>

        )}

      </div>

    </BrowserRouter>
  );
}

export default App;