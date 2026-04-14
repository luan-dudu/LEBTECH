const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    await client.connect();
    console.log("🔥 Conectado ao Neon com sucesso!");
    await client.end();
  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
})();