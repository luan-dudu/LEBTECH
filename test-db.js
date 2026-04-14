import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    await client.connect();
    console.log("🔥 Conectado ao Neon com sucesso!");
    await client.end();
  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
}

test();