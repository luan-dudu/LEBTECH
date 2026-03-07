import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, Package, Lightbulb, ArrowRight } from 'lucide-react';
import TechnicalSupportModal from './TechnicalSupportModal';
import EquipmentSalesModal from './EquipmentSalesModal';
import ConsultingModal from './ConsultingModal';

export default function Solutions() {
  const [openModal, setOpenModal] = useState<'technical' | 'equipment' | 'consulting' | null>(null);

  const solutions = [
    {
      id: 1,
      title: 'Assistência Técnica',
      description: 'Suporte especializado 24/7 para manutenção, diagnóstico e resolução de problemas em sua infraestrutura de TI.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/technical-support-2iUhqb4CRqqUqRPUcCd9zA.webp',
      icon: Wrench,
      features: ['Suporte 24/7', 'Resposta Rápida', 'Técnicos Certificados'],
      modalKey: 'technical' as const,
    },
    {
      id: 2,
      title: 'Venda de Equipamentos',
      description: 'Computadores, servidores, periféricos e equipamentos de rede de marcas líderes com garantia e suporte.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/equipment-sales-FpGkey2cqr98dsWH5Az8Nr.webp',
      icon: Package,
      features: ['Marcas Premium', 'Melhor Preço', 'Entrega Rápida'],
      modalKey: 'equipment' as const,
    },
    {
      id: 3,
      title: 'Consultoria em TI',
      description: 'Estratégia digital, otimização de processos e implementação de soluções tecnológicas alinhadas ao seu negócio.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/consulting-services-P3viMfhQo5ZoYms7h7R4RN.webp',
      icon: Lightbulb,
      features: ['Análise Completa', 'Planejamento Estratégico', 'Implementação'],
      modalKey: 'consulting' as const,
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

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.id}
                className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-600/10">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Icon className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{solution.title}</h3>
                  </div>

                  <p className="text-foreground/70 leading-relaxed">{solution.description}</p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold mt-4 group/btn"
                    onClick={() => setOpenModal(solution.modalKey)}
                  >
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                  </Button>
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
    </section>
  );
}
