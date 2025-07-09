// Fastify API server with SQLite for users and todos
import Fastify from "fastify";
import sqlite3pkg from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const fastify = Fastify({ logger: true });
const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite DB setup
const db = new sqlite3.Database(path.join(__dirname, "data.db"));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    scheduledAt TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Register user
fastify.post(
  "/api/register",
  {
    schema: {
      body: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  },
  (request, reply) => {
    const { username, password } = request.body;
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
      function (err) {
        if (err) return reply.code(400).send({ error: "User exists" });
        reply.send({ id: this.lastID, username });
      },
    );
  },
);

// Login user (simple, no JWT)
fastify.post(
  "/api/login",
  {
    schema: {
      body: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
      },
    },
  },
  (request, reply) => {
    const { username, password } = request.body;
    db.get(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (err, row) => {
        if (err || !row)
          return reply.code(401).send({ error: "Invalid credentials" });
        reply.send({ id: row.id, username: row.username });
      },
    );
  },
);

// Get todos for user
fastify.get(
  "/api/todos",
  {
    schema: {
      querystring: {
        type: "object",
        required: ["user_id"],
        properties: {
          user_id: { type: "string" },
        },
      },
    },
  },
  (request, reply) => {
    const { user_id } = request.query;
    db.all("SELECT * FROM todos WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) return reply.code(500).send({ error: "DB error" });
      reply.send(rows);
    });
  },
);

// Add todo
fastify.post(
  "/api/todos",
  {
    schema: {
      body: {
        type: "object",
        required: ["user_id", "text"],
        properties: {
          user_id: { type: "string" },
          text: { type: "string" },
          scheduledAt: { type: ["string", "null"], nullable: true },
        },
      },
    },
  },
  (request, reply) => {
    const { user_id, text, scheduledAt } = request.body;
    db.run(
      "INSERT INTO todos (user_id, text, done, createdAt, scheduledAt) VALUES (?, ?, 0, ?, ?)",
      [user_id, text, new Date().toISOString(), scheduledAt],
      function (err) {
        if (err) return reply.code(500).send({ error: "DB error" });
        reply.send({
          id: this.lastID,
          user_id,
          text,
          done: 0,
          createdAt: new Date().toISOString(),
          scheduledAt,
        });
      },
    );
  },
);

// Update todo (done status)
fastify.put(
  "/api/todos/:id",
  {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      body: {
        type: "object",
        required: ["done"],
        properties: {
          done: { type: "boolean" },
        },
      },
    },
  },
  (request, reply) => {
    const { done } = request.body;
    const { id } = request.params;
    db.run(
      "UPDATE todos SET done = ? WHERE id = ?",
      [done ? 1 : 0, id],
      function (err) {
        if (err) return reply.code(500).send({ error: "DB error" });
        reply.send({ success: true });
      },
    );
  },
);

// Delete todo
fastify.delete(
  "/api/todos/:id",
  {
    schema: {
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
    },
  },
  (request, reply) => {
    const { id } = request.params;
    db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
      if (err) return reply.code(500).send({ error: "DB error" });
      reply.send({ success: true });
    });
  },
);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Fastify server running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
