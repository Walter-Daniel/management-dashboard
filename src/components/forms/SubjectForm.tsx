'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import {
  SubjectInputSchema,
  subjectInputSchema,
  SubjectSchema,
} from '@/lib/formValidationSchemas';
import { createSubject, updateSubject } from '@/lib/actions';
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
}: {
  type: 'create' | 'update';
  data?: any;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectInputSchema>({
    resolver: zodResolver(subjectInputSchema),
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
    console.log(data + 'Desde handle');
    startTransition(() => {
      formAction(data as SubjectSchema);
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
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {isPending ? 'Processing...' : type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default SubjectForm;
