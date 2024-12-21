'use client';
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import PageNumbers from './page-number';

interface PaginatorBoxProps {
  page: number;
  totalPage: number;
}

const PaginatorBox: React.FC<PaginatorBoxProps> = ({ page, totalPage }) => {
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
      <PageNumbers
        key={page - 1}
        value={page - 1}
        activePage={page}
        className='!px-2 rounded-l-md'
        disabled={isPreviousDisabled}
      >
        <MoveLeftIcon
          className='h-5 w-5'
          aria-hidden='true'
        />
      </PageNumbers>

      {generatePageNumbers.map((item) => (
        <PageNumbers
          key={item}
          value={item}
          activePage={page}
        />
      ))}

      <PageNumbers
        key={page + 1}
        value={page + 1}
        activePage={page}
        className='!px-2 rounded-r-md'
        disabled={isNextDisabled}
      >
        <MoveRightIcon
          className='h-5 w-5'
          aria-hidden='true'
        />
      </PageNumbers>
    </div>
  );
};

export default PaginatorBox;
