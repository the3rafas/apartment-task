'use client';

import { CreateApartmentDocument } from '@/gql/graphql';
import { useToast } from '@/hooks/use-toast';
import { executeGraphQL } from '@/lib/graphql';
import {
  ApartmentFormData,
  apartmentSchema,
} from '@/lib/validators/validator-fields';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { DrawerClose } from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface ApartmentFormProps {}

const ApartmentForm: React.FC<ApartmentFormProps> = ({}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const onSubmit = async (data: ApartmentFormData) => {
    try {
      const { data: response } = await executeGraphQL(CreateApartmentDocument, {
        variables: {
          input: {
            ...data,
            addressInfo: `${data.city}, ${data.country}`,
          },
        },
      });

      if (response?.createApartment.success) {
        toast({
          description: 'Apartment added successfully',
          className: 'bg-green-800 font-semibold text-white border-none',
        });
        reset();
        // await revalidate({});
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
          error?.message || 'Something went wrong while creating the apartment',
      });
    }
  };

  const renderFormField = (
    name: keyof ApartmentFormData,
    label: string,
    type: string = 'text',
    required: boolean = true
  ) => {
    const Component = Input;
    return (
      <div className='mb-4 col-span-2 md:col-span-1'>
        <Label
          htmlFor={name}
          className='text-sm font-medium text-gray-700'
        >
          {label}
          {required && <span className='text-red-500'>*</span>}
        </Label>
        <Component
          id={name}
          type={type}
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full h-[85%] mx-auto space-y-4'
    >
      <div className='max-h-[94%] overflow-auto mt-4 form-content grid grid-cols-2 gap-4'>
        {renderFormField('name', 'Name')}
        {renderFormField('projectName', 'Project Name')}
        {renderFormField('country', 'Country')}
        {renderFormField('city', 'City')}
        {renderFormField('area', 'Area', 'text', false)}
        {renderFormField('unitNumber', 'Unit Number', 'number')}

        <div className='mb-4 col-span-2'>
          <Label
            htmlFor='specification'
            className='text-sm font-medium text-gray-700'
          >
            Specification<span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='specification'
            {...register('specification')}
            className={`mt-1 block w-full ${
              errors.specification ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Enter specifications'
            rows={4}
            maxLength={1000}
          />
          {errors.specification && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.specification.message}
            </p>
          )}
        </div>

        <div className='mb-4 col-span-2'>
          <Label
            htmlFor='description'
            className='text-sm font-medium text-gray-700'
          >
            Description<span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='description'
            {...register('description')}
            className={`mt-1 block w-full ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder='Enter description'
            rows={3}
            maxLength={200}
          />
          {errors.description && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <div className='mt-6 gap-4 w-full'>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-secondary-hover hover:bg-secondary'
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
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
      </div>
    </form>
  );
};

export default ApartmentForm;
