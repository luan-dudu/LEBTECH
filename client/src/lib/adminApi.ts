// Chamadas do painel admin: envia o token, trata sessão expirada e respostas
// que não são JSON (ex.: página de erro/timeout da hospedagem).

const TOKEN_KEY = 'adminToken';
const EMAIL_KEY = 'adminEmail';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAdminSession(token: string, email: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
}

export function getAdminEmail() {
  return localStorage.getItem(EMAIL_KEY) || '';
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export async function adminRequest<T = any>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(path, {
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error('Sem conexão com o servidor. Verifique sua internet e tente novamente.');
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    clearAdminSession();
    window.location.assign('/admin/login');
    throw new Error(data?.error || 'Sessão expirada. Faça login novamente.');
  }
  if (!response.ok || !data?.success) {
    if (data?.error) throw new Error(data.error);
    throw new Error(
      response.status === 502 || response.status === 504
        ? 'O servidor demorou demais para responder. Tente novamente.'
        : `O servidor não respondeu corretamente (HTTP ${response.status}).`
    );
  }
  return data as T;
}

const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  dateStyle: 'short',
  timeStyle: 'short',
});

/** Data/hora no fuso de Brasília (o banco guarda em UTC). */
export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateTimeFormat.format(date);
}
