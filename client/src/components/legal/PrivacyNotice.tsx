import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShieldCheck } from 'lucide-react';
import { PRIVACY_NOTICE_KEY } from '@/lib/legal';

// Aviso informativo: o site não usa cookies de rastreamento, então não há
// consentimento a coletar — apenas transparência sobre o armazenamento local.
export default function PrivacyNotice() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(PRIVACY_NOTICE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(PRIVACY_NOTICE_KEY, new Date().toISOString());
    } catch {
      /* navegador sem armazenamento: só esconde nesta visita */
    }
    setVisible(false);
  };

  if (!visible || location.startsWith('/admin')) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de privacidade"
      className="fixed bottom-24 left-4 right-4 sm:bottom-5 sm:right-auto sm:max-w-md z-[55] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-5"
    >
      <div className="flex gap-3">
        <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" size={22} />
        <div className="space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Respeitamos sua privacidade. Este site <strong className="text-foreground">não usa cookies de rastreamento</strong>
            {' '}— guardamos no navegador só o necessário para funcionar. Saiba mais na{' '}
            <Link href="/privacidade" className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline">
              Política de Privacidade
            </Link>{' '}
            e na{' '}
            <Link href="/cookies" className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline">
              Política de Cookies
            </Link>
            .
          </p>
          <button
            onClick={dismiss}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
