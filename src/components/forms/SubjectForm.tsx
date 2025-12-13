'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { SubjectSchema, subjectSchema } from '@/lib/schemas/subject.schema';
import { createSubject, updateSubject } from '@/lib/actions/subjects.actions';
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useTransition,
} from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const SubjectForm = ({
  type,
  data,
  setModalOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: any;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction(data);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Subject has been ${type === 'create' ? 'created' : 'updated'}!`
      );
      setModalOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error('An error occurred while processing your request.');
    }
  }, [state, type, router, setModalOpen]);

  const teachers = relatedData?.teachers ?? [];

  return (
    <form className='flex flex-col gap-8' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new subject' : 'Update the subject'}
      </h1>

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Subject name'
          type='text'
          register={register}
          name='name'
          defaultValue={data?.name}
          error={errors.name}
        />
        {data && (
          <InputField
            label='Id'
            name='id'
            defaultValue={data?.id?.toString()}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label htmlFor='sex' className='text-xs text-gray-500'>
            Teachers
          </label>
          <select
            multiple
            {...register('teachers')}
            className='ring-[1.5px] ring-gray-300 rounded-md p-2 w-full'
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: {
                id: string;
                firstName: string;
                lastName: string;
              }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.firstName + ' ' + teacher.lastName}
                </option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className='text-xs text-red-400'>
              {errors.teachers.message.toString()}
            </p>
          )}
        </div>
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {isPending ? 'Processing...' : type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default SubjectForm;
