"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterDepartment from "./FilterDepartment";
import FilterShortlisted from "./FilterShortlisted";
import FilterPriority from "./FilterPriority";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "./ui/button";
import { CheckBoxComp } from "./CheckBoxComp";
import { toast } from "sonner";
import { months, resolveQuestionLabel, CSV_Header } from "@/constants";
import { getDepartmentDisplayName } from "@/lib/departments";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Search } from "lucide-react";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
} from "react-table";
import { Input } from "@/components/ui/input";
import PaginationComp from "./PaginationComp";
import DialogComp from "./DialogComp";
import { CSVLink } from "react-csv";

const DataTable = ({
  data = [],
  filteredData: propFilteredData,
  onDataChange,
  searchQuery = "",
  setSearchQuery,
  selectedDept = "",
  setSelectedDept,
  selectedPriority = "",
  setSelectedPriority,
  selectedShortlist = "",
  setSelectedShortlist,
  handleResetFilters,
  isFiltered = false,
}) => {
  // Local fallback state if DataTable is used standalone
  const [localSearch, setLocalSearch] = useState("");
  const [localDept, setLocalDept] = useState("");
  const [localPriority, setLocalPriority] = useState("");
  const [localShortlist, setLocalShortlist] = useState("");

  const search = setSearchQuery ? searchQuery : localSearch;
  const onSearchChange = setSearchQuery ? setSearchQuery : setLocalSearch;

  const dept = setSelectedDept ? selectedDept : localDept;
  const onDeptChange = setSelectedDept ? setSelectedDept : setLocalDept;

  const priority = setSelectedPriority ? selectedPriority : localPriority;
  const onPriorityChange = setSelectedPriority ? setSelectedPriority : setLocalPriority;

  const shortlist = setSelectedShortlist ? selectedShortlist : localShortlist;
  const onShortlistChange = setSelectedShortlist ? setSelectedShortlist : setLocalShortlist;

  const onReset = handleResetFilters
    ? handleResetFilters
    : () => {
        setLocalSearch("");
        setLocalDept("");
        setLocalPriority("");
        setLocalShortlist("");
      };

  const activeFiltered = isFiltered !== undefined
    ? isFiltered
    : Boolean(search.trim() || dept || priority || shortlist);

  // If filteredData is supplied by parent (AdminContent), use it; otherwise compute locally
  const effectiveFilteredData = useMemo(() => {
    if (propFilteredData) return propFilteredData;
    return data.filter((item) => {
      if (dept && item.Department !== dept) return false;
      if (shortlist === "true" && !item.shortlisted) return false;
      if (shortlist === "false" && item.shortlisted) return false;
      if (priority === "1" && item.priority !== 1 && item.priority !== "1") return false;
      if (priority === "2" && item.priority !== 2 && item.priority !== "2") return false;
      if (
        priority === "not_set" &&
        (item.priority === 1 || item.priority === "1" || item.priority === 2 || item.priority === "2")
      ) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const name = String(item.Name || "").toLowerCase();
        const email = String(item.Email || "").toLowerCase();
        const regNo = String(item.RegistrationNumber || "").toLowerCase();
        const rawDept = String(item.Department || "").toLowerCase();
        const displayDept = String(getDepartmentDisplayName(item.Department) || "").toLowerCase();
        const matches =
          name.includes(q) ||
          email.includes(q) ||
          regNo.includes(q) ||
          rawDept.includes(q) ||
          displayDept.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [propFilteredData, data, dept, shortlist, priority, search]);

  const handleShortlist = useCallback(
    async (id, isShortlisted) => {
      try {
        const nextShortlisted = !Boolean(isShortlisted);
        const res = await fetch(`/api/shortlist/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shortlisted: nextShortlisted }),
        });

        if (res.ok) {
          const updater = (prev) =>
            prev.map((applicant) => {
              if (applicant._id === id || applicant.id === id) {
                return { ...applicant, shortlisted: nextShortlisted };
              }
              return applicant;
            });

          if (typeof onDataChange === "function") {
            onDataChange(updater);
          }
          toast.success(
            nextShortlisted
              ? "Student shortlisted successfully!"
              : "Student unshortlisted successfully!"
          );
        } else {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.message || "Failed to update applicant status.";
          toast.error(errMsg);
        }
      } catch (error) {
        console.error("Error occurred while updating the status:", error.message);
        toast.error("Failed to update status");
      }
    },
    [onDataChange]
  );

  // Evaluate single-shortlist blocking against ALL data to preserve constraint across filters
  const studentShortlistMap = useMemo(() => {
    const map = new Map();
    data.forEach((item) => {
      if (item.shortlisted && item.Email) {
        map.set(item.Email, {
          id: item._id || item.id,
          department: item.Department,
          priority: item.priority,
        });
      }
    });
    return map;
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "RegistrationNumber",
        accessor: "RegistrationNumber",
      },
      {
        Header: "Priority",
        accessor: "priority",
        Cell: ({ value }) => {
          if (value === 1 || value === "1") {
            return (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                P1
              </span>
            );
          }
          if (value === 2 || value === "2") {
            return (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                P2
              </span>
            );
          }
          return (
            <span className="text-xs text-muted-foreground/70 italic">
              Not set
            </span>
          );
        },
      },
      {
        Header: "Department",
        accessor: "Department",
        Cell: ({ value }) => getDepartmentDisplayName(value) || value || "N/A",
      },
      {
        Header: "Gender",
        accessor: (row) => row.Gender || "N/A",
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Shortlist Status",
        accessor: "shortlisted",
        Cell: ({ row }) => {
          const applicant = row.original;
          const id = applicant._id || applicant.id;
          const isShortlisted = Boolean(applicant.shortlisted);
          const studentEmail = applicant.Email;
          const selectedOther = studentEmail ? studentShortlistMap.get(studentEmail) : null;
          const isBlocked = !isShortlisted && selectedOther && selectedOther.id !== id;

          if (isShortlisted) {
            return (
              <div className="flex flex-col items-start gap-1">
                <button
                  type="button"
                  onClick={() => handleShortlist(id, true)}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors w-[125px]"
                >
                  Unshortlist
                </button>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Shortlisted
                </span>
              </div>
            );
          }

          if (isBlocked) {
            const otherDeptName =
              getDepartmentDisplayName(selectedOther.department) ||
              selectedOther.department ||
              "another department";
            const otherPriority = selectedOther.priority
              ? `P${selectedOther.priority}`
              : null;
            return (
              <div className="flex flex-col items-start gap-1">
                <button
                  type="button"
                  disabled
                  title={`Unavailable — student already shortlisted for ${otherDeptName}${
                    otherPriority ? ` (${otherPriority})` : ""
                  }`}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/60 cursor-not-allowed opacity-75 w-[125px]"
                >
                  Already Shortlisted
                </button>
                <span
                  className="text-[10px] text-muted-foreground leading-tight max-w-[130px] truncate"
                  title={`Unavailable — student already shortlisted for ${otherDeptName}`}
                >
                  Already shortlisted for {otherDeptName}
                </span>
              </div>
            );
          }

          return (
            <button
              type="button"
              onClick={() => handleShortlist(id, false)}
              className="px-3 py-1.5 rounded text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors w-[125px]"
            >
              Shortlist
            </button>
          );
        },
      },
    ],
    [handleShortlist, studentShortlistMap]
  );

  const stateReducer = useCallback((newState, action, prevState) => {
    if (action.type === "toggleRowSelected") {
      const isSelected = Boolean(prevState?.selectedRowIds?.[action.id]);
      const shouldSelect =
        typeof action.value !== "undefined"
          ? Boolean(action.value)
          : !isSelected;

      return {
        ...newState,
        selectedRowIds: shouldSelect ? { [action.id]: true } : {},
      };
    }

    if (
      action.type === "toggleAllRowsSelected" ||
      action.type === "toggleAllPageRowsSelected"
    ) {
      return {
        ...newState,
        selectedRowIds: {},
      };
    }

    return newState;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: effectiveFilteredData,
      getRowId: (row, index) => row._id || row.id || String(index),
      autoResetSelectedRows: false,
      stateReducer,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((cols) => [
        {
          id: "selection",
          disableSortBy: true,
          Header: () => null,
          Cell: ({ row }) => (
            <CheckBoxComp {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...cols,
      ]);
    }
  );

  const { pageIndex } = state;

  const handlePageSize = (e) => {
    const sz = Number(e.target.value);
    if (sz) {
      setPageSize(sz);
    } else {
      setPageSize(10);
    }
  };

  const showRowData = useCallback(() => {
    if (!selectedFlatRows || selectedFlatRows.length === 0) return [];
    return [selectedFlatRows[0].original];
  }, [selectedFlatRows]);

  const formatQuestionsForCsv = (item) => {
    if (!item?.Questions) return "";

    if (Array.isArray(item.Questions)) {
      return item.Questions
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (Array.isArray(entry)) return entry.join(": ");
          if (entry && typeof entry === "object") {
            return Object.entries(entry)
              .map(([key, value]) => `${resolveQuestionLabel(key)}: ${value}`)
              .join(" | ");
          }
          return String(entry ?? "");
        })
        .join(" | ");
    }

    if (typeof item.Questions === "object") {
      return Object.entries(item.Questions)
        .map(([question, answer]) => `${resolveQuestionLabel(question)}: ${answer}`)
        .join(" | ");
    }

    return String(item.Questions);
  };

  const csv_link = useMemo(
    () => ({
      headers: CSV_Header,
      data: effectiveFilteredData.map((item) => {
        const deptDisplay =
          getDepartmentDisplayName(item.Department) || item.Department || "N/A";
        const priorityDisplay =
          item.priority === 1 || item.priority === "1"
            ? "P1"
            : item.priority === 2 || item.priority === "2"
            ? "P2"
            : "Not set";
        return {
          ...item,
          Department: deptDisplay,
          Priority: priorityDisplay,
          Pref: item.priority ? `P${item.priority}` : priorityDisplay,
          Gender: item.Gender || "N/A",
          Questions: formatQuestionsForCsv(item),
        };
      }),
    }),
    [effectiveFilteredData]
  );

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col gap-3 p-4 mt-5 shadow-sm">
      {/* Filter and Action Toolbar */}
      <div className="flex flex-wrap items-center justify-start gap-2.5 p-1">
        {/* Search Box */}
        <div className="relative min-w-[260px] flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, reg no, dept..."
            className="pl-8 text-xs h-9"
            aria-label="Search applicants"
          />
        </div>

        {/* Page Size */}
        <Input
          className="w-24 text-xs h-9"
          onChange={handlePageSize}
          placeholder="Page Size"
          type="number"
          min="1"
          aria-label="Page size"
        />

        {/* Department Filter */}
        <FilterDepartment value={dept} filterFunc={onDeptChange} />

        {/* Priority Filter */}
        <FilterPriority value={priority} filterFunc={onPriorityChange} />

        {/* Shortlist Filter */}
        <FilterShortlisted value={shortlist} filterFunc={onShortlistChange} />

        {/* Action Controls */}
        <DialogComp
          selectedApplicants={showRowData}
          onApplicantUpdate={(id, nextShortlisted) => {
            if (typeof onDataChange === "function") {
              onDataChange((prev) =>
                prev.map((applicant) => {
                  if (applicant._id === id || applicant.id === id) {
                    return { ...applicant, shortlisted: nextShortlisted };
                  }
                  return applicant;
                })
              );
            }
          }}
        />

        {/* Reset Filters Control */}
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="flex gap-1.5 items-center text-xs h-9"
          disabled={!activeFiltered}
        >
          <GrPowerReset className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </Button>

        {/* Download CSV */}
        <Button size="sm" className="h-9 text-xs">
          <CSVLink
            {...csv_link}
            filename={`applicants_${new Date().toISOString().slice(0, 10)}.csv`}
            className="flex gap-1.5 justify-center items-center"
          >
            <IoCloudDownloadOutline className="h-4 w-4" />
            <span>Download CSV</span>
          </CSVLink>
        </Button>
      </div>

      {/* Table Content */}
      <div className="border border-border rounded-md overflow-hidden overflow-x-auto">
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((hg) => (
              <TableRow key={hg.id} {...hg.getHeaderGroupProps()}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    {...header.getHeaderProps(header.getSortByToggleProps())}
                    aria-sort={
                      header.isSorted
                        ? header.isSortedDesc
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    <div className="inline-flex gap-1 items-center cursor-pointer select-none">
                      {header.render("Header")}
                      {header.canSort && (
                        <FaSortAmountDownAlt
                          className={`w-3 h-3 ${
                            header.isSorted ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                const rowKey = row.original._id || row.original.id || row.id;
                return (
                  <TableRow
                    key={rowKey}
                    {...row.getRowProps()}
                    className="hover:bg-muted/50 transition-colors duration-150"
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={`${rowKey}-${cell.column.id}`} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 3} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <p className="text-base font-semibold text-foreground">No applicants found</p>
                    <p className="text-xs text-muted-foreground">
                      {activeFiltered
                        ? "No applicant records match your active search terms or filters."
                        : "There are currently no applicant submissions recorded."}
                    </p>
                    {activeFiltered && (
                      <Button
                        onClick={onReset}
                        variant="secondary"
                        size="sm"
                        className="mt-2 text-xs flex gap-1.5 items-center"
                      >
                        <GrPowerReset className="w-3 h-3" />
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationComp
        pageIndex={pageIndex}
        pages={pageOptions.length}
        nextPage={nextPage}
        canNext={canNextPage}
        previousPage={previousPage}
        canPrev={canPreviousPage}
        goto={gotoPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default DataTable;
