(function () {
  const CURRENCY = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
  const STORAGE_KEY = 'gc_cart_v1';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    renderNavbarCartCount();
  }

  function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    saveCart(cart);
    showToast('Added to cart');
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(item => item.productId !== productId);
    saveCart(cart);
  }

  function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity | 0);
      saveCart(cart);
    }
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartWithDetails() {
    const map = new Map(PRODUCTS.map(p => [p.id, p]));
    return getCart().map(item => ({
      ...item,
      product: map.get(item.productId)
    })).filter(row => row.product);
  }

  function getCartTotals() {
    const rows = getCartWithDetails();
    const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
    return { subtotal, total: subtotal };
  }

  function renderNavbarCartCount() {
    const el = document.getElementById('navbar-cart-count');
    if (el) el.textContent = String(getCartCount());
  }

  function elProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="ratio ratio-1x1">
          <img src="${product.image}" alt="${product.name}" class="product-img rounded-top object-fit-cover">
        </div>
        <div class="card-body d-flex flex-column">
          <div class="small text-secondary">${product.brand}</div>
          <h3 class="h6 mt-1 mb-2">${product.name}</h3>
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge badge-category">${product.category}</span>
            <span class="text-warning"><i class="bi bi-star-fill me-1"></i>${product.rating.toFixed(1)}</span>
          </div>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="price">${CURRENCY.format(product.price)}</div>
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${product.id}"><i class="bi bi-cart-plus me-1"></i>Add</button>
          </div>
        </div>
      </div>`;
    return col;
  }

  function renderFeaturedProducts() {
    const mount = document.getElementById('featured-products');
    if (!mount) return;
    const featured = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 8);
    mount.innerHTML = '';
    featured.forEach(p => mount.appendChild(elProductCard(p)));
  }

  function renderCategoryPills() {
    const mount = document.getElementById('category-pills');
    if (!mount) return;
    mount.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-2';
      col.innerHTML = `<a href="/products.html?category=${encodeURIComponent(cat)}" class="btn w-100 btn-outline-primary">${cat}</a>`;
      mount.appendChild(col);
    });
  }

  function renderProductGrid() {
    const grid = document.getElementById('product-grid');
    const countEl = document.getElementById('product-count');
    if (!grid) return;

    const url = new URL(window.location.href);
    const q = (document.getElementById('search-input')?.value || url.searchParams.get('q') || '').toLowerCase();
    const category = document.getElementById('category-select')?.value || url.searchParams.get('category') || '';
    const sort = document.getElementById('sort-select')?.value || 'popularity';

    let items = PRODUCTS.filter(p => (
      (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) &&
      (!category || p.category === category)
    ));

    switch (sort) {
      case 'price-asc': items.sort((a,b) => a.price - b.price); break;
      case 'price-desc': items.sort((a,b) => b.price - a.price); break;
      case 'name-asc': items.sort((a,b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': items.sort((a,b) => b.name.localeCompare(a.name)); break;
      default: items.sort((a,b) => b.rating - a.rating); break;
    }

    grid.innerHTML = '';
    items.forEach(p => grid.appendChild(elProductCard(p)));
    if (countEl) countEl.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
  }

  function hydrateFilters() {
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
      CATEGORIES.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat; opt.textContent = cat; categorySelect.appendChild(opt);
      });

      const url = new URL(window.location.href);
      const pre = url.searchParams.get('category') || '';
      if (pre) categorySelect.value = pre;
    }
  }

  function attachGlobalHandlers() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      const btn = target.closest?.('.add-to-cart-btn');
      if (btn) {
        const id = btn.getAttribute('data-product-id');
        if (id) addToCart(id, 1);
      }

      const removeBtn = target.closest?.('[data-remove-product-id]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-remove-product-id');
        if (id) { removeFromCart(id); renderCartPage(); showToast('Removed from cart'); }
      }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', debounce(renderProductGrid, 200));

    const categorySelect = document.getElementById('category-select');
    if (categorySelect) categorySelect.addEventListener('change', renderProductGrid);

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.addEventListener('change', renderProductGrid);

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = '';
      if (sortSelect) sortSelect.value = 'popularity';
      renderProductGrid();
    });
  }

  function renderCartPage() {
    const mount = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (!mount) return;

    const rows = getCartWithDetails();
    mount.innerHTML = '';

    if (rows.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'p-4 text-center text-secondary';
      empty.innerHTML = '<i class="bi bi-bag fs-3 d-block mb-2"></i>Your cart is empty.';
      mount.appendChild(empty);
    } else {
      rows.forEach(row => {
        const li = document.createElement('div');
        li.className = 'list-group-item';
        li.innerHTML = `
          <div class="d-flex align-items-start gap-3">
            <img src="${row.product.image}" alt="${row.product.name}" width="80" height="80" class="rounded object-fit-cover">
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="small text-secondary">${row.product.brand} · ${row.product.category}</div>
                  <div class="fw-semibold">${row.product.name}</div>
                </div>
                <button class="btn btn-sm btn-outline-danger" data-remove-product-id="${row.product.id}"><i class="bi bi-x-lg"></i></button>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="input-group" style="max-width: 140px;">
                  <span class="input-group-text">Qty</span>
                  <input type="number" min="1" class="form-control form-control-sm" value="${row.quantity}" data-qty-product-id="${row.product.id}">
                </div>
                <div class="fw-bold">${CURRENCY.format(row.product.price * row.quantity)}</div>
              </div>
            </div>
          </div>`;
        mount.appendChild(li);
      });

      mount.querySelectorAll('input[data-qty-product-id]').forEach(input => {
        input.addEventListener('change', (e) => {
          const target = e.target;
          const id = target.getAttribute('data-qty-product-id');
          const qty = parseInt(target.value, 10) || 1;
          updateCartQuantity(id, qty);
          renderCartPage();
        });
      });
    }

    const { subtotal, total } = getCartTotals();
    if (subtotalEl) subtotalEl.textContent = CURRENCY.format(subtotal);
    if (totalEl) totalEl.textContent = CURRENCY.format(total);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-dark border-0 position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>`;
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 1500 });
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }

  function debounce(fn, ms) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), ms); };
  }

  function onReady() {
    // Common
    document.getElementById('year')?.appendChild(document.createTextNode(String(new Date().getFullYear())));
    renderNavbarCartCount();
    attachGlobalHandlers();

    // Index
    renderFeaturedProducts();
    renderCategoryPills();

    // Products
    hydrateFilters();
    renderProductGrid();

    // Cart
    renderCartPage();

    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) clearCartBtn.addEventListener('click', () => { saveCart([]); renderCartPage(); showToast('Cart cleared'); });

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
      if (getCartCount() === 0) { showToast('Your cart is empty'); return; }
      showToast('Checkout flow is a demo');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();