import { PlusIcon } from 'lucide-react';
import { ApartmentCardDefault } from '../components/cards/apartment.default';
import FilterBox from '../components/filter/filter';
import ApartmentForm from '../components/forms/create-apartment';
import PaginatorBox from '../components/pagination/paginate-box';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../components/ui/drawer';
import { apartmentsAction } from '../lib/actions/apartment.action';
export interface Apartment {
  id: string;
  name: string;
  unitNumber: number;
  projectName: string;
  description: string;
}

interface HomeProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchKey = params?.q || '';
  const pagination = {
    page: parseInt(params?.page || '1', 10) || 1,
    limit: 9,
    totalCount: 0,
    totalPage: function () {
      return Math.ceil(this.totalCount / this.limit);
    },
  };
  let apartmentsResponse: any = [];

  const data = await apartmentsAction({
    filter: {
      searchKey: searchKey,
    },
    paginate: {
      page: pagination.page,
      limit: pagination.limit,
    },
  });

  pagination.totalCount = data?.Apartments?.data?.pageInfo?.totalCount || 0;
  apartmentsResponse = data?.Apartments.data! || [];

  return (
    <div className='capitalize font-bold text-3xl w-full'>
      <nav className='bg-white w-full fixed border-gray-200 z-20 top-0 start-0 border-b'>
        <div className=' flex justify-end py-3  px-[6rem] '>
          <Drawer>
            <DrawerTrigger
              type='button'
              className='flex items-center gap-2 text-white bg-secondary  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              <PlusIcon />
              Add Apartment
            </DrawerTrigger>
            <DrawerContent className='h-full lg:w-1/3 md:w-2/3  w-full'>
              <DrawerHeader>
                <DrawerTitle>Create Apartment</DrawerTitle>
                <DrawerDescription>
                  Create an apartment using required fields.
                </DrawerDescription>
                <ApartmentForm />
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>

      <header className='flex justify-between flex-wrap items-center py-3 px-4'>
        <h1>Apartments</h1>
        <FilterBox />
      </header>
      <section className='grid grid-cols-12  gap-6 px-4 mt-10'>
        {apartmentsResponse.items!.map((apartment: any) => (
          <ApartmentCardDefault
            key={apartment!.id}
            value={apartment}
          />
        ))}
      </section>
      {pagination.totalPage() > 1 && (
        <nav
          className='flex justify-center mt-6'
          aria-label='Apartment Pagination'
        >
          <PaginatorBox
            totalPage={pagination.totalPage()}
            page={pagination.page}
          />
        </nav>
      )}
    </div>
  );
}
