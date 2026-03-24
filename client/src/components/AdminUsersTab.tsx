import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

export default function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Admin Principal',
      email: 'admin@lebtech.com',
      role: 'admin',
      status: 'active',
      createdAt: '2026-01-15',
      lastLogin: '2026-03-24 14:30',
    },
    {
      id: 2,
      name: 'Gerenciador de Vendas',
      email: 'vendas@lebtech.com',
      role: 'manager',
      status: 'active',
      createdAt: '2026-02-10',
      lastLogin: '2026-03-24 10:15',
    },
    {
      id: 3,
      name: 'Suporte Técnico',
      email: 'suporte@lebtech.com',
      role: 'user',
      status: 'active',
      createdAt: '2026-02-20',
      lastLogin: '2026-03-23 16:45',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ name: string; email: string; password: string; role: 'admin' | 'user' | 'manager' }>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos!');
      return;
    }

    if (editingId) {
      setUsers(users.map(u => u.id === editingId ? { ...u, name: formData.name, email: formData.email, role: formData.role } : u));
      toast.success('Usuário atualizado com sucesso!');
      setEditingId(null);
    } else {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Nunca',
      };
      setUsers([...users, newUser]);
      toast.success('Usuário criado com sucesso!');
    }

    setFormData({ name: '', email: '', password: '', role: 'user' });
    setShowForm(false);
  };

  const handleDeleteUser = (id: number) => {
    if (id === 1) {
      toast.error('Não é possível deletar o admin principal!');
      return;
    }
    setUsers(users.filter(u => u.id !== id));
    toast.success('Usuário deletado com sucesso!');
  };

  const handleEditUser = (user: User) => {
    setFormData({ name: user.name, email: user.email, password: '', role: user.role as 'admin' | 'user' | 'manager' });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    toast.success('Status atualizado!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h2>
          <p className="text-slate-400 text-sm mt-1">Total: {users.length} usuários</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'user' });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Editar Usuário' : 'Criar Novo Usuário'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="user">Usuário</option>
              <option value="manager">Gerenciador</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddUser}
              className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 transition-all"
            >
              {editingId ? 'Atualizar' : 'Criar'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Função</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Último Acesso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {user.role === 'admin' ? 'Admin' : user.role === 'manager' ? 'Gerenciador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="flex items-center gap-1"
                    >
                      {user.status === 'active' ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle size={16} />
                          Ativo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <AlertCircle size={16} />
                          Inativo
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
