import z from 'zod';

export const examSchema = z.object({
  id: z.coerce.number<number>().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  startTime: z.coerce.date<Date>({ message: 'Start time is required!' }),
  endTime: z.coerce.date<Date>({ message: 'End time is required!' }),
  lessonId: z.coerce.number<number>({ message: 'Lesson Id is required!' }),
});

export type ExamSchema = z.infer<typeof examSchema>;
