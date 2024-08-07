 
/** @format     node --watch index.js*/
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

 

let products = require("./products");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API...");
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const oneProduct = products.find((item) => item.id == req.params.id);

  if (oneProduct) {
    res.json(oneProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((item) => item.id == id);

  if (index !== -1) {
    products.splice(index, 1);
    fs.writeFileSync(
      path.resolve(__dirname, "products.json"),
      JSON.stringify(products, null, 2)
    );
    res.status(204).send(); // Send no content on successful deletion
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((item) => item.id == id);

  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length ? products[products.length - 1].id + 1 : 1; // Assign a new ID
  products.push(newProduct);
  fs.writeFileSync(
    path.resolve(__dirname, "products.json"),
    JSON.stringify(products, null, 2)
  );
  res.status(201).json(newProduct);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
 