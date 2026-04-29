// Interactive skills visualization with proficiency levels
import { useState } from 'react';

export default function SkillsVisualization({ skills }) {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(skills)[0]);

  // Skill proficiency data (you can customize these levels)
  const skillProficiency = {
    // Systems & Infrastructure
    'Linux/Unix': 95,
    'Docker': 90,
    'Kubernetes': 85,
    'Terraform': 88,
    'CI/CD': 90,

    // Languages
    'Python': 92,
    'JavaScript': 88,
    'TypeScript': 85,
    'Go': 80,
    'Java': 85,
    'C++': 75,

    // Backend
    'Node.js': 90,
    'Django': 85,
    'FastAPI': 87,
    'GraphQL': 82,
    'REST': 95,

    // Databases
    'PostgreSQL': 90,
    'MongoDB': 85,
    'Redis': 88,
    'Elasticsearch': 80,

    // Cloud
    'AWS': 92,
    'GCP': 85,
    'Azure': 80,

    // DevOps
    'Git': 95,
    'GitHub Actions': 88,
    'Jenkins': 82,
    'Ansible': 80,
  };

  const getSkillLevel = (skill) => {
    return skillProficiency[skill] || 70; // Default to 70% if not specified
  };

  const getSkillColor = (level) => {
    if (level >= 90) return 'from-green-500 to-emerald-500';
    if (level >= 80) return 'from-blue-500 to-cyan-500';
    if (level >= 70) return 'from-purple-500 to-pink-500';
    return 'from-gray-500 to-gray-600';
  };

  const categories = Object.keys(skills);

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Skills Bars */}
      <div className="space-y-4">
        {skills[selectedCategory]?.map((skill, index) => {
          const proficiency = getSkillLevel(skill);
          const colorClass = getSkillColor(proficiency);

          return (
            <div key={index} className="group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-medium">{skill}</span>
                <span className="text-gray-500 text-sm">{proficiency}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`}
                  style={{
                    width: `${proficiency}%`,
                    animation: `slideIn 1s ease-out ${index * 0.1}s both`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: var(--final-width);
          }
        }
      `}</style>
    </div>
  );
}
