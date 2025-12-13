'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';
import { TeacherSchema } from '../schemas/teacher.schema';
import { clerkClient } from '@clerk/nextjs/server';

type CurrentState = { success: boolean; error: boolean };

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const clerk = await clerkClient();

    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: 'teacher' },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.dateOfBirth,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath('/list/subjects');
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
    };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath('/list/subjects');
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
    };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get('id') as string;
  try {
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath('/list/subjects');
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
    };
  }
};
