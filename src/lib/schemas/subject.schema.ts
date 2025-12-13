import z from 'zod';

export const subjectSchema = z.object({
  id: z.coerce.number<number>().optional(),
  name: z.string().min(1, { message: 'Subjects name is required' }),
  teachers: z.array(z.string()), //teachers ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
