/** @format */

import { useState } from "react";

interface PaginationProps {
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  totalItems = 100,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange = () => {},
}: PaginationProps) {
  const [activePage, setActivePage] = useState<number>(currentPage);
  const totalPages: number = Math.ceil(totalItems / itemsPerPage);

  // Create an array of page numbers to display
  const getPageNumbers = (): Array<number | string> => {
    const pageNumbers: Array<number | string> = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have less than max pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page
      pageNumbers.push(1);

      // Calculate start and end of page number range
      let startPage: number = Math.max(2, activePage - 1);
      let endPage: number = Math.min(totalPages - 1, activePage + 1);

      // Adjust if at the beginning
      if (activePage <= 2) {
        endPage = 4;
      }

      // Adjust if at the end
      if (activePage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add page numbers in range
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages && page !== activePage) {
      setActivePage(page);
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      {/* Previous button */}
      <button
        onClick={() => handlePageChange(activePage - 1)}
        disabled={activePage === 1}
        className={`px-3 py-1 rounded-md ${
          activePage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Trước
      </button>

      {/* Page numbers */}
      <div className="flex  space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === "number" ? handlePageChange(page) : null
            }
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              page === activePage
                ? "bg-blue-500 text-white"
                : typeof page === "number"
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-white text-gray-500"
            }`}
            disabled={typeof page !== "number"}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => handlePageChange(activePage + 1)}
        disabled={activePage === totalPages}
        className={`px-3 py-1 rounded-md ${
          activePage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Sau
      </button>
    </div>
  );
}

// Example usage
interface PaginationExampleProps {
  initialPage?: number;
}

function PaginationExample({ initialPage = 1 }: PaginationExampleProps) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const totalItems = 87;
  const itemsPerPage = 10;

  // Calculate which items to display based on current page
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;

  return (
    <div className="w-full max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Pagination Example</h2>
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <p>
          Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}. Showing
          items {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, totalItems)} of {totalItems}.
        </p>
      </div>

      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export { PaginationExample };
