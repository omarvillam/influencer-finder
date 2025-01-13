export interface Claim {
  claim: string;
  category: string;
  trust: string;
  originalSource: {
    description: string;
    link: string;
  }
  verificationSources: {
    name: string;
    description: string;
    link: string;
  }[]
  status: string;
  created_at: string;
}

export interface InfluencerRecord {
  name: string;
  avatar?: string;
  categories: string[];
  description: string;
  products: number;
  revenue: string;
  followers: string;
  trust: string;
  claims: Claim[];
}
