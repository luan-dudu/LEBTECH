import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Calendar, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface SocialPlan {
  id: number;
  platform: string;
  objective: string;
  targetAudience: string;
  budget: number;
  startDate: string;
  endDate: string;
  expectedReach: number;
  status: 'planning' | 'active' | 'completed';
  posts: number;
  engagement: number;
}

export default function AdminSocialMediaTab() {
  const [plans, setPlans] = useState<SocialPlan[]>([
    {
      id: 1,
      platform: 'Instagram',
      objective: 'Aumentar seguidores e engajamento',
      targetAudience: 'Empresas de 50-500 funcionários',
      budget: 2000,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      expectedReach: 15000,
      status: 'active',
      posts: 12,
      engagement: 8.5,
    },
    {
      id: 2,
      platform: 'LinkedIn',
      objective: 'Gerar leads B2B',
      targetAudience: 'Diretores de TI e CIOs',
      budget: 3000,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      expectedReach: 25000,
      status: 'active',
      posts: 8,
      engagement: 12.3,
    },
    {
      id: 3,
      platform: 'Facebook',
      objective: 'Conscientização de marca',
      targetAudience: 'Pequenas e médias empresas',
      budget: 1500,
      startDate: '2026-02-01',
      endDate: '2026-02-28',
      expectedReach: 10000,
      status: 'completed',
      posts: 10,
      engagement: 6.2,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    platform: 'Instagram',
    objective: '',
    targetAudience: '',
    budget: '',
    startDate: '',
    endDate: '',
    expectedReach: '',
  });

  const handleAddPlan = () => {
    if (!formData.objective || !formData.targetAudience || !formData.budget) {
      toast.error('Preencha todos os campos!');
      return;
    }

    if (editingId) {
      setPlans(plans.map(p => p.id === editingId ? {
        ...p,
        platform: formData.platform,
        objective: formData.objective,
        targetAudience: formData.targetAudience,
        budget: Number(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        expectedReach: Number(formData.expectedReach),
      } : p));
      toast.success('Plano atualizado com sucesso!');
      setEditingId(null);
    } else {
      const newPlan: SocialPlan = {
        id: Math.max(...plans.map(p => p.id), 0) + 1,
        platform: formData.platform,
        objective: formData.objective,
        targetAudience: formData.targetAudience,
        budget: Number(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        expectedReach: Number(formData.expectedReach),
        status: 'planning',
        posts: 0,
        engagement: 0,
      };
      setPlans([...plans, newPlan]);
      toast.success('Plano criado com sucesso!');
    }

    setFormData({
      platform: 'Instagram',
      objective: '',
      targetAudience: '',
      budget: '',
      startDate: '',
      endDate: '',
      expectedReach: '',
    });
    setShowForm(false);
  };

  const handleDeletePlan = (id: number) => {
    setPlans(plans.filter(p => p.id !== id));
    toast.success('Plano deletado com sucesso!');
  };

  const handleEditPlan = (plan: SocialPlan) => {
    setFormData({
      platform: plan.platform,
      objective: plan.objective,
      targetAudience: plan.targetAudience,
      budget: plan.budget.toString(),
      startDate: plan.startDate,
      endDate: plan.endDate,
      expectedReach: plan.expectedReach.toString(),
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const totalBudget = plans.reduce((sum, p) => sum + p.budget, 0);
  const totalReach = plans.reduce((sum, p) => sum + p.expectedReach, 0);
  const avgEngagement = (plans.reduce((sum, p) => sum + p.engagement, 0) / plans.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Plano de Engajamento em Redes Sociais</h2>
          <p className="text-slate-400 text-sm mt-1">Total: {plans.length} planos ativos</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              platform: 'Instagram',
              objective: '',
              targetAudience: '',
              budget: '',
              startDate: '',
              endDate: '',
              expectedReach: '',
            });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all"
        >
          <Plus size={20} />
          Novo Plano
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Orçamento Total</p>
              <p className="text-3xl font-bold text-white mt-2">R$ {totalBudget.toLocaleString('pt-BR')}</p>
            </div>
            <Target className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Alcance Esperado</p>
              <p className="text-3xl font-bold text-white mt-2">{totalReach.toLocaleString('pt-BR')}</p>
            </div>
            <TrendingUp className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Engajamento Médio</p>
              <p className="text-3xl font-bold text-white mt-2">{avgEngagement}%</p>
            </div>
            <Eye className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Editar Plano' : 'Criar Novo Plano'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="TikTok">TikTok</option>
              <option value="Twitter">Twitter</option>
              <option value="YouTube">YouTube</option>
            </select>
            <input
              type="text"
              placeholder="Objetivo"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Público-alvo"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Orçamento (R$)"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Alcance esperado"
              value={formData.expectedReach}
              onChange={(e) => setFormData({ ...formData, expectedReach: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddPlan}
              className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 transition-all"
            >
              {editingId ? 'Atualizar' : 'Criar'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Plataforma</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Objetivo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Orçamento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Alcance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Engajamento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Ações</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{plan.platform}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{plan.objective}</td>
                  <td className="px-6 py-4 text-sm text-white">R$ {plan.budget.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm text-white">{plan.expectedReach.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm text-green-400 font-semibold">{plan.engagement}%</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                      {plan.status === 'planning' && 'Planejamento'}
                      {plan.status === 'active' && 'Ativo'}
                      {plan.status === 'completed' && 'Concluído'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
