"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DepartmentCard from "@/components/explore/DepartmentCard";
import DepartmentDetailModal from "@/components/explore/DepartmentDetailModal";
import DepartmentCompareModal from "@/components/explore/DepartmentCompareModal";
import {
  DEPARTMENTS_EXPLORE_DATA,
  EXPLORE_CATEGORIES,
  getDepartmentExploreData,
  searchDepartments,
} from "@/constants/departmentsData";
import { useSubmissions } from "@/components/SubmissionsProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  GitCompare,
  X,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import Link from "next/link";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { submittedDepartments } = useSubmissions();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Selected department for detailed modal
  const [activeDeptModal, setActiveDeptModal] = useState(null);

  // Departments selected for comparison
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Handle deep link ?dept=<id> or ?dept=<name>
  useEffect(() => {
    const deptParam = searchParams.get("dept");
    if (deptParam) {
      const found = getDepartmentExploreData(deptParam);
      if (found) {
        setActiveDeptModal(found);
      }
    }
  }, [searchParams]);

  // Filtered departments list
  const filteredDepartments = useMemo(() => {
    return searchDepartments(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: DEPARTMENTS_EXPLORE_DATA.length };
    EXPLORE_CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = DEPARTMENTS_EXPLORE_DATA.filter((d) => d.category === cat).length;
      }
    });
    return counts;
  }, []);

  const handleToggleCompare = (deptId) => {
    setCompareList((prev) => {
      if (prev.includes(deptId)) {
        return prev.filter((id) => id !== deptId);
      }
      if (prev.length >= 2) {
        return [prev[1], deptId];
      }
      return [...prev, deptId];
    });
  };

  const handleOpenCompareFromDetail = (deptId) => {
    setCompareList((prev) => {
      if (prev.includes(deptId)) return prev;
      if (prev.length >= 2) return [prev[0], deptId];
      return [...prev, deptId];
    });
    setIsCompareModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <header className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Find Your Track</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Departments
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Understand what each team builds, discover the tools they use, and find the perfect match for your skills and interests before choosing your preferences.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/departments">Go to Priority Selection →</Link>
            </Button>
          </div>
        </header>

        {/* Filters & Search Toolbar */}
        <section className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {EXPLORE_CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:border-border/90 hover:text-foreground"
                    }`}
                  >
                    {category}
                    <span
                      className={`ml-1.5 text-[11px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {categoryCounts[category] || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search skills, tools, or tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs sm:text-sm rounded-full bg-card border-border focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Result Counter / Helper */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing <strong>{filteredDepartments.length}</strong> of{" "}
              {DEPARTMENTS_EXPLORE_DATA.length} departments
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-primary hover:underline font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </section>

        {/* Departments Grid */}
        {filteredDepartments.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onOpenDetails={(dept) => setActiveDeptModal(dept)}
                isComparing={compareList.includes(department.id)}
                onToggleCompare={handleToggleCompare}
                compareDisabled={compareList.length >= 2}
              />
            ))}
          </section>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/50">
            <Info className="h-8 w-8 mx-auto text-muted-foreground/60 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No matching departments found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any departments matching &quot;{searchQuery}&quot; in the &quot;{selectedCategory}&quot; category.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Floating Compare Dock (When user selected tracks for comparison) */}
        {compareList.length > 0 && (
          <aside
            aria-label="Department comparison drawer"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-xl p-3 sm:p-4 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline">
                Compare:
              </span>
              {compareList.map((id) => {
                const dept = getDepartmentExploreData(id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted border border-border text-foreground"
                  >
                    {dept?.shortName || dept?.name}
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {compareList.length === 1 && (
                <span className="text-xs text-muted-foreground italic hidden sm:inline">
                  (select 1 more to compare)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCompareList([])}
                className="text-xs h-8 px-2 text-muted-foreground"
              >
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={compareList.length < 2}
                onClick={() => setIsCompareModalOpen(true)}
                className="text-xs h-8 font-semibold gap-1.5"
              >
                <GitCompare className="h-3.5 w-3.5" />
                Compare Now
              </Button>
            </div>
          </aside>
        )}

        {/* Detailed Department Modal */}
        <DepartmentDetailModal
          department={activeDeptModal}
          isOpen={Boolean(activeDeptModal)}
          onClose={() => setActiveDeptModal(null)}
          onOpenCompare={handleOpenCompareFromDetail}
        />

        {/* Side-by-side Compare Modal */}
        <DepartmentCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          initialDept1Id={compareList[0]}
          initialDept2Id={compareList[1]}
        />
      </main>

      <Footer />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
