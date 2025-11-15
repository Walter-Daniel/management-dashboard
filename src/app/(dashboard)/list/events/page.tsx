import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';
import { Class, Event, Prisma } from '@prisma/client';
import Image from 'next/image';

type EventList = Event & { class: Class };

const EventListPage = async ({
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
      header: 'Class',
      accesor: 'class',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Date',
      accesor: 'date',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Start time',
      accesor: 'startTime',
      className: 'hidden md:table-cell',
    },
    {
      header: 'End time',
      accesor: 'endTime',
      className: 'hidden md:table-cell',
    },
    ...(role === 'admin'
      ? [
          {
            header: 'Acciones',
            accesor: 'actions',
          },
        ]
      : []),
  ];

  const renderRows = (item: EventList) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.title}</td>
      <td className=''>{item.class?.name || '-'}</td>
      <td className='hidden md:table-cell'>
        {new Intl.DateTimeFormat('en-US').format(new Date(item.startTime))}
      </td>
      <td className='hidden md:table-cell'>
        {item.startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </td>
      <td className='hidden md:table-cell'>
        {item.endTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </td>
      <td>
        <div className='flex items-center gap-2'>
          {role === 'admin' && (
            <>
              <FormModal table='event' type='update' data={item} />
              <FormModal table='event' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? Number(page) : 1;

  //URL params conditions can be added here

  const query: Prisma.EventWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value, mode: 'insensitive' };
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  const roleCondition = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    { class: roleCondition[role as keyof typeof roleCondition] || {} },
  ];

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: (p - 1) * ITEM_PER_PAGE,
    }),
    prisma.event.count(),
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Events</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table='event' type='create' />}
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

export default EventListPage;
