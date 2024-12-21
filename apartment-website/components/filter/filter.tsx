import { FilterIcon } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import React from 'react';

interface FilterBoxProps {
  // q: string;
}
const FilterBox: React.FC<FilterBoxProps> = ({}) => {
  // const searchParams = useParams();
  const initialSearchKey = '';

  // const [searchKey, setSearchKey] = useState(initialSearchKey);
  // const [debouncedKey, setDebouncedKey] = useState(initialSearchKey);

  // // Update local state when searchParams change (e.g., via browser navigation)
  // useEffect(() => {
  //   setSearchKey(initialSearchKey);
  //   setDebouncedKey(initialSearchKey);
  // }, [initialSearchKey]);

  // // Debounce the search input
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     if (searchKey.length >= 3 || searchKey.length === 0) {
  //       setDebouncedKey(searchKey);
  //     }
  //   }, 300);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [searchKey]);

  // // Update the URL when debouncedKey changes
  // useEffect(() => {
  //   const currentPage = searchParams.get('page') || '1';
  //   const query = new URLSearchParams(searchParams.toString());

  //   if (debouncedKey) {
  //     query.set('q', debouncedKey);
  //   } else {
  //     query.delete('q');
  //   }

  //   // Reset to page 1 when search query changes
  //   if (debouncedKey !== initialSearchKey) {
  //     query.set('page', '1');
  //   }

  //   // Avoid unnecessary router pushes
  //   const newQuery = query.toString();
  //   const currentQuery = searchParams.toString();
  //   if (newQuery !== currentQuery) {
  //     router.push(`/?${newQuery}`, { scroll: false });
  //   }
  // }, [debouncedKey, router, searchParams, initialSearchKey]);

  // const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchKey(e.target.value);
  // }, []);

  return (
    <form
      action={aerversdsa}
      className='flex gap-3 items-center md:mt-0 mt-5'
    >
      <FilterIcon
        className='cursor-pointer text-zinc-400'
        aria-label='Filter Apartments'
      />
      <input
        className='flex h-9 w-full max-w-xs font-semibold rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
        type='search'
        name='q'
        id='search'
        placeholder='Search apartments'
        defaultValue={initialSearchKey}
        aria-label='Search apartments'
      />
      {/* <Button
        type='submit'
        variant={'secondary'}
        className='text-white'
      >
        <SearchCheck />
      </Button> */}
    </form>
  );
};

FilterBox.displayName = 'FilterBox';

export default FilterBox;

export async function aerversdsa() {
  'use server';
  console.log("sdfs");

  revalidatePath('/', 'page');
}
