/**
 * Visit Counter Component
 * Tracks page views and unique visitors using localStorage
 * Displays analytics stats in a nice dashboard format
 */

import { useEffect, useState } from 'react';

export default function VisitCounter({ variant = 'full' }) {
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    uniqueVisitors: 0,
    lastVisit: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStats = () => {
      const now = new Date();
      const today = now.toDateString();

      // Get existing stats from localStorage
      const storedStats = localStorage.getItem('portfolioStats');
      let data = storedStats
        ? JSON.parse(storedStats)
        : {
            totalVisits: 0,
            visits: {},
            uniqueVisitorId: generateUniqueId(),
            firstVisit: now.toISOString(),
          };

      // Increment total visits
      data.totalVisits += 1;

      // Track visits by date
      if (!data.visits[today]) {
        data.visits[today] = 0;
      }
      data.visits[today] += 1;

      // Update last visit time
      data.lastVisit = now.toISOString();

      // Save updated stats
      localStorage.setItem('portfolioStats', JSON.stringify(data));

      // Calculate today's visits
      const todayVisits = data.visits[today] || 0;

      // Calculate unique visitors (approximate)
      const uniqueVisitors = Object.keys(data.visits).length;

      setStats({
        totalVisits: data.totalVisits,
        todayVisits,
        uniqueVisitors,
        lastVisit: data.lastVisit,
      });

      setIsLoading(false);
    };

    updateStats();
  }, []);

  if (isLoading) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 text-sm">
        <span className="text-gray-400">👁️</span>
        <span className="text-gray-300 font-medium">{formatNumber(stats.totalVisits)}</span>
        <span className="text-gray-500 text-xs">views</span>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xl">👁️</span>
          <div>
            <div className="text-lg font-bold text-white">{formatNumber(stats.totalVisits)}</div>
            <div className="text-xs text-gray-400">Total Views</div>
          </div>
        </div>
        <div className="w-px h-10 bg-gray-700" />
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <div>
            <div className="text-lg font-bold text-white">{stats.todayVisits}</div>
            <div className="text-xs text-gray-400">Today</div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant - complete dashboard
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Visit Statistics
        </h3>
        <span className="text-xs text-gray-500">
          Updated {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="👁️"
          label="Total Views"
          value={formatNumber(stats.totalVisits)}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon="📅"
          label="Today's Views"
          value={stats.todayVisits}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon="👥"
          label="Unique Days"
          value={stats.uniqueVisitors}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {stats.lastVisit && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Last visit: {new Date(stats.lastVisit).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <div className={`text-3xl mb-2 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

// Format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Generate unique visitor ID
function generateUniqueId() {
  return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Simple Page View Tracker (invisible)
 * Just tracks visits without displaying anything
 */
export function PageViewTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const now = new Date();
    const today = now.toDateString();

    const storedStats = localStorage.getItem('portfolioStats');
    let data = storedStats
      ? JSON.parse(storedStats)
      : {
          totalVisits: 0,
          visits: {},
          uniqueVisitorId: generateUniqueId(),
          firstVisit: now.toISOString(),
        };

    data.totalVisits += 1;

    if (!data.visits[today]) {
      data.visits[today] = 0;
    }
    data.visits[today] += 1;

    data.lastVisit = now.toISOString();

    localStorage.setItem('portfolioStats', JSON.stringify(data));
  }, []);

  return null;
}

/**
 * Reset Statistics (for testing)
 */
export function useResetStats() {
  return () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolioStats');
      window.location.reload();
    }
  };
}
