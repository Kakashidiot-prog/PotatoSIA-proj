// DOM Elements
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-amount");
const checkoutBtn = document.querySelector(".checkout-btn");
const emptyCartMessage = document.querySelector(".empty-cart");
const categoryLinks = document.querySelectorAll(".shop-categories ul li a");
const navigationToggle = document.querySelector(".toggle");
const navigationBar = document.querySelector(".navigation-bar");
const arrowUp = document.querySelector(".arrow-up");

// Cart State
let cart = [];
let total = 0;

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Load cart from local storage if available
  loadCart();

  // Set up event listeners
  setupEventListeners();

  // Set active category based on hash
  setActiveCategoryFromHash();
});

// Add event listeners
function setupEventListeners() {
  // Add to cart buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });

  // Category navigation
  categoryLinks.forEach((link) => {
    link.addEventListener("click", handleCategoryClick);
  });

  // Checkout button
  checkoutBtn.addEventListener("click", handleCheckout);

  // Mobile menu toggle
  navigationToggle.addEventListener("click", toggleMobileMenu);

  // Scroll to top button
  arrowUp.addEventListener("click", scrollToTop);

  // Listen for hash changes
  window.addEventListener("hashchange", setActiveCategoryFromHash);
}

// Handle adding items to cart
function handleAddToCart(event) {
  const button = event.target;
  const productCard = button.closest(".product-card");
  const productName = productCard.querySelector("h4").textContent;
  const productPrice = productCard.querySelector(".product-price").textContent;
  const productImage = productCard.querySelector(".product-image img").src;

  // Convert price string to number (remove ¥ and convert to number)
  const price = parseInt(productPrice.replace("¥", "").replace(",", ""));

  // Check if product is already in cart
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    // Increase quantity
    existingItem.quantity += 1;
  } else {
    // Add new item
    cart.push({
      name: productName,
      price: price,
      image: productImage,
      quantity: 1,
    });
  }

  // Update cart display
  updateCart();

  // Animation feedback
  animateAddToCart(button);

  // Save cart to local storage
  saveCart();
}

// Update cart display
function updateCart() {
  // Clear current cart display
  cartItems.innerHTML = "";

  // Hide empty cart message if cart has items
  if (cart.length > 0) {
    emptyCartMessage.style.display = "none";
  } else {
    emptyCartMessage.style.display = "block";
  }

  // Reset total
  total = 0;

  // Add each item to cart display
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemElement = document.createElement("div");
    cartItemElement.className = "cart-item";
    cartItemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-price">¥${item.price.toLocaleString()}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn increase">+</button>
        </div>
      </div>
      <button class="remove-item" data-index="${index}">×</button>
    `;

    cartItems.appendChild(cartItemElement);

    // Add event listeners to quantity buttons
    const decreaseBtn = cartItemElement.querySelector(".decrease");
    const increaseBtn = cartItemElement.querySelector(".increase");
    const removeBtn = cartItemElement.querySelector(".remove-item");

    decreaseBtn.addEventListener("click", () => updateItemQuantity(index, -1));
    increaseBtn.addEventListener("click", () => updateItemQuantity(index, 1));
    removeBtn.addEventListener("click", () => removeItem(index));
  });

  // Update total display
  cartTotal.textContent = `¥${total.toLocaleString()}`;

  // Enable/disable checkout button
  checkoutBtn.disabled = cart.length === 0;
}

// Update item quantity
function updateItemQuantity(index, change) {
  cart[index].quantity += change;

  // Remove item if quantity is 0
  if (cart[index].quantity <= 0) {
    removeItem(index);
    return;
  }

  // Update cart display
  updateCart();

  // Save cart to local storage
  saveCart();
}

// Remove item from cart
function removeItem(index) {
  cart.splice(index, 1);

  // Update cart display
  updateCart();

  // Save cart to local storage
  saveCart();
}

// Handle checkout process
function handleCheckout() {
  if (cart.length === 0) return;

  alert(
    `Thank you for your purchase! Your total is ¥${total.toLocaleString()}`
  );

  // Clear cart
  cart = [];
  updateCart();
  saveCart();
}

// Save cart to local storage
function saveCart() {
  localStorage.setItem("rosaCart", JSON.stringify(cart));
}

// Load cart from local storage
function loadCart() {
  const savedCart = localStorage.getItem("rosaCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// Add to cart animation
function animateAddToCart(button) {
  button.classList.add("added");
  button.textContent = "Added!";

  setTimeout(() => {
    button.classList.remove("added");
    button.textContent = "Add to Cart";
  }, 1500);
}

// Handle category navigation
function handleCategoryClick(event) {
  const categoryLinks = document.querySelectorAll(".shop-categories ul li");

  // Remove active class from all links
  categoryLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to clicked link's parent
  event.target.parentElement.classList.add("active");
}

// Set active category based on URL hash
function setActiveCategoryFromHash() {
  const hash = window.location.hash || "#signature-sauces";
  const activeLink = document.querySelector(
    `.shop-categories a[href="${hash}"]`
  );

  if (activeLink) {
    // Remove active class from all links
    document.querySelectorAll(".shop-categories ul li").forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to current category
    activeLink.parentElement.classList.add("active");

    // Scroll to section with offset for header
    const section = document.querySelector(hash);
    if (section) {
      const headerHeight = document.querySelector("header").offsetHeight;
      const sectionPosition =
        section.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: sectionPosition - headerHeight - 20,
        behavior: "smooth",
      });
    }
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  navigationToggle.classList.toggle("active");
  navigationBar.classList.toggle("active");
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Sticky header on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("nav");
  if (window.scrollY > 50) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.getAttribute("href") !== "#") {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("nav").offsetHeight;
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
          top: elementPosition - headerHeight - 20,
          behavior: "smooth",
        });
      }
    }
  });
});
