import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { resultsData, role } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

type ResultProps = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  student: string;
  type: 'exam' | 'assignment';
  date: string;
  score: string;
};

const columns = [
  {
    header: 'Subject Name',
    accesor: 'subject',
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
  {
    header: 'Actions',
    accesor: 'actions',
  },
];

const ResultListPage = () => {
  const renderRows = (item: ResultProps) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-schoolPurpleLight'
    >
      <td className='flex items-center gap-4 p-4'>{item.subject}</td>
      <td className=''>{item.student}</td>
      <td className='hidden md:table-cell'>{item.score}</td>
      <td className='hidden md:table-cell'>{item.teacher}</td>
      <td className='hidden md:table-cell'>{item.class}</td>
      <td className='hidden md:table-cell'>{item.date}</td>
      <td>
        <div className='flex items-center gap-2'>
          {role === 'admin' && (
            <>
              <FormModal table='result' type='update' data={item} />
              <FormModal table='result' type='delete' id={item.id} />
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
        <h1 className='hidden md:block text-lg font-semibold'>Resultados</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/filter.png' alt='' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-schoolYellow'>
              <Image src='/sort.png' alt='' width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table='result' type='create' />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRows={renderRows} data={resultsData} />
      </div>
      {/* PAGINATION */}
      <div>
        <Pagination />
      </div>
    </div>
  );
};

export default ResultListPage;
