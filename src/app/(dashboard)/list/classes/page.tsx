import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Class, Prisma, Teacher } from '@prisma/client';
import Image from 'next/image';

type ClassList = Class & { supervisor: Teacher };

const columns = [
  {
    header: 'Class Name',
    accesor: 'name',
  },
  {
    header: 'Capacity',
    accesor: 'capacity',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Grade',
    accesor: 'grade',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Supervisor',
    accesor: 'supervisor',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accesor: 'actions',
  },
];

const renderRows = (item: ClassList) => (
  <tr
    key={item.id}
    className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
  >
    <td className='flex items-center gap-4 p-4'>{item.name}</td>
    <td className='hidden md:table-cell'>{item.capacity}</td>
    <td className='hidden md:table-cell'>{item.name[0]}</td>
    <td className='hidden md:table-cell'>
      {item.supervisor
        ? `${item.supervisor.firstName} ${item.supervisor.lastName}`
        : 'N/A'}
    </td>
    <td>
      <div className='flex items-center gap-2'>
        {role === 'admin' && (
          <>
            <FormModal table='class' type='update' data={item} />
            <FormModal table='class' type='delete' id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  //URL params conditions can be added here

  const query: Prisma.ClassWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'supervisorId':
            query.supervisorId = value;
            break;
          case 'search':
            query.name = { contains: value, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: { supervisor: true, grade: true },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.class.count(),
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Clases</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table='class' type='create' />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRows={renderRows} data={data} />
      </div>
      {/* PAGINATION */}
      <div>
        <Pagination currentPage={p} count={count} />
      </div>
    </div>
  );
};

export default ClassListPage;
