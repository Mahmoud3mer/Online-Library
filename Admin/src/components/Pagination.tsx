import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  // لا تظهر أزرار التصفح إذا كان عدد الصفحات 1 أو أقل
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

  // حساب بداية الصفحات المعروضة
  const startPage = currentPage > totalPages - 2 ? totalPages - 2 : currentPage;

  return (
    <div className="join">
      {/* زر السابق: يعطل إذا كنت في الصفحة الأولى */}
      <button
        className="join-item btn rounded-full"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </button>

      {/* عرض الأزرار بناءً على الصفحة الحالية */}
      {Array.from({ length: 3 }).map((_, index) => {
        const page = startPage + index;

        // التحقق من أن الزر لا يعرض أرقام صفحات تتجاوز العدد الإجمالي للصفحات
        if (page <= totalPages) {
          return (
            <button
              key={page}
              className={`join-item btn ${currentPage === page ? 'btn-primary' : ''} rounded-full`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        }

        return null;
      })}

      {/* زر التالي: يعطل إذا كنت في الصفحة الأخيرة */}
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
