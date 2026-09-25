export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
}

export interface ShoppingLink {
  platform: string;
  url: string;
  badgeColor?: string;
}

// ----------------- HOME PLANNER TYPES -----------------
export interface HomeItemRecommendation {
  id: string;
  name: string;
  description: string;
  estimated_price: number;
  quantity: number;
  search_terms: string;
  shopping_links: Record<string, string>;
}

export interface HomeCategoryBreakdown {
  category: string;
  allocation: number;
  items: HomeItemRecommendation[];
}

export interface CalculationTableRow {
  category: string;
  items_count: number;
  total_cost: number;
  percentage_of_budget: number;
}

export interface HomeBudgetInput {
  total_budget: number;
  num_lights: number;
  num_fans: number;
  num_furniture: number;
  num_dining_tables: number;
  rooms: {
    living_room: boolean;
    kitchen: boolean;
    bedroom: boolean;
    balcony?: boolean;
    study?: boolean;
  };
  additional_requirements?: string;
}

export interface HomeBudgetResponse {
  id: string;
  timestamp: string;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  budget_breakdown: HomeCategoryBreakdown[];
  calculation_table: CalculationTableRow[];
  additional_suggestions: string[];
}

// ----------------- PARTY PLANNER TYPES -----------------
export interface PartyItemRecommendation {
  id: string;
  name: string;
  description: string;
  estimated_price: number;
  quantity: number;
  search_terms: string;
  shopping_links: Record<string, string>;
}

export interface PartyCategoryBreakdown {
  category: string;
  allocation: number;
  items: PartyItemRecommendation[];
}

export interface VenueSuggestion {
  name: string;
  type: string;
  capacity: number;
  estimated_cost: number;
  search_terms: string;
  location?: string;
  shopping_links: Record<string, string>;
}

export interface PartyBudgetInput {
  total_budget: number;
  num_guests: number;
  party_type: string;
  venue_type: string;
  needs_catering: boolean;
  needs_decoration: boolean;
  needs_entertainment: boolean;
  needs_photography?: boolean;
  additional_requirements?: string;
}

export interface PartyBudgetResponse {
  id: string;
  timestamp: string;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  budget_breakdown: PartyCategoryBreakdown[];
  venue_suggestions: VenueSuggestion[];
  calculation_table: CalculationTableRow[];
  additional_suggestions: string[];
}

// ----------------- JEWELRY PLANNER TYPES -----------------
export interface OutfitAnalysis {
  colors: string[];
  style: string;
  formality: string;
  rationale: string;
}

export interface JewelryItemRecommendation {
  id: string;
  item_type: string;
  name: string;
  description: string;
  style: string;
  estimated_price: number;
  search_terms: string;
  shopping_links: Record<string, string>;
}

export interface JewelryBudgetInput {
  total_budget: number;
  occasion: string;
  preferences: string;
  image?: string; // base64 or data URL
  image_name?: string;
}

export interface JewelryBudgetResponse {
  id: string;
  timestamp: string;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  outfit_analysis?: OutfitAnalysis;
  jewelry_recommendations: JewelryItemRecommendation[];
  styling_tips: string[];
  calculation_table?: CalculationTableRow[];
}

// ----------------- HISTORY TYPES -----------------
export type RecommendationType = 'home' | 'party' | 'jewelry';

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: RecommendationType;
  input_summary?: Record<string, any>;
  input?: Record<string, any>;
  result_summary?: {
    total_budget: number;
    remaining_budget: number;
    item_count: number;
    categories?: string[];
  };
  summary?: {
    total_budget: number;
    remaining_budget: number;
    item_count: number;
    categories?: string[];
  };
  full_result: HomeBudgetResponse | PartyBudgetResponse | JewelryBudgetResponse;
}
