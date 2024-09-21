import React, { useState, useEffect } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const [pageRange, setPageRange] = useState<number[]>([]);

  // This state keeps track of the current start page for the range
  const [rangeStart, setRangeStart] = useState(1);

  useEffect(() => {
    const calculatePageRange = () => {
      const range = [];
      const rangeSize = 3; // Number of pages to display at a time
      let endPage = Math.min(rangeStart + rangeSize - 1, totalPages);

      // Build the range array
      for (let i = rangeStart; i <= endPage; i++) {
        range.push(i);
      }

      setPageRange(range);
    };

    calculatePageRange();
  }, [rangeStart, totalPages]);

  const handleNext = () => {
    if (rangeStart + 3 <= totalPages) {
      setRangeStart(rangeStart + 1); // Shift range by one page forward
    }
    onPageChange(currentPage + 1);
  };

  const handlePrevious = () => {
    if (rangeStart > 1) {
      setRangeStart(rangeStart - 1); // Shift range by one page backward
    }
    onPageChange(currentPage - 1);
  };

  return (
    <div className="join">
      {/* Previous button: disabled on the first page */}
      <button
        className="join-item btn rounded-full"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      >
        «
      </button>

      {/* Page buttons */}
      {pageRange.map(page => (
        <button
          key={page}
          className={`join-item btn ${currentPage === page ? 'btn-primary' : ''} rounded-full`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next button: disabled on the last page */}
      <button
        className="join-item btn rounded-full"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
