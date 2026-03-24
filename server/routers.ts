import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createTechnicalSupportRequest, 
  getTechnicalSupportRequests, 
  createEquipmentSalesRequest, 
  getEquipmentSalesRequests, 
  createConsultingRequest, 
  getConsultingRequests, 
  createContactMessage, 
  getContactMessages 
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers para formulários
  forms: router({
    // Assistência Técnica
    submitTechnicalSupport: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        company: z.string().min(1),
        problemType: z.string().min(1),
        urgency: z.string().min(1),
        description: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        await createTechnicalSupportRequest({
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          problemType: input.problemType,
          urgency: input.urgency,
          description: input.description,
          status: 'pending',
        });
        return { success: true, message: 'Solicitação de assistência técnica enviada com sucesso!' };
      }),

    // Venda de Equipamentos
    submitEquipmentSales: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        company: z.string().min(1),
        equipmentType: z.string().min(1),
        quantity: z.number().min(1),
        specifications: z.string().min(1),
        budget: z.string().optional(),
        timeline: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        await createEquipmentSalesRequest({
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          equipmentType: input.equipmentType,
          quantity: input.quantity,
          specifications: input.specifications,
          budget: input.budget,
          timeline: input.timeline,
          status: 'pending',
        });
        return { success: true, message: 'Solicitação de venda de equipamentos enviada com sucesso!' };
      }),

    // Consultoria de TI
    submitConsulting: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        company: z.string().min(1),
        consultingType: z.string().min(1),
        currentChallenges: z.string().min(1),
        objectives: z.string().min(1),
        teamSize: z.string().optional(),
        budget: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createConsultingRequest({
          name: input.name,
          email: input.email,
          phone: input.phone,
          company: input.company,
          consultingType: input.consultingType,
          currentChallenges: input.currentChallenges,
          objectives: input.objectives,
          teamSize: input.teamSize,
          budget: input.budget,
          status: 'pending',
        });
        return { success: true, message: 'Solicitação de consultoria enviada com sucesso!' };
      }),

    // Mensagem de Contato Geral
    submitContact: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        await createContactMessage({
          name: input.name,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          message: input.message,
          status: 'new',
        });
        return { success: true, message: 'Mensagem enviada com sucesso!' };
      }),
  }),
});

export type AppRouter = typeof appRouter;
