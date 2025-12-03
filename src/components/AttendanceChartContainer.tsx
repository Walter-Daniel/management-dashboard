import Image from 'next/image';
import AttendanceChart from './AttendanceChart';
import prisma from '@/lib/prisma';

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const response = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  // console.log({ data });

  const daysOfWeek = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri'];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wen: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  response.forEach((item) => {
    const itemDate = new Date(item.date);
    if (dayOfWeek > 1 && dayOfWeek <= 5) {
      const dayDame = daysOfWeek[dayOfWeek - 1];

      if (item.present) {
        attendanceMap[dayDame].present += 1;
      } else {
        attendanceMap[dayDame].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className='bg-white rounded-lg p-4 h-[450px]'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Attendance</h1>
        <Image src='/moreDark.png' alt='icon' width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
