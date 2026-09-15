const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const adminUser = {
  name: 'Admin User',
  email: 'admin@shoppersstop.com',
  password: 'admin123',
  role: 'admin'
};

// Original image arrays
const IMG_SAREE = ["/images/saree.jpg"];
const IMG_SUIT = ["/images/suit.jpg"];
const IMG_KURTI = ["/images/kurti.jpg"];
const IMG_LEHENGA = ["/images/lehenga.jpg"];

const IMG_JEANS = [
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800"
];

const IMG_TOPS = [
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800"
];

function getImg(arr, index) {
  return arr[index % arr.length];
}

const products = [
  // --- SAREES (10 items) ---
  ...Array.from({ length: 10 }).map((_, i) => ({
    name: ["Banarasi Silk Saree", "Kanjivaram Silk Saree", "Floral Georgette Saree", "Cotton Handloom Saree", "Chiffon Party Saree", "Mysore Silk Saree", "Net Embroidered Saree", "Linen Printed Saree", "Tussar Silk Saree", "Organza Saree"][i],
    description: "Authentic and elegant Indian saree perfect for all occasions.",
    price: 1599 + (i * 300), originalPrice: 2599 + (i * 400),
    category: "Saree", subCategory: "Traditional",
    fabric: ["Silk", "Georgette", "Cotton", "Chiffon", "Net", "Organza"][i % 6],
    occasion: ["Wedding", "Party", "Daily Wear", "Festive", "Casual"][i % 5],
    stock: 20 + i,
    images: [{ url: getImg(IMG_SAREE, i), alt: "Indian Saree" }],
    sizes: ["Free Size"],
    colors: [{ name: "Red", hex: "#FF0000" }, { name: "Gold", hex: "#FFD700" }],
    isFeatured: i % 3 === 0, isTrending: i % 4 === 0, rating: 4.5 + (i % 5) * 0.1, numReviews: 20 + i,
    tags: ["saree", "indian", "traditional"]
  })),

  // --- SUITS (10 items) ---
  ...Array.from({ length: 10 }).map((_, i) => ({
    name: ["Cotton Anarkali Suit", "Georgette Sharara Suit", "Punjabi Patiala Suit", "Silk Straight Cut Suit", "Chanderi Salwar Suit", "Velvet Winter Suit", "Chiffon Palazzo Suit", "Cotton Daily Wear Suit", "Net Gown Suit", "Muslin Printed Suit"][i],
    description: "Beautiful Indian suit set with matching dupatta.",
    price: 1299 + (i * 200), originalPrice: 2299 + (i * 300),
    category: "Suit", subCategory: "Ethnic",
    fabric: ["Cotton", "Georgette", "Silk", "Velvet", "Chiffon"][i % 5],
    occasion: ["Festive", "Wedding", "Casual", "Formal", "Party"][i % 5],
    stock: 25 + i,
    images: [{ url: getImg(IMG_SUIT, i), alt: "Indian Suit" }],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Green", hex: "#008000" }, { name: "Yellow", hex: "#FFFF00" }],
    isFeatured: i % 4 === 0, isTrending: i % 3 === 0, rating: 4.4 + (i % 4) * 0.1, numReviews: 15 + i,
    tags: ["suit", "indian", "ethnic"]
  })),

  // --- KURTIS (10 items) ---
  ...Array.from({ length: 10 }).map((_, i) => ({
    name: ["Embroidered Rayon Kurti", "Cotton A-Line Kurti", "Silk Anarkali Kurti", "Chikankari Georgette Kurti", "Short Denim Kurti", "Crepe Printed Kurti", "Khadi Cotton Kurti", "Chanderi Silk Kurti", "Rayon Flared Kurti", "Velvet Embellished Kurti"][i],
    description: "Comfortable and stylish Indian Kurti for everyday fashion.",
    price: 599 + (i * 100), originalPrice: 999 + (i * 150),
    category: "Kurti", subCategory: "Straight",
    fabric: ["Rayon", "Cotton", "Silk", "Georgette", "Crepe"][i % 5],
    occasion: ["Casual", "Daily Wear", "Festive", "Party"][i % 4],
    stock: 50 + i,
    images: [{ url: getImg(IMG_KURTI, i), alt: "Indian Kurti" }],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Blue", hex: "#0000FF" }],
    isFeatured: i % 5 === 0, isTrending: i % 2 === 0, rating: 4.3 + (i % 3) * 0.1, numReviews: 50 + i,
    tags: ["kurti", "indian", "casual"]
  })),

  // --- LEHENGAS (10 items) ---
  ...Array.from({ length: 10 }).map((_, i) => ({
    name: ["Bridal Red Velvet Lehenga", "Floral Organza Lehenga", "Mirror Work Georgette Lehenga", "Banarasi Silk Lehenga", "Net Sequined Lehenga", "Printed Crepe Lehenga", "Satin Silk Lehenga", "Cotton Garba Lehenga", "Brocade Silk Lehenga", "Pastel Net Lehenga"][i],
    description: "Stunning Indian Lehenga Choli perfect for weddings and big festivals.",
    price: 4999 + (i * 500), originalPrice: 7999 + (i * 700),
    category: "Lehenga", subCategory: "Bridal",
    fabric: ["Velvet", "Organza", "Georgette", "Silk", "Net"][i % 5],
    occasion: ["Wedding", "Party", "Festive", "Wedding"][i % 4],
    stock: 10 + i,
    images: [{ url: getImg(IMG_LEHENGA, i), alt: "Indian Lehenga" }],
    sizes: ["Free Size"],
    colors: [{ name: "Maroon", hex: "#800000" }],
    isFeatured: i % 2 === 0, isTrending: i % 3 === 0, rating: 4.7 + (i % 3) * 0.1, numReviews: 30 + i,
    tags: ["lehenga", "indian", "wedding"]
  })),

  // --- JEANS (10 items) ---
  ...Array.from({ length: 10 }).map((_, i) => ({
    name: ["High-Waist Skinny Jeans", "Wide Leg Denim Jeans", "Distressed Boyfriend Jeans", "Black Bootcut Jeans", "Mom Jeans", "Straight Fit Denim", "Flared Hem Jeans", "White Skinny Jeans", "Cropped Denim Jeans", "High-Rise Cargo Jeans"][i],
    description: "Premium quality stylish jeans.",
    price: 999 + (i * 100), originalPrice: 1999 + (i * 150),
    category: "Jeans", subCategory: "Denim",
    fabric: "Denim", occasion: "Casual", stock: 80 + i,
    images: [{ url: getImg(IMG_JEANS, i), alt: "Jeans" }],
    sizes: ["28", "30", "32", "34"],
    colors: [{ name: "Dark Blue", hex: "#00008B" }],
    isFeatured: false, isTrending: i % 2 === 0, rating: 4.5, numReviews: 100 + i,
    tags: ["jeans", "denim"]
  })),

  // --- TOPS (5 items) ---
  ...Array.from({ length: 5 }).map((_, i) => ({
    name: ["Floral Peplum Top", "Solid Ribbed Crop Top", "Chiffon Blouse", "Oversized Graphic T-Shirt", "Lace Trim Cami Top"][i],
    description: "Trendy tops for modern fashion.",
    price: 399 + (i * 100), originalPrice: 799 + (i * 150),
    category: "Tops", subCategory: "Casual",
    fabric: ["Georgette", "Cotton", "Chiffon", "Satin"][i % 4],
    occasion: ["Casual", "Party", "Formal"][i % 3],
    stock: 60 + i,
    images: [{ url: getImg(IMG_TOPS, i), alt: "Top" }],
    sizes: ["S", "M", "L"],
    colors: [{ name: "White", hex: "#FFFFFF" }],
    isFeatured: false, isTrending: true, rating: 4.6, numReviews: 80 + i,
    tags: ["top", "casual"]
  }))
];

const seedData = async () => {
  await Product.deleteMany({});
  await User.deleteMany({ email: adminUser.email });

  console.log('🗑️  Cleared old data');

  await User.create(adminUser);
  console.log(`👤 Admin user created (${adminUser.email} / ${adminUser.password})`);

  for (const p of products) {
    if (p.originalPrice > 0 && p.price < p.originalPrice) {
      p.discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    }
    await Product.create(p);
  }
  console.log(`🛍️  Seeded ${products.length} products with original image configuration!`);
  console.log('✅ Database seeded successfully!');
};

module.exports = seedData;
