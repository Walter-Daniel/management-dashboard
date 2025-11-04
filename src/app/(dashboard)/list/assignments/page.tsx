import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Assignment, Class, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';

type AssigmenList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const columns = [
  {
    header: 'Subject Name',
    accesor: 'subject',
  },
  {
    header: 'Class',
    accesor: 'class',
  },
  {
    header: 'Teacher',
    accesor: 'teacher',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Due Date',
    accesor: 'dueDate',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accesor: 'actions',
  },
];

const renderRows = (item: AssigmenList) => (
  <tr
    key={item.id}
    className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
  >
    <td className='flex items-center gap-4 p-4'>{item.lesson.subject.name}</td>
    <td className=''>{item.lesson.class.name}</td>
    <td className='hidden md:table-cell'>
      {item.lesson.teacher.firstName} {item.lesson.teacher.lastName}
    </td>
    <td className='hidden md:table-cell'>
      {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
        item.dueDate
      )}
    </td>
    <td>
      <div className='flex items-center gap-2'>
        {role === 'admin' && (
          <>
            <FormModal table='assignment' type='update' data={item} />
            <FormModal table='assignment' type='delete' id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  //URL params conditions can be added here

  const query: Prisma.AssignmentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lesson = { classId: parseInt(value) };
            break;
          case 'teacherId':
            query.lesson = { teacherId: value };
            break;
          case 'search':
            query.OR = [
              {
                lesson: {
                  subject: { name: { contains: value, mode: 'insensitive' } },
                },
              },
              {
                lesson: {
                  teacher: {
                    firstName: { contains: value, mode: 'insensitive' },
                  },
                },
              },
              {
                lesson: {
                  teacher: {
                    lastName: { contains: value, mode: 'insensitive' },
                  },
                },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { firstName: true, lastName: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.assignment.count(),
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Tareas</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table='assignment' type='create' />}
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

export default AssignmentListPage;
