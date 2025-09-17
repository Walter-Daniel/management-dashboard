import CountChart from '@/components/CountChart';
import UseCard from '@/components/UseCard';

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        {/* USER CARD */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UseCard type='Student' key={1} />
          <UseCard type='Techer' key={2} />
          <UseCard type='Parent' key={3} />
          <UseCard type='Staff' key={4} />
        </div>
        {/* MIDDLE CHART */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* COUNT CHART */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className='w-full lg:w-1/3 h-[450px]'></div>
        </div>
        {/* BOTTOM CHART */}
        <div></div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3'>RIGHT</div>
    </div>
  );
};

export default AdminPage;
