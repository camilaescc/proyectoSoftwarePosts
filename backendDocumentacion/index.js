// ==========================================
// IMPORTAR DEPENDENCIAS
// ==========================================
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(cors());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../frontenddocumentacion")));

// ==========================================
// CONEXIÓN MYSQL
// ==========================================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mini_red_social"
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// ==========================================
// ENDPOINTS USUARIOS
// ==========================================

// Obtener todos los usuarios
app.get("/users", async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT id, username FROM users");
    res.json(results);
  } catch (err) {
    res.status(500).send("Error al obtener usuarios");
  }
});

// Registrar usuario
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send("Faltan datos");

  try {
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    await db.promise().query(
      "INSERT INTO users (username, password) VALUES (?, ?)", 
      [username.trim(), hashedPassword]
    );
    res.send("✅ Usuario creado");
  } catch (err) {
    res.status(500).send("Error al crear usuario");
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0)
      return res.status(401).send("Usuario no encontrado");

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({ success: true, user_id: user.id, username: user.username });
    } else {
      res.status(401).send("Contraseña incorrecta");
    }
  } catch (err) {
    res.status(500).send("Error en el servidor");
  }
});

// ==========================================
// ENDPOINTS POSTS
// ==========================================

// Obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT posts.id, posts.content, users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.id DESC
    `);
    res.json(results);
  } catch (err) {
    res.status(500).send("Error al obtener posts");
  }
});

// Crear un nuevo post
app.post("/posts", async (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content)
    return res.status(400).send("Faltan datos");

  try {
    await db.promise().query(
      "INSERT INTO posts (user_id, content) VALUES (?, ?)",
      [user_id, content.trim()]
    );
    res.send("✅ Post creado con éxito");
  } catch (err) {
    res.status(500).send("Error al crear post");
  }
});

// ==========================================
// RUTAS PARA FRONTEND
// ==========================================

// Login y Posts
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontenddocumentacion/login/login.html"));
});

app.get("/posts", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontenddocumentacion/posts/posts.html"));
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
