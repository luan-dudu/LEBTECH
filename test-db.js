const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Conectado com sucesso ao banco Neon!');
    await client.end();
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    process.exit(1);
  }
}

testConnection();