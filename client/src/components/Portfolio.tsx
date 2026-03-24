import { useState } from 'react';
import { ChevronLeft, ChevronRight, Award, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  results: Array<{ label: string; value: string }>;
  technologies: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Implementação de Infraestrutura de Data Center',
    category: 'Infraestrutura',
    description: 'Projeto completo de implementação de data center moderno com redundância, monitoramento 24/7 e dashboards de gestão em tempo real.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-1-infrastructure-mNGUTzgKosqRkTVFCrvAWa.webp',
    results: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Redução de Custos', value: '35%' },
      { label: 'Tempo de Resposta', value: '-45%' }
    ],
    technologies: ['VMware', 'Hyper-V', 'Cisco', 'NetApp']
  },
  {
    id: 2,
    title: 'Migração para Nuvem AWS',
    category: 'Cloud',
    description: 'Migração completa de aplicações on-premise para infraestrutura AWS com zero downtime e otimização de custos.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-2-migration-QfpUFXTX4praRj86GTfwiu.webp',
    results: [
      { label: 'Economia Mensal', value: 'R$ 45.000' },
      { label: 'Escalabilidade', value: '+300%' },
      { label: 'Downtime', value: '0 minutos' }
    ],
    technologies: ['AWS', 'EC2', 'RDS', 'S3']
  },
  {
    id: 3,
    title: 'Implementação de Segurança Cibernética',
    category: 'Segurança',
    description: 'Solução completa de segurança com firewall avançado, detecção de ameaças e compliance com LGPD.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-3-security-ZhGtm9bAFehyXDAtKw55rV.webp',
    results: [
      { label: 'Ameaças Bloqueadas', value: '10.500+' },
      { label: 'Conformidade', value: '100%' },
      { label: 'Incidentes', value: '0' }
    ],
    technologies: ['Palo Alto', 'Fortinet', 'Splunk']
  },
  {
    id: 4,
    title: 'Automação de Processos de Negócio',
    category: 'Automação',
    description: 'Implementação de RPA e automação de workflows reduzindo processamento manual em 80%.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-4-automation-iQKVtKfj8id6zpcuKBKAE3.webp',
    results: [
      { label: 'Processos Automatizados', value: '45+' },
      { label: 'Redução de Tempo', value: '80%' },
      { label: 'ROI', value: '250%' }
    ],
    technologies: ['UiPath', 'Blue Prism', 'Python']
  },
  {
    id: 5,
    title: 'Redesenho de Infraestrutura de Rede',
    category: 'Rede',
    description: 'Redesenho completo da infraestrutura de rede com switches de última geração e redundância total.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-5-network-9dV27WhhZjRmUg6rnAtGaX.webp',
    results: [
      { label: 'Velocidade', value: '10 Gbps' },
      { label: 'Latência', value: '<1ms' },
      { label: 'Disponibilidade', value: '99.95%' }
    ],
    technologies: ['Cisco Nexus', 'Arista', 'Juniper']
  }
];

export default function Portfolio() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(projects.length / itemsPerView));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(projects.length / itemsPerView)) % Math.ceil(projects.length / itemsPerView));
  };

  const visibleProjects = projects.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  );

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
            <Award className="text-blue-400" size={18} />
            <span className="text-blue-400 font-semibold">Nossos Projetos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Portfólio de Projetos
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Confira alguns dos projetos de TI que implementamos com sucesso para nossos clientes
          </p>
        </div>

        {/* Projects Carousel */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-600/10">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-500/80 text-white text-xs font-semibold">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-foreground line-clamp-2">{project.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed flex-1">{project.description}</p>

                  {/* Results */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/50">
                    {project.results.map((result, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-blue-400 font-bold text-sm">{result.value}</p>
                        <p className="text-foreground/60 text-xs">{result.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="rounded-full border-border/50 hover:border-blue-500/50 hover:bg-blue-500/10"
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="rounded-full border-border/50 hover:border-blue-500/50 hover:bg-blue-500/10"
              >
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Indicators */}
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(projects.length / itemsPerView) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-8 bg-blue-500'
                      : 'w-2 bg-border/50 hover:bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-12 border-t border-border/50">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Award className="text-blue-400" size={32} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">50+</h3>
            <p className="text-foreground/60">Projetos Concluídos</p>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Users className="text-purple-400" size={32} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">100+</h3>
            <p className="text-foreground/60">Clientes Satisfeitos</p>
          </div>

          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <TrendingUp className="text-blue-400" size={32} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">R$ 50M+</h3>
            <p className="text-foreground/60">Investimento em Projetos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
