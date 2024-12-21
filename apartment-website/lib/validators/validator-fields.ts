import { z } from 'zod';

export const textValidator = (flag: string) =>
  z.string().min(1, { message: flag + '  is required' });

export const numberValidator = (flag: string) =>
  z
    .number({ invalid_type_error: `${flag} is required` })
    .int({ message: `${flag} must be an integer` })
    .positive({ message: `${flag} must be positive` });

export const bigTextValidator = (flag: string, length: number = 250) =>
  z
    .string()
    .min(1, { message: `${flag} is required` })
    .max(length, {
      message: `Specification must be at most ${length} characters`,
    });

export const apartmentSchema = z.object({
  name: textValidator('Name'),
  projectName: textValidator('Project name'),
  country: textValidator('Country'),
  city: textValidator('City'),
  specification: bigTextValidator('Specification', 1000),
  unitNumber: numberValidator('Unit Number'),
  description: bigTextValidator('Specification', 250),
  area: bigTextValidator('Specification', 100).optional().or(z.literal('')), // Allow empty string
});

export type ApartmentFormData = z.infer<typeof apartmentSchema>;
