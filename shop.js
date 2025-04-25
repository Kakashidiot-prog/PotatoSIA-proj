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
const logoImage = document.querySelector("header nav.logo img");
const headerSection = document.querySelector("header");

// Cart State
let cart = [];
let total = 0;

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  setupEventListeners();
  setActiveCategoryFromHash();
});

// Add event listeners
function setupEventListeners() {
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });

  categoryLinks.forEach((link) => {
    link.addEventListener("click", handleCategoryClick);
  });

  checkoutBtn.addEventListener("click", handleCheckout);
  navigationToggle.addEventListener("click", toggleMobileMenu);
  arrowUp.addEventListener("click", scrollToTop);
  window.addEventListener("hashchange", setActiveCategoryFromHash);
}

// FLY-TO-CART ANIMATION FUNCTIONS
function createFlyingImage(imageSrc, startX, startY, endX, endY) {
  const flyingImg = document.createElement("img");
  flyingImg.src = imageSrc;
  flyingImg.classList.add("flying-image");
  flyingImg.style.left = `${startX}px`;
  flyingImg.style.top = `${startY}px`;
  flyingImg.style.setProperty("--target-x", `${endX - startX}px`);
  flyingImg.style.setProperty("--target-y", `${endY - startY}px`);
  document.body.appendChild(flyingImg);
  setTimeout(() => flyingImg.remove(), 800);
}

// MODIFIED HANDLE ADD TO CART
function handleAddToCart(event) {
  const button = event.target;
  const productCard = button.closest(".product-card");
  const productName = productCard.querySelector("h4").textContent;
  const productPrice = productCard.querySelector(".product-price").textContent;
  const productImage = productCard.querySelector(".product-image img").src;
  const productImageElement = productCard.querySelector(".product-image img");

  const price = parseInt(productPrice.replace("¥", "").replace(",", ""));
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: price,
      image: productImage,
      quantity: 1,
    });
  }

  // Animation positions
  const imageRect = productImageElement.getBoundingClientRect();
  const startX = imageRect.left + imageRect.width / 2 - 30;
  const startY = imageRect.top + imageRect.height / 2 - 30;

  const cartIcon = document.querySelector(".cart-icon");
  const cartIconRect = cartIcon.getBoundingClientRect();
  const endX = cartIconRect.left + cartIconRect.width / 2 - 3;
  const endY = cartIconRect.top + cartIconRect.height / 2 - 3;

  createFlyingImage(productImage, startX, startY, endX, endY);
  updateCart();
  animateAddToCart(button);
  saveCart();
}

// UPDATED ANIMATE ADD TO CART
function animateAddToCart(button) {
  button.classList.add("added");
  button.textContent = "Added!";
  setTimeout(() => {
    button.classList.remove("added");
    button.textContent = "Add to Cart";
  }, 1500);
}

function updateCart() {
  cartItems.innerHTML = "";
  emptyCartMessage.style.display = cart.length > 0 ? "none" : "block";
  total = 0;

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

    // Add event listeners
    cartItemElement
      .querySelector(".decrease")
      .addEventListener("click", () => updateItemQuantity(index, -1));
    cartItemElement
      .querySelector(".increase")
      .addEventListener("click", () => updateItemQuantity(index, 1));
    cartItemElement
      .querySelector(".remove-item")
      .addEventListener("click", () => removeItem(index));
  });

  cartTotal.textContent = `¥${total.toLocaleString()}`;

  // Update cart counter
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }

  checkoutBtn.disabled = cart.length === 0;
}

// REST OF YOUR EXISTING FUNCTIONS (keep these the same)
function updateItemQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    removeItem(index);
    return;
  }
  updateCart();
  saveCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
  saveCart();
}

function handleCheckout() {
  if (cart.length === 0) return;
  alert(
    `Thank you for your purchase! Your total is ¥${total.toLocaleString()}`
  );
  cart = [];
  updateCart();
  saveCart();
}

function saveCart() {
  localStorage.setItem("rosaCart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("rosaCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

function handleCategoryClick(event) {
  document.querySelectorAll(".shop-categories ul li").forEach((link) => {
    link.classList.remove("active");
  });
  event.target.parentElement.classList.add("active");
}

function setActiveCategoryFromHash() {
  const hash = window.location.hash || "#signature-sauces";
  const activeLink = document.querySelector(
    `.shop-categories a[href="${hash}"]`
  );

  if (activeLink) {
    document.querySelectorAll(".shop-categories ul li").forEach((link) => {
      link.classList.remove("active");
    });
    activeLink.parentElement.classList.add("active");

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

function toggleMobileMenu() {
  navigationToggle.classList.toggle("active");
  navigationBar.classList.toggle("active");
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Scroll behavior for nav
window.addEventListener("scroll", () => {
  if (window.pageYOffset > headerSection.offsetHeight - 75) {
    document.querySelector("nav").classList.add("active");
    logoImage.src =
      "https://res.cloudinary.com/abdel-rahman-ali/image/upload/v1535988525/logo-rosa.png";
  } else {
    document.querySelector("nav").classList.remove("active");
    logoImage.src =
      "https://res.cloudinary.com/abdel-rahman-ali/image/upload/v1535988515/logo-rosa-white.png";
  }
});

// Smooth scroll for anchor links
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
