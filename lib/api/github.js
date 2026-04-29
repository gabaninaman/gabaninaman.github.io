/**
 * GitHub API Integration
 * Fetches live statistics from GitHub using GraphQL API v4
 *
 * Setup: Add GITHUB_TOKEN to .env.local
 * Generate token: https://github.com/settings/tokens
 * Required scopes: public_repo, read:user
 */

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

/**
 * Fetch comprehensive GitHub statistics for a user
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} GitHub stats object
 */
export async function fetchGitHubStats(username) {
  const token = process.env.GITHUB_TOKEN;

  // Use fallback data if no token (for development/testing)
  if (!token) {
    console.warn('⚠️ GITHUB_TOKEN not found in environment variables. Using fallback data.');
    return getFallbackStats();
  }

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
            totalCount
            nodes {
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
            }
          }
          followers {
            totalCount
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
            contributionYears
          }
          repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, PULL_REQUEST]) {
            totalCount
          }
        }
      }
    `;

    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GitHub GraphQL errors:', data.errors);
      throw new Error(data.errors[0]?.message || 'GraphQL query failed');
    }

    const user = data.data?.user;

    if (!user) {
      throw new Error(`User "${username}" not found on GitHub`);
    }

    // Calculate total stars across all repositories
    const totalStars = user.repositories.nodes.reduce(
      (sum, repo) => sum + repo.stargazerCount,
      0
    );

    // Calculate total forks across all repositories
    const totalForks = user.repositories.nodes.reduce(
      (sum, repo) => sum + repo.forkCount,
      0
    );

    // Get language distribution
    const languages = {};
    user.repositories.nodes.forEach(repo => {
      if (repo.primaryLanguage) {
        const lang = repo.primaryLanguage.name;
        languages[lang] = (languages[lang] || 0) + 1;
      }
    });

    // Sort languages by usage
    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count,
        color: user.repositories.nodes.find(
          repo => repo.primaryLanguage?.name === name
        )?.primaryLanguage?.color || '#000000',
      }));

    return {
      username,
      repositories: user.repositories.totalCount,
      contributions: user.contributionsCollection.contributionCalendar.totalContributions,
      stars: totalStars,
      followers: user.followers.totalCount,
      forks: totalForks,
      contributedTo: user.repositoriesContributedTo.totalCount,
      topLanguages,
      contributionYears: user.contributionsCollection.contributionYears,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message);
    // Return fallback data on error
    return getFallbackStats();
  }
}

/**
 * Fetch recent GitHub activity (commits, PRs, issues)
 * @param {string} username - GitHub username
 * @param {number} limit - Number of events to fetch (max 100)
 * @returns {Promise<Array>} Recent activity events
 */
export async function fetchGitHubActivity(username, limit = 30) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('⚠️ GITHUB_TOKEN not found. Using fallback activity data.');
    return getFallbackActivity();
  }

  try {
    // Use REST API for recent events (GraphQL doesn't support events well)
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const events = await response.json();

    // Transform events into a cleaner format
    const activity = events.map(event => ({
      id: event.id,
      type: event.type,
      repo: event.repo.name,
      createdAt: event.created_at,
      payload: getEventPayload(event),
    }));

    return activity;
  } catch (error) {
    console.error('Error fetching GitHub activity:', error.message);
    return getFallbackActivity();
  }
}

/**
 * Extract relevant payload data from GitHub event
 * @param {Object} event - GitHub event object
 * @returns {Object} Simplified payload
 */
function getEventPayload(event) {
  switch (event.type) {
    case 'PushEvent':
      return {
        commits: event.payload.size,
        message: event.payload.commits?.[0]?.message,
      };
    case 'PullRequestEvent':
      return {
        action: event.payload.action,
        title: event.payload.pull_request?.title,
        number: event.payload.pull_request?.number,
      };
    case 'IssuesEvent':
      return {
        action: event.payload.action,
        title: event.payload.issue?.title,
        number: event.payload.issue?.number,
      };
    case 'CreateEvent':
      return {
        refType: event.payload.ref_type,
        ref: event.payload.ref,
      };
    case 'WatchEvent':
      return {
        action: 'starred',
      };
    default:
      return {};
  }
}

/**
 * Fallback stats when API fails or token is missing
 * @returns {Object} Fallback statistics
 */
function getFallbackStats() {
  return {
    username: 'gabaninaman',
    repositories: 30,
    contributions: 500,
    stars: 50,
    followers: 100,
    forks: 20,
    contributedTo: 10,
    topLanguages: [
      { name: 'JavaScript', count: 12, color: '#f1e05a' },
      { name: 'Python', count: 8, color: '#3572A5' },
      { name: 'TypeScript', count: 6, color: '#2b7489' },
      { name: 'Go', count: 4, color: '#00ADD8' },
    ],
    contributionYears: [2022, 2023, 2024, 2025, 2026],
    fetchedAt: new Date().toISOString(),
    isFallback: true,
  };
}

/**
 * Fallback activity when API fails or token is missing
 * @returns {Array} Fallback activity events
 */
function getFallbackActivity() {
  return [
    {
      id: '1',
      type: 'PushEvent',
      repo: 'gabaninaman/portfolio',
      createdAt: new Date().toISOString(),
      payload: { commits: 3, message: 'Updated portfolio features' },
    },
    {
      id: '2',
      type: 'PullRequestEvent',
      repo: 'gabaninaman/kubernetes-scripts',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      payload: { action: 'opened', title: 'Add deployment automation', number: 42 },
    },
  ];
}

/**
 * Format numbers with K/M suffixes (e.g., 1500 -> "1.5K")
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format GitHub stat for display with + suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted stat (e.g., "500+", "1.5K+")
 */
export function formatStat(num) {
  return formatNumber(num) + '+';
}
