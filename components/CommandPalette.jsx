/**
 * Command Palette Component
 * Keyboard-driven navigation (CMD+K / CTRL+K)
 * Quick access to sections, projects, social links, and actions
 */

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { trackButtonClick } from './Analytics';

export default function CommandPalette({ projects = [], socialLinks = {} }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Toggle command palette with CMD+K or CTRL+K
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when command palette is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleSelect = (callback) => {
    callback();
    setOpen(false);
    setSearch('');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      trackButtonClick(`Navigate to ${sectionId}`, 'Command Palette');
    }
  };

  const openLink = (url, label) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    trackButtonClick(label, 'Command Palette');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gray-800/90 backdrop-blur-sm text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all duration-200 shadow-xl hover:shadow-2xl group"
        aria-label="Open command palette"
      >
        <span className="text-sm font-medium">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-gray-900/50 rounded text-xs font-mono border border-gray-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Command Palette */}
      <Command
        className="relative w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
        label="Command Menu"
        shouldFilter={true}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
          }
        }}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-700 px-4">
          <svg
            className="w-5 h-5 text-gray-400 mr-3"
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
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search..."
            className="w-full bg-transparent py-4 text-gray-100 placeholder-gray-500 outline-none text-base"
            autoFocus
          />
        </div>

        {/* Results */}
        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-gray-500 text-sm">
            No results found.
          </Command.Empty>

          {/* Navigation Section */}
          <Command.Group
            heading="Navigation"
            className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            <CommandItem
              onSelect={() => handleSelect(() => scrollToSection('home'))}
              icon="🏠"
              label="Home"
              shortcut="H"
            />
            <CommandItem
              onSelect={() => handleSelect(() => scrollToSection('about'))}
              icon="👤"
              label="About"
              shortcut="A"
            />
            <CommandItem
              onSelect={() => handleSelect(() => scrollToSection('experience'))}
              icon="💼"
              label="Experience"
              shortcut="E"
            />
            <CommandItem
              onSelect={() => handleSelect(() => scrollToSection('skills'))}
              icon="⚡"
              label="Skills"
              shortcut="S"
            />
            <CommandItem
              onSelect={() => handleSelect(() => scrollToSection('achievements'))}
              icon="🏆"
              label="Achievements"
              shortcut="G"
            />
            <CommandItem
              onSelect={() => handleSelect(() => scrollToSection('projects'))}
              icon="🚀"
              label="Projects"
              shortcut="P"
            />
            <CommandItem
              onSelect={() => handleSelect(() => scrollToSection('contact'))}
              icon="📧"
              label="Contact"
              shortcut="C"
            />
          </Command.Group>

          {/* Projects Section */}
          {projects.length > 0 && (
            <Command.Group
              heading="Projects"
              className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {projects.slice(0, 5).map((project, index) => {
                // Handle description as either string or array
                let desc = '';
                if (typeof project.description === 'string') {
                  desc = project.description.substring(0, 50) + '...';
                } else if (Array.isArray(project.description) && project.description.length > 0) {
                  desc = project.description[0].substring(0, 50) + '...';
                }

                return (
                  <CommandItem
                    key={project.id || index}
                    onSelect={() => handleSelect(() => {
                      if (project.link) {
                        openLink(project.link, `Open ${project.title}`);
                      } else {
                        scrollToSection('projects');
                      }
                    })}
                    icon="📁"
                    label={project.title}
                    description={desc}
                  />
                );
              })}
            </Command.Group>
          )}

          {/* Social Links Section */}
          {Object.keys(socialLinks).length > 0 && (
            <Command.Group
              heading="Social"
              className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {socialLinks.github && (
                <CommandItem
                  onSelect={() => handleSelect(() => openLink(socialLinks.github, 'GitHub'))}
                  icon="💻"
                  label="GitHub"
                  description="View my repositories"
                />
              )}
              {socialLinks.linkedin && (
                <CommandItem
                  onSelect={() => handleSelect(() => openLink(socialLinks.linkedin, 'LinkedIn'))}
                  icon="💼"
                  label="LinkedIn"
                  description="Connect with me"
                />
              )}
              {socialLinks.twitter && (
                <CommandItem
                  onSelect={() => handleSelect(() => openLink(socialLinks.twitter, 'Twitter'))}
                  icon="🐦"
                  label="Twitter"
                  description="Follow me"
                />
              )}
              {socialLinks.email && (
                <CommandItem
                  onSelect={() => handleSelect(() => {
                    window.location.href = `mailto:${socialLinks.email}`;
                    trackButtonClick('Email', 'Command Palette');
                  })}
                  icon="📧"
                  label="Email"
                  description={socialLinks.email}
                />
              )}
            </Command.Group>
          )}

          {/* Actions Section */}
          <Command.Group
            heading="Actions"
            className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            <CommandItem
              onSelect={() => handleSelect(() => {
                const url = '/resume.pdf'; // Adjust path as needed
                window.open(url, '_blank');
                trackButtonClick('Download Resume', 'Command Palette');
              })}
              icon="📄"
              label="Download Resume"
              shortcut="R"
            />
            <CommandItem
              onSelect={() => handleSelect(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              })}
              icon="⬆️"
              label="Scroll to Top"
              shortcut="↑"
            />
            <CommandItem
              onSelect={() => handleSelect(() => {
                navigator.clipboard.writeText(window.location.href);
                alert('URL copied to clipboard!');
              })}
              icon="📋"
              label="Copy Page URL"
              shortcut="U"
            />
          </Command.Group>
        </Command.List>

        {/* Footer */}
        <div className="border-t border-gray-700 px-4 py-2 bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-900/50 rounded text-xs border border-gray-600">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-900/50 rounded text-xs border border-gray-600">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-900/50 rounded text-xs border border-gray-600">ESC</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </Command>
    </div>
  );
}

// Command Item Component
function CommandItem({ onSelect, icon, label, description, shortcut }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150 data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-purple-600 data-[selected=true]:to-pink-600 data-[selected=true]:text-white group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">{label}</span>
          {description && (
            <span className="text-xs text-gray-500 group-data-[selected=true]:text-gray-200 truncate">
              {description}
            </span>
          )}
        </div>
      </div>
      {shortcut && (
        <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 bg-gray-900/50 group-data-[selected=true]:bg-white/20 rounded text-xs font-mono border border-gray-600 group-data-[selected=true]:border-white/30">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
