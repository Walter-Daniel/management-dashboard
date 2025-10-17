import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role, studentsData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

type StudentProps = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
};

const columns = [
  {
    header: 'Info',
    accesor: 'info',
  },
  {
    header: 'Estudiante ID',
    accesor: 'studentId',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Grado',
    accesor: 'grade',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Teléfono',
    accesor: 'phone',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Dirección',
    accesor: 'address',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accesor: 'actions',
  },
];

const StudentListPage = () => {
  const renderRows = (item: StudentProps) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>
        <Image
          src={item.photo}
          alt={item.name}
          width={40}
          height={40}
          className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
        />
        <div className='flex flex-col'>
          <h3 className='font-semibold'>{item.name}</h3>
          <p className='text-xs text-gray-500'>{item.class}</p>
        </div>
      </td>
      <td className='hidden md:table-cell'>#{item.studentId}</td>
      <td className='hidden md:table-cell'>{item.grade}</td>
      <td className='hidden md:table-cell'>{item?.phone}</td>
      <td className='hidden md:table-cell'>{item.address}</td>
      <td>
        <div className='flex items-center gap-2'>
          <Link
            href={`/list/teachers/${item?.id}`}
            className='btn btn-sm bg-schoolBlue hover:bg-schoolBlue/80 text-white'
          >
            <button className='w-7 h-7 flex items-center justify-center rounded-full bg-schoolSky'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
          </Link>
          {role === 'admin' && (
            // <button className='w-7 h-7 flex items-center justify-center rounded-full bg-schoolPurple'>
            //   <Image src='/delete.png' alt='' width={14} height={14} />
            // </button>
            <FormModal table='student' type='delete' id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Estudiantes</h1>
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
              // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              //   <Image src='/create.png' alt='' width={14} height={14} />
              // </button>
              <FormModal table='student' type='create' />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRows={renderRows} data={studentsData} />
      </div>
      {/* PAGINATION */}
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default StudentListPage;
