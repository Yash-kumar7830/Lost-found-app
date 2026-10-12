import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ItemCard from '../components/items/ItemCard';
import ItemFilters from '../components/items/ItemFilters';
import ClaimModal from '../components/claims/ClaimModal';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { PlusCircle, SearchX } from 'lucide-react';

export default function ItemsPage() {
  const { items } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters State
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState(() => searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Claim Modal State
  const [claimTargetItem, setClaimTargetItem] = useState(null);

  // Sync searchParam changes
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setActiveTab('all');
    setSelectedCategory('All Items');
    setSelectedLocation('All Locations');
    setDateFilter('all');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    const now = Date.now();
    return items.filter((item) => {
      // 1. Tab filter (lost vs found)
      if (activeTab === 'lost' && item.type !== 'lost') return false;
      if (activeTab === 'found' && item.type !== 'found') return false;

      // 2. Category filter
      if (selectedCategory !== 'All Items' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Location filter
      if (selectedLocation !== 'All Locations' && item.location !== selectedLocation) {
        return false;
      }

      // 4. Date filter
      if (dateFilter !== 'all' && item.date) {
        const itemDate = new Date(item.date).getTime();
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
        if (dateFilter === 'today' && diffDays > 1) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
        if (dateFilter === 'month' && diffDays > 30) return false;
      }

      // 5. Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesLocation = item.location?.toLowerCase().includes(q);
        const matchesCategory = item.category?.toLowerCase().includes(q);
        const matchesMarks = item.distinguishingMarks?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesCategory && !matchesMarks) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (sortBy === 'relevance') {
        // Items with potential match or recent activity higher
        const scoreA = a.status === 'potential_match' ? 10 : 0;
        const scoreB = b.status === 'potential_match' ? 10 : 0;
        return scoreB - scoreA;
      }
      return 0;
    });
  }, [items, activeTab, selectedCategory, selectedLocation, dateFilter, search, sortBy]);

  // Pagination calculation
  const displayedItems = filteredItems.slice(0, page * pageSize);
  const hasMore = displayedItems.length < filteredItems.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Campus Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and claim lost and found possessions across university grounds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/report/found')}
          >
            Report Found
          </Button>
          <Button
            variant="gradient"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/report/lost')}
          >
            Report Lost
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <ItemFilters
        search={search}
        setSearch={handleSearchChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalCount={filteredItems.length}
        onReset={handleResetFilters}
      />

      {/* Item Cards Grid / List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No items match your criteria"
          description="We couldn't find any lost or found records with the selected filters. Try broadening your keywords or resetting filters."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {displayedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              onClaim={(target) => setClaimTargetItem(target)}
            />
          ))}
        </div>
      )}

      {/* Load More Interaction */}
      {hasMore && (
        <div className="pt-6 text-center">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setPage((p) => p + 1)}
          >
            Load More Items ({filteredItems.length - displayedItems.length} remaining)
          </Button>
        </div>
      )}

      {/* Claim Modal Instance */}
      {claimTargetItem && (
        <ClaimModal
          isOpen={!!claimTargetItem}
          onClose={() => setClaimTargetItem(null)}
          item={claimTargetItem}
        />
      )}
    </div>
  );
}
