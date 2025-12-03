'use server';

import { revalidatePath } from 'next/cache';
import { SubjectSchema } from './formValidationSchemas';
import prisma from './prisma';

export const createSubject = async (data: SubjectSchema) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
      },
    });

    revalidatePath('/list/subjects');
  } catch (error) {
    console.log(error);
  }
};
