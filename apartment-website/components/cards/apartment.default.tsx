import { HomeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function ApartmentCardDefault({ value }: { value: any }) {
  return (
    <article className='lg:col-span-4 md:col-span-6 shadow p-4 col-span-12 flex flex-col justify-center items-start'>
      <div className='w-full  max-h-fit'>
        <Image
          className='dark:invert mx-auto object-cover rounded-2xl bg-gray-100 max-w-full h-auto md:aspect-3/2 aspect-2/1'
          src='/test.jpeg'
          alt={value.name + value.id}
          width={1000}
          height={500}
          loading='lazy'
        />
      </div>
      <div className='w-full'>
        <div className='text-sm gap-2 flex items-center mt-1 '>
          <p className='flex items-center gap-1  text-gray-500 '>
            <HomeIcon className='!w-[16px]' />
            {value.unitNumber}
          </p>
          <p className='font-medium px-2 text-white  bg-secondary rounded-xl capitalize relative z-10'>
            {value.projectName}
          </p>
        </div>
        <div className='relative'>
          <h3 className='font-semibold text-lg mt-3 text-primary'>
            {value.name}
          </h3>
          <p className='text-sm overflow-hidden  text-gray-600 mt-3 line-clamp-3 min-h-14'>
            {value.description}
          </p>
        </div>

        <div className='relative flex items-center justify-between mt-5 text-sm text-zinc-600 font-normal'>
          <button type='button'>
            <Link
              href={'/' + value.id}
              className='cursor-pointer capitalize px-3 py-2 text-white text-sm rounded-md  bg-secondary hover:bg-secondary-hover'
            >
              Know more
            </Link>
          </button>
          <time>12-11-2023</time>
        </div>
      </div>
    </article>
  );
}
