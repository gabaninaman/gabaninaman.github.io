// Project filtering component with technology and category filters
import { useState, useMemo } from 'react';

export default function ProjectFilter({ projects, onFilterChange }) {
  const [selectedTech, setSelectedTech] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set();
    projects.forEach(project => {
      if (project.tech_stack) {
        project.tech_stack.forEach(tech => techSet.add(tech));
      }
    });
    return ['all', ...Array.from(techSet).sort()];
  }, [projects]);

  // Filter projects based on selected tech and search query
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesTech = selectedTech === 'all' ||
        (project.tech_stack && project.tech_stack.includes(selectedTech));

      // Handle description as either string or array
      let descriptionText = '';
      if (typeof project.description === 'string') {
        descriptionText = project.description;
      } else if (Array.isArray(project.description)) {
        descriptionText = project.description.join(' ');
      }

      const matchesSearch = !searchQuery ||
        (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        descriptionText.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTech && matchesSearch;
    });
  }, [projects, selectedTech, searchQuery]);

  // Notify parent component when filters change
  useMemo(() => {
    if (onFilterChange) {
      onFilterChange(filteredProjects);
    }
  }, [filteredProjects, onFilterChange]);

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Technology Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {allTechnologies.map(tech => (
          <button
            key={tech}
            onClick={() => setSelectedTech(tech)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedTech === tech
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {tech === 'all' ? 'All Projects' : tech}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredProjects.length} of {projects.length} projects
        {searchQuery && ` matching "${searchQuery}"`}
        {selectedTech !== 'all' && ` using ${selectedTech}`}
      </div>
    </div>
  );
}
