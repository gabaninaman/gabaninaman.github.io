/**
 * Tech Stack Explorer Component
 * Interactive skill tree with filtering and detailed tooltips
 * Organized by categories with proficiency levels
 */

import { useState } from 'react';

export default function TechStackExplorer({ skills }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  if (!skills || Object.keys(skills).length === 0) {
    return null;
  }

  // Skill proficiency data (can be moved to user.json)
  const skillDetails = {
    // Systems & Infrastructure
    'Linux/Unix': { level: 95, experience: '5+ years', icon: '🐧', description: 'System administration, scripting, and optimization' },
    'Docker': { level: 90, experience: '4+ years', icon: '🐳', description: 'Container orchestration and multi-stage builds' },
    'Kubernetes': { level: 85, experience: '3+ years', icon: '☸️', description: 'K8s cluster management and deployment strategies' },
    'Terraform': { level: 80, experience: '3+ years', icon: '🏗️', description: 'Infrastructure as Code for cloud platforms' },

    // Cloud Platforms
    'AWS': { level: 90, experience: '4+ years', icon: '☁️', description: 'EC2, S3, Lambda, ECS, RDS, CloudFormation' },
    'GCP': { level: 75, experience: '2+ years', icon: '🌐', description: 'Compute Engine, Cloud Storage, Cloud Functions' },
    'Azure': { level: 70, experience: '2+ years', icon: '💠', description: 'VMs, Blob Storage, Azure Functions' },

    // Programming Languages
    'Python': { level: 95, experience: '6+ years', icon: '🐍', description: 'Backend development, automation, data processing' },
    'JavaScript': { level: 90, experience: '5+ years', icon: '⚡', description: 'Full-stack web development with modern frameworks' },
    'TypeScript': { level: 85, experience: '3+ years', icon: '📘', description: 'Type-safe JavaScript for large applications' },
    'Go': { level: 80, experience: '2+ years', icon: '🔵', description: 'Concurrent systems and microservices' },
    'Java': { level: 75, experience: '3+ years', icon: '☕', description: 'Enterprise applications and Spring Boot' },
    'C/C++': { level: 70, experience: '2+ years', icon: '⚙️', description: 'System programming and performance optimization' },

    // Frameworks & Libraries
    'Node.js': { level: 90, experience: '5+ years', icon: '🟢', description: 'Backend APIs and real-time applications' },
    'React': { level: 90, experience: '4+ years', icon: '⚛️', description: 'Modern UI development with hooks and context' },
    'Next.js': { level: 85, experience: '3+ years', icon: '▲', description: 'SSR, SSG, and full-stack React applications' },
    'Express.js': { level: 85, experience: '4+ years', icon: '🚂', description: 'RESTful APIs and middleware architecture' },
    'Django': { level: 80, experience: '3+ years', icon: '🎸', description: 'Python web framework with ORM' },
    'Flask': { level: 85, experience: '4+ years', icon: '🧪', description: 'Lightweight Python microservices' },

    // Databases
    'PostgreSQL': { level: 90, experience: '5+ years', icon: '🐘', description: 'Advanced SQL, indexing, and query optimization' },
    'MongoDB': { level: 85, experience: '4+ years', icon: '🍃', description: 'NoSQL document databases and aggregation' },
    'Redis': { level: 85, experience: '3+ years', icon: '🔴', description: 'Caching, pub/sub, and session management' },
    'MySQL': { level: 80, experience: '4+ years', icon: '🐬', description: 'Relational database design and optimization' },
    'Elasticsearch': { level: 75, experience: '2+ years', icon: '🔍', description: 'Full-text search and log analytics' },

    // DevOps & Tools
    'Git': { level: 95, experience: '6+ years', icon: '📚', description: 'Version control, branching strategies, and workflows' },
    'GitHub Actions': { level: 85, experience: '3+ years', icon: '🤖', description: 'CI/CD pipelines and automation' },
    'Jenkins': { level: 80, experience: '3+ years', icon: '🔨', description: 'Continuous integration and deployment' },
    'Ansible': { level: 75, experience: '2+ years', icon: '🔄', description: 'Configuration management and automation' },
    'Nginx': { level: 85, experience: '4+ years', icon: '🌐', description: 'Web server, reverse proxy, and load balancing' },
    'Prometheus': { level: 75, experience: '2+ years', icon: '📊', description: 'Monitoring and alerting' },
    'Grafana': { level: 75, experience: '2+ years', icon: '📈', description: 'Metrics visualization and dashboards' },
  };

  // Filter skills based on category and search
  const filteredSkills = Object.entries(skills).reduce((acc, [category, categorySkills]) => {
    if (selectedCategory !== 'all' && category !== selectedCategory) {
      return acc;
    }

    const filtered = categorySkills.filter((skill) =>
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length > 0) {
      acc[category] = filtered;
    }

    return acc;
  }, {});

  const categories = Object.keys(skills);
  const totalSkills = Object.values(skills).flat().length;
  const displayedSkills = Object.values(filteredSkills).flat().length;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          Tech Stack Explorer
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {displayedSkills} of {totalSkills} technologies
        </p>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-700 bg-gray-800/30 px-6 py-4">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technologies..."
              className="w-full bg-gray-800 text-gray-100 placeholder-gray-500 rounded-lg px-4 py-2 pl-10 border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            label="All"
            count={totalSkills}
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          />
          {categories.map((category) => (
            <CategoryPill
              key={category}
              label={category}
              count={skills[category].length}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="p-6">
        {Object.keys(filteredSkills).length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>No technologies found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categorySkills.map((skill) => (
                    <SkillCard
                      key={skill}
                      skill={skill}
                      details={skillDetails[skill]}
                      onHover={setHoveredSkill}
                      isHovered={hoveredSkill === skill}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Category Pill Component
function CategoryPill({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
      <span
        className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
          active ? 'bg-white/20' : 'bg-gray-700'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// Skill Card Component
function SkillCard({ skill, details, onHover, isHovered }) {
  const defaultDetails = {
    level: 75,
    experience: '1+ years',
    icon: '💻',
    description: 'Technology skill',
  };

  const skillInfo = details || defaultDetails;

  return (
    <div
      className={`relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border transition-all duration-200 cursor-pointer ${
        isHovered
          ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-105'
          : 'border-gray-700 hover:border-gray-600'
      }`}
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Skill Icon & Name */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{skillInfo.icon}</span>
          <div>
            <h5 className="font-medium text-white text-sm">{skill}</h5>
            <p className="text-xs text-gray-400">{skillInfo.experience}</p>
          </div>
        </div>
      </div>

      {/* Proficiency Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Proficiency</span>
          <span className="font-medium text-purple-400">{skillInfo.level}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
            style={{ width: `${skillInfo.level}%` }}
          />
        </div>
      </div>

      {/* Description (shown on hover) */}
      {isHovered && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400">{skillInfo.description}</p>
        </div>
      )}

      {/* Hover Indicator */}
      {isHovered && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping" />
      )}
    </div>
  );
}
