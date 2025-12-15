'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma';

import { clerkClient } from '@clerk/nextjs/server';
import { StudentSchema } from '../schemas/student.schema';

type CurrentState = { success: boolean; error: boolean };

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: {
        id: data.classId,
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return {
        success: false,
        error: true,
      };
    }

    const clerk = await clerkClient();

    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: 'student' },
    });

    await prisma.student.create({
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
        classId: data.classId,
        gradeId: data.gradeId,
        parentId: data.parentId,
      },
    });

    // revalidatePath('/list/students');
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

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
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

    await prisma.student.update({
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
        classId: data.classId,
        gradeId: data.gradeId,
        parentId: data.parentId,
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

export const testStudents = async () => {
  const studentsGrade = await prisma.grade.findMany({
    select: { id: true, level: true },
  });
  const studentsClasses = await prisma.class.findMany({
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  });
  return {
    grades: studentsGrade,
    classes: studentsClasses,
  };
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const clerk = await clerkClient();
  const id = data.get('id');
  if (!id || typeof id !== 'string') {
    return {
      success: false,
      error: true,
    };
  }
  try {
    await prisma.student.delete({
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
