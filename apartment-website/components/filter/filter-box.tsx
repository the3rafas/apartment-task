'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useDebounce } from '../../hooks/use-debounce';
import FilterBar from './filter-bar';

const FilterBox: React.FC = ({ }) => {
  const debounceFn = useDebounce();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = debounceFn((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term.trim().length >= 3) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    replace(`${pathname}?${params.toString()}`);
  });

  const initialSearchKey = searchParams.get('q') || '';

  return (
    <form className='flex gap-3 items-center md:mt-0 mt-5'>
      <FilterBar

      />
      <input
        className='flex h-9 w-full max-w-xs font-semibold rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
        type='search'
        name='q'
        id='search'
        placeholder='Search apartments'
        defaultValue={initialSearchKey}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        aria-label='Search apartments'
      />
    </form>
  );
};

FilterBox.displayName = 'FilterBox';

export default FilterBox;
