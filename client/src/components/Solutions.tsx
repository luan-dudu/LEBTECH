import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Wrench, Package, Lightbulb, Cog, BarChart3, ArrowRight } from 'lucide-react';
import TechnicalSupportModal from './TechnicalSupportModal';
import EquipmentSalesModal from './EquipmentSalesModal';
import ConsultingModal from './ConsultingModal';
import ProjectsModal from './ProjectsModal';
import ManagementModal from './ManagementModal';


export default function Solutions() {
  const [, setLocation] = useLocation();
  const [openModal, setOpenModal] = useState<'technical' | 'equipment' | 'consulting' | 'projects' | 'management' | null>(null);

  const solutions = [
    {
      id: 1,
      title: 'Assistência Técnica',
      description: 'Suporte especializado 24/7 para manutenção, diagnóstico e resolução de problemas em sua infraestrutura de TI.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/technical-support-2iUhqb4CRqqUqRPUcCd9zA.webp',
      icon: Wrench,
      path: '/servicos/assistencia-tecnica',
      modalKey: 'technical' as const,
    },
    {
      id: 2,
      title: 'Venda de Equipamentos',
      description: 'Computadores, servidores, periféricos e equipamentos de rede de marcas líderes com garantia e suporte.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/equipment-sales-FpGkey2cqr98dsWH5Az8Nr.webp',
      icon: Package,
      path: '/servicos/venda-equipamentos',
      modalKey: 'equipment' as const,
    },
    {
      id: 3,
      title: 'Consultoria de TI',
      description: 'Estratégia digital, otimização de processos e implementação de soluções tecnológicas alinhadas ao seu negócio.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/consulting-services-P3viMfhQo5ZoYms7h7R4RN.webp',
      icon: Lightbulb,
      path: '/servicos/consultoria-ti',
      modalKey: 'consulting' as const,
    },
    {
      id: 4,
      title: 'Projetos de TI',
      description: 'Desenvolvimento e implementação de projetos tecnológicos customizados para sua empresa.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/tech-background-pattern-nbMFWsLn4cp8LrSB4sYcZv.webp',
      icon: Cog,
      path: '/servicos/projetos-ti',
      modalKey: 'projects' as const,
    },
    {
      id: 5,
      title: 'Gestão de TI',
      description: 'Monitoramento, gestão e suporte contínuo de TI com service desk e help desk para sua empresa.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/hero-tech-solutions-oH9Lk8G822ZHH4RzjAGPwg.webp',
      icon: BarChart3,
      path: '/servicos/gestao-ti',
      modalKey: 'management' as const,
    },
  ];

  return (
    <section id="solucoes" className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Nossas Soluções
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Oferecemos serviços completos de tecnologia para transformar e potencializar seu negócio
          </p>
        </div>

        {/* Solutions Grid - 5 columns responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.id}
                className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-600/10">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Icon className="text-blue-400" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{solution.title}</h3>
                  </div>

                  <p className="text-foreground/70 leading-relaxed text-sm flex-1">{solution.description}</p>

                  {/* Buttons */}
                  <div className="space-y-2 mt-3">
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-sm py-2"
                      onClick={() => setLocation(solution.path)}
                    >
                      Conhecer
                    </Button>
                    {solution.modalKey && (
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-sm py-2"
                        onClick={() => setOpenModal(solution.modalKey as 'technical' | 'equipment' | 'consulting')}
                      >
                        Solicitar Orçamento
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-12 text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">
            Pronto para Transformar Sua Infraestrutura?
          </h3>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Entre em contato conosco hoje mesmo e descubra como podemos ajudar seu negócio a crescer com tecnologia
          </p>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg"
            onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Fale com Nossos Especialistas
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

    </section>
  );
}
