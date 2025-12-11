// formValidationSchemas.ts (Verificado, está correcto)
import z from 'zod';

export const subjectInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Subjects name is required' }),
});

export const subjectSchema = subjectInputSchema.extend({
  id: z.coerce.number().optional(), // <--- ESTE ES EL QUE HACE LA COERCIÓN
});

export type SubjectInputSchema = z.infer<typeof subjectInputSchema>;
export type SubjectSchema = z.infer<typeof subjectSchema>;
