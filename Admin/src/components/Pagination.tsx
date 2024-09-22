import React, { useState, useEffect } from 'react';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {

  // Conditional rendering of pagination buttons with dots
  const renderPageNumbers = () => {
    const pageButtons = [];

    // First page
    pageButtons.push(
      <button
        key={1}
        className={`join-item btn dark:btn-neutral dark:text-gray ${currentPage === 1 ? 'btn-primary dark:btn-error' : ''} rounded-full btn-sm sm:btn-md`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    // Dots after the first page if currentPage > 3
    if (currentPage > 3) {
      pageButtons.push(<span key="start-dots" className='join-item btn dark:btn-neutral dark:text-gray btn-sm sm:btn-md'>...</span>);
    }

    // Middle pages, show the page before, current page, and page after
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
      pageButtons.push(
        <button
          key={i}
          className={`join-item btn dark:btn-neutral dark:text-gray ${currentPage === i ? 'btn-primary dark:btn-error' : ''} rounded-full btn-sm sm:btn-md`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Dots before the last page if currentPage < totalPages - 2
    if (currentPage < totalPages - 2) {
      pageButtons.push(<span key="end-dots" className='join-item btn dark:btn-neutral dark:text-gray btn-sm sm:btn-md'>...</span>);
    }

    // Last page
    pageButtons.push(
      <button
        key={totalPages}
        className={`join-item btn dark:btn-neutral dark:text-gray ${currentPage === totalPages ? 'btn-primary dark:btn-error' : ''} rounded-full btn-sm sm:btn-md`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>
    );

    return pageButtons;
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="join">
      {/* Previous button */}
      <button
        className="join-item btn rounded-full dark:btn-neutral dark:text-gray btn-sm sm:btn-md"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <MdKeyboardDoubleArrowLeft color='black' size={20}/>
      </button>

      {/* Pagination Numbers */}
        {renderPageNumbers()}

      {/* Next button */}
      <button
        className="join-item btn rounded-full dark:btn-neutral dark:text-gray btn-sm sm:btn-md"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <MdKeyboardDoubleArrowRight color='black' size={20}/>
        </button>
    </div>
  );
};

export default Pagination;
