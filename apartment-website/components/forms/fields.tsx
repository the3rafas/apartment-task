'use client';
import {
  ApartmentFormData,
  apartmentSchema,
} from '@/lib/validators/validator-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DrawerClose } from '../ui/drawer';
import { Input } from '../ui/input';
interface FieldsProps {
  name: keyof ApartmentFormData;
  label: string;
  type?: string;
  required?: boolean;
  errors: any;
}
export function Fields({ name, label, required, type, errors }: FieldsProps) {
  const {
    register,
    handleSubmit,
    // formState: { errors, isSubmitting },
    reset,
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: {
      name: '',
      projectName: '',
      country: '',
      city: '',
      specification: '',
      unitNumber: undefined,
      description: '',
      area: '',
    },
  });

  const renderFormField = () => {
    const Component = Input;
    return (
      <div className='mb-4 col-span-2 md:col-span-1'>
        <Label
          htmlFor={name}
          className='text-sm font-medium text-gray-700'
        >
          {label}
          {(required ?? true) && <span className='text-red-500'>*</span>}
        </Label>
        <Component
          id={name}
          type={type || 'text'}
          {...register(
            name,
            type === 'number' ? { valueAsNumber: true } : undefined
          )}
          className={`mt-1 block w-full ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        {errors[name] && (
          <p className='mt-1 text-sm text-red-600'>{errors[name]?.message}</p>
        )}
      </div>
    );
  };

  return <div>{renderFormField()}</div>;
}

export function CloseDrawer({ close }: { close: boolean }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  if (closed) {
    ref.current?.click();
  }
  return (
    <DrawerClose
      asChild
      className='opacity-0'
    >
      <Button
        variant='outline'
        ref={ref}
      >
        Cancel
      </Button>
    </DrawerClose>
  );
}
