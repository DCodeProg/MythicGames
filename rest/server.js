const express = require("express");
const app = express();
const port = 8080;
const z = require("zod");
const postgres = require("postgres");
const crypto = require("crypto");
const sql = postgres({ db: "mydb", user: "user", password: "password", port: 5433 });

app.use(express.json());

// Schemas
const ProductSchema = z.object({
    id: z.int(),
    name: z.string(),
    about: z.string(),
    price: z.number().positive(),
});

const CreateProductSchema = ProductSchema.omit({ id: true });

const UserSchema = z.object({
    id: z.int(),
    username: z.string(),
    email: z.email(),
    password: z.string(),
});

const CreateUserSchema = UserSchema.omit({ id: true });
const UserResponseSchema = UserSchema.omit({ password: true });

app.post("/products", async (req, res) => {
    const result = await CreateProductSchema.safeParse(req.body);

    // If Zod parsed successfully the request body
    if (result.success) {
        const { name, about, price } = result.data;

        const product = await sql`
    INSERT INTO products (name, about, price)
    VALUES (${name}, ${about}, ${price})
    RETURNING *
    `;

        res.send(product[0]);
    } else {
        res.status(400).send(result);
    }
});

app.get("/products", async (req, res) => {
    const products = await sql`
    SELECT * FROM products
    `;

    res.send(products);
});

app.get("/products/:id", async (req, res) => {
    const product = await sql`
    SELECT * FROM products WHERE id=${req.params.id}
    `;

    if (product.length > 0) {
        res.send(product[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.delete("/products/:id", async (req, res) => {
    const product = await sql`
    DELETE FROM products
    WHERE id=${req.params.id}
    RETURNING *
    `;

    if (product.length > 0) {
        res.send(product[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.post("/users", async (req, res) => {
    const result = await CreateUserSchema.safeParse(req.body);

    if (result.success) {
        const { username, email, password } = result.data;
        const encryptedPassword = crypto.createHash("sha512").update(password).digest("hex");

        const user = await sql`
    INSERT INTO users (username, email, password)
    VALUES (${username}, ${email}, ${encryptedPassword})
    RETURNING *
    `;

        res.send(UserResponseSchema.parse(user[0]));
    } else {
        res.status(400).send(result);
    }
});

app.get("/users", async (req, res) => {
    const users = await sql`
    SELECT id, username, email FROM users
    `;
    res.send(users);
});

app.get("/users/:id", async (req, res) => {
    const user = await sql`
    SELECT id, username, email FROM users WHERE id=${req.params.id}
    `;

    if (user.length > 0) {
        res.send(user[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.delete("/users/:id", async (req, res) => {
    const user = await sql`
    DELETE FROM users
    WHERE id=${req.params.id}
    RETURNING id, username, email
    `;

    if (user.length > 0) {
        res.send(user[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

