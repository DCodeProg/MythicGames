const express = require("express");
const app = express();
const port = 8080;
const postgres = require("postgres");

const sql = postgres({ db: "mydb", user: "user", password: "password" });

// Schemas
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  about: z.string(),
  price: z.number().positive(),
});

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

 