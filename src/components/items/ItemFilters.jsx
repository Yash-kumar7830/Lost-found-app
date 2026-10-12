import React from 'react';
import { Search, LayoutGrid, List, X, RotateCcw, MapPin, Calendar } from 'lucide-react';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../../data/mockItems';

export default function ItemFilters({
  search,
  setSearch,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalCount,
  onReset,
}) {
  const hasActiveFilters =
    search.trim() !== '' ||
    activeTab !== 'all' ||
    selectedCategory !== 'All Items' ||
    selectedLocation !== 'All Locations' ||
    dateFilter !== 'all';

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Top Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keywords, model, color, or location..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & Sort Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 shadow-xs"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="relevance">Sort: Most Relevant</option>
          </select>

          {/* Grid/List Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Row: All, Lost, Found */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'lost', label: 'Lost Items' },
            { id: 'found', label: 'Found Items' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Location & Date Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Select */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Date Select */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
            </select>
            <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Horizon Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {ITEM_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">Active filters:</span>
          {activeTab !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              Type: {activeTab.toUpperCase()}
              <button onClick={() => setActiveTab('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'All Items' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All Items')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedLocation !== 'All Locations' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              Location: {selectedLocation}
              <button onClick={() => setSelectedLocation('All Locations')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {dateFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              Date: {dateFilter}
              <button onClick={() => setDateFilter('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              Search: "{search}"
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <span className="ml-auto font-medium text-slate-400">
            Showing {totalCount} item{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
