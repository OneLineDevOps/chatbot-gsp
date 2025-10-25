import express from "express";
import { createServer } from "http";
import initBot from "./bot/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
app.use(express.static("public"));

initBot(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
