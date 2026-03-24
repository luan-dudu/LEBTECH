'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    timeline: '',
    budget: '',
    description: '',
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
      // Simular envio do formulário
      console.log('Formulário de Projetos de TI enviado:', formData);
      
      // Aqui você pode adicionar a chamada à API
      // await trpc.forms.submitProjectsRequest.mutate(formData);

      // Limpar formulário e fechar modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        timeline: '',
        budget: '',
        description: '',
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
            Solicitar Orçamento - Projetos de TI
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
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

          {/* Detalhes do Projeto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Detalhes do Projeto</h3>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de Projeto *
              </label>
              <Select value={formData.projectType} onValueChange={(value) => handleSelectChange('projectType', value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione o tipo de projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Desenvolvimento de Software</SelectItem>
                  <SelectItem value="infrastructure">Infraestrutura</SelectItem>
                  <SelectItem value="integration">Integração de Sistemas</SelectItem>
                  <SelectItem value="migration">Migração de Dados</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prazo Estimado *
                </label>
                <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgente (até 1 mês)</SelectItem>
                    <SelectItem value="short">Curto Prazo (1-3 meses)</SelectItem>
                    <SelectItem value="medium">Médio Prazo (3-6 meses)</SelectItem>
                    <SelectItem value="long">Longo Prazo (6+ meses)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Orçamento Disponível *
                </label>
                <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Selecione a faixa de orçamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5k">Até R$ 5 mil</SelectItem>
                    <SelectItem value="15k">R$ 5 mil - R$ 15 mil</SelectItem>
                    <SelectItem value="50k">R$ 15 mil - R$ 50 mil</SelectItem>
                    <SelectItem value="100k">R$ 50 mil - R$ 100 mil</SelectItem>
                    <SelectItem value="above">Acima de R$ 100 mil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição do Projeto *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva os objetivos, requisitos e escopo do projeto..."
                required
                className="bg-background border-border min-h-32"
              />
            </div>
          </div>

          {/* Botões */}
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
