import z from 'zod';

export const classInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Subjects name is required' }),
  capacity: z.string().min(1, { message: 'Capacity is required' }),
  gradeId: z.string().min(1, { message: 'GradeId is required' }),
  supervisorId: z.string().optional(),
});

export const classSchema = classInputSchema.extend({
  id: z.coerce.number().optional(),
  capacity: z.coerce.number(),
  gradeId: z.coerce.number(),
});

export type ClassInputSchema = z.infer<typeof classInputSchema>;
export type ClassSchema = z.infer<typeof classSchema>;
