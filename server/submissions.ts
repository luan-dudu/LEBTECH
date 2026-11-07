// Monta a lista unificada de solicitações exibida no painel admin.
// A descrição inclui todos os campos preenchidos no formulário (com rótulos em
// português), para o admin — e a IA que gera propostas — verem o pedido inteiro.
import {
  getTechnicalSupportRequests,
  getEquipmentSalesRequests,
  getConsultingRequests,
  getContactMessages,
  getItProjectRequests,
  getItManagementRequests,
  getLebIaTickets,
  normalizeStatus,
  type SubmissionType,
} from './db';

type Labels = Record<string, string>;

const PROBLEM_TYPES: Labels = { hardware: 'Hardware', software: 'Software', network: 'Rede/Conectividade', security: 'Segurança', other: 'Outro' };
const SUPPORT_URGENCY: Labels = { low: 'Baixa', normal: 'Normal', high: 'Alta', critical: 'Crítica' };
const EQUIPMENT_TYPES: Labels = { computers: 'Computadores', servers: 'Servidores', monitors: 'Monitores', peripherals: 'Periféricos', network: 'Equipamentos de Rede', storage: 'Armazenamento', other: 'Outro' };
const EQUIPMENT_TIMELINES: Labels = { asap: 'O mais rápido possível', '1week': 'Até 1 semana', '2weeks': 'Até 2 semanas', '1month': 'Até 1 mês', flexible: 'Flexível' };
const CONSULTING_TYPES: Labels = { strategy: 'Estratégia Digital', infrastructure: 'Infraestrutura de TI', security: 'Segurança da Informação', cloud: 'Migração para Nuvem', optimization: 'Otimização de Processos', other: 'Outro' };
const TEAM_SIZES: Labels = { '1-2': '1-2 pessoas', '3-5': '3-5 pessoas', '6-10': '6-10 pessoas', '10+': 'Mais de 10 pessoas' };
const PROJECT_TYPES: Labels = { development: 'Desenvolvimento de Software', infrastructure: 'Infraestrutura', integration: 'Integração de Sistemas', migration: 'Migração de Dados', other: 'Outro' };
const PROJECT_TIMELINES: Labels = { urgent: 'Urgente (até 1 mês)', short: 'Curto prazo (1-3 meses)', medium: 'Médio prazo (3-6 meses)', long: 'Longo prazo (6+ meses)' };
const PROJECT_BUDGETS: Labels = { '5k': 'Até R$ 5 mil', '15k': 'R$ 5 mil - R$ 15 mil', '50k': 'R$ 15 mil - R$ 50 mil', '100k': 'R$ 50 mil - R$ 100 mil', above: 'Acima de R$ 100 mil' };
const MANAGEMENT_TYPES: Labels = { full: 'Gestão Completa', partial: 'Gestão Parcial', helpdesk: 'Help Desk', monitoring: 'Monitoramento', support: 'Suporte Técnico' };
const USER_COUNTS: Labels = { '1-10': '1 a 10 usuários', '11-50': '11 a 50 usuários', '51-100': '51 a 100 usuários', '101-500': '101 a 500 usuários', '500+': '500+ usuários' };
const INFRASTRUCTURES: Labels = { 'on-premises': 'On-Premises', cloud: 'Cloud', hybrid: 'Híbrida', mixed: 'Mista' };

const label = (labels: Labels, value: string | null | undefined) => (value ? labels[value] || value : undefined);

/** Linhas "Rótulo: valor" (omitindo vazias) seguidas do texto livre do cliente. */
function describe(fields: [string, string | number | null | undefined][], ...texts: [string, string | null | undefined][]) {
  const header = fields
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([name, value]) => `${name}: ${value}`)
    .join('\n');
  const body = texts
    .filter(([, value]) => value && value.trim())
    .map(([name, value]) => `${name}:\n${value!.trim()}`)
    .join('\n\n');
  return [header, body].filter(Boolean).join('\n\n');
}

export type AdminSubmission = {
  id: number;
  type: SubmissionType;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'pending' | 'viewed' | 'responded';
  /** ISO 8601 (UTC) — o painel formata no fuso de Brasília */
  createdAt: string;
  description: string;
  adminNotes: string | null;
  aiProposal: string | null;
  aiAnalysis: unknown;
  rawTicket?: unknown;
};

type BaseRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: Date;
  adminNotes: string | null;
  aiProposal: string | null;
  aiAnalysis: unknown;
};

