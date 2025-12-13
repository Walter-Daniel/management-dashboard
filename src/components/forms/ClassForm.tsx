'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useTransition,
} from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createClass, updateClass } from '@/lib/actions/class.actions';
import {
  classInputSchema,
  ClassInputSchema,
  classSchema,
} from '@/lib/schemas/class.schema';

const ClassForm = ({
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
  } = useForm<ClassInputSchema>({
    resolver: zodResolver(classInputSchema),
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    const parsed = classSchema.parse(data);
    startTransition(() => {
      formAction(parsed);
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

  const { teachers = [], grades = [] } = relatedData ?? {};

  return (
    <form className='flex flex-col gap-8' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new class' : 'Update the class'}
      </h1>

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Class name'
          type='text'
          register={register}
          name='name'
          defaultValue={data?.name}
          error={errors.name}
        />
        <InputField
          label='Capacity'
          type='text'
          register={register}
          name='capacity'
          defaultValue={data?.capacity}
          error={errors.capacity}
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
            Supervisor
          </label>
          <select
            {...register('supervisorId')}
            className='ring-[1.5px] ring-gray-300 rounded-md p-2 w-full'
            defaultValue={data?.supervisorId}
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
          {errors.supervisorId?.message && (
            <p className='text-xs text-red-400'>
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>

        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label htmlFor='sex' className='text-xs text-gray-500'>
            Grade
          </label>
          <select
            {...register('gradeId')}
            className='ring-[1.5px] ring-gray-300 rounded-md p-2 w-full'
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className='text-xs text-red-400'>
              {errors.gradeId.message.toString()}
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

export default ClassForm;
