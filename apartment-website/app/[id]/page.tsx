import { ApartmentDocument, ApartmentQuery } from '@/gql/graphql';
import { executeGraphQL } from '@/lib/graphql';
import { HomeIcon } from 'lucide-react';
import Image from 'next/image';
import { FC, memo } from 'react';
// Define TypeScript interfaces for props
interface ApartmentDetailsProps {
  params: { id: string };
}

// Reusable Section Component
const Section: FC<{ title: string; children: React.ReactNode }> = memo(
  ({ title, children }) => (
    <section className='mt-6'>
      <h2 className='text-2xl font-semibold'>{title}</h2>
      {children}
    </section>
  )
);

// Reusable Address Subsection
const AddressSubsection: FC<{ title: string; value: string }> = memo(
  ({ title, value }) => (
    <div className='mb-4'>
      <h3 className='text-gray-500 font-bold capitalize mb-1'>{title}</h3>
      <p>{value}</p>
    </div>
  )
);

const ApartmentDetails: FC<ApartmentDetailsProps> = async ({ params }) => {
  const apartmentId = (await params).id;

  try {
    const { data } = await executeGraphQL<
      ApartmentQuery,
      { apartmentId: string }
    >(ApartmentDocument, {
      variables: { apartmentId },
    });

    const target = data?.Apartment?.data;

    if (!target) {
      return (
        <main className='container font-geist-sans'>
          <p className='text-red-500'>Apartment details not found.</p>
        </main>
      );
    }

    return (
      <main className='container font-geist-sans p-4'>
        <section className=' mb-4 w-full h-52 flex justify-center items-center rounded-lg bg-white p-4'>
          <Image
            className='dark:invert mx-auto object-fill aspect-video rounded-2xl bg-gray-100 w-full h-52 md:aspect-3/2 '
            src={'/default-apartment.jpeg'}
            alt={`Apartment Image for ${target.name}`}
            width={1200}
            height={600}
            quality={100}
            loading='lazy'
          />
        </section>

        <header className='mb-6'>
          <h1 className='text-2xl font-bold'>Details #{apartmentId}</h1>
          <div className='flex items-center mt-1 text-sm text-gray-500 gap-2'>
            <HomeIcon
              className='w-4'
              aria-hidden='true'
            />
            <span>{target.unitNumber}</span>
          </div>
        </header>

        <Section title='Basic Information'>
          <div className='flex flex-col md:flex-row justify-between'>
            <article className='flex-1 mb-4 md:mb-0 md:pr-2'>
              <div className='mb-4'>
                <h2 className='text-gray-500 font-bold capitalize'>Name</h2>
                <p>{target.name}</p>
              </div>
              <div className='mb-4'>
                <h2 className='text-gray-500 font-bold capitalize'>
                  Create Time
                </h2>
                <time dateTime={ target.createdAt }>
                  -
                  {/* {format(new Date(target.createdAt), "yyyy-MM-dd")} */}
                </time>
              </div>
            </article>
            <article className='flex-1 md:pl-2'>
              <div className='mb-4'>
                <h2 className='text-gray-500 font-bold capitalize'>
                  Project Name
                </h2>
                <p>{target.projectName}</p>
              </div>
              <div className='mb-4'>
                <h2 className='text-gray-500 font-bold capitalize'>
                  Description
                </h2>
                <p>{target.description}</p>
              </div>
            </article>
          </div>
        </Section>

        <Section title='Address'>
          <div className='flex flex-col md:flex-row justify-between'>
            <article className='flex-1 mb-4 md:mb-0 md:pr-2'>
              <AddressSubsection
                title='Country'
                value={target.location.country}
              />
              <AddressSubsection
                title='City'
                value={target.location.city}
              />
            </article>
            <article className='flex-1 md:pl-2'>
              <AddressSubsection
                title='Address Information'
                value={target.addressInfo}
              />
            </article>
          </div>
        </Section>

        <Section title='Specifications'>
          <div className='prose'>
            {target.specifications || 'No specifications available.'}
          </div>
        </Section>
      </main>
    );
  } catch (error) {
    console.error('Error fetching apartment details:', error);
    return (
      <main className='container font-geist-sans'>
        <p className='text-red-500'>
          Failed to load apartment details. Please try again later.
        </p>
      </main>
    );
  }
};

export default memo(ApartmentDetails);
