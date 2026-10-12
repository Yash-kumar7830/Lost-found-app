// Utility helpers for FindIt

export function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function generateReportId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REP-${year}-${randomNum}`;
}

export function generateClaimId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CLM-${year}-${randomNum}`;
}

export function maskPhoneNumber(phone) {
  if (!phone) return '+91 ••••• ••000';
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length < 5) return '•••••';
  const last4 = cleaned.slice(-4);
  const prefix = cleaned.startsWith('+') ? cleaned.slice(0, 3) : '';
  return `${prefix || '+91'} ••••• ••${last4.slice(-3)}`;
}

export function getInitials(name) {
  if (!name) return 'ST';
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Frontend text similarity demo calculation
 * Computes simulated similarity score between two item reports
 * based on category match, title/description token overlap, and location proximity.
 */
export function calculateDemoSimilarity(itemA, itemB) {
  if (!itemA || !itemB) return 0;
  
  let score = 0;
  
  // 1. Category match (30%)
  if (itemA.category && itemB.category && itemA.category.toLowerCase() === itemB.category.toLowerCase()) {
    score += 30;
  }
  
  // 2. Location match (25%)
  if (itemA.location && itemB.location) {
    const locA = itemA.location.toLowerCase();
    const locB = itemB.location.toLowerCase();
    if (locA === locB || locA.includes(locB) || locB.includes(locA)) {
      score += 25;
    }
  }

  // 3. Keyword / title token intersection (35%)
  const tokensA = `${itemA.title} ${itemA.description}`.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
  const tokensB = `${itemB.title} ${itemB.description}`.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
  
  const setA = new Set(tokensA);
  const shared = tokensB.filter(t => setA.has(t));
  const uniqueShared = [...new Set(shared)];

  const maxLen = Math.max(tokensA.length, tokensB.length, 1);
  const tokenScore = Math.min(35, Math.round((uniqueShared.length / Math.min(maxLen, 6)) * 35));
  score += tokenScore;

  // 4. Date proximity (10%)
  if (itemA.date && itemB.date) {
    const dateA = new Date(itemA.date);
    const dateB = new Date(itemB.date);
    const diffDays = Math.abs((dateA - dateB) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) score += 10;
    else if (diffDays <= 7) score += 5;
  }

  return Math.min(98, Math.max(45, score));
}

export function getSharedKeywords(itemA, itemB) {
  if (!itemA || !itemB) return [];
  const tokensA = `${itemA.title} ${itemA.description}`.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
  const tokensB = `${itemB.title} ${itemB.description}`.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
  const stopWords = new Set(['the', 'and', 'with', 'for', 'was', 'this', 'that', 'from', 'near', 'have', 'lost', 'found', 'item']);
  
  const setA = new Set(tokensA.filter(w => !stopWords.has(w)));
  const matches = tokensB.filter(t => setA.has(t) && !stopWords.has(t));
  return [...new Set(matches)].slice(0, 5);
}
