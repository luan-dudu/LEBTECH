import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';
import { useLocation } from 'wouter';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Ticket = {
  protocolo: string;
  nome: string;
  categoria: string;
  urgencia: string;
  resumo: string;
  resolvidoNoN1: boolean;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  ticket?: Ticket;
  whatsappUrl?: string;
  error?: boolean;
};

const STORAGE_KEY = 'lebtech-ai-chat';

const WELCOME: Message = {
  role: 'assistant',
  content:
    'Olá! 👋 Eu sou a **LEB IA**, assistente virtual da LEB TECH.\n\nMe conta com suas palavras o que está acontecendo — não precisa saber termos técnicos. Vou entender o problema, tentar resolver com você e, se precisar, já te encaminho para um técnico com tudo explicado.',
};

const SUGGESTIONS = [
  'Meu computador está muito lento',
  'Estou sem internet',
  'Quero comprar computadores',
  'Preciso falar com um técnico',
];

const URGENCY_STYLES: Record<string, string> = {
  Crítica: 'bg-red-500/15 text-red-300 border-red-500/30',
  Alta: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Média: 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30',
  Baixa: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

// ─── Markdown mínimo (negrito, listas, quebras de linha) ──────────────────────

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith('**') && chunk.endsWith('**') ? (
      <strong key={i} className="font-semibold text-white">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1">
          {list.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  text.split('\n').forEach((raw) => {
    const lineText = raw.trim();
    const match = lineText.match(/^([-*•]|\d+[.)])\s+(.*)$/);
    if (match) return list.push(match[2]);
    flush();
    if (lineText) blocks.push(<p key={`p-${blocks.length}`}>{renderInline(lineText)}</p>);
  });
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AIAssistant() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      /* ignore */
    }
    return [WELCOME];
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const finished = messages.some((m) => m.ticket);
  const hideOnRoute = location.startsWith('/admin');

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  // Balão de convite aparece uma vez por sessão
  useEffect(() => {
    if (sessionStorage.getItem('lebtech-ai-teaser')) return;
    const t = setTimeout(() => {
      setTeaser(true);
      sessionStorage.setItem('lebtech-ai-teaser', '1');
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading || finished) return;

    const next: Message[] = [...messages.filter((m) => !m.error), { role: 'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Resposta não foi JSON (ex.: erro de proxy ou servidor indisponível)
      }

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.error ||
            (res.status === 404 || res.status === 502 || res.status === 504
              ? 'O servidor da IA não está respondendo no momento.'
              : `Erro na comunicação com a IA (${res.status || 'sem resposta'})`)
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.data.reply,
          ticket: data.data.ticket,
          whatsappUrl: data.data.whatsappUrl,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          error: true,
          content: `${err.message || 'Não consegui responder agora.'} Se preferir, fale direto com a gente pelo WhatsApp (12) 98817-6687.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([WELCOME]);
    setInput('');
  }

  if (hideOnRoute) return null;

  return (
    <>
      {/* ── Botão flutuante ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-5 right-5 z-[60] flex items-end gap-3"
          >
            <AnimatePresence>
              {teaser && (
                <motion.button
                  id="ai-assistant-teaser"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => {
                    setTeaser(false);
                    setOpen(true);
                  }}
                  className="hidden sm:block max-w-[230px] text-left rounded-2xl rounded-br-sm bg-card/95 backdrop-blur border border-blue-500/30 px-4 py-3 text-sm text-foreground/90 shadow-xl shadow-blue-500/10"
                >
                  <span className="font-semibold text-white">Precisa de ajuda com TI?</span>
                  <br />
                  Converse com nossa IA e seja atendido agora.
                </motion.button>
              )}
            </AnimatePresence>

            <button
              id="ai-assistant-open"
              aria-label="Abrir assistente virtual LEB IA"
              onClick={() => {
                setTeaser(false);
                setOpen(true);
              }}
              className="group relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl shadow-purple-600/40 flex items-center justify-center transition-transform duration-300 hover:scale-110"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-ping opacity-25" />
              <Bot size={30} className="relative transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-purple-700 shadow">
                <Sparkles size={10} /> IA
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Janela do chat ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.section
            id="ai-assistant-panel"
            aria-label="Chat com a LEB IA"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="fixed z-[60] inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[410px] sm:h-[640px] sm:max-h-[calc(100vh-2.5rem)] flex flex-col overflow-hidden sm:rounded-3xl border border-white/10 bg-[oklch(0.11_0.02_270)]/95 backdrop-blur-xl shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <header className="relative flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-blue-600/25 via-purple-600/20 to-transparent">
              <div className="relative">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Bot size={24} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[oklch(0.11_0.02_270)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  LEB IA
                </p>
                <p className="text-xs text-foreground/60 flex items-center gap-1">
                  <Sparkles size={11} className="text-purple-300" /> Atendimento inteligente • online
                </p>
              </div>
              <button
                id="ai-assistant-reset"
                onClick={reset}
                title="Nova conversa"
                className="p-2 rounded-lg text-foreground/60 hover:text-white hover:bg-white/10 transition"
              >
                <RotateCcw size={18} />
              </button>
              <button
                id="ai-assistant-close"
                onClick={() => setOpen(false)}
                title="Fechar"
                className="p-2 rounded-lg text-foreground/60 hover:text-white hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </header>

            {/* Mensagens */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="mt-1 h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot size={15} className="text-white" />
                    </div>
                  )}
                  <div className="max-w-[85%] space-y-3">
                    <div
                      className={`px-4 py-3 text-[14.5px] leading-relaxed ${
                        m.role === 'user'
                          ? 'rounded-2xl rounded-br-md bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-600/20'
                          : m.error
                            ? 'rounded-2xl rounded-tl-md bg-red-500/10 border border-red-500/30 text-red-200'
                            : 'rounded-2xl rounded-tl-md bg-white/[0.06] border border-white/10 text-foreground/90'
                      }`}
                    >
                      {m.role === 'user' ? m.content : <RichText text={m.content} />}
                    </div>

                    {m.ticket && m.whatsappUrl && <TicketCard ticket={m.ticket} url={m.whatsappUrl} />}

                    {m.error && !loading && (
                      <button
                        type="button"
                        onClick={() => {
                          const lastUser = [...messages].reverse().find((msg) => msg.role === 'user');
                          if (lastUser) send(lastUser.content);
                        }}
                        className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg px-3 py-1.5 transition"
                      >
                        <RotateCcw size={13} /> Tentar novamente
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2 items-center">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot size={15} className="text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-white/[0.06] border border-white/10 px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                    <span className="ml-2 text-xs text-foreground/50">analisando…</span>
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 hover:border-blue-400/60 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <footer className="border-t border-white/10 p-3 bg-black/20">
              {finished ? (
                <button
                  id="ai-assistant-new"
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-foreground/80 border border-white/10 hover:bg-white/5 transition"
                >
                  <RotateCcw size={16} /> Iniciar novo atendimento
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/15 transition"
                >
                  <textarea
                    id="ai-assistant-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    maxLength={2000}
                    placeholder="Descreva o que está acontecendo…"
                    className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground placeholder-foreground/40 focus:outline-none max-h-32"
                  />
                  <button
                    id="ai-assistant-send"
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <Send size={17} />
                  </button>
                </form>
              )}
              <p className="mt-2 text-center text-[10.5px] text-foreground/40">
                Respostas geradas por IA • Um técnico humano confirma todo atendimento
              </p>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Cartão de encaminhamento ─────────────────────────────────────────────────

function TicketCard({ ticket, url }: { ticket: Ticket; url: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-blue-500/10 p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
          {ticket.resolvidoNoN1 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          {ticket.resolvidoNoN1 ? 'Resolvido no atendimento' : 'Triagem concluída'}
        </span>
        <span className="text-[11px] font-mono text-foreground/50">{ticket.protocolo}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-[11px] px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-200">
          {ticket.categoria}
        </span>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border ${URGENCY_STYLES[ticket.urgencia] || URGENCY_STYLES.Média}`}
        >
          Urgência {ticket.urgencia}
        </span>
      </div>

      <p className="text-xs text-foreground/70 leading-relaxed line-clamp-4">{ticket.resumo}</p>

      <a
        id="ai-assistant-whatsapp"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5"
      >
        <MessageCircle size={18} />
        Falar com o técnico no WhatsApp
      </a>
      <p className="text-[10.5px] text-center text-foreground/45">
        O técnico já recebe todas as informações — você não precisa explicar de novo.
      </p>
    </motion.div>
  );
}
