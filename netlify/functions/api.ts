import serverless from 'serverless-http';
import express from 'express';
import crypto from 'crypto';
import {
  createTechnicalSupportRequest,
  createConsultingRequest,
  createEquipmentSalesRequest,
  createContactMessage,
  createItProjectRequest,
  createItManagementRequest,
  getTechnicalSupportRequests,
  getEquipmentSalesRequests,
  getConsultingRequests,
  getContactMessages,
  getItProjectRequests,
  getItManagementRequests,
  updateTechnicalSupportRequestStatus,
  updateEquipmentSalesRequestStatus,
  updateConsultingRequestStatus,
  updateContactMessageStatus,
  updateItProjectRequestStatus,
  updateItManagementRequestStatus,
  getUsers,
  createUser,
  deleteUser,
  verifyUserPassword,
} from '../../server/db';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── FORMULÁRIOS PÚBLICOS ─────────────────────────────────────────────────────

app.post('/api/support', async (req, res) => {
  try {
    const result = await createTechnicalSupportRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/consulting', async (req, res) => {
  try {
    const result = await createConsultingRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const result = await createEquipmentSalesRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const result = await createContactMessage(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const result = await createItProjectRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/management', async (req, res) => {
  try {
    const result = await createItManagementRequest(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── ADMIN — LOGIN ────────────────────────────────────────────────────────────

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checar credencial de admin via variáveis de ambiente
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lebtech.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      const token = generateToken(email);
      return res.json({ success: true, token });
    }

    // Checar usuários cadastrados no banco
    const user = await verifyUserPassword(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos!',
      });
    }

    const token = generateToken(user.email!);
    res.json({ success: true, token });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// ─── ADMIN — SUBMISSIONS ──────────────────────────────────────────────────────

app.get('/api/admin/submissions', async (_req, res) => {
  try {
    const [support, equipment, consulting, contact, projects, management] =
      await Promise.all([
        getTechnicalSupportRequests(),
        getEquipmentSalesRequests(),
        getConsultingRequests(),
        getContactMessages(),
        getItProjectRequests(),
        getItManagementRequests(),
      ]);

    const all = [
      ...support.map((s) => ({
        id: s.id,
        type: 'Assistência Técnica',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company,
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.description,
        adminNotes: s.adminNotes,
      })),
      ...equipment.map((s) => ({
        id: s.id,
        type: 'Venda de Equipamentos',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company,
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.specifications,
        adminNotes: s.adminNotes,
      })),
      ...consulting.map((s) => ({
        id: s.id,
        type: 'Consultoria de TI',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company,
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.currentChallenges,
        adminNotes: s.adminNotes,
      })),
      ...contact.map((s) => ({
        id: s.id,
        type: 'Contato',
        name: s.name,
        email: s.email,
        phone: s.phone || '',
        company: '',
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.message,
        adminNotes: s.adminNotes,
      })),
      ...projects.map((s) => ({
        id: s.id,
        type: 'Projetos de TI',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company || '',
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.description,
        adminNotes: s.adminNotes,
      })),
      ...management.map((s) => ({
        id: s.id,
        type: 'Gestão de TI',
        name: s.name,
        email: s.email,
        phone: s.phone,
        company: s.company || '',
        status: s.status,
        createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
        description: s.challenges,
        adminNotes: s.adminNotes,
      })),
    ].sort((a, b) =>
      (b.createdAt || '').localeCompare(a.createdAt || '')
    );

    res.json({ success: true, data: all });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/submissions/status', async (req, res) => {
  try {
    const { id, type, status } = req.body;

    if (type === 'Assistência Técnica')
      await updateTechnicalSupportRequestStatus(id, status);
    else if (type === 'Venda de Equipamentos')
      await updateEquipmentSalesRequestStatus(id, status);
    else if (type === 'Consultoria de TI')
      await updateConsultingRequestStatus(id, status);
    else if (type === 'Contato')
      await updateContactMessageStatus(id, status);
    else if (type === 'Projetos de TI')
      await updateItProjectRequestStatus(id, status);
    else if (type === 'Gestão de TI')
      await updateItManagementRequestStatus(id, status);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── ADMIN — USERS ────────────────────────────────────────────────────────────

app.get('/api/admin/users', async (_req, res) => {
  try {
    const users = await getUsers();
    // Nunca retornar o hash de senha
    const safeUsers = users.map(({ passwordHash, openId, ...u }) => u);
    res.json({ success: true, data: safeUsers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/users', async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.cause ? error.cause.message : error.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await deleteUser(Number(req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── JWT HELPERS ──────────────────────────────────────────────────────────────

function generateToken(email: string): string {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  ).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'lebtech-jwt-secret-change-in-prod')
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

// ─── EXPORT para Netlify Functions ────────────────────────────────────────────

export const handler = serverless(app);
