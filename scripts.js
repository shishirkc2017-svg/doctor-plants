// ==== NAVIGATION ==== //
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetID = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetID);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    }
    navMenu.classList.remove('open');
  });
});

// ==== ECOMMERCE PRODUCTS ==== //
const products = [
  {
    id: 1,
    title: "Medicinal & Aromatic Herbs",
    description: "Herbs, teas, essential oils, and skincare balms.",
    retailPrice: 350,
    wholesalePrice: 250,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Bio Fertilizers & Vermicompost",
    description: "Organic nutrient products to enrich and improve soil health.",
    retailPrice: 800,
    wholesalePrice: 600,
    image: "https://images.unsplash.com/photo-1549887534-21b1f297fca1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Seasonal Fresh Organic Produce",
    description: "Fresh vegetables, fruits, flowers, seedlings and seeds sourced nationwide.",
    retailPrice: 200,
    wholesalePrice: 150,
    image: "https://images.unsplash.com/photo-1462632454104-0d86d054ef02?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Farm Services",
    description: "Farm planning, monthly subscriptions, trainings, and research support.",
    retailPrice: 0,
    wholesalePrice: 0,
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=400&q=80",
    isService: true,
  },
  {
    id: 1001, // Environment product
    title: "Recycled Flower Pot",
    description: "Eco-friendly flower pot made from recycled plastics.",
    retailPrice: 120,
    wholesalePrice: 80,
    image: "https://images.unsplash.com/photo-1518831953459-8c16e38cfb59?auto=format&fit=crop&w=400&q=80",
  }
];
const productsGrid = document.getElementById('products-grid');
const priceRadios = document.querySelectorAll('input[name="priceType"]');
let currentPriceType = 'retail';
let cart = JSON.parse(localStorage.getItem('doctorplantsCart')) || [];

// Format NPR
function formatNPR(amount) {
  return "NPR " + amount.toLocaleString('en-NP');
}

// Render Products
function renderProducts() {
  productsGrid.innerHTML = '';
  products.forEach(product => {
    const price = currentPriceType === 'retail' ? product.retailPrice : product.wholesalePrice;
    const isService = product.isService || false;
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      ${isService
        ? `<p><em>Contact for pricing and booking</em></p>`
        : `<p class="price">Price: ${formatNPR(price)}</p>
          <button class="btn primary-btn add-to-cart-btn" data-id="${product.id}" ${price === 0 ? 'disabled' : ''}>${price === 0 ? 'Not for Sale' : 'Add to Cart'}</button>`
      }
    `;
    productsGrid.appendChild(card);
  });
  attachAddToCartListeners();
}

// Attach Cart Listeners
function attachAddToCartListeners() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.onclick = () => {
      const prodId = parseInt(btn.dataset.id);
      addToCart(prodId);
    };
  });
}

// Add to Cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const price = currentPriceType === 'retail' ? product.retailPrice : product.wholesalePrice;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, title: product.title, price: price, qty: 1 });
  }
  updateCart();
  alert(`Added "${product.title}" to cart.`);
}

function updateCart() {
  localStorage.setItem('doctorplantsCart', JSON.stringify(cart));
  document.getElementById('cart-count').textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  renderCartModal();
}

// Cart Modal Logic
const cartBtn = document.querySelector('.cart-link');
const cartModal = document.getElementById('cart-modal');
const closeCartModalBtn = document.getElementById('close-cart-modal');
cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  renderCartModal();
  cartModal.classList.remove('hidden');
});
closeCartModalBtn.addEventListener('click', () => cartModal.classList.add('hidden'));

function renderCartModal() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!cartItemsDiv) return;
  cartItemsDiv.innerHTML = '';
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalSpan.textContent = '0';
    checkoutBtn.disabled = true;
    return;
  }
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.title}</span>
      <div class="qty-controls">
        <button class="qty-decrease" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button class="qty-increase" data-id="${item.id}">+</button>
      </div>
      <span>${formatNPR(item.price * item.qty)}</span>
      <button class="btn-remove-item" data-id="${item.id}" aria-label="Remove item">&times;</button>
    `;
    cartItemsDiv.appendChild(div);
  });
  cartTotalSpan.textContent = total.toLocaleString();
  checkoutBtn.disabled = total === 0;
  attachCartButtonsListeners();
}
function attachCartButtonsListeners() {
  document.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.onclick = () => { changeQty(parseInt(btn.dataset.id), -1); };
  });
  document.querySelectorAll('.qty-increase').forEach(btn => {
    btn.onclick = () => { changeQty(parseInt(btn.dataset.id), 1); };
  });
  document.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.onclick = () => { removeFromCart(parseInt(btn.dataset.id)); };
  });
}
function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId); else updateCart();
}
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}
document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('Checkout is not implemented in this demo. Please contact Doctor Plants for purchase.');
  cartModal.classList.add('hidden');
});
priceRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    currentPriceType = radio.value;
    renderProducts();
  });
});
renderProducts();
updateCart();

