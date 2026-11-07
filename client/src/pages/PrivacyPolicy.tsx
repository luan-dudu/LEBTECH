import { Link } from 'wouter';
import LegalLayout, { ControllerContact } from '@/components/legal/LegalLayout';
import { LEGAL } from '@/lib/legal';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      subtitle="Como a LEB TECH coleta, usa e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)."
    >
      <section>
        <h2>1. Quem somos</h2>
        <p>
          A {LEGAL.companyName} presta serviços de assistência técnica, venda de equipamentos, consultoria, projetos e
          gestão de TI. Para os fins da LGPD, somos a <strong>controladora</strong> dos dados pessoais tratados por meio
          deste site, ou seja, somos nós que decidimos como e para que eles são usados.
        </p>
        <ControllerContact />
      </section>

      <section>
        <h2>2. Quais dados coletamos</h2>
        <h3>Dados que você nos informa</h3>
        <ul>
          <li>
            <strong>Formulários de solicitação e contato</strong> (assistência técnica, venda de equipamentos, consultoria,
            projetos de TI, gestão de TI e contato): nome, e-mail, telefone, empresa e as informações que você descreve
            sobre a sua necessidade, como tipo de problema, urgência, quantidade, orçamento e prazo.
          </li>
          <li>
            <strong>Assistente virtual LEB IA</strong>: as mensagens que você escreve na conversa e, quando o atendimento é
            encaminhado a um técnico, nome, telefone/WhatsApp, e-mail, empresa, cidade/bairro e o resumo do problema.
          </li>
        </ul>
        <p>
          Pedimos que você <strong>não informe dados pessoais sensíveis</strong> (como saúde, religião, biometria ou
          opinião política), nem senhas ou dados bancários, nos formulários ou no chat. Eles não são necessários para o
          atendimento.
        </p>
        <h3>Dados coletados automaticamente</h3>
        <ul>
          <li>
            <strong>Endereço IP</strong>: usado de forma temporária, apenas em memória, para limitar o volume de mensagens
            ao assistente virtual e proteger o serviço contra abusos. Não é gravado no nosso banco de dados.
          </li>
          <li>
            <strong>Registros técnicos de acesso</strong> mantidos pelo nosso provedor de hospedagem, como data, hora, IP e
            página acessada, conforme exige o Marco Civil da Internet (Lei nº 12.965/2014).
          </li>
          <li>
            <strong>Armazenamento local do navegador</strong>: detalhado na nossa{' '}
            <Link href="/cookies">Política de Cookies</Link>. Este site não usa cookies de publicidade ou de rastreamento.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Para que usamos seus dados e com qual base legal</h2>
        <ul>
          <li>
            <strong>Responder às suas solicitações, preparar orçamentos e propostas e prestar o serviço contratado</strong>{' '}
            — base legal: execução de contrato ou de procedimentos preliminares a pedido do titular (art. 7º, V, da LGPD).
          </li>
          <li>
            <strong>Fazer a triagem inicial do atendimento pelo assistente virtual e encaminhar o caso a um técnico</strong>{' '}
            — base legal: procedimentos preliminares a pedido do titular (art. 7º, V).
          </li>
          <li>
            <strong>Organizar e priorizar chamados internamente</strong>, inclusive com o apoio de ferramentas de
            inteligência artificial que sugerem classificação e rascunhos de proposta — base legal: legítimo interesse
            (art. 7º, IX). Toda proposta e todo atendimento são revisados por uma pessoa da nossa equipe antes de chegar a
            você.
          </li>
          <li>
            <strong>Garantir a segurança do site e prevenir fraudes e abusos</strong> — base legal: legítimo interesse
            (art. 7º, IX).
          </li>
          <li>
            <strong>Cumprir obrigações legais e regulatórias</strong>, como guarda de registros de acesso e de documentos
            fiscais — base legal: cumprimento de obrigação legal (art. 7º, II).
          </li>
          <li>
            <strong>Exercer direitos em processos judiciais, administrativos ou arbitrais</strong> — base legal: art. 7º,
            VI.
          </li>
        </ul>
        <p>Não vendemos seus dados e não os usamos para publicidade de terceiros.</p>
      </section>

      <section>
        <h2>4. Uso de inteligência artificial</h2>
        <p>
          O assistente virtual LEB IA e as ferramentas de apoio do nosso painel interno usam o serviço <strong>Google
          Gemini</strong> para gerar respostas, organizar a triagem e sugerir propostas. Para isso, o conteúdo da conversa
          ou da solicitação é enviado ao Google, que atua como <strong>operador</strong> e processa os dados em nosso
          nome.
        </p>
        <p>
          As respostas do assistente são automáticas e podem conter imprecisões. Nenhuma decisão que afete os seus
          interesses é tomada só pela IA: um técnico humano confirma todo atendimento. Se quiser, você pode falar
          diretamente com a nossa equipe pelo WhatsApp, sem usar o assistente.
        </p>
      </section>

      <section>
        <h2>5. Com quem compartilhamos</h2>
        <p>Compartilhamos dados pessoais apenas com quem é necessário para operar o site e prestar o serviço:</p>
        <ul>
          <li>
            <strong>Netlify</strong> — hospedagem do site e das funções do servidor.
          </li>
          <li>
            <strong>Neon</strong> — banco de dados onde ficam guardadas as solicitações e os chamados.
          </li>
          <li>
            <strong>Google</strong> — processamento por inteligência artificial (Gemini) e fornecimento das fontes
            tipográficas do site (Google Fonts), que recebe o seu endereço IP ao carregar a página.
          </li>
          <li>
            <strong>WhatsApp (Meta)</strong> — quando você escolhe continuar o atendimento pelo WhatsApp, a mensagem com o
            resumo do seu caso é aberta no aplicativo e enviada por você. A partir daí também se aplica a política de
            privacidade do WhatsApp.
          </li>
          <li>
            <strong>Autoridades públicas</strong> — quando houver obrigação legal ou ordem judicial.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Transferência internacional</h2>
        <p>
          Alguns desses fornecedores mantêm servidores fora do Brasil, principalmente nos Estados Unidos. Essas
          transferências são feitas para executar o serviço que você solicitou e com base nas garantias contratuais
          oferecidas por esses fornecedores, nos termos do art. 33 da LGPD.
        </p>
      </section>

      <section>
        <h2>7. Por quanto tempo guardamos</h2>
        <ul>
          <li>
            <strong>Solicitações, chamados e propostas</strong>: enquanto forem necessários para o atendimento e o
            relacionamento com você e, depois disso, pelo prazo exigido para cumprir obrigações legais ou exercer direitos
            (em geral, até 5 anos). Se a solicitação não resultar em contratação, você pode pedir a exclusão a qualquer
            momento.
          </li>
          <li>
            <strong>Histórico da conversa com o assistente no seu navegador</strong>: apagado automaticamente ao fechar a
            aba ou o navegador.
          </li>
          <li>
            <strong>Registros de acesso</strong>: pelo menos 6 meses, conforme o Marco Civil da Internet.
          </li>
        </ul>
        <p>Encerrado o prazo, os dados são excluídos ou anonimizados.</p>
      </section>

      <section>
        <h2>8. Seus direitos</h2>
        <p>Pelo art. 18 da LGPD, você pode, a qualquer momento e gratuitamente:</p>
        <ul>
          <li>confirmar se tratamos seus dados e acessá-los;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;</li>
          <li>pedir a portabilidade dos seus dados a outro fornecedor;</li>
          <li>saber com quem compartilhamos seus dados;</li>
          <li>se opor a um tratamento feito com base em legítimo interesse;</li>
          <li>pedir a revisão de decisões tomadas apenas com base em tratamento automatizado;</li>
          <li>
            quando o tratamento se basear em consentimento, revogá-lo e ser informado sobre as consequências de não
            fornecê-lo.
          </li>
        </ul>
        <p>
          Para exercer qualquer desses direitos, escreva para{' '}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. Podemos pedir informações para confirmar a
          sua identidade antes de atender o pedido. Respondemos em até 15 dias. Você também pode apresentar reclamação à{' '}
          <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
            Autoridade Nacional de Proteção de Dados (ANPD)
          </a>
          .
        </p>
      </section>

      <section>
        <h2>9. Canal de atendimento ao titular</h2>
        <p>
          O canal de comunicação para assuntos de privacidade e proteção de dados é o e-mail{' '}
          <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>, por onde atendemos titulares e a ANPD.
        </p>
      </section>

      <section>
        <h2>10. Segurança</h2>
        <p>
          Adotamos medidas técnicas e administrativas para proteger seus dados: conexão criptografada (HTTPS), acesso ao
          painel interno restrito a pessoas autorizadas e com senha, e uso de fornecedores com práticas reconhecidas de
          segurança. Nenhum sistema é totalmente imune a falhas. Se ocorrer um incidente de segurança que possa trazer
          risco ou dano relevante, comunicaremos você e a ANPD, conforme o art. 48 da LGPD.
        </p>
      </section>

      <section>
        <h2>11. Crianças e adolescentes</h2>
        <p>
          Nossos serviços são destinados a empresas e a pessoas maiores de 18 anos. Não coletamos intencionalmente dados
          de crianças e adolescentes. Se você acredita que isso aconteceu, entre em contato para que os dados sejam
          excluídos.
        </p>
      </section>

      <section>
        <h2>12. Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada para refletir mudanças no site, nos serviços ou na legislação. A data da
          última atualização fica sempre no topo da página. Quando houver mudança relevante, ela será destacada no site.
        </p>
      </section>
    </LegalLayout>
  );
}
