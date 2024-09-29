import React from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const siblingsCount = 1; // Number of siblings on each side
    const totalButtons = 7; // Total number of buttons including ellipses

    // Always add first page
    pageNumbers.push(1);

    if (totalPages <= totalButtons) {
      // If total pages are less than or equal to totalButtons, show all pages
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let leftSibling = Math.max(currentPage - siblingsCount, 2);
      const rightSibling = Math.min(currentPage + siblingsCount, totalPages - 1);

      const shouldShowLeftDots = leftSibling > 2;
      const shouldShowRightDots = rightSibling < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        // Show more pages on the left
        leftSibling = 2;
        for (let i = leftSibling; i <= leftSibling + 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Show more pages on the right
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages - 1; i++) {
          pageNumbers.push(i);
        }
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Show dots on both sides
        pageNumbers.push('...');
        for (let i = leftSibling; i <= rightSibling; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
      }
    }

    // Always add last page
    if (pageNumbers[pageNumbers.length - 1] !== totalPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="join">
      <button
        className="join-item btn rounded-full dark:btn-neutral dark:text-gray"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <MdKeyboardDoubleArrowLeft />
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          className={`join-item  px-3 md:px-4 btn dark:btn-neutral dark:text-gray ${
            currentPage === page ? 'btn-primary dark:btn-error' : ''
          } rounded-full`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <button
        className="join-item btn rounded-full dark:btn-neutral dark:text-gray"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <MdKeyboardDoubleArrowRight />
      </button>
    </div>
  );
};

export default Pagination;