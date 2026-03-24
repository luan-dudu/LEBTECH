import { useState } from 'react';
import { useLocation } from 'wouter';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação simples (em produção, isso seria validado no backend)
    const ADMIN_EMAIL = 'admin@lebtech.com';
    const ADMIN_PASSWORD = 'admin123';

    setTimeout(() => {
      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        // Salvar token no localStorage
        localStorage.setItem('adminToken', 'valid-token-' + Date.now());
        localStorage.setItem('adminEmail', credentials.email);
        toast.success('Login realizado com sucesso!');
        setLocation('/admin/dashboard');
      } else {
        toast.error('Email ou senha incorretos!');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Acesso Admin</h1>
            <p className="text-slate-400">Painel de Administração - LEB TECH</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-200">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400"
                  placeholder="admin@lebtech.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-200">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-200">
                <strong>Credenciais de Teste:</strong><br />
                Email: admin@lebtech.com<br />
                Senha: admin123
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {isLoading ? 'Entrando...' : 'Entrar no Painel'}
              {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setLocation('/')}
              className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              ← Voltar para Home
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>🔒 Esta página é protegida. Acesso apenas para administradores autorizados.</p>
        </div>
      </div>
    </div>
  );
}
