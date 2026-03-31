const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ ROOT ROUTE (FIXES "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Mechanical Parts Catalog API is running");
});

// Get all parts
app.get("/api/parts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM parts ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new part
app.post("/api/parts", async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;

    const result = await pool.query(
      "INSERT INTO parts (name, category, price, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, category, price, description, image]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete part
app.delete("/api/parts/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM parts WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));