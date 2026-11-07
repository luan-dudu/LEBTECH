interface PrivacyConsentProps {
  id: string;
}

// Checkbox obrigatório nos formulários: o navegador bloqueia o envio até ser marcado.
// Os links abrem em nova aba para o usuário não perder o que já preencheu.
export default function PrivacyConsent({ id }: PrivacyConsentProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-foreground/70 cursor-pointer select-none">
      <input
        type="checkbox"
        id={id}
        name="privacyConsent"
        required
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-blue-500 cursor-pointer"
      />
      <span>
        Li e concordo com a{' '}
        <a href="/privacidade" target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline">
          Política de Privacidade
        </a>{' '}
        e os{' '}
        <a href="/termos" target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline">
          Termos de Uso
        </a>
        , e autorizo o uso dos meus dados para a LEB TECH responder a esta solicitação. *
      </span>
    </label>
  );
}
