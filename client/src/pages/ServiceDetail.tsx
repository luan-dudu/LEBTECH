import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, Users, Zap, BarChart3 } from 'lucide-react';
import TechnicalSupportModal from '@/components/TechnicalSupportModal';
import EquipmentSalesModal from '@/components/EquipmentSalesModal';
import ConsultingModal from '@/components/ConsultingModal';
import ProjectsModal from '@/components/ProjectsModal';
import ManagementModal from '@/components/ManagementModal';

interface ServiceInfo {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  benefits: string[];
  features: Array<{ icon: React.ReactNode; title: string; description: string }>;
  process: Array<{ step: number; title: string; description: string }>;
  cta: string;
}

const servicesData: Record<string, ServiceInfo> = {
  'assistencia-tecnica': {
    title: 'Assistência Técnica',
    subtitle: 'Suporte especializado 24/7 para sua infraestrutura de TI',
    description: 'Oferecemos assistência técnica completa e especializada para manutenção, diagnóstico e resolução rápida de problemas em sua infraestrutura de TI. Nossa equipe de técnicos certificados está disponível 24/7 para garantir a continuidade dos seus negócios.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/technical-support-2iUhqb4CRqqUqRPUcCd9zA.webp',
    benefits: [
      'Suporte 24/7 com resposta rápida',
      'Técnicos certificados e experientes',
      'Diagnóstico completo de problemas',
      'Manutenção preventiva e corretiva',
      'Relatórios detalhados de atendimento',
      'Garantia de satisfação do cliente'
    ],
    features: [
      {
        icon: <Clock className="text-blue-400" size={24} />,
        title: 'Resposta Rápida',
        description: 'Atendimento imediato para problemas críticos'
      },
      {
        icon: <Users className="text-purple-400" size={24} />,
        title: 'Equipe Especializada',
        description: 'Técnicos certificados em diversas plataformas'
      },
      {
        icon: <Zap className="text-blue-400" size={24} />,
        title: 'Eficiência',
        description: 'Resolução rápida e eficaz de problemas'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Abertura do Chamado',
        description: 'Você relata o problema através de nossa plataforma ou por telefone'
      },
      {
        step: 2,
        title: 'Diagnóstico',
        description: 'Nossa equipe analisa e diagnostica o problema'
      },
      {
        step: 3,
        title: 'Resolução',
        description: 'Implementamos a solução de forma rápida e eficiente'
      },
      {
        step: 4,
        title: 'Acompanhamento',
        description: 'Garantimos que o problema foi totalmente resolvido'
      }
    ],
    cta: 'Solicitar Assistência Técnica'
  },
  'venda-equipamentos': {
    title: 'Venda de Equipamentos',
    subtitle: 'Equipamentos de TI de qualidade com melhor preço',
    description: 'Comercializamos computadores, servidores, periféricos e equipamentos de rede de marcas líderes do mercado. Oferecemos soluções customizadas com garantia completa e suporte pós-venda.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/equipment-sales-FpGkey2cqr98dsWH5Az8Nr.webp',
    benefits: [
      'Marcas premium e confiáveis',
      'Melhor relação custo-benefício',
      'Entrega rápida',
      'Garantia estendida',
      'Suporte técnico pós-venda',
      'Configuração e instalação'
    ],
    features: [
      {
        icon: <CheckCircle className="text-blue-400" size={24} />,
        title: 'Qualidade Garantida',
        description: 'Equipamentos de marcas reconhecidas'
      },
      {
        icon: <Zap className="text-purple-400" size={24} />,
        title: 'Entrega Rápida',
        description: 'Prazo de entrega otimizado'
      },
      {
        icon: <Users className="text-blue-400" size={24} />,
        title: 'Suporte Completo',
        description: 'Assistência antes e após a compra'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Consulta',
        description: 'Discutimos suas necessidades e orçamento'
      },
      {
        step: 2,
        title: 'Proposta',
        description: 'Apresentamos as melhores opções de equipamentos'
      },
      {
        step: 3,
        title: 'Entrega',
        description: 'Entregamos os equipamentos no prazo acordado'
      },
      {
        step: 4,
        title: 'Instalação',
        description: 'Configuramos e instalamos os equipamentos'
      }
    ],
    cta: 'Solicitar Orçamento'
  },
  'consultoria-ti': {
    title: 'Consultoria de TI',
    subtitle: 'Estratégia e otimização tecnológica para seu negócio',
    description: 'Oferecemos consultoria especializada em TI para empresas que desejam otimizar sua infraestrutura, implementar novas soluções e alinhar a tecnologia com seus objetivos de negócio.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/consulting-services-P3viMfhQo5ZoYms7h7R4RN.webp',
    benefits: [
      'Análise completa da infraestrutura',
      'Planejamento estratégico de TI',
      'Otimização de custos',
      'Implementação de melhores práticas',
      'Segurança da informação',
      'Transformação digital'
    ],
    features: [
      {
        icon: <Lightbulb className="text-blue-400" size={24} />,
        title: 'Estratégia',
        description: 'Planejamento alinhado com seus objetivos'
      },
      {
        icon: <Zap className="text-purple-400" size={24} />,
        title: 'Implementação',
        description: 'Execução eficiente das soluções propostas'
      },
      {
        icon: <CheckCircle className="text-blue-400" size={24} />,
        title: 'Resultados',
        description: 'Métricas e acompanhamento de ROI'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Diagnóstico',
        description: 'Análise profunda da situação atual'
      },
      {
        step: 2,
        title: 'Planejamento',
        description: 'Desenvolvimento de estratégia customizada'
      },
      {
        step: 3,
        title: 'Implementação',
        description: 'Execução do plano com acompanhamento'
      },
      {
        step: 4,
        title: 'Otimização',
        description: 'Ajustes e melhorias contínuas'
      }
    ],
    cta: 'Agendar Consultoria'
  },
  'projetos-ti': {
    title: 'Projetos de TI',
    subtitle: 'Desenvolvimento e implementação de soluções customizadas',
    description: 'Desenvolvemos e implementamos projetos tecnológicos customizados que atendem às necessidades específicas da sua empresa, desde infraestrutura até aplicações de negócio.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/tech-background-pattern-nbMFWsLn4cp8LrSB4sYcZv.webp',
    benefits: [
      'Soluções customizadas',
      'Equipe experiente',
      'Metodologia ágil',
      'Entrega no prazo',
      'Documentação completa',
      'Suporte pós-implementação'
    ],
    features: [
      {
        icon: <Cog className="text-blue-400" size={24} />,
        title: 'Desenvolvimento',
        description: 'Projetos com tecnologia de ponta'
      },
      {
        icon: <Users className="text-purple-400" size={24} />,
        title: 'Colaboração',
        description: 'Trabalho próximo com sua equipe'
      },
      {
        icon: <CheckCircle className="text-blue-400" size={24} />,
        title: 'Qualidade',
        description: 'Testes rigorosos e garantia'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Levantamento',
        description: 'Coleta de requisitos e escopo do projeto'
      },
      {
        step: 2,
        title: 'Design',
        description: 'Arquitetura e design da solução'
      },
      {
        step: 3,
        title: 'Desenvolvimento',
        description: 'Implementação com qualidade'
      },
      {
        step: 4,
        title: 'Deployment',
        description: 'Lançamento e treinamento'
      }
    ],
    cta: 'Iniciar Projeto'
  },
  'gestao-ti': {
    title: 'Gestão de TI',
    subtitle: 'Monitoramento e gestão contínua de sua infraestrutura',
    description: 'Oferecemos serviços completos de gestão de TI com monitoramento 24/7, service desk, help desk e suporte contínuo para garantir a disponibilidade e eficiência de seus sistemas.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/hero-tech-solutions-oH9Lk8G822ZHH4RzjAGPwg.webp',
    benefits: [
      'Monitoramento 24/7',
      'Service desk especializado',
      'Help desk para usuários',
      'Relatórios de performance',
      'Planejamento de capacidade',
      'Gestão de mudanças'
    ],
    features: [
      {
        icon: <BarChart3 className="text-blue-400" size={24} />,
        title: 'Monitoramento',
        description: 'Acompanhamento contínuo dos sistemas'
      },
      {
        icon: <Users className="text-purple-400" size={24} />,
        title: 'Suporte',
        description: 'Equipe dedicada ao seu atendimento'
      },
      {
        icon: <Zap className="text-blue-400" size={24} />,
        title: 'Proatividade',
        description: 'Prevenção de problemas antes que ocorram'
      }
    ],
    process: [
      {
        step: 1,
        title: 'Avaliação',
        description: 'Análise da infraestrutura atual'
      },
      {
        step: 2,
        title: 'Planejamento',
        description: 'Definição de SLAs e métricas'
      },
      {
        step: 3,
        title: 'Implementação',
        description: 'Implantação do modelo de gestão'
      },
      {
        step: 4,
        title: 'Acompanhamento',
        description: 'Monitoramento e otimização contínua'
      }
    ],
    cta: 'Contratar Gestão'
  }
};

