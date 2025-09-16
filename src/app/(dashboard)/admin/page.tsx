import UseCard from '@/components/UseCard';

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3'>
        {/* USER CARD */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UseCard type='Student' />
          <UseCard type='Techer' />
          <UseCard type='Parent' />
          <UseCard type='Staff' />
        </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3'>RIGHT</div>
    </div>
  );
};

export default AdminPage;
