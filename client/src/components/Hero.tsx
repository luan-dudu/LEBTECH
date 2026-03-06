import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310419663030699559/UjFYWBBdi8jAWih5h5i7dJ/hero-tech-solutions-oH9Lk8G822ZHH4RzjAGPwg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-background via-background/80 to-transparent" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold border border-blue-500/30">
                ✨ Soluções em Tecnologia
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Desbloqueie o Potencial Tecnológico da Sua Empresa
            </h1>

            <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
              Assistência técnica especializada, venda de equipamentos de ponta e consultoria estratégica para impulsionar seu negócio no mundo digital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg group"
                onClick={() => document.getElementById('solucoes')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Soluções
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg"
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Solicite um Orçamento
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div>
                <p className="text-2xl font-bold text-blue-400">500+</p>
                <p className="text-foreground/60 text-sm">Clientes Satisfeitos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">20+</p>
                <p className="text-foreground/60 text-sm">Anos de Experiência</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">24/7</p>
                <p className="text-foreground/60 text-sm">Suporte Disponível</p>
              </div>
            </div>
          </div>

          {/* Right - Decorative Element */}
          <div className="hidden lg:block relative h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <div className="absolute inset-0 border border-blue-500/30 rounded-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
