// ==========================================
// IMPORTAR DEPENDENCIAS
// ==========================================
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs"); // bcryptjs funciona bien en Windows
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = 3000;

// ==========================================
// CONFIGURACIÓN DE CONEXIÓN MYSQL
// ==========================================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // Usuario de MySQL (por defecto en XAMPP)
  password: "",       // Si tu MySQL no tiene contraseña, deja vacío
  database: "mini_red_social"
});

// Verificar conexión con MySQL
db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos MySQL");
});

// Middleware para leer JSON en el body
app.use(express.json());

// ==========================================
// CONFIGURAR SWAGGER
// ==========================================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Red Social API",
      version: "1.0.0",
      description: "Documentación interactiva de la API de la Mini Red Social",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./index.js"], // Aquí se buscan los comentarios tipo Swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==========================================
// RUTA DE PRUEBA
// ==========================================
app.get("/", (req, res) => {
  res.send("Servidor Node funcionando 🚀");
});

// ==========================================
// ENDPOINTS USUARIOS
// ==========================================

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Muestra todos los usuarios
 *     description: Devuelve la lista de usuarios registrados (sin contraseñas).
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 */
app.get("/users", async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT id, username FROM users");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener usuarios");
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Registra un usuario con contraseña encriptada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: emilio
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Usuario creado correctamente
 */
app.post("/users", async (req, res) => {
  let { username, password } = req.body;

  username = username.trim();
  password = password.trim();

  if (!username || !password) {
    return res.status(400).send("Faltan datos (username o password)");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    res.send("✅ Usuario creado con éxito (contraseña protegida)");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear usuario");
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión
 *     description: Valida las credenciales del usuario y devuelve un mensaje de bienvenida.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: emilio
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Usuario no encontrado o contraseña incorrecta
 */
app.post("/login", async (req, res) => {
  let { username, password } = req.body;

  username = username.trim();
  password = password.trim();

  try {
    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return res.status(401).send("Usuario no encontrado ❌");
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.send(`✅ Bienvenido, ${user.username}!`);
    } else {
      res.status(401).send("Contraseña incorrecta ❌");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor");
  }
});

// ==========================================
// ENDPOINTS POSTS
// ==========================================

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtiene todos los posts
 *     description: Devuelve una lista con todos los posts de los usuarios.
 *     responses:
 *       200:
 *         description: Lista de posts obtenida correctamente
 */
app.get("/posts", async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM posts");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener posts");
  }
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crea un nuevo post
 *     description: Permite crear un nuevo post vinculado a un usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: Este es mi primer post
 *     responses:
 *       200:
 *         description: Post creado correctamente
 */
app.post("/posts", async (req, res) => {
  let { user_id, content } = req.body;
  user_id = user_id.toString().trim();
  content = content.trim();

  if (!user_id || !content) {
    return res.status(400).send("Faltan datos para crear el post");
  }

  try {
    await db.promise().query(
      "INSERT INTO posts (user_id, content) VALUES (?, ?)",
      [user_id, content]
    );
    res.send("📝 Post creado con éxito!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear post");
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Documentación disponible en http://localhost:${PORT}/api-docs`);
});
