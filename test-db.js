import { neon } from '@neondatabase/serverless';

async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL não configurada. Pulando o teste no CI.');
      return;
    }
    
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1`;
    console.log('✅ Conectado com sucesso ao banco Neon!');
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    process.exit(1);
  }
}

testConnection();