'use client';

import { deleteSubject } from '@/lib/actions/subjects.actions';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { FormContainerProps } from './FormContainer';
import { deleteClass } from '@/lib/actions/class.actions';

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteSubject,
  student: deleteSubject,
  parent: deleteSubject,
  lesson: deleteSubject,
  exam: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
};

const LoadingSpinner = () => (
  <div className='flex items-center justify-center w-full h-40'>
    <div className='relative'>
      <div className='w-12 h-12 rounded-full border-4 border-schoolYellow border-t-transparent animate-spin'></div>
      <div className='mt-4 text-center text-gray-600 font-medium'>
        Loading form...
      </div>
    </div>
  </div>
);

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
  loading: LoadingSpinner,
});
const StudentForm = dynamic(() => import('./forms/StudentForm'), {
  loading: LoadingSpinner,
});
const SubjectForm = dynamic(() => import('./forms/SubjectForm'), {
  loading: LoadingSpinner,
});
const ClassForm = dynamic(() => import('./forms/ClassForm'), {
  loading: LoadingSpinner,
});

const forms: {
  [key: string]: (
    setModalOpen: Dispatch<SetStateAction<boolean>>,
    type: 'create' | 'update',
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setModalOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setModalOpen={setModalOpen}
      relatedData={relatedData}
    />
  ),
  class: (setModalOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setModalOpen={setModalOpen}
      relatedData={relatedData}
    />
  ),
  // teacher: (setModalOpen, type, data, relatedData) => (
  //   <TeacherForm
  //     type={type}
  //     data={data}
  //     setModalOpen={setModalOpen}
  //     relatedData={relatedData}
  //   />
  // ),
  // student: (setModalOpen, type, data, relatedData) => (
  //   <StudentForm
  //     type={type}
  //     data={data}
  //     setModalOpen={setModalOpen}
  //     relatedData={relatedData}
  //   />
  // ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create'
      ? 'bg-schoolYellow'
      : type === 'update'
      ? 'bg-black'
      : 'bg-schoolPurple';

  const [modalOpen, setModalOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast.success(`Subject has been deleted!`);
        setModalOpen(false);
        router.refresh();
      } else if (state.error) {
        toast.error('An error occurred while processing your request.');
      }
    }, [state]);

    return type === 'delete' && id ? (
      <form action={formAction} className='p-4 flex flex-col gap-4'>
        <input type='text | number' name='id' value={id} hidden readOnly />
        <span className='text-center font-medium'>
          Are you sure you want to delete this {table}?
        </span>
        <button className='bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center'>
          Delete
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table](setModalOpen, type, data, relatedData)
    ) : (
      'Form not found!'
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
