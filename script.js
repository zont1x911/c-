const STORAGE_KEYS = {
  products: "supermarket-products-v2",
  receipt: "supermarket-last-receipt-v2"
};

const seedProducts = [
  { id: 1, name: "有机纯牛奶", category: "乳制品", price: 12.8, stock: 28, produceDate: "2026-04-10" },
  { id: 2, name: "新鲜鸡蛋", category: "生鲜", price: 16.5, stock: 40, produceDate: "2026-04-14" },
  { id: 3, name: "苏打气泡水", category: "饮料", price: 5.8, stock: 52, produceDate: "2026-04-11" },
  { id: 4, name: "原味吐司", category: "烘焙", price: 9.9, stock: 16, produceDate: "2026-04-15" },
  { id: 5, name: "精选苹果", category: "水果", price: 18.6, stock: 24, produceDate: "2026-04-15" },
  { id: 6, name: "东北大米", category: "粮油", price: 58.0, stock: 12, produceDate: "2026-04-02" }
];

let products = loadProductsFromStorage();
let cart = [];
let userType = 0;
let lastReceipt = loadReceiptFromStorage();

const loginForm = document.getElementById("login-form");
const loginFeedback = document.getElementById("login-feedback");
const logoutButton = document.getElementById("logout-button");
const userStatus = document.getElementById("user-status");
const userStatusCopy = document.getElementById("user-status-copy");
const categoryFilter = document.getElementById("category-filter");
const searchInput = document.getElementById("search-input");
const resetFiltersButton = document.getElementById("reset-filters");
const productGrid = document.getElementById("product-grid");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartDiscount = document.getElementById("cart-discount");
const cartPayable = document.getElementById("cart-payable");
const clearCartButton = document.getElementById("clear-cart-button");
const checkoutButton = document.getElementById("checkout-button");
const receiptEmpty = document.getElementById("receipt-empty");
const receiptContent = document.getElementById("receipt-content");
const receiptBadge = document.getElementById("receipt-badge");
const receiptItems = document.getElementById("receipt-items");
const receiptOriginal = document.getElementById("receipt-original");
const receiptOffer = document.getElementById("receipt-offer");
const receiptFinal = document.getElementById("receipt-final");
const productForm = document.getElementById("product-form");
const productFeedback = document.getElementById("product-feedback");
const addProductButton = document.getElementById("add-product-button");
const updateProductButton = document.getElementById("update-product-button");
const resetFormButton = document.getElementById("reset-form-button");
const productTableBody = document.getElementById("product-table-body");
const findIdInput = document.getElementById("find-id-input");
const findNameInput = document.getElementById("find-name-input");
const findByIdButton = document.getElementById("find-by-id-button");
const findByNameButton = document.getElementById("find-by-name-button");
const saveDataButton = document.getElementById("save-data-button");
const loadDataButton = document.getElementById("load-data-button");
const searchResult = document.getElementById("search-result");
const backToTop = document.getElementById("back-to-top");
const toast = document.getElementById("toast");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main .section, #shop, #receipt, #admin");
const counters = document.querySelectorAll("[data-count-up]");

function loadProductsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.products);
    if (!stored) return [...seedProducts];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...seedProducts];
  } catch {
    return [...seedProducts];
  }
}

function loadReceiptFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.receipt);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveProductsToStorage() {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function saveReceiptToStorage() {
  localStorage.setItem(STORAGE_KEYS.receipt, JSON.stringify(lastReceipt));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function formatMoney(value) {
  return `¥${value.toFixed(2)}`;
}

function getUserTypeLabel() {
  if (userType === 1) return "普通用户";
  if (userType === 2) return "尊贵的 VIP 客户";
  return "未登录";
}

function updateUserStatus() {
  userStatus.textContent = getUserTypeLabel();
  if (userType === 2) {
    userStatusCopy.textContent = "当前结算可自动享受 9 折优惠。";
  } else if (userType === 1) {
    userStatusCopy.textContent = "你已登录，可以正常结算购物车。";
  } else {
    userStatusCopy.textContent = "请先登录后再结算，逻辑与 C 程序保持一致。";
  }
}

function populateCategoryFilter() {
  const categories = [...new Set(products.map((product) => product.category))];
  const currentValue = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="all">全部类别</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = categories.includes(currentValue) ? currentValue : "all";
}

function getFilteredProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  return products.filter((product) => {
    const matchCategory = category === "all" || product.category === category;
    const matchKeyword = !keyword || product.name.toLowerCase().includes(keyword);
    return matchCategory && matchKeyword;
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<div class="empty-state">没有找到符合条件的商品，请调整筛选条件后再试。</div>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map((product) => {
    const stockClass = product.stock === 0 ? "empty" : product.stock < 10 ? "low" : "";
    return `
      <article class="product-card ${product.stock === 0 ? "out-of-stock" : ""}">
        <div class="product-topline">
          <span class="product-id">ID ${product.id}</span>
          <span class="stock-badge ${stockClass}">
            ${product.stock === 0 ? "售罄" : `库存 ${product.stock}`}
          </span>
        </div>
        <div><h3>${product.name}</h3></div>
        <div class="product-meta">
          <div><span>类别</span><strong>${product.category}</strong></div>
          <div><span>价格</span><strong>${formatMoney(product.price)}</strong></div>
          <div><span>生产日期</span><strong>${product.produceDate}</strong></div>
        </div>
        <div class="product-buy">
          <input type="number" min="1" value="1" data-quantity-input="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
          <button class="product-action-button" type="button" data-add-to-cart="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
            加入购物车
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function getCartSummary() {
  const originalTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = userType === 2 ? originalTotal * 0.1 : 0;
  const payable = originalTotal - discount;
  return { originalTotal, discount, payable };
}

function renderCart() {
  if (cart.length === 0) {
    cartList.innerHTML = '<div class="cart-empty">购物车为空，先去左侧选择商品吧。</div>';
  } else {
    cartList.innerHTML = cart.map((item) => {
      const subtotal = item.price * item.quantity;
      return `
        <article class="cart-item">
          <div class="cart-item-head">
            <strong>${item.name}</strong>
            <button class="icon-button danger" type="button" data-remove-cart="${item.productid}">移除</button>
          </div>
          <div class="cart-item-meta">
            <span>单价 ${formatMoney(item.price)}</span>
            <span>数量 ${item.quantity}</span>
            <strong>${formatMoney(subtotal)}</strong>
          </div>
        </article>
      `;
    }).join("");
  }

  const summary = getCartSummary();
  cartCount.textContent = String(cart.length);
  cartTotal.textContent = formatMoney(summary.originalTotal);
  cartDiscount.textContent = formatMoney(summary.discount);
  cartPayable.textContent = formatMoney(summary.payable);
}

function renderReceipt() {
  if (!lastReceipt) {
    receiptEmpty.hidden = false;
    receiptContent.hidden = true;
    return;
  }

  receiptEmpty.hidden = true;
  receiptContent.hidden = false;
  receiptBadge.textContent = lastReceipt.userLabel;
  receiptItems.innerHTML = lastReceipt.items.map((item) => `
    <article class="receipt-item">
      <div class="receipt-item-head">
        <strong>${item.name}</strong>
        <strong>${formatMoney(item.subtotal)}</strong>
      </div>
      <div class="receipt-item-meta">
        <span>单价 ${formatMoney(item.price)}</span>
        <span>数量 ${item.quantity}</span>
      </div>
    </article>
  `).join("");
  receiptOriginal.textContent = formatMoney(lastReceipt.originalTotal);
  receiptOffer.textContent = formatMoney(lastReceipt.discount);
  receiptFinal.textContent = formatMoney(lastReceipt.finalTotal);
}

function renderProductTable() {
  if (products.length === 0) {
    productTableBody.innerHTML = '<tr><td colspan="7">当前没有商品数据。</td></tr>';
    return;
  }

  productTableBody.innerHTML = products.map((product) => `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${formatMoney(product.price)}</td>
      <td>${product.stock}</td>
      <td>${product.produceDate}</td>
      <td>
        <div class="table-actions">
          <button class="icon-button" type="button" data-edit-product="${product.id}">编辑</button>
          <button class="icon-button danger" type="button" data-delete-product="${product.id}">删除</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function refreshAllViews() {
  populateCategoryFilter();
  renderProducts();
  renderCart();
  renderReceipt();
  renderProductTable();
  updateUserStatus();
}

function findProductIndexById(id) {
  return products.findIndex((product) => product.id === id);
}

function addToCart(productId, quantity) {
  const productIndex = findProductIndexById(productId);
  if (productIndex === -1) return showToast("没有找到该商品");
  if (quantity <= 0) return showToast("购买数量必须大于 0");

  const product = products[productIndex];
  if (quantity > product.stock) return showToast("库存不足");

  const cartIndex = cart.findIndex((item) => item.productid === productId);
  if (cartIndex !== -1) {
    if (cart[cartIndex].quantity + quantity > product.stock) {
      return showToast("累计数量超过库存");
    }
    cart[cartIndex].quantity += quantity;
  } else {
    cart.push({ productid: product.id, name: product.name, price: product.price, quantity });
  }

  renderCart();
  showToast("商品已加入购物车");
}

function clearCart() {
  cart = [];
  renderCart();
  showToast("购物车已清空");
}

function checkout() {
  if (userType === 0) return showToast("请先登录");
  if (cart.length === 0) return showToast("购物车为空");

  const receiptItemsData = [];
  let originalTotal = 0;

  for (const item of cart) {
    const index = findProductIndexById(item.productid);
    if (index === -1) continue;
    products[index].stock -= item.quantity;
    const subtotal = item.price * item.quantity;
    originalTotal += subtotal;
    receiptItemsData.push({ ...item, subtotal });
  }

  const discount = userType === 2 ? originalTotal * 0.1 : 0;
  const finalTotal = originalTotal - discount;
  lastReceipt = {
    userLabel: userType === 2 ? "VIP 客户" : "普通用户",
    items: receiptItemsData,
    originalTotal,
    discount,
    finalTotal
  };

  cart = [];
  saveProductsToStorage();
  saveReceiptToStorage();
  refreshAllViews();
  showToast("结算成功，欢迎下次光临");
}

function getFormProductData() {
  const idValue = document.getElementById("product-id").value.trim();
  const name = document.getElementById("product-name").value.trim();
  const category = document.getElementById("product-category").value.trim();
  const price = Number(document.getElementById("product-price").value);
  const stock = Number(document.getElementById("product-stock").value);
  const produceDate = document.getElementById("product-date").value;

  if (!name || !category || !produceDate || Number.isNaN(price) || Number.isNaN(stock)) {
    return { error: "请先完整填写商品信息。" };
  }
  if (price < 0 || stock < 0) return { error: "价格和库存不能小于 0。" };

  return {
    data: {
      id: idValue ? Number(idValue) : null,
      name,
      category,
      price,
      stock,
      produceDate
    }
  };
}

function setProductFeedback(message, type = "success") {
  productFeedback.textContent = message;
  productFeedback.classList.remove("is-success", "is-error");
  productFeedback.classList.add(type === "success" ? "is-success" : "is-error");
}

function resetProductFeedback() {
  productFeedback.textContent = "";
  productFeedback.classList.remove("is-success", "is-error");
}

function addProduct() {
  const { data, error } = getFormProductData();
  if (error) return setProductFeedback(error, "error");

  const nextId = products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1;
  products.push({ ...data, id: nextId });
  saveProductsToStorage();
  refreshAllViews();
  productForm.reset();
  setProductFeedback(`已新增商品：${data.name}`);
  showToast("商品添加成功");
}

function updateProduct() {
  const { data, error } = getFormProductData();
  if (error) return setProductFeedback(error, "error");
  if (!data.id) return setProductFeedback("更新商品时必须填写商品编号。", "error");

  const index = findProductIndexById(data.id);
  if (index === -1) return setProductFeedback("没有找到要更新的商品编号。", "error");

  products[index] = data;
  saveProductsToStorage();
  refreshAllViews();
  setProductFeedback(`已更新商品：${data.name}`);
  showToast("商品更新成功");
}

function deleteProduct(id) {
  const index = findProductIndexById(id);
  if (index === -1) return showToast("没有找到该商品");

  const deletedName = products[index].name;
  products.splice(index, 1);
  cart = cart.filter((item) => item.productid !== id);
  saveProductsToStorage();
  refreshAllViews();
  showToast(`已删除商品：${deletedName}`);
}

function fillFormWithProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  document.getElementById("product-id").value = String(product.id);
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-category").value = product.category;
  document.getElementById("product-price").value = String(product.price);
  document.getElementById("product-stock").value = String(product.stock);
  document.getElementById("product-date").value = product.produceDate;
  setProductFeedback(`已加载商品 ${product.name} 到表单，可直接修改。`);
}

function findProductById() {
  const id = Number(findIdInput.value);
  if (Number.isNaN(id)) {
    searchResult.textContent = "请输入有效的商品编号。";
    return;
  }

  const product = products.find((item) => item.id === id);
  searchResult.textContent = product
    ? `找到商品：编号 ${product.id}，名称 ${product.name}，类别 ${product.category}，价格 ${formatMoney(product.price)}，库存 ${product.stock}，生产日期 ${product.produceDate}`
    : "没有找到该编号商品。";
}

function findProductByName() {
  const keyword = findNameInput.value.trim();
  if (!keyword) {
    searchResult.textContent = "请输入商品名称。";
    return;
  }

  const matched = products.filter((product) => product.name.includes(keyword));
  searchResult.textContent = matched.length === 0
    ? "没有找到该名称商品。"
    : matched.map((product) => `编号 ${product.id} / ${product.name} / ${product.category} / ${formatMoney(product.price)} / 库存 ${product.stock}`).join("；");
}

function saveData() {
  saveProductsToStorage();
  showToast("数据已保存到浏览器本地");
}

function loadData() {
  products = loadProductsFromStorage();
  refreshAllViews();
  showToast("已从本地读取商品数据");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  loginFeedback.classList.remove("is-success", "is-error");

  if (username === "user" && password === "123456") {
    userType = 1;
    loginFeedback.textContent = "你好，普通用户。";
    loginFeedback.classList.add("is-success");
  } else if (username === "vipuser" && password === "888888") {
    userType = 2;
    loginFeedback.textContent = "你好，尊贵的 VIP 客户。";
    loginFeedback.classList.add("is-success");
  } else {
    userType = 0;
    loginFeedback.textContent = "账号或密码错误。";
    loginFeedback.classList.add("is-error");
  }

  updateUserStatus();
  renderCart();
});

logoutButton.addEventListener("click", () => {
  userType = 0;
  updateUserStatus();
  renderCart();
  loginForm.reset();
  loginFeedback.textContent = "已退出登录。";
  loginFeedback.classList.remove("is-success", "is-error");
  showToast("已退出登录");
});

categoryFilter.addEventListener("change", renderProducts);
searchInput.addEventListener("input", renderProducts);

resetFiltersButton.addEventListener("click", () => {
  categoryFilter.value = "all";
  searchInput.value = "";
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const target = event.target;
  const productId = Number(target.dataset.addToCart);
  if (!productId) return;

  const quantityInput = document.querySelector(`[data-quantity-input="${productId}"]`);
  const quantity = Number(quantityInput.value);
  addToCart(productId, quantity);
});

cartList.addEventListener("click", (event) => {
  const target = event.target;
  const productId = Number(target.dataset.removeCart);
  if (!productId) return;
  cart = cart.filter((item) => item.productid !== productId);
  renderCart();
  showToast("已从购物车移除商品");
});

clearCartButton.addEventListener("click", clearCart);
checkoutButton.addEventListener("click", checkout);
addProductButton.addEventListener("click", addProduct);
updateProductButton.addEventListener("click", updateProduct);
resetFormButton.addEventListener("click", () => window.setTimeout(resetProductFeedback, 0));

productTableBody.addEventListener("click", (event) => {
  const target = event.target;
  const editId = Number(target.dataset.editProduct);
  const deleteId = Number(target.dataset.deleteProduct);
  if (editId) fillFormWithProduct(editId);
  if (deleteId) deleteProduct(deleteId);
});

findByIdButton.addEventListener("click", findProductById);
findByNameButton.addEventListener("click", findProductByName);
saveDataButton.addEventListener("click", saveData);
loadDataButton.addEventListener("click", loadData);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("scroll", () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 520);

  let currentSectionId = "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 180 && rect.bottom >= 180) currentSectionId = section.id;
  });

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").slice(1);
    link.classList.toggle("is-active", targetId === currentSectionId);
  });
});

function initRevealTargets() {
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-panel, .metric-card, .product-card, .cart-panel, .receipt-card, .admin-card"
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealTargets.forEach((target, index) => {
    target.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
    revealObserver.observe(target);
  });
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const targetValue = Number(element.dataset.countUp);
    const suffix = element.dataset.suffix || "";
    const startTime = performance.now();
    const duration = 1100;

    function animate(timestamp) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      element.textContent = `${Math.floor(progress * targetValue)}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
    countObserver.unobserve(element);
  });
}, { threshold: 0.5 });

counters.forEach((counter) => {
  counter.textContent = "0";
  countObserver.observe(counter);
});

refreshAllViews();
initRevealTargets();
