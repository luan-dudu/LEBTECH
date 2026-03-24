'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManagementModal({ isOpen, onClose }: ManagementModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    managementType: 'full',
    userCount: '1-10',
    infrastructure: 'on-premises',
    challenges: '',
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
      toast.success('Solicitação de gestão de TI enviada! Entraremos em contato em breve.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        managementType: 'full',
        userCount: '1-10',
        infrastructure: 'on-premises',
        challenges: '',
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
          <h2 className="text-2xl font-bold text-foreground">Solicitação de Gestão de TI</h2>
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
                Empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
                placeholder="Sua empresa"
              />
            </div>
          </div>

          {/* Management Type and User Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="managementType" className="block text-sm font-semibold text-foreground">
                Tipo de Gestão Desejada *
              </label>
              <select
                id="managementType"
                name="managementType"
                value={formData.managementType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
              >
                <option value="full">Gestão Completa</option>
                <option value="partial">Gestão Parcial</option>
                <option value="helpdesk">Help Desk</option>
                <option value="monitoring">Monitoramento</option>
                <option value="support">Suporte Técnico</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="userCount" className="block text-sm font-semibold text-foreground">
                Número de Usuários *
              </label>
              <select
                id="userCount"
                name="userCount"
                value={formData.userCount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
              >
                <option value="1-10">1 a 10 usuários</option>
                <option value="11-50">11 a 50 usuários</option>
                <option value="51-100">51 a 100 usuários</option>
                <option value="101-500">101 a 500 usuários</option>
                <option value="500+">500+ usuários</option>
              </select>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="space-y-2">
            <label htmlFor="infrastructure" className="block text-sm font-semibold text-foreground">
              Infraestrutura Atual *
            </label>
            <select
              id="infrastructure"
              name="infrastructure"
              value={formData.infrastructure}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
            >
              <option value="on-premises">On-Premises</option>
              <option value="cloud">Cloud</option>
              <option value="hybrid">Híbrida</option>
              <option value="mixed">Mista</option>
            </select>
          </div>

          {/* Challenges */}
          <div className="space-y-2">
            <label htmlFor="challenges" className="block text-sm font-semibold text-foreground">
              Principais Desafios e Necessidades *
            </label>
            <textarea
              id="challenges"
              name="challenges"
              value={formData.challenges}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40 resize-none"
              placeholder="Descreva os principais desafios de TI, necessidades de suporte e objetivos..."
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
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
              {!isSubmitting && <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
