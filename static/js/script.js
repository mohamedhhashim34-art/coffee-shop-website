const $ = (id) => document.getElementById(id);

const welcomeBtn = $("welcome-btn");
const darkBtn = $("dark-mode-btn");
const topBtn = $("scroll-top-btn");
const table = $("products-table");
const contactForm = $("contact-form");

if (welcomeBtn) {
  welcomeBtn.onclick = () =>
    welcomeBtn.textContent = "Hello, coffee lover! ☕";
}

if (darkBtn) {
  if (localStorage.getItem("theme") === "dark")
    document.body.classList.add("dark");

  darkBtn.textContent = document.body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";

  darkBtn.onclick = () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    localStorage.setItem("theme", dark ? "dark" : "light");

    darkBtn.textContent = dark ? "Light Mode" : "Dark Mode";
  };
}

if (topBtn) {
  window.onscroll = () =>
    topBtn.style.display = window.scrollY > 250 ? "block" : "none";

  topBtn.onclick = () => window.scrollTo(0, 0);
}

if (table) {
  const tbody = table.querySelector("tbody");
  const cards = $("products-cards");
  const loading = $("loading");
  const error = $("products-error");
  const search = $("search-box");
  const form = $("add-product-form");
  const msg = $("product-form-message");

  let products = [];

  function show(list) {
    tbody.innerHTML = "";
    cards.innerHTML = "";

    list.forEach((p) => {
      tbody.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>${Number(p.price).toFixed(2)}</td>
          <td>${p.description || ""}</td>
        </tr>
      `;

      cards.innerHTML += `
        <div class="product-card">
          <img src="${p.image || "/static/images/hero.jpg"}" alt="${p.name}">
          <div class="product-card-content">
            <h3>${p.name}</h3>
            <p class="price">$${Number(p.price).toFixed(2)}</p>
            <p>${p.description || "Freshly prepared drink."}</p>
          </div>
        </div>
      `;
    });
  }

  function load() {
    loading.style.display = "block";

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        products = data;
        show(products);
      })
      .catch(() => (error.textContent = "Failed to load products."))
      .finally(() => (loading.style.display = "none"));
  }

  if (search)
    search.oninput = () =>
      show(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(search.value.toLowerCase()) ||
            String(p.description || "")
              .toLowerCase()
              .includes(search.value.toLowerCase())
        )
      );

  if (form)
    form.onsubmit = (e) => {
      e.preventDefault();

      const newProduct = {
        name: $("p-name").value.trim(),
        price: $("p-price").value,
        description: $("p-desc").value.trim(),
        image: "/static/images/hero.jpg",
      };

      fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })
        .then((r) => r.json())
        .then((data) => {
          msg.className = "success";
          msg.textContent = data.message || "Product added successfully.";
          form.reset();
          load();
        })
        .catch(() => {
          msg.className = "error";
          msg.textContent = "Could not add the product.";
        });
    };

  load();
}

if (contactForm) {
  contactForm.onsubmit = (e) => {
    e.preventDefault();

    const name = $("c-name").value.trim();
    const email = $("c-email").value.trim();
    const message = $("c-message").value.trim();

    $("form-error").textContent = "";
    $("form-success").textContent = "";

    if (!name || !email || !message)
      return ($("form-error").textContent = "Please fill in all fields.");

    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then((r) => r.json())
      .then((data) => {
        $("form-success").textContent =
          data.message || "Thanks! Your message has been sent.";
        contactForm.reset();
      })
      .catch(() => ($("form-error").textContent = "Message could not be saved."));
  };
}