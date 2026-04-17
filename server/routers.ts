import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import * as db from './db';

export const appRouter = router({
  // Technical Support Requests
  technical: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, 'Nome é obrigatório'),
          email: z.string().email('Email inválido'),
          phone: z.string().min(1, 'Telefone é obrigatório'),
          company: z.string().min(1, 'Empresa é obrigatória'),
          problemType: z.string().min(1, 'Tipo de problema é obrigatório'),
          urgency: z.string().min(1, 'Urgência é obrigatória'),
          description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.createTechnicalSupportRequest(input);
        return { success: true, id: result.insertId };
      }),

    list: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 50;
        const offset = input?.offset || 0;
        return db.getTechnicalSupportRequests(limit, offset);
      }),

    updateStatus: publicProcedure
      .input(z.object({ id: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateTechnicalSupportRequestStatus(input.id, input.status);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTechnicalSupportRequest(input.id);
        return { success: true };
      }),
  }),

  // Equipment Sales Requests
  equipment: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, 'Nome é obrigatório'),
          email: z.string().email('Email inválido'),
          phone: z.string().min(1, 'Telefone é obrigatório'),
          company: z.string().min(1, 'Empresa é obrigatória'),
          equipmentType: z.string().min(1, 'Tipo de equipamento é obrigatório'),
          quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
          specifications: z.string().min(10, 'Especificações devem ter pelo menos 10 caracteres'),
          budget: z.string().optional(),
          timeline: z.string().min(1, 'Prazo é obrigatório'),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.createEquipmentSalesRequest(input);
        return { success: true, id: result.insertId };
      }),

    list: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 50;
        const offset = input?.offset || 0;
        return db.getEquipmentSalesRequests(limit, offset);
      }),

    updateStatus: publicProcedure
      .input(z.object({ id: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateEquipmentSalesRequestStatus(input.id, input.status);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEquipmentSalesRequest(input.id);
        return { success: true };
      }),
  }),

  // Consulting Requests
  consulting: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, 'Nome é obrigatório'),
          email: z.string().email('Email inválido'),
          phone: z.string().min(1, 'Telefone é obrigatório'),
          company: z.string().min(1, 'Empresa é obrigatória'),
          consultingType: z.string().min(1, 'Tipo de consultoria é obrigatório'),
          currentChallenges: z.string().min(10, 'Desafios devem ter pelo menos 10 caracteres'),
          objectives: z.string().min(10, 'Objetivos devem ter pelo menos 10 caracteres'),
          teamSize: z.string().optional(),
          budget: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.createConsultingRequest(input);
        return { success: true, id: result.insertId };
      }),

    list: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 50;
        const offset = input?.offset || 0;
        return db.getConsultingRequests(limit, offset);
      }),

    updateStatus: publicProcedure
      .input(z.object({ id: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateConsultingRequestStatus(input.id, input.status);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteConsultingRequest(input.id);
        return { success: true };
      }),
  }),

  // Contact Messages
  contact: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, 'Nome é obrigatório'),
          email: z.string().email('Email inválido'),
          phone: z.string().optional(),
          subject: z.string().min(1, 'Assunto é obrigatório'),
          message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
        })
      )
      .mutation(async ({ input }) => {
        const result = await db.createContactMessage(input);
        return { success: true, id: result.insertId };
      }),

    list: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 50;
        const offset = input?.offset || 0;
        return db.getContactMessages(limit, offset);
      }),

    updateStatus: publicProcedure
      .input(z.object({ id: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        await db.updateContactMessageStatus(input.id, input.status);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteContactMessage(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
