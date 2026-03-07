import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">LT</span>
              </div>
              <span className="text-lg font-bold text-foreground">LEB TECH</span>
            </div>
            <p className="text-foreground/60 text-sm">
              Soluções em tecnologia para impulsionar seu negócio
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#solucoes" className="text-foreground/60 hover:text-blue-400 transition-colors">
                  Assistência Técnica
                </a>
              </li>
              <li>
                <a href="#solucoes" className="text-foreground/60 hover:text-blue-400 transition-colors">
                  Venda de Equipamentos
                </a>
              </li>
              <li>
                <a href="#solucoes" className="text-foreground/60 hover:text-blue-400 transition-colors">
                  Consultoria em TI
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-foreground/60 hover:text-blue-400 transition-colors">
                  Sobre Nós
                </a>
              </li>

              <li>
                <a href="#contato" className="text-foreground/60 hover:text-blue-400 transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-foreground/60">
                <Mail size={16} className="text-blue-400" />
                contato@lebtech.com.br
              </li>
              <li className="flex items-center gap-2 text-foreground/60">
                <Phone size={16} className="text-purple-400" />
                (11) 3000-0000
              </li>
              <li className="flex items-center gap-2 text-foreground/60">
                <MapPin size={16} className="text-blue-400" />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-foreground/60">
            <p>&copy; {currentYear} LEB TECH. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
