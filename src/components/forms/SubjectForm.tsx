'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import { subjectSchema, SubjectSchema } from '@/lib/formValidationSchemas';
import { createSubject } from '@/lib/actions';

const SubjectForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data + 'Desde handle');
    createSubject(data);
  });
  return (
    <form action='' className='flex flex-col gap-8' onSubmit={onSubmit}>
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
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default SubjectForm;
