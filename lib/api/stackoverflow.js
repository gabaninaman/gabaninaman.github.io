/**
 * Stack Overflow API Integration
 * Fetches live statistics from Stack Exchange API v2.3
 *
 * Documentation: https://api.stackexchange.com/docs
 * No API key required for basic usage (limited to 300 requests/day per IP)
 * With API key: 10,000 requests/day
 *
 * Setup (optional): Add STACKOVERFLOW_API_KEY to .env.local
 * Get key: https://stackapps.com/apps/oauth/register
 */

const STACKOVERFLOW_API = 'https://api.stackexchange.com/2.3';

/**
 * Fetch Stack Overflow user statistics
 * @param {string|number} userId - Stack Overflow user ID
 * @returns {Promise<Object>} Stack Overflow stats object
 */
export async function fetchStackOverflowStats(userId) {
  const apiKey = process.env.STACKOVERFLOW_API_KEY;

  if (!userId) {
    console.warn('⚠️ Stack Overflow user ID not provided. Using fallback data.');
    return getFallbackStats();
  }

  try {
    // Build API URL with optional API key for higher quota
    const params = new URLSearchParams({
      site: 'stackoverflow',
      filter: 'default', // Returns standard response
    });

    if (apiKey) {
      params.append('key', apiKey);
    }

    // Fetch user data
    const userResponse = await fetch(
      `${STACKOVERFLOW_API}/users/${userId}?${params}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`Stack Overflow API returned ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    if (!userData.items || userData.items.length === 0) {
      throw new Error(`User ${userId} not found on Stack Overflow`);
    }

    const user = userData.items[0];

    // Fetch badge counts
    const badgeParams = new URLSearchParams({
      site: 'stackoverflow',
      pagesize: 100,
      filter: 'default',
    });

    if (apiKey) {
      badgeParams.append('key', apiKey);
    }

    const badgeResponse = await fetch(
      `${STACKOVERFLOW_API}/users/${userId}/badges?${badgeParams}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    let badges = { gold: 0, silver: 0, bronze: 0 };

    if (badgeResponse.ok) {
      const badgeData = await badgeResponse.json();
      badges = {
        gold: user.badge_counts?.gold || 0,
        silver: user.badge_counts?.silver || 0,
        bronze: user.badge_counts?.bronze || 0,
      };
    }

    // Fetch top tags
    const tagParams = new URLSearchParams({
      site: 'stackoverflow',
      pagesize: 10,
    });

    if (apiKey) {
      tagParams.append('key', apiKey);
    }

    const tagResponse = await fetch(
      `${STACKOVERFLOW_API}/users/${userId}/top-tags?${tagParams}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    let topTags = [];

    if (tagResponse.ok) {
      const tagData = await tagResponse.json();
      topTags = tagData.items?.map(tag => ({
        name: tag.tag_name,
        count: tag.answer_count + tag.question_count,
        score: tag.answer_score + tag.question_score,
      })) || [];
    }

    return {
      userId: user.user_id,
      username: user.display_name,
      reputation: user.reputation,
      reached: user.reputation > 0 ? calculateReach(user.reputation) : 0,
      answers: user.answer_count || 0,
      questions: user.question_count || 0,
      acceptRate: user.accept_rate || null,
      badges,
      totalBadges: badges.gold + badges.silver + badges.bronze,
      topTags: topTags.slice(0, 5),
      profileUrl: user.link,
      avatarUrl: user.profile_image,
      createdAt: new Date(user.creation_date * 1000).toISOString(),
      lastAccessDate: new Date(user.last_access_date * 1000).toISOString(),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching Stack Overflow stats:', error.message);
    // Return fallback data on error
    return getFallbackStats();
  }
}

/**
 * Fetch recent Stack Overflow activity (answers, questions, comments)
 * @param {string|number} userId - Stack Overflow user ID
 * @param {number} limit - Number of items to fetch
 * @returns {Promise<Object>} Recent activity
 */
export async function fetchStackOverflowActivity(userId, limit = 10) {
  const apiKey = process.env.STACKOVERFLOW_API_KEY;

  if (!userId) {
    return getFallbackActivity();
  }

  try {
    const params = new URLSearchParams({
      site: 'stackoverflow',
      pagesize: limit,
      order: 'desc',
      sort: 'activity',
      filter: 'withbody',
    });

    if (apiKey) {
      params.append('key', apiKey);
    }

    // Fetch recent answers
    const answersResponse = await fetch(
      `${STACKOVERFLOW_API}/users/${userId}/answers?${params}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    // Fetch recent questions
    const questionsResponse = await fetch(
      `${STACKOVERFLOW_API}/users/${userId}/questions?${params}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const answers = answersResponse.ok ? (await answersResponse.json()).items || [] : [];
    const questions = questionsResponse.ok ? (await questionsResponse.json()).items || [] : [];

    // Combine and sort by creation date
    const activity = [
      ...answers.map(a => ({
        type: 'answer',
        id: a.answer_id,
        questionId: a.question_id,
        title: a.title,
        score: a.score,
        isAccepted: a.is_accepted,
        createdAt: new Date(a.creation_date * 1000).toISOString(),
        link: a.link,
        tags: a.tags || [],
      })),
      ...questions.map(q => ({
        type: 'question',
        id: q.question_id,
        title: q.title,
        score: q.score,
        answerCount: q.answer_count,
        viewCount: q.view_count,
        createdAt: new Date(q.creation_date * 1000).toISOString(),
        link: q.link,
        tags: q.tags || [],
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return {
      activity,
      totalAnswers: answers.length,
      totalQuestions: questions.length,
    };
  } catch (error) {
    console.error('Error fetching Stack Overflow activity:', error.message);
    return getFallbackActivity();
  }
}

/**
 * Calculate estimated reach based on reputation
 * Stack Overflow uses complex algorithm, this is an approximation
 * @param {number} reputation - User reputation
 * @returns {number} Estimated reach
 */
function calculateReach(reputation) {
  // Rough estimation: reputation * average views per post
  // Average Stack Overflow answer gets ~1000 views over its lifetime
  const avgViewsPerPoint = 100;
  const estimatedReach = reputation * avgViewsPerPoint;

  // Cap at reasonable maximum
  return Math.min(estimatedReach, 10000000); // 10M max
}

/**
 * Fallback stats when API fails or user ID is missing
 * @returns {Object} Fallback statistics
 */
function getFallbackStats() {
  return {
    userId: '19144656',
    username: 'Naman Gabani',
    reputation: 500,
    reached: 50000,
    answers: 30,
    questions: 5,
    acceptRate: null,
    badges: {
      gold: 0,
      silver: 5,
      bronze: 15,
    },
    totalBadges: 20,
    topTags: [
      { name: 'python', count: 12, score: 45 },
      { name: 'javascript', count: 10, score: 38 },
      { name: 'docker', count: 8, score: 30 },
      { name: 'kubernetes', count: 5, score: 22 },
      { name: 'aws', count: 4, score: 18 },
    ],
    profileUrl: 'https://stackoverflow.com/users/19144656/smit-gabani',
    avatarUrl: null,
    createdAt: new Date('2022-01-01').toISOString(),
    lastAccessDate: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    isFallback: true,
  };
}

/**
 * Fallback activity when API fails
 * @returns {Object} Fallback activity
 */
function getFallbackActivity() {
  return {
    activity: [
      {
        type: 'answer',
        id: 1,
        questionId: 123,
        title: 'How to deploy Node.js app on Kubernetes?',
        score: 15,
        isAccepted: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        link: 'https://stackoverflow.com/a/123',
        tags: ['kubernetes', 'nodejs', 'docker'],
      },
      {
        type: 'question',
        id: 2,
        title: 'Best practices for CI/CD with GitHub Actions?',
        score: 8,
        answerCount: 3,
        viewCount: 450,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        link: 'https://stackoverflow.com/q/456',
        tags: ['github-actions', 'ci-cd', 'devops'],
      },
    ],
    totalAnswers: 1,
    totalQuestions: 1,
  };
}

/**
 * Format reputation number with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatReputation(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format reach with K/M/B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted reach
 */
export function formatReach(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

/**
 * Format Stack Overflow stat for display with + suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted stat (e.g., "500+", "50K+")
 */
export function formatStat(num) {
  return formatReputation(num) + '+';
}
