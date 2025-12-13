'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../InputField';
import Image from 'next/image';
import {
  TeacherSchemaInput,
  TeacherSchemaOutput,
  teacherSchema,
} from '@/lib/schemas/teacher.schema';
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import { createTeacher, updateTeacher } from '@/lib/actions/teacher.actions';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';

const TeacherForm = ({
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
  } = useForm<TeacherSchemaInput, any, TeacherSchemaOutput>({
    resolver: zodResolver(teacherSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useActionState(
    type === 'create' ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction({ ...data, img: img?.secure_url });
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Teacher has been ${type === 'create' ? 'created' : 'updated'}!`
      );
      setModalOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error('An error occurred while processing your request.');
    }
  }, [state, type, router, setModalOpen]);

  const subjects = relatedData?.subjects ?? [];
  return (
    <form action='' className='flex flex-col gap-8' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? 'Create a new teacher'
          : 'Update teacher information'}
      </h1>
      <span className='text-xs text-gray-400 font-medium'>
        Authentication Information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label='Username'
          type='text'
          register={register}
          name='username'
          defaultValue={data?.username}
          error={errors.username}
        />
        <InputField
          label='Email'
          type='email'
          register={register}
          name='email'
          defaultValue={data?.email}
          error={errors.email}
        />
        <InputField
          label='Password'
          type='password'
          register={register}
          name='password'
          defaultValue={data?.password}
          error={errors.password}
        />
      </div>
      <span className='text-xs text-gray-400 font-medium'>
        Personal Information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
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
          label='First Name'
          type='text'
          register={register}
          name='firstName'
          defaultValue={data?.firstName}
          error={errors.firstName}
        />
        <InputField
          label='Last Name'
          type='text'
          register={register}
          name='lastName'
          defaultValue={data?.lastName}
          error={errors.lastName}
        />
        <InputField
          label='Phone Number'
          type='text'
          register={register}
          name='phone'
          defaultValue={data?.phone}
          error={errors.phone}
        />
        <InputField
          label='Address'
          type='text'
          register={register}
          name='address'
          defaultValue={data?.address}
          error={errors.address}
        />
        <InputField
          label='Blood Type'
          type='text'
          register={register}
          name='bloodType'
          defaultValue={data?.bloodType}
          error={errors.bloodType}
        />
        <InputField
          label='Birthday'
          type='date'
          register={register}
          name='dateOfBirth'
          defaultValue={data?.birthday.toISOString().split('T')[0]}
          error={errors.dateOfBirth}
        />
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label htmlFor='sex' className='text-xs text-gray-500'>
            Sex
          </label>
          <select
            {...register('sex')}
            className='ring-[1.5px] ring-gray-300 rounded-md p-2 w-full'
            defaultValue={data?.sex}
          >
            <option value='MALE'>Male</option>
            <option value='FEMALE'>Female</option>
            <option value='OTHER'>Other</option>
          </select>
          {errors.sex?.message && (
            <p className='text-xs text-red-400'>
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label htmlFor='sex' className='text-xs text-gray-500'>
            Subjects
          </label>
          <select
            multiple
            {...register('subjects')}
            className='ring-[1.5px] ring-gray-300 rounded-md p-2 w-full'
            defaultValue={data?.subjects}
          >
            {subjects.map((subject: { id: string; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className='text-xs text-red-400'>
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
        <CldUploadWidget
          uploadPreset='school-management'
          onSuccess={(result, { widget }) => {
            setImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer'
                onClick={() => open()}
              >
                <Image
                  src='/upload.png'
                  alt='upload icon'
                  height={28}
                  width={28}
                />
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {isPending ? 'Processing...' : type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default TeacherForm;
