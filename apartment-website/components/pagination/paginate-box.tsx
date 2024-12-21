import clsx from 'clsx';
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import PageNumbers from './page-number';

interface PaginatorBoxProps {
  page: number;
  totalPage: number;
}

const PaginatorBox: React.FC<PaginatorBoxProps> = ({ page, totalPage }) => {
  // Remove console logs to optimize performance
  // console.log(totalPage, page);

  // Helper function to generate page numbers
  const generatePageNumbers = useMemo(() => {
    const pages: number[] = [];

    if (totalPage <= 3) {
      // If total pages are 3 or less, show all pages
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      if (page === 1) {
        pages.push(1, 2, 3);
      } else if (page === totalPage) {
        pages.push(totalPage - 2, totalPage - 1, totalPage);
      } else {
        pages.push(page - 1, page, page + 1);
      }
    }

    // Ensure no invalid page numbers
    return pages.filter((p) => p >= 1 && p <= totalPage);
  }, [page, totalPage]);

  // Determine if "Previous" and "Next" buttons should be disabled
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= totalPage;

  return (
    <div
      aria-label='Pagination Navigation'
      className='isolate inline-flex -space-x-px rounded-md shadow-sm'
    >
      {isPreviousDisabled ? (
        <span
          className={clsx(
            'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 cursor-not-allowed'
          )}
          aria-disabled='true'
        >
          <span className='sr-only'>Previous</span>
          <MoveLeftIcon
            className='h-5 w-5'
            aria-hidden='true'
          />
        </span>
      ) : (
        <Link
          href={`?page=${page - 1}`}
          className={clsx(
            'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-secondary'
          )}
          aria-label='Previous Page'
          shallow
        >
          <span className='sr-only'>Previous</span>
          <MoveLeftIcon
            className='h-5 w-5'
            aria-hidden='true'
          />
        </Link>
      )}

      {generatePageNumbers.map((item) => (
        <PageNumbers
          key={item}
          value={item}
          activePage={page}
        />
      ))}

      {isNextDisabled ? (
        <span
          className={clsx(
            'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 cursor-not-allowed'
          )}
          aria-disabled='true'
        >
          <span className='sr-only'>Next</span>
          <MoveRightIcon
            className='h-5 w-5'
            aria-hidden='true'
          />
        </span>
      ) : (
        <Link
          href={`?page=${page + 1}`}
          className={clsx(
            'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-none focus:ring-2 focus:ring-secondary'
          )}
          aria-label='Next Page'
          shallow
        >
          <span className='sr-only'>Next</span>
          <MoveRightIcon
            className='h-5 w-5'
            aria-hidden='true'
          />
        </Link>
      )}
    </div>
  );
};

export default PaginatorBox;
