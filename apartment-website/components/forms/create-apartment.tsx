'use client';

import { CreateApartmentDocument } from '@/gql/graphql';
import { useToast } from '@/hooks/use-toast';
import { executeGraphQL } from '@/lib/graphql';
import {
  ApartmentFormData,
  apartmentSchema,
} from '@/lib/validators/validator-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DrawerClose } from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

// Define the form fields and their properties
const formFields: Array<{
  name: keyof ApartmentFormData;
  label: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
}> = [
  { name: 'name', label: 'Name' },
  { name: 'projectName', label: 'Project Name' },
  { name: 'country', label: 'Country' },
  { name: 'city', label: 'City' },
  { name: 'area', label: 'Area', required: false },
  { name: 'unitNumber', label: 'Unit Number', type: 'number' },
];

// Define the textarea fields
const textAreaFields: Array<{
  name: keyof ApartmentFormData;
  label: string;
  rows?: number;
  maxLength?: number;
}> = [
  { name: 'addressInfo', label: 'Address Info', rows: 4, maxLength: 500 },
  { name: 'specification', label: 'Specification' },
  { name: 'description', label: 'Description', rows: 3, maxLength: 250 },
];

const ApartmentForm: React.FC = () => {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: {
      name: undefined,
      projectName: undefined,
      country: undefined,
      city: undefined,
      specification: undefined,
      unitNumber: undefined,
      description: undefined,
      area: undefined,
      addressInfo: undefined,
    },
  });

  const onSubmit: SubmitHandler<ApartmentFormData> = useCallback(
    async (data) => {
      try {
        const { data: response } = await executeGraphQL(
          CreateApartmentDocument,
          {
            variables: {
              input: data,
            },
          }
        );

        if (response?.createApartment.success) {
          toast({
            description: 'Apartment added successfully',
            className: 'bg-green-800 font-semibold text-white border-none',
          });
          reset();
          router.refresh();
          ref.current?.click();
        } else {
          throw new Error(
            response?.createApartment?.message || 'Failed to create apartment'
          );
        }
      } catch (error: any) {
        console.error('Error creating apartment:', error);
        toast({
          variant: 'destructive',
          description:
            error?.message ||
            'Something went wrong while creating the apartment',
        });
      }
    },
    [executeGraphQL, toast, reset, router]
  );

  const renderFormField = useCallback(
    (field: (typeof formFields)[0]) => {
      const { name, label, type = 'text', required = true } = field;
      return (
        <div
          key={name}
          className='mb-4 col-span-2 md:col-span-1'
        >
          <Label
            htmlFor={name}
            className='text-sm font-medium text-gray-700 flex items-center gap-1'
          >
            {label}
            {required && <span className='text-red-500'>*</span>}
          </Label>
          <Input
            id={name}
            type={type}
            {...register(
              name,
              type === 'number' ? { valueAsNumber: true } : undefined
            )}
            className={clsx(
              'mt-1 block w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2',
              errors[name]
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            )}
            placeholder={`Enter ${label.toLowerCase()}`}
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
          />
          {errors[name] && (
            <p
              className='mt-1 text-sm font-thin text-red-600'
              id={`${name}-error`}
              role='alert'
            >
              {errors[name]?.message}
            </p>
          )}
        </div>
      );
    },
    [register, errors]
  );

  const renderTextArea = useCallback(
    (field: (typeof textAreaFields)[0]) => {
      const { name, label, rows = 4, maxLength = 1000 } = field;
      const value = (watch(name) as string) || '';
      return (
        <div
          key={name}
          className='mb-4 col-span-2'
        >
          <Label
            htmlFor={name}
            className='text-sm font-medium text-gray-700 flex items-center gap-1'
          >
            {label}
            <span className='text-red-500'>*</span>
          </Label>
          <div className='relative'>
            <Textarea
              id={name}
              {...register(name)}
              className={clsx(
                'mt-1 block w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2',
                errors[name]
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              )}
              placeholder={`Enter ${label.toLowerCase()}`}
              rows={rows}
              maxLength={maxLength}
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            <span className='absolute bottom-2 right-2 text-xs text-gray-500'>
              {value.length}/{maxLength}
            </span>
          </div>
          {errors[name] && (
            <p
              className='mt-1 text-sm font-thin text-red-600'
              id={`${name}-error`}
              role='alert'
            >
              {errors[name]?.message}
            </p>
          )}
        </div>
      );
    },
    [register, errors, watch]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full h-[85%] mx-auto space-y-4'
      noValidate
    >
      <div className='max-h-[81%] overflow-auto mt-4 form-content grid grid-cols-2 gap-4 px-2'>
        {formFields.map(renderFormField)}
        {textAreaFields.map(renderTextArea)}
      </div>

      <div className='mt-6 gap-4 w-full flex flex-col'>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-secondary-hover hover:bg-secondary transition-colors duration-200'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
        <DrawerClose
          asChild
          className='opacity-0'
          ref={ref}
        >
          <Button
            variant='outline'
            ref={ref}
          >
            Cancel
          </Button>
        </DrawerClose>
      </div>
    </form>
  );
};

export default React.memo(ApartmentForm);
