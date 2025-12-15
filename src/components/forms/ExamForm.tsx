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
import { examSchema, ExamSchema } from '@/lib/schemas/exam.actions';
import { createExam, updateExam } from '@/lib/actions/exam.actions';

const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useActionState(
    type === 'create' ? createExam : updateExam,
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
        `Exam has been ${type === 'create' ? 'created' : 'updated'}!`
      );
      setModalOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error('An error occurred while processing your request.');
    }
  }, [state, type, router, setModalOpen]);

  const lessons = relatedData?.lessons ?? [];

  return (
    <form className='flex flex-col gap-8' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new exam' : 'Update the exam'}
      </h1>

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Exam title'
          type='text'
          register={register}
          name='title'
          defaultValue={data?.title}
          error={errors?.title}
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
        <InputField
          label='Start Date'
          type='datetime-local'
          register={register}
          name='startTime'
          defaultValue={data?.startTime}
          error={errors?.startTime}
        />
        <InputField
          label='End Date'
          type='datetime-local'
          register={register}
          name='endTime'
          defaultValue={data?.endTime}
          error={errors?.endTime}
        />
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label htmlFor='sex' className='text-xs text-gray-500'>
            Lesson
          </label>
          <select
            multiple
            {...register('lessonId')}
            className='ring-[1.5px] ring-gray-300 rounded-md p-2 w-full'
            defaultValue={data?.teachers}
          >
            {lessons.map((lesson: { id: number; title: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className='text-xs text-red-400'>
              {errors.lessonId.message.toString()}
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

export default ExamForm;
