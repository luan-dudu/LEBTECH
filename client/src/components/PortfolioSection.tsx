import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  metrics: {
    label: string;
    value: string;
  }[];
  technologies: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Migração para Cloud',
    category: 'Infraestrutura',
    description: 'Migração completa de infraestrutura on-premises para cloud, com zero downtime e otimização de custos.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-1-cloud-migration-KD3354kCajts8uHpyiMPWk.webp',
    metrics: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Economia', value: '40%' },
      { label: 'Escalabilidade', value: 'Automática' }
    ],
    technologies: ['AWS', 'Kubernetes', 'Docker', 'Terraform']
  },
  {
    id: 2,
    title: 'Auditoria de Segurança',
    category: 'Segurança',
    description: 'Auditoria completa de segurança e implementação de conformidade com LGPD, ISO 27001 e PCI-DSS.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-2-security-audit-EKti7T9f7PvoHeQiE8txZG.webp',
    metrics: [
      { label: 'Vulnerabilidades', value: '0' },
      { label: 'Conformidade', value: '100%' },
      { label: 'Tempo', value: '3 meses' }
    ],
    technologies: ['Nessus', 'Qualys', 'Burp Suite', 'SIEM']
  },
  {
    id: 3,
    title: 'Upgrade de Infraestrutura',
    category: 'Rede',
    description: 'Upgrade completo de infraestrutura de rede com implementação de redundância e failover automático.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-3-network-infrastructure-VkhrHGHWKaSn3tk8PkV9mc.webp',
    metrics: [
      { label: 'Latência', value: '2ms' },
      { label: 'Bandwidth', value: '1 Gbps' },
      { label: 'Disponibilidade', value: '99.99%' }
    ],
    technologies: ['Cisco', 'Juniper', 'BGP', 'MPLS']
  },
  {
    id: 4,
    title: 'Automação de Processos',
    category: 'Automação',
    description: 'Implementação de automação de processos IT com redução de 80% em tarefas manuais e aumento de eficiência.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-4-automation-HNGX32yGZZbXGWLDTkxzyS.webp',
    metrics: [
      { label: 'Redução Manual', value: '80%' },
      { label: 'Eficiência', value: '+65%' },
      { label: 'ROI', value: '6 meses' }
    ],
    technologies: ['Ansible', 'Python', 'Jenkins', 'GitLab']
  },
  {
    id: 5,
    title: 'Solução de Disaster Recovery',
    category: 'Backup',
    description: 'Implementação de solução completa de disaster recovery com RTO < 1 hora e RPO < 15 minutos.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/portfolio-project-5-disaster-recovery-VaSMc5Yc3YPmchz9qFZNvs.webp',
    metrics: [
      { label: 'RTO', value: '< 1 hora' },
      { label: 'RPO', value: '< 15 min' },
      { label: 'Cobertura', value: '100%' }
    ],
    technologies: ['Veeam', 'NetApp', 'AWS', 'Azure']
  }
];

export default function PortfolioSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const currentProject = projects[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Portfólio de Projetos
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Conheça alguns dos projetos de TI que realizamos com sucesso para nossos clientes
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
            {/* Project Image */}
            <div className="relative">
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="rounded-2xl w-full h-80 object-cover border border-blue-500/30"
              />
              <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm font-semibold">{currentProject.category}</span>
              </div>
            </div>

            {/* Project Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{currentProject.title}</h3>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  {currentProject.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {currentProject.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-card/50 border border-border/50 rounded-lg p-4 text-center">
                    <p className="text-foreground/60 text-sm mb-1">{metric.label}</p>
                    <p className="text-blue-400 font-bold text-lg">{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div>
                <p className="text-foreground/60 text-sm mb-3">Tecnologias utilizadas:</p>
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="icon"
              className="border-blue-500/30 hover:bg-blue-500/10"
            >
              <ChevronLeft className="text-blue-400" size={24} />
            </Button>

            {/* Indicators */}
            <div className="flex gap-2">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-blue-500 w-8'
                      : 'bg-blue-500/30 w-2 hover:bg-blue-500/50'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="border-blue-500/30 hover:bg-blue-500/10"
            >
              <ChevronRight className="text-blue-400" size={24} />
            </Button>
          </div>

          {/* Project Counter */}
          <div className="text-center mt-8 text-foreground/60">
            Projeto {currentIndex + 1} de {projects.length}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-border/30">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">50+</p>
            <p className="text-foreground/70">Projetos Realizados</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">100+</p>
            <p className="text-foreground/70">Clientes Satisfeitos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">R$ 50M+</p>
            <p className="text-foreground/70">Investimento em Projetos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
