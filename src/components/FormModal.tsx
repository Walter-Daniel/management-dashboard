'use client';

import Image from 'next/image';
import { useState } from 'react';
import TeacherForm from './forms/TeacherForm';

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | 'student'
    | 'teacher'
    | 'parent'
    | 'subject'
    | 'class'
    | 'lesson'
    | 'exam'
    | 'assignment'
    | 'result'
    | 'attendance'
    | 'event'
    | 'announcement';
  type: 'create' | 'update' | 'delete';
  data?: any;
  id?: number;
}) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create'
      ? 'bg-schoolYellow'
      : type === 'update'
      ? 'bg-schoolSky'
      : 'bg-schoolPurple';

  const [modalOpen, setModalOpen] = useState(false);

  const Form = () => {
    return type === 'delete' && id ? (
      <form action='' className='p-4 flex flex-col gap-4'>
        <span className='text-center font-medium'>
          Are you sure you want to delete this {table}?
        </span>
        <button className='bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center'>
          Delete
        </button>
      </form>
    ) : (
      <TeacherForm type={'create'} />
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setModalOpen(true)}
      >
        <Image
          src={`/${type}.png`}
          alt={`${type} icon`}
          height={16}
          width={16}
        />
      </button>
      {modalOpen && (
        <div className='w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-md relative w-[90%] xl:w-[60%] 2xl:w-[40%]'>
            <Form />
            <div
              className='absolute top-4 right-4 cursor-pointer'
              onClick={() => setModalOpen(false)}
            >
              <Image src='/close.png' alt='close icon' height={14} width={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
