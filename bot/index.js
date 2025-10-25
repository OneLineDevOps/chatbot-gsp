import pkg from "whatsapp-web.js";
import qrcode from "qrcode";
import { Server } from "socket.io";
import { handleCommand } from "./commands.js";
const { Client, LocalAuth } = pkg;

export default function initBot(httpServer) {
  const io = new Server(httpServer);
  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./bot/sessions" }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // 🧠 ruta en macOS
    },
  });

  let lastQR = null;

  // 📱 QR generado
  client.on("qr", async (qr) => {
    console.log("📱 Nuevo QR generado");
    const qrImage = await qrcode.toDataURL(qr);
    lastQR = qrImage;
    io.emit("qr", qrImage);
  });

  // ✅ Conectado
  client.on("ready", () => {
    console.log("✅ WhatsApp conectado");
    io.emit("qr", null);
  });

  // 🧹 Desconectado
  client.on("disconnected", () => {
    console.log("❌ WhatsApp desconectado");
    io.emit("qr", "disconnected");
  });

  // 💬 Escuchar mensajes entrantes
  client.on("message", async (message) => {
    console.log(`📩 Mensaje de ${message.from}: ${message.body}`);
    await handleCommand(client, message);
  });

  // ⚙️ Socket.IO (panel web)
  io.on("connection", (socket) => {
    console.log("🖥️ Cliente conectado al panel QR");

    socket.on("qr_request", () => {
      if (lastQR) socket.emit("qr", lastQR);
    });

    socket.on("disconnect", () => console.log("❌ Cliente desconectado del panel QR"));

    socket.on("send_message", async (msg) => {
      const to = process.env.TEST_NUMBER + "@c.us";
      try {
        await client.sendMessage(to, msg);
        socket.emit("message_status", "✅ Mensaje enviado correctamente");
      } catch (err) {
        socket.emit("message_status", "❌ Error al enviar mensaje");
      }
    });
  });

  client.initialize();
}
