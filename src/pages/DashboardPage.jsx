import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  PackagePlus,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  PlusCircle,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import MonthlyTrendsChart from '../components/charts/MonthlyTrendsChart';
import CategoryDistributionChart from '../components/charts/CategoryDistributionChart';
import ItemCard from '../components/items/ItemCard';
import ClaimModal from '../components/claims/ClaimModal';
import { formatDate } from '../utils/helpers';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    items,
    myLostCount,
    myFoundCount,
    potentialMatchesCount,
    resolvedCount
  } = useData();
  const navigate = useNavigate();

  const [claimTargetItem, setClaimTargetItem] = useState(null);
  const [chartType, setChartType] = useState('area');

  // Candidate items with potential match
  const potentialMatchItems = items.filter((item) => item.status === 'potential_match').slice(0, 2);

  // Recent 5 reports for the table
  const recentReports = items.slice(0, 5);

  const metricCards = [
    {
      title: 'My Lost Items',
      count: myLostCount,
      desc: 'Active lost notices',
      icon: HelpCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60',
      link: '/my-reports?tab=lost',
    },
    {
      title: 'My Found Items',
      count: myFoundCount,
      desc: 'Turned into security',
      icon: PackagePlus,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/60',
      link: '/my-reports?tab=found',
    },
    {
      title: 'Potential Matches',
      count: potentialMatchesCount,
      desc: 'High confidence pairs',
      icon: Sparkles,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200/80 dark:border-violet-900/60',
      link: '/matches',
    },
    {
      title: 'Resolved Cases',
      count: resolvedCount,
      desc: 'Reunited belongings',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60',
      link: '/my-reports?tab=resolved',
    },
  ];

  const quickActions = [
    {
      title: 'Report Lost Item',
      desc: 'Broadcast notice across campus',
      icon: PlusCircle,
      color: 'bg-rose-500',
      to: '/report/lost',
    },
    {
      title: 'Turn in Found Item',
      desc: 'Log found object & set clues',
      icon: PackagePlus,
      color: 'bg-emerald-500',
      to: '/report/found',
    },
    {
      title: 'Browse Marketplace',
      desc: 'Search directory & locations',
      icon: Compass,
      color: 'bg-indigo-500',
      to: '/items',
    },
    {
      title: 'Track Claims',
      desc: 'Check security desk reviews',
      icon: ShieldCheck,
      color: 'bg-amber-500',
      to: '/claims',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Personalized Greeting Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
            alt={user?.name || "Student"}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {user?.name || 'Aarav'}!
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-100">
              {user?.department} • Student ID: <strong className="font-mono">{user?.studentId}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/report/lost')}
            className="bg-white text-indigo-700 hover:bg-slate-100 shadow-md font-semibold"
          >
            + Report Lost
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/items')}
            className="border-white/40 text-white hover:bg-white/10"
          >
            Browse Directory
          </Button>
        </div>
      </div>

      {/* 2. Four Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`p-5 rounded-2xl border ${card.bg} shadow-xs hover:shadow-md transition-all group flex items-start justify-between`}
          >
            <div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {card.title}
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {card.count}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {card.desc}
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-xs ${card.color}`}>
              <card.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Quick Action Buttons Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((qa, i) => (
            <Link
              key={i}
              to={qa.to}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 group"
            >
              <div
                className={`w-11 h-11 rounded-xl ${qa.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
              >
                <qa.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {qa.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {qa.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Trends Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Campus Recovery Volume
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trends of lost notices vs. returned items across academic semesters
              </p>
            </div>
            {/* View switcher: Area vs Bar */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Trend Lines
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Bar Columns
              </button>
            </div>
          </div>

          <MonthlyTrendsChart type={chartType} />
        </div>

        {/* Right 1 Col: Category Distribution Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Category Distribution
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of items reported on campus
            </p>
          </div>
          <CategoryDistributionChart />
        </div>
      </div>

      {/* 5. Recommended Matching Items Spotlight */}
      {potentialMatchItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recommended Potential Matches
              </h3>
            </div>
            <Link
              to="/matches"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all smart matches →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {potentialMatchItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                viewMode="grid"
                onClaim={(target) => setClaimTargetItem(target)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. Recent Reports Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Campus Activity
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest items registered in the university lost & found system
            </p>
          </div>
          <Link
            to="/items"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all items →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">Report ID</th>
                <th className="py-3 px-4 font-bold">Item Title</th>
                <th className="py-3 px-4 font-bold">Type</th>
                <th className="py-3 px-4 font-bold">Location</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentReports.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge type={item.type} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {item.location}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge type={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/items/${item.id}`}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim modal if opened from dashboard */}
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