// ==== SELLER LOGIN ==== //
const sellerLoginBtn = document.getElementById('seller-login-btn');
const sellerLoginModal = document.getElementById('seller-login-modal');
const closeLoginModalBtn = document.getElementById('close-login-modal');
const sellerLoginForm = document.getElementById('seller-login-form');
const loginErrorMsg = document.getElementById('login-error-msg');
sellerLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  sellerLoginModal.classList.remove('hidden');
  loginErrorMsg.textContent = '';
});
closeLoginModalBtn.addEventListener('click', () => sellerLoginModal.classList.add('hidden'));
sellerLoginForm.addEventListener('submit', e => {
  e.preventDefault();
  loginErrorMsg.textContent = '';
  const username = sellerLoginForm.username.value.trim();
  const password = sellerLoginForm.password.value.trim();
  if (username === 'seller' && password === 'pass123') {
    sellerLoginModal.classList.add('hidden');
    alert('Welcome, seller! (Seller dashboard not implemented in this demo.)');
  } else {
    loginErrorMsg.textContent = 'Invalid username or password.';
  }
});

// ==== DIPLOMATS ==== //
const diplomatData = [
  {
    fullName: "Maya Gurung",
    education: "MSc in Organic Agriculture",
    location: "Kathmandu, Nepal",
    experience: "10 yrs training rural farmers",
    currentJob: "Lead Trainer, Doctor Plants",
    specialTalents: "Soil regeneration, permaculture design"
  },
  {
    fullName: "Rajan Thapa",
    education: "BSc Agricultural Science",
    location: "Pokhara, Nepal",
    experience: "5 yrs organic certification advisor",
    currentJob: "Researcher, Doctor Plants",
    specialTalents: "Organic fertilizers, vermicomposting"
  }
];
const diplomatList = document.getElementById('diplomat-list');
const filterBtns = document.querySelectorAll('.diplomat-category-buttons .filter-btn');
let currentFilter = 'all';
function renderDiplomats(filter = 'all') {
  diplomatList.innerHTML = '';
  diplomatData.forEach(dip => {
    if (filter !== 'all' && !dip[categoryKey(filter)].toLowerCase()) return;
    const card = document.createElement('article');
    card.className = 'diplomat-card';
    card.innerHTML = `<h3>${dip.fullName}</h3>
    <p><strong>Education:</strong> ${dip.education}</p>
    <p><strong>Location:</strong> ${dip.location}</p>
    <p><strong>Experience:</strong> ${dip.experience}</p>
    <p><strong>Current Job:</strong> ${dip.currentJob}</p>
    <p><strong>Special Talents:</strong> ${dip.specialTalents}</p>`;
    diplomatList.appendChild(card);
  });
}
function categoryKey(filter) {
  switch(filter) {
    case 'education': return 'education';
    case 'location': return 'location';
    case 'experience': return 'experience';
    case 'job': return 'currentJob';
    case 'talents': return 'specialTalents';
    default: return '';
  }
}
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderDiplomats(currentFilter);
  });
});
renderDiplomats();

// ==== DIPLOMAT FORM ==== //
const showFormBtn = document.getElementById('show-form-btn');
const diplomatsForm = document.getElementById('diplomats-form');
const cancelFormBtn = document.getElementById('cancel-form-btn');
showFormBtn.addEventListener('click', () => {
  diplomatsForm.style.display = 'block';
  showFormBtn.style.display = 'none';
  diplomatsForm.scrollIntoView({ behavior: 'smooth' });
});
cancelFormBtn.addEventListener('click', () => {
  diplomatsForm.style.display = 'none';
  showFormBtn.style.display = 'inline-block';
  clearFormMessage();
});
diplomatsForm.addEventListener('submit', e => {
  e.preventDefault();
  clearFormMessage();
  const fullName = diplomatsForm.fullName.value.trim();
  const education = diplomatsForm.education.value.trim();
  const location = diplomatsForm.location.value.trim();
  const experience = diplomatsForm.experience.value.trim();
  const currentJob = diplomatsForm.currentJob.value.trim();
  const specialTalents = diplomatsForm.specialTalents.value.trim();
  if (!fullName || !education || !location || !experience || !currentJob || !specialTalents) {
    setFormMessage('Please fill in all required fields.', false);
    return;
  }
  diplomatData.push({
    fullName, education, location, experience, currentJob, specialTalents
  });
  setFormMessage('Thank you for submitting your profile! We will contact you soon.', true);
  diplomatsForm.reset();
  setTimeout(() => {
    diplomatsForm.style.display = 'none';
    showFormBtn.style.display = 'inline-block';
    clearFormMessage();
    renderDiplomats(currentFilter);
  }, 2000);
});
function setFormMessage(message, success) {
  const msgElem = document.getElementById('form-message');
  msgElem.textContent = message;
  msgElem.style.color = success ? 'green' : '#cc0000';
}
function clearFormMessage() {
  const msgElem = document.getElementById('form-message');
  msgElem.textContent = '';
}
