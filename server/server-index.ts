import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
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
  findUserByEmail,
  getLebIaTickets,
  updateLebIaTicketStatus,
  updateSubmissionAiProposal,
  updateSubmissionAiAnalysis,
} from "./db";
import { runAiChat, aiRateLimited, generateAiProposal, analyzeAiSubmission } from "./ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );

  app.post("/api/support", async (req, res) => {
    try {
      const result = await createTechnicalSupportRequest(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/consulting", async (req, res) => {
    try {
      const result = await createConsultingRequest(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/equipment", async (req, res) => {
    try {
      const result = await createEquipmentSalesRequest(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const result = await createContactMessage(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = await createItProjectRequest(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/management", async (req, res) => {
    try {
      const result = await createItManagementRequest(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const ip = String(req.headers["x-forwarded-for"] || req.ip || "anon");
      if (aiRateLimited(ip)) {
        return res.status(429).json({ success: false, error: "Muitas mensagens em pouco tempo. Aguarde alguns minutos." });
      }
      const result = await runAiChat(req.body?.messages);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@lebtech.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      if (email === adminEmail && password === adminPassword) {
        return res.json({ success: true, token: 'valid-token-' + Date.now() });
      }

      const user = await findUserByEmail(email);
      if (!user) throw new Error('Email ou senha incorretos!');

      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      if (user.openId !== passwordHash) throw new Error('Email ou senha incorretos!');

      res.json({ success: true, token: 'valid-token-' + Date.now() });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  });

  app.get("/api/admin/submissions", async (req, res) => {
    try {
      const [support, equipment, consulting, contact, projects, management, lebIa] = await Promise.all([
        getTechnicalSupportRequests(),
        getEquipmentSalesRequests(),
        getConsultingRequests(),
        getContactMessages(),
        getItProjectRequests(),
        getItManagementRequests(),
        getLebIaTickets(),
      ]);

      const all = [
        ...support.map((s: any) => ({ id: s.id, type: 'Assistência Técnica', name: s.name, email: s.email, phone: s.phone, company: s.company, status: s.status, createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '), description: s.description, aiProposal: s.aiProposal, aiAnalysis: s.aiAnalysis })),
        ...equipment.map((s: any) => ({ id: s.id, type: 'Venda de Equipamentos', name: s.name, email: s.email, phone: s.phone, company: s.company, status: s.status, createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '), description: s.specifications, aiProposal: s.aiProposal, aiAnalysis: s.aiAnalysis })),
        ...consulting.map((s: any) => ({ id: s.id, type: 'Consultoria de TI', name: s.name, email: s.email, phone: s.phone, company: s.company, status: s.status, createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '), description: s.currentChallenges, aiProposal: s.aiProposal, aiAnalysis: s.aiAnalysis })),
        ...contact.map((s: any) => ({ id: s.id, type: 'Contato', name: s.name, email: s.email, phone: s.phone || '', company: '', status: s.status, createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '), description: s.message, aiProposal: s.aiProposal, aiAnalysis: s.aiAnalysis })),
        ...projects.map((s: any) => ({ id: s.id, type: 'Projetos de TI', name: s.name, email: s.email, phone: s.phone, company: s.company || '', status: s.status, createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '), description: s.description, aiProposal: s.aiProposal, aiAnalysis: s.aiAnalysis })),
        ...management.map((s: any) => ({ id: s.id, type: 'Gestão de TI', name: s.name, email: s.email, phone: s.phone, company: s.company || '', status: s.status, createdAt: s.createdAt?.toISOString().slice(0, 16).replace('T', ' '), description: s.challenges, aiProposal: s.aiProposal, aiAnalysis: s.aiAnalysis })),
        ...lebIa.map((t: any) => ({
          id: t.id,
          type: 'Atendimento LEB IA',
          name: t.name,
          email: t.email,
          phone: t.phone || '',
          company: t.company || (t.city ? `Cidade: ${t.city}` : 'Cliente Particular'),
          status: t.status,
          createdAt: t.createdAt?.toISOString().slice(0, 16).replace('T', ' '),
          description: t.whatsappText || `[${t.category} - Urgência ${t.urgency}]\n${t.summary}\n${t.symptoms ? 'Sintomas: ' + t.symptoms : ''}`,
          aiProposal: t.aiProposal,
          aiAnalysis: t.aiAnalysis || {
            urgencia: t.urgency,
            categoriaSugerida: t.category,
            nivelComplexidade: t.resolvedN1 ? 'N1 - Suporte Básico' : 'N2 - Técnico Especializado',
            impactoNegocio: t.summary,
            tags: [t.category, `Urgência ${t.urgency}`, t.equipment || 'TI'].filter(Boolean).map((x: string) => '#' + x.replace(/\s+/g, '')),
            acaoRecomendada: t.preliminaryDiagnosis || (t.resolvedN1 ? 'Resolvido no N1 via LEB IA. Acompanhar satisfação.' : 'Agendar visita ou atendimento remoto com técnico responsável.')
          },
          rawTicket: t,
        })),
      ].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

      res.json({ success: true, data: all });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/admin/submissions/status", async (req, res) => {
    try {
      const { id, type, status } = req.body;
      if (type === 'Assistência Técnica') await updateTechnicalSupportRequestStatus(id, status);
      else if (type === 'Venda de Equipamentos') await updateEquipmentSalesRequestStatus(id, status);
      else if (type === 'Consultoria de TI') await updateConsultingRequestStatus(id, status);
      else if (type === 'Contato') await updateContactMessageStatus(id, status);
      else if (type === 'Projetos de TI') await updateItProjectRequestStatus(id, status);
      else if (type === 'Gestão de TI') await updateItManagementRequestStatus(id, status);
      else if (type === 'Atendimento LEB IA') await updateLebIaTicketStatus(id, status);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ✨ Gerador Automático de Propostas Técnicas com IA
  app.post("/api/admin/ai/proposal", async (req, res) => {
    try {
      const { type, id, name, company, phone, email, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ success: false, error: "Nome e descrição são obrigatórios." });
      }
      const proposal = await generateAiProposal({ type: type || 'Geral', name, company, phone, email, description });
      if (id && type) {
        await updateSubmissionAiProposal(type, Number(id), proposal);
      }
      res.json({ success: true, proposal });
    } catch (error: any) {
      console.error("[LEB IA] Erro ao gerar proposta:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 🎯 Triagem e Classificação Inteligente com IA
  app.post("/api/admin/ai/analyze", async (req, res) => {
    try {
      const { type, id, name, company, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ success: false, error: "Nome e descrição são obrigatórios." });
      }
      const analysis = await analyzeAiSubmission({ type: type || 'Geral', name, company, description });
      if (id && type) {
        await updateSubmissionAiAnalysis(type, Number(id), analysis);
      }
      res.json({ success: true, analysis });
    } catch (error: any) {
      console.error("[LEB IA] Erro ao analisar chamado:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Salvar proposta editada manualmente pelo admin
  app.put("/api/admin/submissions/proposal", async (req, res) => {
    try {
      const { type, id, proposal } = req.body;
      if (!id || !type) {
        return res.status(400).json({ success: false, error: "ID e tipo são obrigatórios." });
      }
      await updateSubmissionAiProposal(type, Number(id), proposal);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await getUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const result = await createUser(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      await deleteUser(Number(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);