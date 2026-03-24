import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ConsultingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultingModal({ isOpen, onClose }: ConsultingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    consultingType: 'strategy',
    currentChallenges: '',
    objectives: '',
    teamSize: '',
    budget: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Solicitação de consultoria enviada! Agende uma reunião com nossos especialistas.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        consultingType: 'strategy',
        currentChallenges: '',
        objectives: '',
        teamSize: '',
        budget: '',
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-foreground">Solicitação de Consultoria em TI</h2>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                Nome Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Phone and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
                Telefone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
                placeholder="(11) 9999-9999"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-semibold text-foreground">
                Empresa *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
                placeholder="Sua empresa"
              />
            </div>
          </div>

          {/* Consulting Type and Team Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="consultingType" className="block text-sm font-semibold text-foreground">
                Tipo de Consultoria *
              </label>
              <select
                id="consultingType"
                name="consultingType"
                value={formData.consultingType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
              >
                <option value="strategy">Estratégia Digital</option>
                <option value="infrastructure">Infraestrutura de TI</option>
                <option value="security">Segurança da Informação</option>
                <option value="cloud">Migração para Nuvem</option>
                <option value="optimization">Otimização de Processos</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="teamSize" className="block text-sm font-semibold text-foreground">
                Tamanho do Time de TI
              </label>
              <select
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
              >
                <option value="">Selecione...</option>
                <option value="1-2">1-2 pessoas</option>
                <option value="3-5">3-5 pessoas</option>
                <option value="6-10">6-10 pessoas</option>
                <option value="10+">Mais de 10 pessoas</option>
              </select>
            </div>
          </div>

          {/* Current Challenges */}
          <div className="space-y-2">
            <label htmlFor="currentChallenges" className="block text-sm font-semibold text-foreground">
              Desafios Atuais *
            </label>
            <textarea
              id="currentChallenges"
              name="currentChallenges"
              value={formData.currentChallenges}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40 resize-none"
              placeholder="Descreva os principais desafios tecnológicos que sua empresa enfrenta..."
            />
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <label htmlFor="objectives" className="block text-sm font-semibold text-foreground">
              Objetivos Esperados *
            </label>
            <textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40 resize-none"
              placeholder="Quais são seus objetivos com a consultoria? O que você espera alcançar?"
            />
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-semibold text-foreground">
              Orçamento Disponível
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
              placeholder="Ex: R$ 100.000"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? 'Enviando...' : 'Agendar Consultoria'}
              {!isSubmitting && <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
