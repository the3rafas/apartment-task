'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { CountriesDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/lib/graphql';
import { FilterIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import CheckboxItem from './checkbox';

function FilterBar() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const unitNumberRef = useRef<HTMLInputElement>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(() =>
    searchParams.getAll('countries')
  );

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await executeGraphQL(CountriesDocument, {});
        if (data?.countries?.data) {
          setCountries(data.countries.data as string[]);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleCheckboxChange = useCallback((country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  }, []);

  const handleSubmit = useCallback(() => {
    const newParams = new URLSearchParams(params);

    if (+(newParams.get('page') || 1) > 1) {
      newParams.set('page', '1');
    }

    newParams.delete('countries');
    selectedCountries.forEach((country) => {
      newParams.append('countries', country);
    });

    const unitValue = unitNumberRef.current?.value;
    if (unitValue) {
      newParams.set('unitNumber', unitValue);
    } else {
      newParams.delete('unitNumber');
    }

    replace(`${pathname}?${newParams.toString()}`);
  }, [params, pathname, replace, selectedCountries]);

  const handleClear = useCallback(() => {
    setSelectedCountries([]);
    if (unitNumberRef.current) {
      unitNumberRef.current.value = '';
    }
  }, []);

  return (
    <Drawer direction='left'>
      <DrawerTrigger
        className='cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors'
        aria-label='Filter Apartments'
        type='button'
      >
        <FilterIcon />
      </DrawerTrigger>
      <DrawerContent className='h-full lg:w-1/4 md:w-2/3 w-full'>
        <DrawerHeader className='flex flex-row justify-between'>
          <div>
            <DrawerTitle>Filter bar</DrawerTitle>
            <DrawerDescription>choose your filters here.</DrawerDescription>
          </div>
          <Button
            type='reset'
            variant='ghost'
            onClick={handleClear}
          >
            Clear
          </Button>
        </DrawerHeader>
        <div className='p-5'>
          <Accordion
            type='single'
            collapsible
            className='w-full'
            defaultValue='unit'
          >
            <AccordionItem value='unit'>
              <AccordionTrigger>Unit number</AccordionTrigger>
              <AccordionContent className='px-3'>
                <Input
                  className='mt-1 block w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2'
                  type='number'
                  placeholder='Unit number'
                  ref={unitNumberRef}
                  defaultValue={searchParams.get('unitNumber') || ''}
                  min={0}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='countries'>
              <AccordionTrigger>Countries</AccordionTrigger>
              <AccordionContent className='grid grid-cols-4 form-content max-h-[300px] overflow-y-auto gap-y-3'>
                {countries.map((country) => (
                  <CheckboxItem
                    key={country}
                    label={country}
                    checked={selectedCountries.includes(country)}
                    onChange={() => handleCheckboxChange(country)}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <DrawerFooter className='flex flex-row justify-between'>
          <DrawerClose asChild>
            <Button variant='ghost'>Cancel</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={handleSubmit}
              variant='secondary'
            >
              Submit
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

FilterBar.displayName = 'FilterBar';

export default FilterBar;
