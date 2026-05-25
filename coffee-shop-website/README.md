# Bean & Brew — Coffee Shop Website

A simple coffee shop website for the Web Programming course project.
The project uses HTML, CSS, JavaScript, JSON, Fetch API, and a simple JSON database.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- JSON
- Fetch API / AJAX
- JSON Server for the simple API
- `db.json` as the simple database

## Important Note

Flask and SQLite were removed. The website now uses `db.json` only.
When you add a product or send a contact message, JSON Server saves it inside `db.json`.

## How to Run

First install the simple JSON API tool:

```bash
npm install
```

Then run the API:

```bash
npm start
```

Open the website using VS Code Live Server from `index.html`.

## API Endpoints

JSON Server creates these endpoints from `db.json`:

- `GET http://localhost:3000/products`
- `POST http://localhost:3000/products`
- `GET http://localhost:3000/messages`
- `POST http://localhost:3000/messages`

## Pages

- `index.html` — Home page
- `products.html` — Products/Menu page
- `about.html` — Additional page
- `contact.html` — Contact page

## Project Structure

```text
coffee-shop/
├── index.html
├── products.html
├── about.html
├── contact.html
├── products.json
├── db.json
├── package.json
├── README.md
└── static/
    ├── css/style.css
    ├── js/script.js
    └── images/
```
