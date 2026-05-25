const API_BASE = "http://localhost:3000";

const welcomeBtn = document.getElementById("welcome-btn");
if (welcomeBtn) {
  welcomeBtn.addEventListener("click", function () {
    welcomeBtn.textContent = "Hello, coffee lover! ☕";
  });
}

const darkModeBtn = document.getElementById("dark-mode-btn");

if (darkModeBtn) {
  // 1. اعرف الثيم الحالي إيه أول ما الصفحة تفتح
  const currentTheme = localStorage.getItem("theme");

  // 2. طبق الـ Dark لو كان محفوظ قبل كده
  if (currentTheme === "dark") {
    document.body.classList.add("dark");
  }

  // 3. دالة (Function) مهمتها بس تحديث الأيقونة بناءً على وضع الـ body الحالي
  function updateIcon() {
    const isDark = document.body.classList.contains("dark");

    if (darkModeBtn.classList.contains("theme-toggle")) {
      const icon = isDark ? "sun" : "moon";
      darkModeBtn.innerHTML = `<i class="fa-solid fa-${icon}" aria-hidden="true"></i>`;
    } else {
      darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    }

    darkModeBtn.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  // شغل الدالة فوراً عشان تظبط الأيقونة أول ما الصفحة تفتح
  updateIcon();

  // 4. عند الضغط على الزرار
  darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    // احفظ الحالة الجديدة في الـ LocalStorage
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }

    // حدث الأيقونة بعد التغيير
    updateIcon();
  });
}


const scrollTopBtn = document.getElementById("scroll-top-btn");
if (scrollTopBtn) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 250) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const productsTable = document.getElementById("products-table");

if (productsTable) {
  const loading = document.getElementById("loading");
  const productsError = document.getElementById("products-error");
  const productCards = document.getElementById("products-cards");
  const searchBox = document.getElementById("search-box");
  const addForm = document.getElementById("add-product-form");
  const productFormMessage = document.getElementById("product-form-message");

  let allProducts = [];

  function renderProducts(items) {
    const tbody = productsTable.querySelector("tbody");
    tbody.innerHTML = "";
    productCards.innerHTML = "";

    items.forEach(function (p) {
      const row = document.createElement("tr");

      row.innerHTML =
        "<td>" + p.name + "</td>" +
        "<td>" + Number(p.price).toFixed(2) + "</td>" +
        "<td>" + (p.description || "") + "</td>";

      tbody.appendChild(row);

      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML =
        '<img src="' + (p.image || "static/images/hero.jpg") + '" alt="' + p.name + '">' +
        '<div class="product-card-content">' +
        "<h3>" + p.name + "</h3>" +
        '<p class="price">$' + Number(p.price).toFixed(2) + "</p>" +
        "<p>" + (p.description || "Freshly prepared drink.") + "</p>" +
        "</div>";

      productCards.appendChild(card);
    });
  }

  function filterProducts() {
    const text = searchBox.value.toLowerCase();

    const filteredProducts = allProducts.filter(function (product) {
      return product.name.toLowerCase().includes(text);
    });

    renderProducts(filteredProducts);
  }

  function loadProducts() {
    loading.style.display = "block";
    productsError.textContent = "";

    fetch(API_BASE + "/products")
      .then(function (res) {
        if (!res.ok) {
          throw new Error("API is not running.");
        }
        return res.json();
      })
      .catch(function () {
        productsError.textContent = "API is not running, so products.json is shown only for viewing.";
        return fetch("products.json").then(function (res) {
          return res.json();
        });
      })
      .then(function (items) {
        allProducts = items;
        renderProducts(allProducts);
      })
      .finally(function () {
        loading.style.display = "none";
      });
  }

  if (searchBox) {
    searchBox.addEventListener("input", filterProducts);
  }

  if (addForm) {
    addForm.addEventListener("submit", function (e) {
      e.preventDefault();

      productFormMessage.textContent = "";
      productFormMessage.className = "success";

      const newProduct = {
        name: document.getElementById("p-name").value.trim(),
        price: Number(document.getElementById("p-price").value),
        description: document.getElementById("p-desc").value.trim(),
        image: "static/images/hero.jpg"
      };

      if (!newProduct.name || !newProduct.price) {
        productFormMessage.className = "error";
        productFormMessage.textContent = "Name and price are required.";
        return;
      }

      fetch(API_BASE + "/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      })
        .then(function (res) {
          if (!res.ok) {
            throw new Error("Run npm start first to save in db.json.");
          }
          return res.json();
        })
        .then(function () {
          productFormMessage.textContent = "Product saved in db.json successfully.";
          addForm.reset();
          loadProducts();
        })
        .catch(function (error) {
          productFormMessage.className = "error";
          productFormMessage.textContent = error.message;
        });
    });
  }

  loadProducts();
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const errorBox = document.getElementById("form-error");
  const successBox = document.getElementById("form-success");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    errorBox.textContent = "";
    successBox.textContent = "";

    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const message = document.getElementById("c-message").value.trim();

    const errors = [];

    if (!name) {
      errors.push("Name is required");
    }

    if (!email) {
      errors.push("Email is required");
    }

    if (!message) {
      errors.push("Message is required");
    }

    if (errors.length > 0) {
      errorBox.textContent = errors.join(" • ");
      return;
    }

    fetch(API_BASE + "/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Run npm start first to save in db.json.");
        }
        return res.json();
      })
      .then(function () {
        successBox.textContent = "Thanks! Your message was saved in db.json.";
        contactForm.reset();
      })
      .catch(function (error) {
        errorBox.textContent = error.message;
      });
  });
}

const orderForm = document.getElementById("order-form");

if (orderForm) {
  const drinkSelect = document.getElementById("o-drink");
  const orderError = document.getElementById("order-error");
  const orderSuccess = document.getElementById("order-success");

  function showDrinks(drinks) {
    drinks.forEach(function (drink) {
      const option = document.createElement("option");
      option.value = drink.name;
      option.textContent = drink.name + " - $" + Number(drink.price).toFixed(2);
      drinkSelect.appendChild(option);
    });
  }

  fetch(API_BASE + "/products")
    .then(function (res) {
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .catch(function () {
      return fetch("products.json").then(function (res) {
        return res.json();
      });
    })
    .then(showDrinks);

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    orderError.textContent = "";
    orderSuccess.textContent = "";

    const order = {
      name: document.getElementById("o-name").value.trim(),
      phone: document.getElementById("o-phone").value.trim(),
      drink: drinkSelect.value,
      quantity: Number(document.getElementById("o-quantity").value),
      notes: document.getElementById("o-notes").value.trim()
    };

    if (!order.name || !order.phone || !order.drink || order.quantity < 1) {
      orderError.textContent = "Please fill name, phone, drink, and quantity.";
      return;
    }

    fetch(API_BASE + "/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Run npm start first to save the order in db.json.");
        }
        return res.json();
      })
      .then(function () {
        orderSuccess.textContent = "Your order has been booked successfully.";
        orderForm.reset();
        document.getElementById("o-quantity").value = 1;
      })
      .catch(function (error) {
        orderError.textContent = error.message;
      });
  });
}
