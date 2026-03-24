import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsCharts = () => {
  // Dados de solicitações por mês
  const requestsData = [
    { month: 'Jan', assistencia: 45, equipamentos: 32, consultoria: 28, projetos: 15, gestao: 22 },
    { month: 'Fev', assistencia: 52, equipamentos: 38, consultoria: 35, projetos: 22, gestao: 28 },
    { month: 'Mar', assistencia: 68, equipamentos: 45, consultoria: 42, projetos: 35, gestao: 38 },
  ];

  // Dados de clientes por serviço
  const serviceData = [
    { name: 'Assistência Técnica', value: 145, color: '#3b82f6' },
    { name: 'Venda de Equipamentos', value: 115, color: '#8b5cf6' },
    { name: 'Consultoria de TI', value: 105, color: '#06b6d4' },
    { name: 'Projetos de TI', value: 72, color: '#10b981' },
    { name: 'Gestão de TI', value: 88, color: '#f59e0b' },
  ];

  // Dados de satisfação por mês
  const satisfactionData = [
    { month: 'Jan', satisfacao: 85 },
    { month: 'Fev', satisfacao: 88 },
    { month: 'Mar', satisfacao: 92 },
  ];

  // Dados de crescimento
  const growthData = [
    { period: 'Q1 2025', clientes: 250, receita: 125000 },
    { period: 'Q2 2025', clientes: 380, receita: 189000 },
    { period: 'Q3 2025', clientes: 520, receita: 275000 },
    { period: 'Q4 2025', clientes: 680, receita: 385000 },
    { period: 'Q1 2026', clientes: 850, receita: 520000 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Estatísticas e Análises
          </h2>
          <p className="text-slate-400 text-lg">
            Acompanhe o desempenho e crescimento da LEB TECH
          </p>
        </div>

        {/* Grid de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico 1: Solicitações por Mês */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Solicitações por Mês</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="assistencia" stackId="a" fill="#3b82f6" />
                <Bar dataKey="equipamentos" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="consultoria" stackId="a" fill="#06b6d4" />
                <Bar dataKey="projetos" stackId="a" fill="#10b981" />
                <Bar dataKey="gestao" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 2: Distribuição de Clientes por Serviço */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Clientes por Serviço</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 3: Satisfação do Cliente */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Satisfação do Cliente (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="satisfacao" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Taxa de Satisfação"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 4: Crescimento de Clientes e Receita */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Crescimento Anual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis stroke="#94a3b8" dataKey="period" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value) => {
                    if (typeof value === 'number' && value > 1000) {
                      return `R$ ${(value / 1000).toFixed(0)}k`;
                    }
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="clientes" fill="#3b82f6" name="Clientes" />
                <Bar dataKey="receita" fill="#10b981" name="Receita (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Total de Clientes</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">850+</p>
            <p className="text-slate-500 text-xs mt-2">↑ 25% vs mês anterior</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Receita Total</p>
            <p className="text-3xl font-bold text-purple-400 mt-2">R$ 520k</p>
            <p className="text-slate-500 text-xs mt-2">↑ 35% vs trimestre anterior</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Taxa de Retenção</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">94%</p>
            <p className="text-slate-500 text-xs mt-2">↑ 2% vs mês anterior</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Satisfação Média</p>
            <p className="text-3xl font-bold text-green-400 mt-2">92%</p>
            <p className="text-slate-500 text-xs mt-2">↑ 4% vs mês anterior</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCharts;
