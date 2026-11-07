import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Gráficos calculados a partir das solicitações reais carregadas no painel.

interface ChartSubmission {
  type: string;
  createdAt: string;
}

interface StatsChartsProps {
  submissions: ChartSubmission[];
  loading?: boolean;
}

// Slot 1 da paleta categórica (modo escuro), validado contra a superfície dos cartões
const SERIES_COLOR = '#3987e5';
const GRID_COLOR = '#334155';
const AXIS_TEXT = '#94a3b8';
const LABEL_TEXT = '#cbd5e1';
const HOVER_BAND = 'rgba(148, 163, 184, 0.08)';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MONTHS_SHOWN = 6;

const SERVICE_TYPES = [
  'Assistência Técnica',
  'Venda de Equipamentos',
  'Consultoria de TI',
  'Projetos de TI',
  'Gestão de TI',
  'Atendimento LEB IA',
  'Contato',
];

// "AAAA-MM" no fuso de Brasília (o banco guarda em UTC)
const monthKeyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
});

function monthKey(date: Date) {
  return monthKeyFormat.format(date).slice(0, 7);
}

function lastMonths(count: number) {
  const [year, month] = monthKey(new Date()).split('-').map(Number);
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1 - (count - 1 - i), 1));
    return {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`,
      label: `${MONTHS[date.getUTCMonth()]}/${String(date.getUTCFullYear()).slice(2)}`,
    };
  });
}

const plural = (n: number) => `${n} ${n === 1 ? 'solicitação' : 'solicitações'}`;

function ChartTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as { label: string; total: number };
  return (
    <div className="rounded-lg border border-slate-600 bg-slate-900/95 px-3 py-2 shadow-xl">
      <p className="text-sm font-semibold text-white">{plural(item.total)}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
        <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: SERIES_COLOR }} />
        {item.label}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  rows,
  dimmed,
  children,
}: {
  title: string;
  subtitle: string;
  rows: { label: string; total: number }[];
  dimmed: boolean;
  children: ReactNode;
}) {
  return (
    <figure className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
      <figcaption className="mb-6">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </figcaption>
      <div className={`transition-opacity ${dimmed ? 'opacity-50' : ''}`}>{children}</div>
      {/* Versão em tabela: os mesmos valores sem depender do gráfico */}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-slate-400 hover:text-slate-200">Ver tabela</summary>
        <table className="mt-3 w-full">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-slate-700/50">
                <td className="py-1.5 text-slate-300">{row.label}</td>
                <td className="py-1.5 text-right text-white tabular-nums">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

const StatsCharts = ({ submissions, loading = false }: StatsChartsProps) => {
  const months = lastMonths(MONTHS_SHOWN);
  const perMonth = new Map(months.map((m) => [m.key, 0]));
  const perService = new Map(SERVICE_TYPES.map((t) => [t, 0]));

  for (const submission of submissions) {
    const date = new Date(submission.createdAt);
    if (!Number.isNaN(date.getTime())) {
      const key = monthKey(date);
      if (perMonth.has(key)) perMonth.set(key, perMonth.get(key)! + 1);
    }
    perService.set(submission.type, (perService.get(submission.type) || 0) + 1);
  }

  const monthlyData = months.map((m) => ({ label: m.label, total: perMonth.get(m.key) || 0 }));
  // Ranking: maior primeiro; empates mantêm a ordem fixa dos serviços
  const serviceData = Array.from(perService, ([label, total]) => ({ label, total })).sort(
    (a, b) => b.total - a.total
  );

  const hasData = submissions.length > 0;

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Estatísticas</h2>
        <p className="text-slate-400 text-sm">Calculadas a partir das solicitações recebidas pelo site e pela LEB IA</p>
      </div>

      {!hasData ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-10 text-center text-slate-400">
          {loading ? 'Carregando dados...' : 'Os gráficos aparecem assim que chegarem as primeiras solicitações.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Solicitações por mês"
            subtitle={`Últimos ${MONTHS_SHOWN} meses, todos os serviços`}
            rows={monthlyData}
            dimmed={loading}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke={GRID_COLOR} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                  tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: HOVER_BAND }} content={<ChartTooltip />} />
                <Bar dataKey="total" name="Solicitações" fill={SERIES_COLOR} radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Solicitações por serviço"
            subtitle="Total por origem, do maior para o menor"
            rows={serviceData}
            dimmed={loading}
          >
            <ResponsiveContainer width="100%" height={serviceData.length * 36 + 8}>
              <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
                <XAxis type="number" hide allowDecimals={false} domain={[0, 'dataMax']} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={160}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                />
                <Tooltip cursor={{ fill: HOVER_BAND }} content={<ChartTooltip />} />
                <Bar dataKey="total" name="Solicitações" fill={SERIES_COLOR} radius={[0, 4, 4, 0]} barSize={20}>
                  <LabelList dataKey="total" position="right" fill={LABEL_TEXT} fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </section>
  );
};

export default StatsCharts;