// Import icons
import { Lightbulb, Cog } from 'lucide-react';

export default function ServiceDetail() {
  const [location, setLocation] = useLocation();
  const [openModal, setOpenModal] = useState<'technical' | 'equipment' | 'consulting' | 'projects' | 'management' | null>(null);
  const serviceKey = location.split('/').pop() || '';
  const service = servicesData[serviceKey];

  const getModalForService = (service: string) => {
    switch (service) {
      case 'assistencia-tecnica':
        return 'technical';
      case 'venda-equipamentos':
        return 'equipment';
      case 'consultoria-ti':
        return 'consulting';
      case 'projetos-ti':
        return 'projects';
      case 'gestao-ti':
        return 'management';
      default:
        return null;
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Serviço não encontrado</h1>
          <Button onClick={() => setLocation('/')}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-card/50 to-background border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="text-5xl font-bold text-foreground mb-4">{service.title}</h1>
          <p className="text-xl text-foreground/70">{service.subtitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Image and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <img
              src={service.image}
              alt={service.title}
              className="rounded-2xl w-full h-96 object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="text-lg text-foreground/70 leading-relaxed">{service.description}</p>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg"
              onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {service.cta}
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-foreground mb-12">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                  <p className="text-foreground/80">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-foreground mb-12">Características Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.features.map((feature, idx) => (
              <div key={idx} className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-foreground mb-12">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card/50 border border-border/50 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
                {idx < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12 text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">
            Pronto para começar?
          </h3>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa
          </p>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg"
            onClick={() => setOpenModal(getModalForService(serviceKey) as any)}
          >
            {service.cta}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <TechnicalSupportModal
        isOpen={openModal === 'technical'}
        onClose={() => setOpenModal(null)}
      />
      <EquipmentSalesModal
        isOpen={openModal === 'equipment'}
        onClose={() => setOpenModal(null)}
      />
      <ConsultingModal
        isOpen={openModal === 'consulting'}
        onClose={() => setOpenModal(null)}
      />
      <ProjectsModal
        isOpen={openModal === 'projects'}
        onClose={() => setOpenModal(null)}
      />
      <ManagementModal
        isOpen={openModal === 'management'}
        onClose={() => setOpenModal(null)}
      />
    </div>
  );
}
