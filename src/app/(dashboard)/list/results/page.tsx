import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import Image from 'next/image';

type ResultList = {
  id: number;
  title: string;
  studentFirstName: string;
  studentLastName: string;
  teacherFirstName: string;
  teacherLastName: string;
  score: number;
  className: string;
  startTime: Date;
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: 'Title',
      accesor: 'title',
    },
    {
      header: 'Student',
      accesor: 'student',
    },
    {
      header: 'Score',
      accesor: 'score',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Teacher',
      accesor: 'teacher',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Class',
      accesor: 'class',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Date',
      accesor: 'date',
      className: 'hidden md:table-cell',
    },
    ...(role === 'admin' || role === 'teacher'
      ? [
          {
            header: 'Actions',
            accesor: 'actions',
          },
        ]
      : []),
  ];

  const renderRows = (item: ResultList) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.title}</td>
      <td className=''>{item.studentFirstName + ' ' + item.studentLastName}</td>
      <td className='hidden md:table-cell'>{item.score}</td>
      <td className='hidden md:table-cell'>
        {item.teacherFirstName + ' ' + item.teacherLastName}
      </td>
      <td className='hidden md:table-cell'>{item.className}</td>
      <td className='hidden md:table-cell'>
        {' '}
        {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
          item.startTime
        )}
      </td>
      <td>
        <div className='flex items-center gap-2'>
          {role === 'admin' ||
            (role === 'teacher' && (
              <>
                <FormModal table='result' type='update' data={item} />
                <FormModal table='result' type='delete' id={item.id} />
              </>
            ))}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  //URL params conditions can be added here

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.studentId = value;
            break;
          case 'search':
            query.OR = [
              {
                exam: { title: { contains: value, mode: 'insensitive' } },
              },
              {
                student: {
                  firstName: { contains: value, mode: 'insensitive' },
                },
              },
              {
                student: {
                  lastName: { contains: value, mode: 'insensitive' },
                },
              },
            ];
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { Assignment: { lesson: { teacherId: currentUserId! } } },
      ];
      break;
    case 'student':
      query.studentId = currentUserId!;
      break;
    case 'parent':
      query.student = {
        parentId: currentUserId!,
      };
    default:
      break;
  }

  const [response, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { firstName: true, lastName: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
        Assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.result.count(),
  ]);

  const data = response.map((item) => {
    const assessment = item.exam || item.Assignment;
    if (!assessment) return null;
    const isExam = 'startTime' in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentFirstName: item.student.firstName,
      studentLastName: item.student.lastName,
      teacherFirstName: assessment.lesson.teacher.firstName,
      teacherLastName: assessment.lesson.teacher.lastName,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });
  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Results</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {(role === 'admin' || role === 'teacher') && (
              <FormModal table='result' type='create' />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRows={renderRows} data={data} />
      </div>
      {/* PAGINATION */}
      <div>
        <Pagination count={count} currentPage={p} />
      </div>
    </div>
  );
};

export default ResultListPage;
