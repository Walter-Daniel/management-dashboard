import prisma from '@/lib/prisma';
import FormModal from './FormModal';
import { auth } from '@clerk/nextjs/server';

export type FormContainerProps = {
  table:
    | 'student'
    | 'teacher'
    | 'parent'
    | 'subject'
    | 'class'
    | 'lesson'
    | 'exam'
    | 'assignment'
    | 'result'
    | 'attendance'
    | 'event'
    | 'announcement';
  type: 'create' | 'update' | 'delete';
  data?: any;
  id?: string | number;
};
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  if (type !== 'delete') {
    switch (table) {
      case 'subject':
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, firstName: true, lastName: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case 'class':
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, firstName: true, lastName: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case 'teacher':
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case 'student':
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
        relatedData = { grades: studentsGrade, classes: studentsClasses };
        break;
      case 'exam':
        const { userId, sessionClaims } = await auth();
        const role = (sessionClaims?.metadata as { role?: string })?.role;
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === 'teacher' ? { teacherId: userId! } : {}),
          },
          select: { id: true, title: true },
        });
        relatedData = { lessons: examLessons };
        break;
      default:
        break;
    }
  }

  return (
    <div className=''>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
