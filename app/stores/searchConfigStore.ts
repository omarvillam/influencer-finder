import { create } from "zustand";

type TimeRange = "week" | "month" | "year" | "all";

export interface Journal {
  name: string;
  isActive: boolean;
}

export interface SearchConfigState {
  mode: "specific" | "discover";
  timeRange: TimeRange;
  influencerName: string;
  claimsToAnalyze: number;
  productsPerInfluencer: number;
  includeRevenueAnalysis: boolean;
  verifyWithJournals: boolean;
  selectedJournals: Journal[];
  notes: string;
  setConfig: (config: Partial<Omit<SearchConfigState, "setConfig" | "resetConfig">>) => void;
  resetConfig: () => void;
}

const initialConfig: Omit<SearchConfigState, "setConfig" | "resetConfig"> = {
  mode: "specific",
  timeRange: "month",
  influencerName: "",
  claimsToAnalyze: 50,
  productsPerInfluencer: 10,
  includeRevenueAnalysis: true,
  verifyWithJournals: true,
  selectedJournals: [
    { name: "PubMed Central", isActive: true },
    { name: "Science", isActive: true },
    { name: "The Lancet", isActive: true },
    { name: "Nature", isActive: false },
    { name: "Cell", isActive: false },
    { name: "JAMA Network", isActive: false },
    { name: "New England Journal of Medicine", isActive: false },
  ],
  notes: "",
};

export const useSearchConfigStore = create<SearchConfigState>((set) => ({
  ...initialConfig,
  setConfig: (config) =>
    set((state) => ({
      ...state,
      ...config,
    })),
  resetConfig: () => set(() => ({ ...initialConfig })),
}));
