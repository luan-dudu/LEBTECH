'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManagementModal({ isOpen, onClose }: ManagementModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    managementType: '',
    userCount: '',
    infrastructure: '',
    challenges: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Formulário de Gestão de TI enviado:', formData);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        managementType: '',
        userCount: '',
        infrastructure: '',
        challenges: '',
      });
      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Solicitar Orçamento - Gestão de TI
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Informações de Contato</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telefone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                required
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Detalhes da Gestão</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Gestão Desejada *
              </label>
              <Select value={formData.managementType} onValueChange={(value) => handleSelectChange('managementType', value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione o tipo de gestão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Gestão Completa</SelectItem>
                  <SelectItem value="partial">Gestão Parcial</SelectItem>
                  <SelectItem value="helpdesk">Help Desk</SelectItem>
                  <SelectItem value="monitoring">Monitoramento</SelectItem>
                  <SelectItem value="support">Suporte Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Número de Usuários *
                </label>
                <Select value={formData.userCount} onValueChange={(value) => handleSelectChange('userCount', value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione a quantidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1 a 10 usuários</SelectItem>
                    <SelectItem value="11-50">11 a 50 usuários</SelectItem>
                    <SelectItem value="51-100">51 a 100 usuários</SelectItem>
                    <SelectItem value="101-500">101 a 500 usuários</SelectItem>
                    <SelectItem value="500+">500+ usuários</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Infraestrutura Atual *
                </label>
                <Select value={formData.infrastructure} onValueChange={(value) => handleSelectChange('infrastructure', value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione a infraestrutura" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-premises">On-Premises</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                    <SelectItem value="hybrid">Híbrida</SelectItem>
                    <SelectItem value="mixed">Mista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Principais Desafios e Necessidades *
              </label>
              <Textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                placeholder="Descreva os principais desafios de TI, necessidades de suporte e objetivos..."
                required
                className="bg-background border-border min-h-32"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-card"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar Orçamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
