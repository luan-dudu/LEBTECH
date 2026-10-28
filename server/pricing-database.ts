/**
 * Base de Dados de Preços e Estimativas de Mercado de Serviços de TI
 * Referência para a LEB TECH (Região de Pouso Alegre / Sul de Minas e Brasil)
 */

export interface PricingItem {
  categoria: string;
  item: string;
  descricao: string;
  unidade: 'serviço' | 'hora' | 'ponto' | 'mensal' | 'unidade';
  valorMin: number;
  valorMedio: number;
  valorMax: number;
}

export const PRICING_CATALOG: PricingItem[] = [
  // ── Assistência e Manutenção ───────────────────────────────────────────────
  {
    categoria: 'Assistência Técnica',
    item: 'Limpeza interna completa + troca de pasta térmica de alta condutividade',
    descricao: 'Desmontagem, desobstrução de coolers, higienização de placa e aplicação de pasta térmica premium',
    unidade: 'serviço',
    valorMin: 110,
    valorMedio: 140,
    valorMax: 180,
  },
  {
    categoria: 'Assistência Técnica',
    item: 'Formatação completa com backup e reinstalação de SO',
    descricao: 'Backup de dados do cliente, instalação limpa do Windows/Linux, drivers atualizados e pacote básico de softwares',
    unidade: 'serviço',
    valorMin: 120,
    valorMedio: 160,
    valorMax: 200,
  },
  {
    categoria: 'Assistência Técnica',
    item: 'Upgrade para SSD (Mão de obra + Clonagem de Disco)',
    descricao: 'Clonagem integral do sistema anterior para novo SSD sem perda de programas ou arquivos',
    unidade: 'serviço',
    valorMin: 90,
    valorMedio: 130,
    valorMax: 160,
  },
  {
    categoria: 'Assistência Técnica',
    item: 'Remoção de vírus/malware, spyware e otimização de inicialização',
    descricao: 'Varredura profunda, limpeza de malwares, reparo do registro e aceleração do sistema operacional',
    unidade: 'serviço',
    valorMin: 90,
    valorMedio: 120,
    valorMax: 150,
  },
  {
    categoria: 'Assistência Técnica',
    item: 'Substituição de Tela / Teclado / Carcaça de Notebook (Mão de Obra)',
    descricao: 'Substituição técnica de componentes danificados de notebooks',
    unidade: 'serviço',
    valorMin: 120,
    valorMedio: 150,
    valorMax: 200,
  },
  {
    categoria: 'Assistência Técnica',
    item: 'Recuperação de dados lógica (arquivos apagados / partição corrompida)',
    descricao: 'Varredura forense e recuperação de fotos, documentos e bancos de dados perdidos',
    unidade: 'serviço',
    valorMin: 250,
    valorMedio: 450,
    valorMax: 800,
  },
  {
    categoria: 'Assistência Técnica',
    item: 'Hora Técnica de Suporte Presencial / Visita Técnica Avulsa',
    descricao: 'Deslocamento e atendimento técnico no local para diagnóstico e resolução presencial',
    unidade: 'hora',
    valorMin: 120,
    valorMedio: 150,
    valorMax: 220,
  },

  // ── Redes e Conectividade ──────────────────────────────────────────────────
  {
    categoria: 'Redes e Infraestrutura',
    item: 'Ponto de Rede Cabeada Estruturada (CAT6)',
    descricao: 'Passagem de cabo, conectorização RJ45 fêmea/macho, certificação de link e identificação',
    unidade: 'ponto',
    valorMin: 85,
    valorMedio: 120,
    valorMax: 160,
  },
  {
    categoria: 'Redes e Infraestrutura',
    item: 'Configuração e Instalação de Roteador / Switch Gerenciável / VLAN',
    descricao: 'Configuração de segurança, segmentação de rede para visitantes/caixas e balanceamento',
    unidade: 'serviço',
    valorMin: 200,
    valorMedio: 350,
    valorMax: 600,
  },
  {
    categoria: 'Redes e Infraestrutura',
    item: 'Instalação e Configuração de Access Point Corporativo (Wi-Fi de Alta Densidade)',
    descricao: 'Fixação, cabeamento, configuração de roaming sem queda e portal de acesso',
    unidade: 'unidade',
    valorMin: 150,
    valorMedio: 220,
    valorMax: 320,
  },
  {
    categoria: 'Redes e Infraestrutura',
    item: 'Organização e Identificação de Rack de TI / Patch Panel',
    descricao: 'Arrumação de cabos (cable management), conectorização em patch panel e teste de canais',
    unidade: 'serviço',
    valorMin: 400,
    valorMedio: 700,
    valorMax: 1200,
  },

  // ── Servidores, Cloud e Backup ─────────────────────────────────────────────
  {
    categoria: 'Servidores e Nuvem',
    item: 'Configuração de Servidor Local (Windows Server / Linux / AD / Compartilhamento)',
    descricao: 'Instalação do SO servidor, configuração de permissões de usuário, pastas em rede e cotas',
    unidade: 'serviço',
    valorMin: 800,
    valorMedio: 1400,
    valorMax: 2500,
  },
  {
    categoria: 'Servidores e Nuvem',
    item: 'Implementação de Sistema de Backup Automatizado Híbrido (Local + Nuvem)',
    descricao: 'Configuração de rotinas diárias com retenção histórica, criptografia e alertas por e-mail',
    unidade: 'serviço',
    valorMin: 350,
    valorMedio: 600,
    valorMax: 950,
  },
  {
    categoria: 'Servidores e Nuvem',
    item: 'Migração de E-mails Corporativos para Nuvem (Google Workspace / Microsoft 365)',
    descricao: 'Criação de contas, migração do histórico de mensagens e configuração de DNS (SPF, DKIM, DMARC)',
    unidade: 'unidade',
    valorMin: 40,
    valorMedio: 65,
    valorMax: 100,
  },

  // ── Gestão de TI Contínua (TI Terceirizada) ─────────────────────────────────
  {
    categoria: 'Gestão de TI',
    item: 'Plano Mensal de Suporte e Manutenção Preventiva/Corretiva por Computador',
    descricao: 'Monitoramento remoto 24/7, suporte helpdesk ilimitado, antivírus gerenciado e visitas inclusas',
    unidade: 'mensal',
    valorMin: 75,
    valorMedio: 110,
    valorMax: 150,
  },
  {
    categoria: 'Gestão de TI',
    item: 'Contrato Mínimo de TI para Pequenas Empresas (Até 5 computadores)',
    descricao: 'Helpdesk N1/N2, rotina de manutenção preventiva mensal e suporte a servidores/roteadores',
    unidade: 'mensal',
    valorMin: 450,
    valorMedio: 650,
    valorMax: 900,
  },

  // ── Equipamentos e Peças Médias (Estimativa de Hardware) ───────────────────
  {
    categoria: 'Equipamentos',
    item: 'SSD 480GB / 512GB SATA ou NVMe M.2 (Componente Novo com Garantia)',
    descricao: 'Unidade de armazenamento de alta velocidade das marcas Kingston, Crucial ou Western Digital',
    unidade: 'unidade',
    valorMin: 190,
    valorMedio: 240,
    valorMax: 310,
  },
  {
    categoria: 'Equipamentos',
    item: 'SSD 1TB NVMe M.2 Ultra Rápido (Componente Novo)',
    descricao: 'SSD de alta performance para cargas de trabalho pesadas e servidores',
    unidade: 'unidade',
    valorMin: 340,
    valorMedio: 420,
    valorMax: 520,
  },
  {
    categoria: 'Equipamentos',
    item: 'Módulo de Memória RAM 8GB / 16GB DDR4/DDR5 para Desktop ou Notebook',
    descricao: 'Memória para expansão de multitarefa e agilidade de sistemas',
    unidade: 'unidade',
    valorMin: 140,
    valorMedio: 220,
    valorMax: 350,
  },
  {
    categoria: 'Equipamentos',
    item: 'Nobreak Senoidal 1200VA - 1500VA para Proteção de Servidores e PDVs',
    descricao: 'Proteção contra surtos elétricos, oscilações de voltagem e autonomia durante apagões',
    unidade: 'unidade',
    valorMin: 850,
    valorMedio: 1250,
    valorMax: 1800,
  },
  {
    categoria: 'Equipamentos',
    item: 'Roteador Wi-Fi 6 Corporativo / Access Point Gigabit',
    descricao: 'Equipamento de rede corporativo para múltiplos dispositivos simultâneos sem travamentos',
    unidade: 'unidade',
    valorMin: 380,
    valorMedio: 550,
    valorMax: 890,
  },
  {
    categoria: 'Equipamentos',
    item: 'Notebook Corporativo i5 / Ryzen 5, 16GB RAM, SSD 512GB (Novo)',
    descricao: 'Equipamento com garantia corporativa para uso administrativo e comercial',
    unidade: 'unidade',
    valorMin: 3100,
    valorMedio: 3700,
    valorMax: 4600,
  },
];

/**
 * Retorna uma versão formatada em texto do catálogo para alimentar o contexto da IA
 */
export function getPricingCatalogText(): string {
  return PRICING_CATALOG.map(
    (p) => `- [${p.categoria}] ${p.item} (${p.unidade}): R$ ${p.valorMin.toFixed(2)} a R$ ${p.valorMax.toFixed(2)} (Média sugerida: R$ ${p.valorMedio.toFixed(2)}) — ${p.descricao}`
  ).join('\n');
}
