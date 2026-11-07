import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';
import { LEGAL } from '@/lib/legal';

const LEGAL_PAGES = [
  { href: '/privacidade', label: 'Política de Privacidade' },
  { href: '/termos', label: 'Termos de Uso' },
  { href: '/cookies', label: 'Política de Cookies' },
];

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} | ${LEGAL.companyName}`;
  }, [title]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-b from-card/50 to-background border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8">
            <ArrowLeft size={20} />
            Voltar ao site
          </Link>
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30">
              <ShieldCheck className="text-blue-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{title}</h1>
              <p className="text-lg text-foreground/70">{subtitle}</p>
              <p className="text-sm text-foreground/50 mt-3">Última atualização: {LEGAL.lastUpdated}</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 mt-8" aria-label="Documentos legais">
            {LEGAL_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  location === page.href
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    : 'border-border text-foreground/60 hover:text-foreground hover:border-foreground/30'
                }`}
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl space-y-10 text-foreground/75 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-3 [&_a]:text-blue-400 [&_a:hover]:text-blue-300 [&_a]:underline-offset-2 [&_a:hover]:underline [&_strong]:text-foreground">
          {children}
        </article>
      </main>

      <Footer />
    </div>
  );
}

export function ControllerContact() {
  return (
    <ul>
      <li>
        <strong>Controlador:</strong> {LEGAL.legalName || LEGAL.companyName}
        {LEGAL.cnpj && <>, CNPJ {LEGAL.cnpj}</>}
      </li>
      <li>
        <strong>Localização:</strong> {LEGAL.address ? `${LEGAL.address} — ` : ''}
        {LEGAL.city}
      </li>
      <li>
        <strong>E-mail para assuntos de privacidade:</strong>{' '}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
      </li>
      <li>
        <strong>WhatsApp:</strong>{' '}
        <a href={LEGAL.whatsappUrl} target="_blank" rel="noopener noreferrer">
          {LEGAL.whatsapp}
        </a>
      </li>
    </ul>
  );
}
