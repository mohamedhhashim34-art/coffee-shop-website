# ☕ Bean & Brew — Coffee Shop Website

A complete coffee shop website built for the Web Programming course project. The project includes HTML pages, external CSS, external JavaScript, JSON files, API data loading, a simple database concept, and form validation.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- JSON
- Fetch API / AJAX
- Python Flask
- SQLite database

## Features

- Home, Products, About, and Contact pages
- Responsive navigation bar
- Images, links, tables, and forms
- Product data loaded dynamically using a GET request
- Add new products using a POST request
- Contact form validation
- Contact messages saved to the database
- Product search feature
- Product cards and product table
- Loading message and API error handling
- Dark mode
- Scroll-to-top button
- Responsive design for mobile screens

## How to Run

```bash
pip install -r requirements.txt
python app.py
```

Then open:

```text
http://localhost:5000
```

## Pages

- `/` — Home page
- `/products.html` — Products/Menu page
- `/about.html` — Additional page
- `/contact.html` — Contact page

## API Endpoints

- `GET /api/products` — Load products from the database
- `POST /api/products` — Add a new product
- `POST /api/messages` — Save a contact form message

## JSON Files

- `products.json` — Static sample product data
- `db.json` — Simple database concept file

## Project Structure

```text
coffee-shop/
├── app.py
├── requirements.txt
├── products.json
├── db.json
├── README.md
├── templates/
│   ├── index.html
│   ├── products.html
│   ├── about.html
│   └── contact.html
└── static/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── images/
        ├── hero.jpg
        ├── about.jpg
        └── favicon.svg
```

## Notes

The SQLite database file `coffee.db` is created automatically when the Flask app runs. It is not required to create it manually.
