import { Link } from 'wouter';
import LegalLayout from '@/components/legal/LegalLayout';
import { LEGAL, PRIVACY_NOTICE_KEY } from '@/lib/legal';

const STORAGE_ITEMS = [
  {
    name: 'theme',
    where: 'Armazenamento local',
    purpose: 'Lembrar a aparência do site (tema claro ou escuro).',
    duration: 'Até você limpar os dados do navegador',
  },
  {
    name: PRIVACY_NOTICE_KEY,
    where: 'Armazenamento local',
    purpose: 'Lembrar que você já viu o aviso de privacidade, para não exibi-lo de novo.',
    duration: 'Até você limpar os dados do navegador',
  },
  {
    name: 'lebtech-ai-chat',
    where: 'Armazenamento de sessão',
    purpose: 'Manter o histórico da conversa com o assistente LEB IA enquanto a aba estiver aberta.',
    duration: 'Apagado ao fechar a aba',
  },
  {
    name: 'lebtech-ai-teaser',
    where: 'Armazenamento de sessão',
    purpose: 'Evitar que o convite do assistente apareça repetidamente.',
    duration: 'Apagado ao fechar a aba',
  },
  {
    name: 'adminToken, adminEmail',
    where: 'Armazenamento local',
    purpose: 'Manter o login da equipe no painel administrativo. Não é usado para visitantes.',
    duration: 'Até sair do painel',
  },
];

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Política de Cookies"
      subtitle="Quais informações este site guarda no seu navegador e por quê."
    >
      <section>
        <h2>1. Resumo</h2>
        <p>
          O site da {LEGAL.companyName} <strong>não usa cookies de publicidade, de rastreamento ou de redes sociais</strong>.
          Guardamos no seu navegador apenas pequenas informações necessárias para o site funcionar, listadas abaixo. Por
          isso, não é preciso aceitar cookies para navegar.
        </p>
      </section>

      <section>
        <h2>2. O que fica guardado no seu navegador</h2>
        <p>
          Em vez de cookies, usamos o armazenamento local (<em>localStorage</em>) e o armazenamento de sessão (
          <em>sessionStorage</em>) do navegador. Essas informações ficam só no seu dispositivo e não são enviadas ao nosso
          servidor automaticamente.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="bg-card/60 text-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Finalidade</th>
                <th className="px-4 py-3 font-semibold">Duração</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {STORAGE_ITEMS.map((item) => (
                <tr key={item.name} className="align-top">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{item.name}</td>
                  <td className="px-4 py-3">{item.where}</td>
                  <td className="px-4 py-3">{item.purpose}</td>
                  <td className="px-4 py-3">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>3. Serviços de terceiros</h2>
        <ul>
          <li>
            <strong>Google Fonts</strong>: as fontes do site são carregadas dos servidores do Google, que recebem o seu
            endereço IP e informações técnicas do navegador. O Google Fonts não grava cookies.
          </li>
          <li>
            <strong>Métricas de audiência</strong>: se ativadas, usamos uma ferramenta de estatísticas que{' '}
            <strong>não usa cookies</strong> e não identifica visitantes individualmente. Ela serve apenas para contar
            acessos e páginas mais vistas.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Como apagar ou bloquear</h2>
        <p>
          Você pode apagar essas informações a qualquer momento nas configurações do seu navegador (opção “limpar dados de
          navegação” ou “dados de sites”). O site continua funcionando, mas pode esquecer preferências como o tema ou o
          histórico do chat.
        </p>
      </section>

      <section>
        <h2>5. Mais informações</h2>
        <p>
          Para saber como tratamos seus dados pessoais e como exercer seus direitos, leia a nossa{' '}
          <Link href="/privacidade">Política de Privacidade</Link> ou escreva para{' '}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
