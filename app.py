# Flask backend for the Bean & Brew Coffee Shop website
# This file serves HTML pages and provides a small JSON API backed by SQLite.

from flask import Flask, jsonify, request, send_from_directory
import sqlite3

app = Flask(__name__, static_folder="static", template_folder="templates")
DB = "coffee.db"


def get_db():
    """Open a database connection and make rows behave like dictionaries."""
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the database tables and insert starter data when the app runs first time."""
    conn = get_db()
    c = conn.cursor()

    c.execute(
        """CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image TEXT
        )"""
    )

    c.execute(
        """CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL
        )"""
    )

    # Add image column safely for old database copies that may not have it.
    columns = [row[1] for row in c.execute("PRAGMA table_info(products)").fetchall()]
    if "image" not in columns:
        c.execute("ALTER TABLE products ADD COLUMN image TEXT")

    c.execute("SELECT COUNT(*) FROM products")
    if c.fetchone()[0] == 0:
        seed = [
            ("Espresso", 2.50, "Rich single shot of pure coffee.", "/static/images/hero.jpg"),
            ("Cappuccino", 3.50, "Espresso topped with steamed milk foam.", "/static/images/about.jpg"),
            ("Latte", 4.00, "Smooth espresso with creamy steamed milk.", "/static/images/about.jpg"),
            ("Mocha", 4.50, "Chocolate, espresso and milk in harmony.", "/static/images/hero.jpg"),
            ("Americano", 3.00, "Espresso diluted with hot water.", "/static/images/hero.jpg"),
            ("Macchiato", 3.75, "Espresso marked with a dot of milk.", "/static/images/about.jpg"),
        ]
        c.executemany(
            "INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)",
            seed,
        )

    conn.commit()
    conn.close()


# ---------- Page routes ----------
@app.route("/")
def home():
    return send_from_directory("templates", "index.html")


@app.route("/<page>.html")
def page(page):
    return send_from_directory("templates", f"{page}.html")


# ---------- Static JSON files for course requirements ----------
@app.route("/products.json")
def products_json_file():
    return send_from_directory(".", "products.json")


@app.route("/db.json")
def db_json_file():
    return send_from_directory(".", "db.json")


# ---------- JSON API ----------
@app.route("/api/products", methods=["GET"])
def list_products():
    conn = get_db()
    rows = conn.execute("SELECT * FROM products ORDER BY id").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    price = data.get("price", "")
    description = data.get("description", "").strip()
    image = data.get("image", "/static/images/hero.jpg")

    if not name or price == "":
        return jsonify({"status": "error", "message": "Name and price are required."}), 400

    try:
        price = float(price)
    except ValueError:
        return jsonify({"status": "error", "message": "Price must be a number."}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)",
        (name, price, description, image),
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "ok", "message": "Product added successfully."}), 201


@app.route("/api/messages", methods=["POST"])
def add_message():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"status": "error", "message": "All contact fields are required."}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
        (name, email, message),
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "ok", "message": "Message saved successfully."}), 201


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
