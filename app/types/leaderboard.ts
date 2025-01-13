export interface LeaderboardRecord {
  slug: string;
  rank: number;
  name: string;
  category: string;
  trustScore: string;
  trend: 'up' | 'down';
  followers: string;
  verifiedClaims: string;
}