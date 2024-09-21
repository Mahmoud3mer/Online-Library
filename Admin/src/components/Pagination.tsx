import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  // If the total number of pages is less than or equal to 1, don't display pagination
  if (totalPages <= 1) {
    return (
      <div className="join">
        <button className="join-item btn rounded-full btn-disabled">«</button>
        <button className="join-item btn btn-primary rounded-full">1</button>
        <button className="join-item btn rounded-full btn-disabled">2</button>
        <button className="join-item btn rounded-full btn-disabled">3</button>
        <button className="join-item btn rounded-full btn-disabled">»</button>
      </div>
    );
  }

  // Determine the range of page numbers to display
  const getPageRange = () => {
    const range = [];
    
    // Always display a fixed 3-page range without shifting the selected page to the center
    let startPage = Math.max(1, currentPage - 2); // Start page is always two numbers before the current page
    const endPage = Math.min(totalPages, startPage + 2); // Show 3 pages at most

    // Ensure the range stays within bounds and doesn't display more than 3 pages
    if (endPage - startPage < 2 && startPage > 1) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  return (
    <div className="join">
      {/* Previous button: disabled when on the first page */}
      <button
        className="join-item btn rounded-full"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
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

      {/* Next button: disabled when on the last page */}
      <button
        className="join-item btn rounded-full"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
