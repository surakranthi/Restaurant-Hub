const mongoose = require("mongoose");
require("dotenv").config();

const Food = require("./models/Food");

const foods = [
  {
    name: "Chicken Biryani",
    description: "Hyderabadi style chicken biryani",
    price: 249,
    category: "Biryani",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
  },
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella and basil",
    price: 199,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
  },
  {
    name: "Cheese Burger",
    description: "Juicy burger with cheese and fresh vegetables",
    price: 149,
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
  },
  {
    name: "Chicken Noodles",
    description: "Stir-fried noodles with chicken and vegetables",
    price: 179,
    category: "Chinese",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    rating: 4.3,
  },
  {
    name: "Chicken Roll",
    description: "Spicy chicken roll with fresh vegetables",
    price: 129,
    category: "Rolls",
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
    rating: 4.2,
  },
  {
    name: "Chocolate Cake",
    description: "Rich and delicious chocolate cake",
    price: 159,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
  },
  {
    name: "Cold Coffee",
    description: "Creamy chilled cold coffee",
    price: 99,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    rating: 4.3,
  },
  {
    name: "Veg Pizza",
    description: "Fresh vegetable pizza with mozzarella cheese",
    price: 179,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    rating: 4.1,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Food.deleteMany();

    await Food.insertMany(foods);

    console.log("Food data inserted successfully");

    await mongoose.connection.close();

    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);

    process.exit(1);
  }
}

seedDatabase();