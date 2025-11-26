'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputField from '../InputField';
import Image from 'next/image';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long!')
    .max(20, 'Username must be at most 20 characters long!'),
  email: z.email({ message: 'Invalid email address!' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' }),
  firstName: z.string().min(1, 'First name is required!'),
  lastName: z.string().min(1, 'Last name is required!'),
  phone: z.string().min(10, 'Phone number is required!'),
  address: z.string().min(1, 'Address is required!'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    message: 'Blood type is required!',
  }),
  dateOfBirth: z.date({ message: 'Birthday is required!' }),
  sex: z.enum(['Male', 'Female', 'Other'], { message: 'Sex is required!' }),
  img: z.instanceof(File, { message: 'Image is required!' }),
});

const StudentForm = ({
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
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });
  return (
    <form action='' className='flex flex-col gap-8' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>
        {type === 'create'
          ? 'Create a new student'
          : 'Update student Information'}
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
          defaultValue={data?.dateOfBirth}
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
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Other'>Other</option>
          </select>
          {errors.sex?.message && (
            <p className='text-xs text-red-400'>
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2 w-full md:w-1/4 justify-center'>
          <label
            htmlFor='img'
            className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer'
          >
            <Image src='/upload.png' alt='upload icon' height={28} width={28} />
            <span>Upload Image</span>
          </label>
          <input type='file' {...register('img')} className='hidden' id='img' />
          {errors.img?.message && (
            <p className='text-xs text-red-400'>
              {errors.img.message.toString()}
            </p>
          )}
        </div>
      </div>
      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default StudentForm;
