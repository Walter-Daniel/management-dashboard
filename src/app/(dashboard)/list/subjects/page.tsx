import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role, subjectsData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

type SubjectProps = {
  id: number;
  name: string;
  teachers: string[];
};

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

const SubjectListPage = () => {
  const renderRows = (item: SubjectProps) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.name}</td>
      <td className='hidden md:table-cell'>{item.teachers.join(', ')}</td>
      <td>
        <div className='flex items-center gap-2'>
          {role === 'admin' && (
            <>
              <FormModal table='subject' type='update' data={item} />
              <FormModal table='subject' type='delete' id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>Asignaturas</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table='subject' type='create' />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRows={renderRows} data={subjectsData} />
      </div>
      {/* PAGINATION */}
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default SubjectListPage;
