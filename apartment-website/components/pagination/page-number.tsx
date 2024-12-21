'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
interface PageNumbersProps {
  value: number;
  activePage: number;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PageNumbers: React.FC<PageNumbersProps> = React.memo(
  ({ value, activePage, children, className, disabled }) => {
    const isActive = value === activePage;
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    params.set('page', value.toString());
    const baseClasses =
      'relative inline-flex items-center text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 transition-colors duration-200 px-4 py-2 w-full h-full flex items-center justify-center';

    const activeClasses = 'bg-secondary text-white cursor-default';
    const inactiveClasses = 'text-gray-900 hover:bg-gray-50 active:bg-gray-100';

    function scrollBehavior() {
      const target = document.getElementById('main') as HTMLElement;
      target.scrollIntoView({ behavior: 'smooth' });
    }

    if (isActive || disabled) {
      return (
        <span
          aria-current='page'
          className={clsx(
            baseClasses,
            !disabled && activeClasses,
            className,
            disabled && 'cursor-not-allowed'
          )}
        >
          {children ? children : value}
        </span>
      );
    }

    return (
      <Link
        href={{ query: params.toString() }}
        scroll={false}
        className={clsx(baseClasses, inactiveClasses, className)}
        aria-label={`Go to page ${value}`}
        shallow
        onClick={scrollBehavior}
      >
        {children ? children : value}
      </Link>
    );
  }
);

PageNumbers.displayName = 'PageNumbers';

export default PageNumbers;
