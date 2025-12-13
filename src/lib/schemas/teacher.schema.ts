import z from 'zod';

export const teacherSchema = z.object({
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
    .min(8, { message: 'Password must be at least 8 characters long!' }),
  firstName: z.string().min(1, 'First name is required!'),
  lastName: z.string().min(1, 'Last name is required!'),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required!'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Blood type is required!',
  }),
  dateOfBirth: z.string().min(1, 'Birthday is required!'),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Sex is required!' }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(), //subject ids
});

export const teacherFormSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  dateOfBirth: z.string().min(1),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER']),
  supervisorId: z.string(),
  subjects: z.array(z.string()).optional(),
  email: z.email({ message: 'Invalid email address!' }).optional(),
  phone: z.string().optional(),
});

export const teacherDomainSchema = teacherFormSchema.extend({
  dateOfBirth: z.string().transform((val) => new Date(val)),
});

export type TeacherFormData = z.infer<typeof teacherFormSchema>; // string
export type TeacherDomainData = z.infer<typeof teacherDomainSchema>; // Date
