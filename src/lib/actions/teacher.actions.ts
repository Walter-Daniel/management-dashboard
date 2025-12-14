'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';

import { clerkClient } from '@clerk/nextjs/server';
import { TeacherSchema } from '../schemas/teacher.schema';

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

    // revalidatePath('/list/teachers');
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
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const clerk = await clerkClient();

    const user = await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: 'teacher' },
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== '' && { password: data.password }),
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
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath('/list/teachers');
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
  const clerk = await clerkClient();
  const id = data.get('id');
  if (!id || typeof id !== 'string') {
    return {
      success: false,
      error: 'Invalid teacher id',
    };
  }
  try {
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    await clerk.users.deleteUser(id);
    // revalidatePath('/list/teachers');
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
