import { Link } from 'wouter';
import LegalLayout, { ControllerContact } from '@/components/legal/LegalLayout';
import { LEGAL } from '@/lib/legal';

export default function TermsOfUse() {
  return (
    <LegalLayout
      title="Termos de Uso"
      subtitle={`Regras para usar o site da ${LEGAL.companyName}, os formulários de solicitação e o assistente virtual LEB IA.`}
    >
      <section>
        <h2>1. Aceitação</h2>
        <p>
          Ao acessar e usar este site, você concorda com estes Termos de Uso e com a nossa{' '}
          <Link href="/privacidade">Política de Privacidade</Link>. Se não concordar, não use o site.
        </p>
      </section>

      <section>
        <h2>2. O que o site oferece</h2>
        <p>
          O site apresenta os serviços da {LEGAL.companyName} e permite que você envie solicitações de assistência técnica,
          venda de equipamentos, consultoria, projetos e gestão de TI, além de conversar com o assistente virtual LEB IA.
        </p>
        <p>
          Enviar uma solicitação <strong>não cria um contrato</strong> e não garante a prestação do serviço. Preços,
          prazos e condições são definidos em proposta ou orçamento enviado pela nossa equipe e só valem depois de
          aceitos pelas duas partes.
        </p>
      </section>

      <section>
        <h2>3. Assistente virtual LEB IA</h2>
        <ul>
          <li>
            As respostas do assistente são geradas por inteligência artificial, têm caráter <strong>orientativo</strong>{' '}
            e podem conter imprecisões.
          </li>
          <li>
            Siga orientações técnicas por sua conta e risco. Em caso de dúvida, risco elétrico, perda de dados ou
            equipamento crítico, não execute procedimentos sozinho: fale com um técnico.
          </li>
          <li>Um técnico humano confirma todo atendimento antes de qualquer serviço ou orçamento.</li>
          <li>
            Não envie senhas, dados bancários ou dados pessoais sensíveis na conversa.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Responsabilidades do usuário</h2>
        <p>Ao usar o site, você se compromete a:</p>
        <ul>
          <li>fornecer informações verdadeiras, atuais e completas;</li>
          <li>informar apenas dados seus ou dados que esteja autorizado a compartilhar;</li>
          <li>
            não usar o site ou o assistente para fins ilícitos, para enviar conteúdo ofensivo ou malicioso, nem para
            tentar acessar áreas restritas, sobrecarregar ou prejudicar o funcionamento do serviço.
          </li>
        </ul>
        <p>
          Podemos limitar ou bloquear o acesso de quem descumprir estes termos, além de adotar as medidas legais
          cabíveis.
        </p>
      </section>

      <section>
        <h2>5. Propriedade intelectual</h2>
        <p>
          Marca, logotipo, textos, imagens, layout e código deste site pertencem à {LEGAL.companyName} ou são usados com
          autorização. Não é permitido copiar, reproduzir ou distribuir esse conteúdo sem autorização prévia por escrito.
        </p>
      </section>

      <section>
        <h2>6. Limitação de responsabilidade</h2>
        <p>
          Fazemos o possível para manter o site disponível e com informações corretas, mas ele pode passar por
          interrupções, falhas técnicas ou manutenção. Não respondemos por danos causados por uso indevido do site, por
          falhas de terceiros (como provedores de internet e hospedagem) ou por decisões tomadas apenas com base nas
          respostas automáticas do assistente virtual. Nada nestes termos afasta os direitos garantidos pelo Código de
          Defesa do Consumidor, quando aplicável.
        </p>
      </section>

      <section>
        <h2>7. Links externos</h2>
        <p>
          O site pode conter links para serviços de terceiros, como o WhatsApp. Esses serviços têm termos e políticas
          próprios, pelos quais não somos responsáveis.
        </p>
      </section>

      <section>
        <h2>8. Alterações</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento. A versão em vigor é sempre a publicada nesta página, com
          a data da última atualização no topo.
        </p>
      </section>

      <section>
        <h2>9. Lei aplicável e foro</h2>
        <p>
          Estes termos são regidos pelas leis brasileiras. Fica eleito o foro do domicílio do consumidor ou, nos demais
          casos, o foro da comarca de {LEGAL.city.split(',')[0]}, para resolver qualquer questão relacionada a eles.
        </p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <ControllerContact />
      </section>
    </LegalLayout>
  );
}
