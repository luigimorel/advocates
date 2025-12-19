"use client";

import advocates from "../advocates.json";

import { useState, useMemo, useTransition, useCallback } from "react";
import { Pagination } from "./components/Pagination";
import Hero from "./components/Hero";

const ITEMS_PER_PAGE = 50;

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 font-medium">{children}</th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3">{children}</td>
);

export default function MemberTableApp() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return advocates.filter((row) => {
      const matchesSearch =
        search === "" ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.firm_name.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase()) ||
        row.phone.includes(search) ||
        row.certificate_no.includes(search);
      const matchesStatus = status === "all" || row.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [advocates, search, status]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = useMemo(
    () => filtered.slice(startIndex, endIndex),
    [filtered, startIndex, endIndex]
  );

  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearch(value);
      setCurrentPage(1);
    });
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    startTransition(() => {
      setStatus(value);
      setCurrentPage(1);
    });
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <>
      <Hero />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto bg-white  rounded p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900 ">Members</h1>
            <div className="text-sm text-gray-600 ">
              {filtered.length.toLocaleString()}{" "}
              {filtered.length === 1 ? "member" : "members"}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, firm, email, phone, or certificate..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300   bg-white  px-4 py-2.5 text-sm text-gray-900 
               placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-blue-500   transition-shadow"
              />
            </div>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full md:w-48 rounded-lg border border-gray-300   bg-white  px-4 py-2.5 text-sm text-gray-900 
             focus:outline-none focus:ring-2 focus:ring-blue-500   transition-shadow"
            >
              <option value="all">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Results count and pagination info */}
          {filtered.length > 0 && (
            <div className="mb-4 text-sm text-gray-600 ">
              Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of{" "}
              {filtered.length.toLocaleString()}
            </div>
          )}

          {/* Loading overlay during filter transitions */}
          {isPending && (
            <div className="absolute inset-0 bg-white/50  flex items-center justify-center rounded-lg z-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200  ">
            <table className="min-w-full">
              <thead className="bg-gray-100  sticky top-0">
                <tr className="text-left text-sm text-gray-600 ">
                  <Th>Name</Th>
                  <Th>Firm</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Enrollment</Th>
                  <Th>Renewal</Th>
                  <Th>Certificate</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200  bg-white ">
                {currentItems.map((row) => (
                  <tr
                    key={row.id}
                    className="text-sm text-gray-800  hover:bg-gray-50 transition-colors"
                  >
                    <Td>
                      <div className="font-medium">{row.name}</div>
                    </Td>
                    <Td>{row.firm_name}</Td>
                    <Td>
                      {row.email ? (
                        <a
                          href={`mailto:${row.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {row.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </Td>
                    <Td>
                      {row.phone ? (
                        <a
                          href={`tel:${row.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {row.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </Td>
                    <Td>{row.enrollment_date}</Td>
                    <Td>{row.renewal_date}</Td>
                    <Td>
                      <span className="font-mono text-xs">
                        {row.certificate_no}
                      </span>
                    </Td>
                    <Td>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          row.status === "Active"
                            ? "bg-green-100 text-green-700 "
                            : "bg-red-100 text-red-700  "
                        }`}
                      >
                        {row.status}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-white">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400  mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-sm font-medium text-gray-900  mb-1">
                  No results found
                </h3>
                <p className="text-sm text-gray-500 ">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              pageNumbers={pageNumbers}
              currentPage={currentPage}
              goToPage={goToPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </>
  );
}
