export default function Clients() {
  const clients = [
    { name: 'TechCorp', logo: '🏢' },
    { name: 'InnovateLabs', logo: '🔬' },
    { name: 'DigitalFirst', logo: '💻' },
    { name: 'CloudSystems', logo: '☁️' },
    { name: 'DataVision', logo: '📊' },
    { name: 'SecureNet', logo: '🔒' },
    { name: 'FutureWorks', logo: '🚀' },
    { name: 'SmartBiz', logo: '📱' },
  ];

  return (
    <section id="clientes" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Alguns dos Nossos Clientes
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Empresas de diversos segmentos confiam em nossas soluções para impulsionar seus negócios
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              <span className="text-4xl group-hover:scale-125 transition-transform duration-300">
                {client.logo}
              </span>
              <p className="text-center font-semibold text-foreground/80 text-sm">
                {client.name}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <div className="text-center space-y-2">
            <p className="text-4xl md:text-5xl font-bold text-blue-400">500+</p>
            <p className="text-foreground/70">Clientes Atendidos</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl md:text-5xl font-bold text-purple-400">99.9%</p>
            <p className="text-foreground/70">Taxa de Satisfação</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl md:text-5xl font-bold text-blue-400">20+</p>
            <p className="text-foreground/70">Anos de Experiência</p>
          </div>
        </div>
      </div>
    </section>
  );
}
