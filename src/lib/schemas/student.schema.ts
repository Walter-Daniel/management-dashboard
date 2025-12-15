import z from 'zod';

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long!')
    .max(20, 'Username must be at most 20 characters long!'),
  email: z
    .email({ message: 'Invalid email address!' })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' })
    .optional()
    .or(z.literal('')),
  firstName: z.string().min(1, 'First name is required!'),
  lastName: z.string().min(1, 'Last name is required!'),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required!'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Blood type is required!',
  }),
  dateOfBirth: z.coerce.date<Date>({ message: 'Birthday is required!' }),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Sex is required!' }),
  img: z.string().optional(),
  gradeId: z.coerce.number<number>().min(1, 'Grade is required'),
  classId: z.coerce.number<number>().min(1, 'Class is required'),
  parentId: z.string().min(1, { message: 'Parent Id required' }),
});

export type StudentSchema = z.infer<typeof studentSchema>;
