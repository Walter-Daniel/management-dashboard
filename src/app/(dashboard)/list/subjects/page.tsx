import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role } from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';

type SubjectList = Subject & { teachers: Teacher[] };

const columns = [
  {
    header: 'Subject Name',
    accesor: 'name',
  },
  {
    header: 'Teachers',
    accesor: 'teachers',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accesor: 'actions',
  },
];

const renderRows = (item: SubjectList) => (
  <tr
    key={item.id}
    className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
  >
    <td className='flex items-center gap-4 p-4'>{item.name}</td>
    <td className='hidden md:table-cell'>
      {item.teachers
        .map((teacher) => teacher.firstName + ' ' + teacher.lastName)
        .join(', ')}
    </td>
    <td>
      <div className='flex items-center gap-2'>
        {role === 'admin' && (
          <>
            <FormContainer table='subject' type='update' data={item} />
            <FormContainer table='subject' type='delete' id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const SubjectListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? Number(page) : 1;

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.OR = [{ name: { contains: value, mode: 'insensitive' } }];
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: { teachers: true },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.subject.count(),
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Subjects</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && (
              <FormContainer table='subject' type='create' />
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

export default SubjectListPage;
