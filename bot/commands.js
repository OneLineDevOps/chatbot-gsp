// 🧠 Lógica de conversación básica
const users = new Map();

export async function handleCommand(client, message) {
  const from = message.from;
  const text = message.body.trim().toLowerCase();

  if (!users.has(from)) {
    users.set(from, true);
    await client.sendMessage(
      from,
      "👋 ¡Bienvenido/a a *Gran Sur Peruano*! 🚌\n\n" +
        "Somos tu empresa de transporte de confianza.\n\n" +
        "✅ Viajes seguros\n✅ Asientos cómodos\n✅ Atención puntual\n\n" +
        "Escribe *menu* para ver las opciones."
    );
    return;
  }

  switch (text) {
    case "menu":
      await client.sendMessage(
        from,
        "📋 *Menú principal*\n\n1️⃣ Horarios\n2️⃣ Comprar\n3️⃣ Consultas"
      );
      break;
    case "1":
      await client.sendMessage(
        from,
        "🕐 Horarios:\nLunes a Viernes de 3:00 am a 10:00 pm.\n📍 Av. Ejército 135, Moquegua / Av. Miguel Forja 105, Arequipa."
      );
      break;
    case "2":
      await client.sendMessage(
        from,
        "🚍 Rutas disponibles:\n1️⃣ Moquegua → Arequipa\n2️⃣ Arequipa → Moquegua"
      );
      break;
    case "3":
      await client.sendMessage(
        from,
        "💬 Gracias por tu mensaje. 🙌 Un agente te atenderá pronto."
      );
      break;
    default:
      await client.sendMessage(from, "❓ Escribe *menu* para comenzar.");
  }
}
