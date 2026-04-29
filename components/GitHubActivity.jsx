/**
 * GitHub Activity Visualization Component
 * Displays GitHub contribution graph, language distribution, and recent activity
 * Uses recharts for data visualization
 */

import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function GitHubActivity({ githubData, activityData = [] }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!githubData) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 text-center">
        <p className="text-gray-400">GitHub data not available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub Activity
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {githubData.isFallback && (
                <span className="text-yellow-400 text-xs">Using fallback data</span>
              )}
              {!githubData.isFallback && (
                <span className="text-green-400 text-xs">Live data • Updated {new Date(githubData.fetchedAt).toLocaleDateString()}</span>
              )}
            </p>
          </div>
          <a
            href={`https://github.com/${githubData.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            View Profile
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800/30 px-6">
        <TabButton
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          label="Overview"
        />
        <TabButton
          active={activeTab === 'languages'}
          onClick={() => setActiveTab('languages')}
          label="Languages"
        />
        <TabButton
          active={activeTab === 'activity'}
          onClick={() => setActiveTab('activity')}
          label="Recent Activity"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab githubData={githubData} />}
        {activeTab === 'languages' && <LanguagesTab githubData={githubData} />}
        {activeTab === 'activity' && <ActivityTab activityData={activityData} />}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
        active
          ? 'border-purple-500 text-white'
          : 'border-transparent text-gray-400 hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

// Overview Tab
function OverviewTab({ githubData }) {
  const stats = [
    { label: 'Repositories', value: githubData.repositories, icon: '📦', color: 'from-blue-500 to-cyan-500' },
    { label: 'Contributions', value: githubData.contributions, icon: '📊', color: 'from-green-500 to-emerald-500' },
    { label: 'Stars Received', value: githubData.stars, icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { label: 'Followers', value: githubData.followers, icon: '👥', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className={`text-3xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Total Forks</h4>
          <p className="text-2xl font-bold text-white">{githubData.forks || 0}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Contributed To</h4>
          <p className="text-2xl font-bold text-white">{githubData.contributedTo || 0} repos</p>
        </div>
      </div>

      {/* Contribution Years */}
      {githubData.contributionYears && githubData.contributionYears.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Active Years</h4>
          <div className="flex flex-wrap gap-2">
            {githubData.contributionYears.map((year) => (
              <span
                key={year}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {year}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Languages Tab
function LanguagesTab({ githubData }) {
  if (!githubData.topLanguages || githubData.topLanguages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No language data available
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#6366f1'];

  // Prepare data for pie chart
  const pieData = githubData.topLanguages.map((lang, index) => ({
    name: lang.name,
    value: lang.count,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-4">Language Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Language List */}
      <div className="space-y-3">
        {githubData.topLanguages.map((lang, index) => (
          <div
            key={lang.name}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color || COLORS[index % COLORS.length] }}
                />
                <span className="font-medium text-white">{lang.name}</span>
              </div>
              <span className="text-sm text-gray-400">{lang.count} repos</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(lang.count / githubData.topLanguages[0].count) * 100}%`,
                  backgroundColor: lang.color || COLORS[index % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Activity Tab
function ActivityTab({ activityData }) {
  if (!activityData || activityData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No recent activity data available
      </div>
    );
  }

  const getEventIcon = (type) => {
    const icons = {
      PushEvent: '📝',
      PullRequestEvent: '🔀',
      IssuesEvent: '❗',
      CreateEvent: '✨',
      WatchEvent: '⭐',
      ForkEvent: '🔱',
      ReleaseEvent: '🚀',
    };
    return icons[type] || '📌';
  };

  const getEventLabel = (type) => {
    const labels = {
      PushEvent: 'Pushed',
      PullRequestEvent: 'Pull Request',
      IssuesEvent: 'Issue',
      CreateEvent: 'Created',
      WatchEvent: 'Starred',
      ForkEvent: 'Forked',
      ReleaseEvent: 'Released',
    };
    return labels[type] || type.replace('Event', '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {activityData.map((event) => (
        <div
          key={event.id}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{getEventIcon(event.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-purple-400">
                  {getEventLabel(event.type)}
                </span>
                <span className="text-xs text-gray-500">{formatDate(event.createdAt)}</span>
              </div>
              <p className="text-sm text-white font-medium truncate">{event.repo}</p>
              {event.payload && (
                <p className="text-xs text-gray-400 mt-1">
                  {event.payload.message || event.payload.title || event.payload.action}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
