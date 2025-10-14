import Image from 'next/image';
import React from 'react';

const SingleTeacherPage = () => {
  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      {/* LEFT */}
      <div className='w-full xl:w-2/3'>
        {/*TOP*/}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* USER INFO CARD */}
          <div className='bg-schoolSky py-6 px-4 rounded-md flex-1 flex gap-4'>
            <div className='w-1/3'>
              <Image
                src='https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200'
                alt='User Image'
                width={144}
                height={144}
                className='w-36 h-36 rounded-full object-cover'
              />
            </div>
            <div className='w-2/3 flex flex-col justify-between gap-4'>
              <h1 className='text-xl font-semibold'>John Doe</h1>
              <p className='text-sm text-gray-500'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className='flex items-center justify-between gap-2 flex-wrap text-xs font-medium'>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image
                    src='/blood.png'
                    alt='Blood Icon'
                    width={14}
                    height={14}
                  />
                  <span>A+</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image
                    src='/date.png'
                    alt='Date Icon'
                    width={14}
                    height={14}
                  />
                  <span>January 2025</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image
                    src='/mail.png'
                    alt='Email Icon'
                    width={14}
                    height={14}
                  />
                  <span>user@email.com</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image
                    src='/phone.png'
                    alt='Phone Icon'
                    width={14}
                    height={14}
                  />
                  <span>+1 234 567 890</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className='flex-1 flex gap-4 justify-between flex-wrap'>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] 2xl:w-[48%] shadow-sm'>
              <Image
                src='/singleAttendance.png'
                alt='Attendance'
                width={24}
                height={24}
                className='w-6 h-6 rounded-md'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>90%</h1>
                <span className='text-sm text-gray-400'>Asistencia</span>
              </div>
            </div>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] 2xl:w-[48%] shadow-sm'>
              <Image
                src='/singleBranch.png'
                alt='Attendance'
                width={24}
                height={24}
                className='w-6 h-6 rounded-md'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>2</h1>
                <span className='text-sm text-gray-400'>Áreas</span>
              </div>
            </div>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] 2xl:w-[48%] shadow-sm'>
              <Image
                src='/singleLesson.png'
                alt='Attendance'
                width={24}
                height={24}
                className='w-6 h-6 rounded-md'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>6</h1>
                <span className='text-sm text-gray-400'>Clases</span>
              </div>
            </div>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] 2xl:w-[48%] shadow-sm'>
              <Image
                src='/singleClass.png'
                alt='Attendance'
                width={24}
                height={24}
                className='w-6 h-6 rounded-md'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>6</h1>
                <span className='text-sm text-gray-400'>Cursos</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div>Cronograma</div>
      </div>
      {/* RIGHT */}
      <div className='w-full xl:w-1/3'>hola</div>
    </div>
  );
};

export default SingleTeacherPage;
