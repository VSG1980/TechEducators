import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const db = new pg.Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING,
});

app.get("/", (req, res) => {
  res.json("You have reached the root. Don't trip!");
});

app.get("/wedding", async (req, res) => {
  try {
    const wedding = await db.query("SELECT * FROM wedding");
    console.log(wedding.rows);
    res.json(wedding.rows);
  } catch (error) {
    console.error("Error fetching wedding data:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

app.post("/wedding", async (req, res) => {
  const { name, message } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO wedding (name, message) VALUES ($1, $2) RETURNING *`,
      [name, message]
    );

    res.json({ success: true, entry: result.rows[0] });
  } catch (error) {
    console.error("Error inserting into wedding table:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
