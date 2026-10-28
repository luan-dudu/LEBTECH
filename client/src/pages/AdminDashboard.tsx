import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  LogOut,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Eye,
  Share2,
  Sparkles,
  Bot,
  Copy,
  Check,
  Edit3,
  Save,
  RefreshCw,
  Send,
  Tag,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminUsersTab from '@/components/AdminUsersTab';
import AdminSocialMediaTab from '@/components/AdminSocialMediaTab';
import StatsCharts from '@/components/StatsCharts';

interface AiAnalysis {
  urgencia?: 'Crítica' | 'Alta' | 'Média' | 'Baixa' | string;
  categoriaSugerida?: string;
  nivelComplexidade?: string;
  impactoNegocio?: string;
  tags?: string[];
  acaoRecomendada?: string;
}

interface FormSubmission {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'pending' | 'viewed' | 'responded';
  createdAt: string;
  description: string;
  aiProposal?: string;
  aiAnalysis?: AiAnalysis;
  rawTicket?: any;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [adminEmail, setAdminEmail] = useState('');
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'submissions' | 'users' | 'social'>('submissions');

  // Estados dos recursos de IA
  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [analyzingTriage, setAnalyzingTriage] = useState(false);
  const [currentProposal, setCurrentProposal] = useState('');
  const [isEditingProposal, setIsEditingProposal] = useState(false);
  const [copiedProposal, setCopiedProposal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    if (!token) {
      setLocation('/admin/login');
      return;
    }
    setAdminEmail(email || '');
    fetchSubmissions();
  }, [setLocation]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/submissions');
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    toast.success('Logout realizado com sucesso!');
    setLocation('/');
  };

  const handleStatusChange = async (id: number, type: string, newStatus: 'pending' | 'viewed' | 'responded') => {
    try {
      const response = await fetch('/api/admin/submissions/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, status: newStatus }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      setSubmissions(prev =>
        prev.map(sub => (sub.id === id && sub.type === type ? { ...sub, status: newStatus } : sub))
      );
      if (selectedSubmission?.id === id && selectedSubmission?.type === type) {
        setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
      }
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleOpenDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setCurrentProposal(submission.aiProposal || '');
    setIsEditingProposal(false);
    setShowDetails(true);
  };

  // ✨ IA: Gerar Proposta Comercial
  const handleGenerateProposal = async () => {
    if (!selectedSubmission) return;
    setGeneratingProposal(true);
    try {
      const res = await fetch('/api/admin/ai/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSubmission.id,
          type: selectedSubmission.type,
          name: selectedSubmission.name,
          company: selectedSubmission.company,
          phone: selectedSubmission.phone,
          email: selectedSubmission.email,
          description: selectedSubmission.description,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Falha ao gerar proposta.');

      setCurrentProposal(data.proposal);
      setSubmissions(prev =>
        prev.map(s => s.id === selectedSubmission.id && s.type === selectedSubmission.type ? { ...s, aiProposal: data.proposal } : s)
      );
      setSelectedSubmission(prev => prev ? { ...prev, aiProposal: data.proposal } : null);
      toast.success('✨ Proposta técnica gerada com sucesso pela IA!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao gerar proposta com IA.');
    } finally {
      setGeneratingProposal(false);
    }
  };

  // 🎯 IA: Triagem e Classificação Inteligente
  const handleAnalyzeTriage = async () => {
    if (!selectedSubmission) return;
    setAnalyzingTriage(true);
    try {
      const res = await fetch('/api/admin/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSubmission.id,
          type: selectedSubmission.type,
          name: selectedSubmission.name,
          company: selectedSubmission.company,
          description: selectedSubmission.description,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Falha ao analisar chamado.');

      setSubmissions(prev =>
        prev.map(s => s.id === selectedSubmission.id && s.type === selectedSubmission.type ? { ...s, aiAnalysis: data.analysis } : s)
      );
      setSelectedSubmission(prev => prev ? { ...prev, aiAnalysis: data.analysis } : null);
      toast.success('🎯 Triagem e classificação atualizada com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao realizar triagem com IA.');
    } finally {
      setAnalyzingTriage(false);
    }
  };

  // Salvar Proposta Editada
  const handleSaveProposal = async () => {
    if (!selectedSubmission) return;
    try {
      const res = await fetch('/api/admin/submissions/proposal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSubmission.id,
          type: selectedSubmission.type,
          proposal: currentProposal,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSubmissions(prev =>
        prev.map(s => s.id === selectedSubmission.id && s.type === selectedSubmission.type ? { ...s, aiProposal: currentProposal } : s)
      );
      setSelectedSubmission(prev => prev ? { ...prev, aiProposal: currentProposal } : null);
      setIsEditingProposal(false);
      toast.success('Proposta salva com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao salvar proposta');
    }
  };

  const handleCopyProposal = () => {
    if (!currentProposal) return;
    navigator.clipboard.writeText(currentProposal);
    setCopiedProposal(true);
    toast.success('Proposta copiada para a área de transferência!');
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  const handleSendWhatsAppProposal = () => {
    if (!selectedSubmission || !currentProposal) return;
    const cleanPhone = selectedSubmission.phone.replace(/[^\d]/g, '');
    const phoneParam = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
    const textParam = encodeURIComponent(
      `Olá, ${selectedSubmission.name}! Aqui é da LEB TECH Soluções em TI.\n\nPreparamos a sua Proposta Técnica conforme conversamos:\n\n${currentProposal}`
    );
    const url = phoneParam ? `https://wa.me/${phoneParam}?text=${textParam}` : `https://wa.me/?text=${textParam}`;
    window.open(url, '_blank');
  };

  const filteredSubmissions = submissions.filter(sub => {
    const typeMatch = filterType === 'all' || sub.type === filterType;
    const statusMatch = filterStatus === 'all' || sub.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    viewed: submissions.filter(s => s.status === 'viewed').length,
    responded: submissions.filter(s => s.status === 'responded').length,
    lebIaCount: submissions.filter(s => s.type === 'Atendimento LEB IA').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'viewed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'responded': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'viewed': return <Eye size={16} />;
      case 'responded': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getUrgencyBadge = (urgencia?: string) => {
    if (!urgencia) return null;
    switch (urgencia) {
      case 'Crítica':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">🔴 Crítica</span>;
      case 'Alta':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">🟠 Alta</span>;
      case 'Média':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">🟡 Média</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🟢 Baixa</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Painel de Administração
              <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 border border-blue-500/30 flex items-center gap-1 font-normal">
                <Sparkles size={12} className="text-purple-400" /> LEB IA Integrada
              </span>
            </h1>
            <p className="text-slate-400 text-sm">Logado como: {adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer ${activeTab === 'submissions' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <FileText size={20} />
            Solicitações & Chamados
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer ${activeTab === 'users' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Users size={20} />
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all cursor-pointer ${activeTab === 'social' ? 'border-blue-500 text-blue-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Share2 size={20} />
            Redes Sociais
          </button>
        </div>

        {activeTab === 'submissions' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total de Solicitações</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
                  </div>
                  <BarChart3 className="text-blue-400" size={32} />
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pendentes</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</p>
                  </div>
                  <Clock className="text-yellow-400" size={32} />
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Visualizadas</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">{stats.viewed}</p>
                  </div>
                  <Eye className="text-blue-400" size={32} />
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Respondidas</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">{stats.responded}</p>
                  </div>
                  <CheckCircle className="text-green-400" size={32} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Via LEB IA</p>
                    <p className="text-3xl font-bold text-purple-200 mt-2">{stats.lebIaCount}</p>
                  </div>
                  <Bot className="text-purple-400" size={32} />
                </div>
              </div>
            </div>

            <StatsCharts />

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Filtros</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Tipo de Serviço</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">Todos os Serviços</option>
                    <option value="Atendimento LEB IA">🤖 Atendimento LEB IA (Chatbot)</option>
                    <option value="Assistência Técnica">Assistência Técnica</option>
                    <option value="Venda de Equipamentos">Venda de Equipamentos</option>
                    <option value="Consultoria de TI">Consultoria de TI</option>
                    <option value="Projetos de TI">Projetos de TI</option>
                    <option value="Gestão de TI">Gestão de TI</option>
                    <option value="Contato">Contato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="pending">Pendente</option>
                    <option value="viewed">Visualizado</option>
                    <option value="responded">Respondido</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Cliente / Empresa</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Origem / Serviço</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Contato</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status & Urgência</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                          <div className="inline-flex items-center gap-2">
                            <RefreshCw className="animate-spin text-blue-400" size={18} />
                            Carregando solicitações...
                          </div>
                        </td>
                      </tr>
                    ) : filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((submission, index) => (
                        <tr key={`${submission.type}-${submission.id}-${index}`} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-semibold text-white">{submission.name}</div>
                            {submission.company && (
                              <div className="text-xs text-slate-400 mt-0.5">{submission.company}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {submission.type === 'Atendimento LEB IA' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-purple-300 border border-purple-500/30">
                                <Bot size={13} className="text-purple-400" />
                                LEB IA
                              </span>
                            ) : (
                              <span className="text-slate-300">{submission.type}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            <div>{submission.email}</div>
                            {submission.phone && <div className="text-xs text-slate-400">{submission.phone}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                {getStatusIcon(submission.status)}
                                {submission.status === 'pending' && 'Pendente'}
                                {submission.status === 'viewed' && 'Visualizado'}
                                {submission.status === 'responded' && 'Respondido'}
                              </span>
                              {submission.aiAnalysis?.urgencia && getUrgencyBadge(submission.aiAnalysis.urgencia)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">{submission.createdAt}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenDetails(submission)}
                                className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all text-xs font-medium cursor-pointer"
                              >
                                Ver Detalhes
                              </button>
                              {submission.aiProposal && (
                                <span className="p-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30" title="Proposta IA gerada">
                                  <Sparkles size={14} />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Nenhuma solicitação encontrada</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal de Detalhes Completo com Recursos de IA */}
            {showDetails && selectedSubmission && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                  {/* Cabeçalho do Modal */}
                  <div className="bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                      {selectedSubmission.type === 'Atendimento LEB IA' ? (
                        <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                          <Bot size={24} />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                          <FileText size={24} />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          {selectedSubmission.name}
                          {selectedSubmission.type === 'Atendimento LEB IA' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Triagem N1 via Chatbot
                            </span>
                          )}
                        </h2>
                        <p className="text-slate-400 text-xs">
                          {selectedSubmission.type} • Enviado em {selectedSubmission.createdAt}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Conteúdo do Modal com Scroll */}
                  <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
                    {/* Dados Básicos */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                      <div>
                        <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Email</p>
                        <p className="text-white font-medium text-sm mt-0.5 break-all">{selectedSubmission.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Telefone</p>
                        <p className="text-white font-medium text-sm mt-0.5">{selectedSubmission.phone || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Empresa / Cidade</p>
                        <p className="text-white font-medium text-sm mt-0.5">{selectedSubmission.company || 'Pessoa Física / Particular'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Status Atual</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                            {getStatusIcon(selectedSubmission.status)}
                            {selectedSubmission.status === 'pending' && 'Pendente'}
                            {selectedSubmission.status === 'viewed' && 'Visualizado'}
                            {selectedSubmission.status === 'responded' && 'Respondido'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Específicos se for do LEB IA */}
                    {selectedSubmission.rawTicket && (
                      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-3">
                        <div className="flex items-center justify-between border-b border-purple-800/30 pb-2">
                          <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                            <Bot size={16} /> Dados Coletados no Atendimento N1
                          </h3>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${selectedSubmission.rawTicket.resolvedN1 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                            {selectedSubmission.rawTicket.resolvedN1 ? '✅ Resolvido no N1' : '⚠️ Necessita Técnico'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400">Categoria:</span> <span className="text-white font-medium">{selectedSubmission.rawTicket.category}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Urgência:</span> <span className="text-white font-medium">{selectedSubmission.rawTicket.urgency}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Equipamento:</span> <span className="text-white font-medium">{selectedSubmission.rawTicket.equipment || 'Não especificado'}</span>
                          </div>
                        </div>
                        {selectedSubmission.rawTicket.preliminaryDiagnosis && (
                          <div className="text-xs bg-slate-900/60 p-3 rounded-lg border border-purple-900/40">
                            <span className="text-purple-300 font-semibold block mb-1">Diagnóstico Preliminar da IA:</span>
                            <p className="text-slate-300">{selectedSubmission.rawTicket.preliminaryDiagnosis}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Descrição Original / Chamado */}
                    <div>
                      <p className="text-slate-400 text-xs uppercase font-medium tracking-wider mb-2">Mensagem / Solicitação do Cliente</p>
                      <pre className="text-sm text-slate-200 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 whitespace-pre-wrap font-sans">
                        {selectedSubmission.description}
                      </pre>
                    </div>

                    {/* 🎯 RECURSO 3: Triagem e Classificação Inteligente de Chamados */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-800/50 to-blue-950/30 border border-blue-500/30 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <Cpu size={18} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              Triagem & Classificação Inteligente
                            </h3>
                            <p className="text-xs text-slate-400">Análise automática de severidade, complexidade e plano de ação</p>
                          </div>
                        </div>
                        <button
                          onClick={handleAnalyzeTriage}
                          disabled={analyzingTriage}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={13} className={analyzingTriage ? 'animate-spin' : ''} />
                          {analyzingTriage ? 'Analisando...' : selectedSubmission.aiAnalysis ? 'Reclassificar com IA' : '⚡ Classificar com IA'}
                        </button>
                      </div>

                      {selectedSubmission.aiAnalysis ? (
                        <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Nível de Urgência</span>
                              <div className="mt-1">{getUrgencyBadge(selectedSubmission.aiAnalysis.urgencia)}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Complexidade Técnica</span>
                              <p className="text-sm font-semibold text-purple-300 mt-1">
                                {selectedSubmission.aiAnalysis.nivelComplexidade || 'N1 - Suporte'}
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Categoria Recomendada</span>
                              <p className="text-sm font-semibold text-blue-300 mt-1">
                                {selectedSubmission.aiAnalysis.categoriaSugerida || selectedSubmission.type}
                              </p>
                            </div>
                          </div>

                          {selectedSubmission.aiAnalysis.tags && selectedSubmission.aiAnalysis.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <Tag size={13} className="text-slate-400" />
                              {selectedSubmission.aiAnalysis.tags.map((tag, i) => (
                                <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {selectedSubmission.aiAnalysis.impactoNegocio && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                              <span className="font-semibold text-amber-300 block mb-0.5 flex items-center gap-1">
                                <AlertTriangle size={13} /> Impacto no Negócio / Cliente:
                              </span>
                              <p className="text-amber-100/90">{selectedSubmission.aiAnalysis.impactoNegocio}</p>
                            </div>
                          )}

                          {selectedSubmission.aiAnalysis.acaoRecomendada && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                              <span className="font-semibold text-emerald-300 block mb-0.5 flex items-center gap-1">
                                <CheckCircle size={13} /> Ação Recomendada para a Equipe:
                              </span>
                              <p className="text-emerald-100/90">{selectedSubmission.aiAnalysis.acaoRecomendada}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                          Clique em <span className="text-blue-400 font-medium">⚡ Classificar com IA</span> para obter diagnóstico de criticidade, tags sugeridas e recomendação técnica.
                        </div>
                      )}
                    </div>

                    {/* ✨ RECURSO 2: Gerador Automático de Propostas Comerciais */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/30 via-slate-800/80 to-slate-900 border border-purple-500/30 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              Proposta Técnica Comercial (LEB IA)
                            </h3>
                            <p className="text-xs text-slate-400">Geração automática de parecer técnico e proposta estruturada</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleGenerateProposal}
                            disabled={generatingProposal}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles size={14} className={generatingProposal ? 'animate-spin' : ''} />
                            {generatingProposal ? 'Gerando proposta...' : currentProposal ? 'Regerar Proposta' : '✨ Gerar Proposta com IA'}
                          </button>
                        </div>
                      </div>

                      {generatingProposal && (
                        <div className="p-8 rounded-xl bg-slate-900/80 border border-purple-500/30 text-center space-y-3">
                          <RefreshCw className="animate-spin text-purple-400 mx-auto" size={30} />
                          <p className="text-sm font-semibold text-purple-300">Consultando especialista de IA da LEB TECH...</p>
                          <p className="text-xs text-slate-400">Elaborando diagnóstico, escopo recomendado, cronograma e diretrizes de atendimento.</p>
                        </div>
                      )}

                      {!generatingProposal && currentProposal && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/60 pb-2 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span>Texto da Proposta Comercial:</span>
                              {(() => {
                                const match = currentProposal.match(/(?:Investimento Total Estimado|Total Estimado)[:\* ]+R\$\s*([\d\.,]+)/i);
                                if (match) {
                                  return (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      💰 Total Estimado: R$ {match[1]}
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setIsEditingProposal(!isEditingProposal)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Edit3 size={12} />
                                {isEditingProposal ? 'Visualizar' : 'Editar Valores'}
                              </button>
                              {isEditingProposal && (
                                <button
                                  onClick={handleSaveProposal}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <Save size={12} />
                                  Salvar
                                </button>
                              )}
                              <button
                                onClick={handleCopyProposal}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                {copiedProposal ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                {copiedProposal ? 'Copiado!' : 'Copiar'}
                              </button>
                              <button
                                onClick={handleSendWhatsAppProposal}
                                className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Send size={12} />
                                Enviar no WhatsApp
                              </button>
                            </div>
                          </div>

                          {isEditingProposal ? (
                            <textarea
                              value={currentProposal}
                              onChange={(e) => setCurrentProposal(e.target.value)}
                              rows={14}
                              className="w-full p-4 rounded-xl bg-slate-950 border border-purple-500/40 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-400 leading-relaxed"
                            />
                          ) : (
                            <pre className="p-4 rounded-xl bg-slate-950/90 border border-purple-900/30 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto selection:bg-purple-600/40">
                              {currentProposal}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Alterar Status */}
                    <div className="pt-2">
                      <p className="text-slate-400 text-xs uppercase font-medium tracking-wider mb-2">Alterar Status do Atendimento</p>
                      <div className="flex gap-2">
                        {(['pending', 'viewed', 'responded'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(selectedSubmission.id, selectedSubmission.type, s)}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              selectedSubmission.status === s
                                ? s === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 font-bold'
                                  : s === 'viewed'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 font-bold'
                                  : 'bg-green-500/20 text-green-300 border border-green-500/50 font-bold'
                                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {s === 'pending' ? 'Pendente' : s === 'viewed' ? 'Visualizado' : 'Respondido'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rodapé do Modal */}
                  <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex justify-end">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-all cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'users' && <AdminUsersTab />}
        {activeTab === 'social' && <AdminSocialMediaTab />}
      </main>
    </div>
  );
}