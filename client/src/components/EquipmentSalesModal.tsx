import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface EquipmentSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EquipmentSalesModal({ isOpen, onClose }: EquipmentSalesModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    equipmentType: 'computers',
    quantity: '',
    specifications: '',
    budget: '',
    timeline: 'asap',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitMutation = trpc.forms.submitEquipmentSales.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        equipmentType: formData.equipmentType,
        quantity: parseInt(formData.quantity) || 0,
        specifications: formData.specifications,
        budget: formData.budget,
        timeline: formData.timeline,
      });
      
      toast.success('Solicitação de orçamento enviada! Retornaremos com uma proposta em breve.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        equipmentType: 'computers',
        quantity: '',
        specifications: '',
        budget: '',
        timeline: 'asap',
      });
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar solicitação. Tente novamente.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-foreground">Solicitação de Orçamento - Equipamentos</h2>
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

          {/* Equipment Type and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="equipmentType" className="block text-sm font-semibold text-foreground">
                Tipo de Equipamento *
              </label>
              <select
                id="equipmentType"
                name="equipmentType"
                value={formData.equipmentType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
              >
                <option value="computers">Computadores</option>
                <option value="servers">Servidores</option>
                <option value="monitors">Monitores</option>
                <option value="peripherals">Periféricos</option>
                <option value="network">Equipamentos de Rede</option>
                <option value="storage">Armazenamento</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-semibold text-foreground">
                Quantidade *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Budget and Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="budget" className="block text-sm font-semibold text-foreground">
                Orçamento Estimado
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40"
                placeholder="Ex: R$ 50.000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="timeline" className="block text-sm font-semibold text-foreground">
                Prazo de Entrega *
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
              >
                <option value="asap">O mais rápido possível</option>
                <option value="1week">Até 1 semana</option>
                <option value="2weeks">Até 2 semanas</option>
                <option value="1month">Até 1 mês</option>
                <option value="flexible">Flexível</option>
              </select>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <label htmlFor="specifications" className="block text-sm font-semibold text-foreground">
              Especificações e Detalhes *
            </label>
            <textarea
              id="specifications"
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground placeholder-foreground/40 resize-none"
              placeholder="Descreva os equipamentos que deseja comprar, especificações técnicas desejadas, marcas preferidas, etc..."
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
              disabled={isSubmitting || submitMutation.isPending}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting || submitMutation.isPending ? 'Enviando...' : 'Solicitar Orçamento'}
              {!isSubmitting && !submitMutation.isPending && <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
