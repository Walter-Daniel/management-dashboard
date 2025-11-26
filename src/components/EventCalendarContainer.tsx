import React from 'react';
import EventCalendar from './EventCalendar';
import Image from 'next/image';
import EventList from './EventList';

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = await searchParams;

  return (
    <div className='bg-white'>
      <EventCalendar />

      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold my-4'>Events</h1>
        <Image src='/moreDark.png' alt='events' width={20} height={20} />
      </div>
      <div className='flex flex-col'>
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
