import prisma from '@/lib/prisma';
import BigCalendar from './BigCalendar';

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: 'teacherId' | 'classId';
  id: string | number;
}) => {
  const response = await prisma.lesson.findMany({
    where: {
      ...(type === 'teacherId'
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  const data = response.map((lesson) => ({
    title: lesson.title,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  return (
    <div>
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;
