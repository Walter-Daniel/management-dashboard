import React from 'react';
import { FieldError } from 'react-hook-form';

type InputFieldProps = {
  label: string;
  register: any;
  type?: string;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  InputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = 'text',
  register,
  name,
  defaultValue,
  error,
  InputProps,
}: InputFieldProps) => {
  return (
    <div className='flex flex-col gap-2 w-full md:w-1/4'>
      <label htmlFor={label} className='text-xs text-gray-500'>
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        className='ring-[1.5px] ring-gray-300 rounded-md p-2 w-full'
        {...InputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className='text-xs text-red-400'>{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
