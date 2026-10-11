import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Import and start the Discord bot
import './bot.js';

async function startServer() {
  const app = express();
  const PORT = (process.env.PORT && process.env.PORT !== '8080') ? Number(process.env.PORT) : 3000;

  // Health check route for hosting containers & uptime monitors
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite middleware unavailable, serving basic status:", e.message);
      app.get("/", (req, res) => {
        res.send("Nachos Marketplace Bot is running.");
      });
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(200).send("Nachos Marketplace Bot is running.");
        }
      });
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err) => {
    console.warn(`[Web Server Notice] Port ${PORT} could not be bound (${err.message}). Discord bot continues running independently.`);
  });
}

startServer().catch((err) => {
  console.warn("[Web Server Notice] Non-critical server warning:", err.message);
});
