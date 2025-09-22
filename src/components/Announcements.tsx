const Announcements = () => {
  return (
    <div className='bg-white p-4 rounded-md'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Announcements</h1>
        <span className='text-xs text-gray-400'></span>
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        <div className='bg-schoolSkyLight rounded-md p4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </h2>
            <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
              2025-01-01
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        <div className='bg-schoolPurpleLight rounded-md p4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </h2>
            <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
              2025-01-01
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        <div className='bg-schoolYellowLight rounded-md p4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </h2>
            <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
              2025-01-01
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
