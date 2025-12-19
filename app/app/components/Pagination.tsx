interface PaginationProps {
  goToPage: (args: any) => void;
  currentPage: number;
  totalPages: number;
  pageNumbers: any;
}

export const Pagination = ({
  goToPage,
  currentPage,
  totalPages,
  pageNumbers,
}: PaginationProps) => {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        {pageNumbers.map((pageNum: any, idx: any) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-2 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum as number)}
              className={`min-w-10 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              {pageNum}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};
