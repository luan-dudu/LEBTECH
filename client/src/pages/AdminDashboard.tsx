import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { LogOut, Users, FileText, CheckCircle, Clock, AlertCircle, BarChart3, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

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
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [adminEmail, setAdminEmail] = useState('');
  const [submissions, setSubmissions] = useState<FormSubmission[]>([
    {
      id: 1,
      type: 'Assistência Técnica',
      name: 'João Silva',
      email: 'joao@empresa.com',
      phone: '(11) 98765-4321',
      company: 'Empresa XYZ',
      status: 'pending',
      createdAt: '2026-03-24 14:30',
      description: 'Problema com servidor de rede',
    },
    {
      id: 2,
      type: 'Venda de Equipamentos',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
      phone: '(11) 97654-3210',
      company: 'Empresa ABC',
      status: 'viewed',
      createdAt: '2026-03-24 13:15',
      description: 'Orçamento para 10 computadores',
    },
    {
      id: 3,
      type: 'Consultoria de TI',
      name: 'Carlos Oliveira',
      email: 'carlos@empresa.com',
      phone: '(11) 96543-2109',
      company: 'Empresa DEF',
      status: 'responded',
      createdAt: '2026-03-24 11:45',
      description: 'Consultoria em segurança da informação',
    },
    {
      id: 4,
      type: 'Projetos de TI',
      name: 'Ana Costa',
      email: 'ana@empresa.com',
      phone: '(11) 95432-1098',
      company: 'Empresa GHI',
      status: 'pending',
      createdAt: '2026-03-24 10:20',
      description: 'Desenvolvimento de sistema de gestão',
    },
    {
      id: 5,
      type: 'Gestão de TI',
      name: 'Pedro Alves',
      email: 'pedro@empresa.com',
      phone: '(11) 94321-0987',
      company: 'Empresa JKL',
      status: 'viewed',
      createdAt: '2026-03-24 09:00',
      description: 'Gestão completa de infraestrutura',
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');

    if (!token) {
      setLocation('/admin/login');
      return;
    }

    setAdminEmail(email || '');
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    toast.success('Logout realizado com sucesso!');
    setLocation('/');
  };

  const handleStatusChange = (id: number, newStatus: 'pending' | 'viewed' | 'responded') => {
    setSubmissions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
    toast.success('Status atualizado com sucesso!');
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'viewed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'responded':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'viewed':
        return <Eye size={16} />;
      case 'responded':
        return <CheckCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Painel de Administração</h1>
            <p className="text-slate-400 text-sm">Logado como: {adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
        </div>

        {/* Filters */}
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
                <option value="Assistência Técnica">Assistência Técnica</option>
                <option value="Venda de Equipamentos">Venda de Equipamentos</option>
                <option value="Consultoria de TI">Consultoria de TI</option>
                <option value="Projetos de TI">Projetos de TI</option>
                <option value="Gestão de TI">Gestão de TI</option>
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

        {/* Submissions Table */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Serviço</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">{submission.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{submission.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{submission.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          {submission.status === 'pending' && 'Pendente'}
                          {submission.status === 'viewed' && 'Visualizado'}
                          {submission.status === 'responded' && 'Respondido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{submission.createdAt}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowDetails(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Nenhuma solicitação encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetails && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 flex items-center justify-between p-6">
              <h2 className="text-2xl font-bold text-white">Detalhes da Solicitação</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Nome</p>
                  <p className="text-white font-semibold mt-1">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-semibold mt-1">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Telefone</p>
                  <p className="text-white font-semibold mt-1">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Empresa</p>
                  <p className="text-white font-semibold mt-1">{selectedSubmission.company}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Tipo de Serviço</p>
                  <p className="text-white font-semibold mt-1">{selectedSubmission.type}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Data de Envio</p>
                  <p className="text-white font-semibold mt-1">{selectedSubmission.createdAt}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-slate-400 text-sm">Descrição</p>
                <p className="text-white mt-2 bg-slate-700/30 p-4 rounded-lg">{selectedSubmission.description}</p>
              </div>

              {/* Status Change */}
              <div>
                <p className="text-slate-400 text-sm mb-3">Alterar Status</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'pending')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all ${selectedSubmission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'}`}
                  >
                    Pendente
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'viewed')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all ${selectedSubmission.status === 'viewed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'}`}
                  >
                    Visualizado
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, 'responded')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all ${selectedSubmission.status === 'responded' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700'}`}
                  >
                    Respondido
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-4 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-white transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