function base(row: BaseRow, type: SubmissionType, company: string | null | undefined, description: string): AdminSubmission {
  return {
    id: row.id,
    type,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    company: company || '',
    status: normalizeStatus(row.status),
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : '',
    description,
    adminNotes: row.adminNotes,
    aiProposal: row.aiProposal,
    aiAnalysis: row.aiAnalysis,
  };
}

export async function listAdminSubmissions(): Promise<AdminSubmission[]> {
  const [support, equipment, consulting, contact, projects, management, lebIa] = await Promise.all([
    getTechnicalSupportRequests(),
    getEquipmentSalesRequests(),
    getConsultingRequests(),
    getContactMessages(),
    getItProjectRequests(),
    getItManagementRequests(),
    getLebIaTickets(),
  ]);

  const all: AdminSubmission[] = [
    ...support.map((s: any) =>
      base(s, 'Assistência Técnica', s.company, describe(
        [['Tipo de problema', label(PROBLEM_TYPES, s.problemType)], ['Urgência informada', label(SUPPORT_URGENCY, s.urgency)]],
        ['Descrição do problema', s.description],
      ))
    ),
    ...equipment.map((s: any) =>
      base(s, 'Venda de Equipamentos', s.company, describe(
        [
          ['Tipo de equipamento', label(EQUIPMENT_TYPES, s.equipmentType)],
          ['Quantidade', s.quantity],
          ['Orçamento', s.budget],
          ['Prazo', label(EQUIPMENT_TIMELINES, s.timeline)],
        ],
        ['Especificações', s.specifications],
      ))
    ),
    ...consulting.map((s: any) =>
      base(s, 'Consultoria de TI', s.company, describe(
        [
          ['Tipo de consultoria', label(CONSULTING_TYPES, s.consultingType)],
          ['Tamanho da equipe de TI', label(TEAM_SIZES, s.teamSize)],
          ['Orçamento', s.budget],
        ],
        ['Desafios atuais', s.currentChallenges],
        ['Objetivos', s.objectives],
      ))
    ),
    ...contact.map((s: any) =>
      base(s, 'Contato', s.company, describe(
        [['Assunto', s.subject && s.subject !== 'Contato via site' ? s.subject : undefined]],
        ['Mensagem', s.message],
      ))
    ),
    ...projects.map((s: any) =>
      base(s, 'Projetos de TI', s.company, describe(
        [
          ['Tipo de projeto', label(PROJECT_TYPES, s.projectType)],
          ['Prazo', label(PROJECT_TIMELINES, s.timeline)],
          ['Orçamento', label(PROJECT_BUDGETS, s.budget)],
        ],
        ['Descrição do projeto', s.description],
      ))
    ),
    ...management.map((s: any) =>
      base(s, 'Gestão de TI', s.company, describe(
        [
          ['Tipo de gestão', label(MANAGEMENT_TYPES, s.managementType)],
          ['Quantidade de usuários', label(USER_COUNTS, s.userCount)],
          ['Infraestrutura', label(INFRASTRUCTURES, s.infrastructure)],
        ],
        ['Desafios', s.challenges],
      ))
    ),
    ...lebIa.map((t: any) => ({
      ...base(
        t,
        'Atendimento LEB IA',
        t.company || (t.city ? `Cidade: ${t.city}` : 'Cliente Particular'),
        t.whatsappText || `[${t.category} - Urgência ${t.urgency}]\n${t.summary}\n${t.symptoms ? 'Sintomas: ' + t.symptoms : ''}`
      ),
      aiAnalysis: t.aiAnalysis || {
        urgencia: t.urgency,
        categoriaSugerida: t.category,
        nivelComplexidade: t.resolvedN1 ? 'N1 - Suporte Básico' : 'N2 - Técnico Especializado',
        impactoNegocio: t.summary,
        tags: [t.category, `Urgência ${t.urgency}`, t.equipment || 'TI']
          .filter(Boolean)
          .map((x: string) => '#' + x.replace(/\s+/g, '')),
        acaoRecomendada:
          t.preliminaryDiagnosis ||
          (t.resolvedN1
            ? 'Resolvido no N1 via LEB IA. Acompanhar satisfação.'
            : 'Agendar visita ou atendimento remoto com técnico responsável.'),
      },
      rawTicket: t,
    })),
  ];

  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
