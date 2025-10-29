'use client';

import { ITEM_PER_PAGE } from '@/lib/settings';
import { useRouter } from 'next/navigation';

const Pagination = ({
  count,
  currentPage,
}: {
  count: number;
  currentPage: number;
}) => {
  const router = useRouter();
  const changePage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage * ITEM_PER_PAGE < count;

  return (
    <div className='p-4 flex items-center justify-between text-gray-500'>
      <button
        disabled={!hasPrevious}
        className='py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={() => changePage(currentPage - 1)}
      >
        Prev
      </button>
      <div className='flex items-center justify-between text-sm gap-2'>
        {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }).map(
          (_, index) => (
            <button
              key={index}
              className={`px-2 rounded-sm ${
                currentPage === index + 1 ? 'bg-schoolSky' : 'bg-slate-200'
              }`}
              onClick={() => changePage(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
      <button
        className='py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={() => changePage(currentPage + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
