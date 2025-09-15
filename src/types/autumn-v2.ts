// Autumn Data V2 Type Definitions

export interface AutumnDataV2Response {
    autumn_data: AutumnDataV2;
    list: number[]; // Array of period timestamps
    credit_schema: CreditSchemaMap;
}

export interface AutumnDataV2 {
  id: string;
  created_at: number;
  name: string;
  email: string;
  fingerprint: string | null;
  stripe_id: string;
  env: string;
  products: Product[];
  features: Record<string, Feature>;
  metadata: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  group: string | null;
  status: 'active' | 'inactive' | 'canceled';
  canceled_at: number | null;
  started_at: number;
  is_default: boolean;
  is_add_on: boolean;
  version: number;
  current_period_start?: number;
  current_period_end?: number;
  items: ProductItem[];
}

export type ProductItem = PriceItem | FeatureItem | PricedFeatureItem;

export interface PriceItem {
  type: 'price';
  feature_id: null;
  feature: null;
  interval: 'month' | 'year' | 'lifetime' | null;
  interval_count: number;
  price: number;
}

export interface FeatureItem {
  type: 'feature';
  feature_id: string;
  feature_type: 'single_use' | 'metered';
  feature: FeatureDefinition;
  included_usage: number;
  interval: 'month' | 'year' | 'lifetime' | null;
  interval_count: number;
  reset_usage_when_enabled: boolean;
  entity_feature_id: string | null;
}

export interface PricedFeatureItem {
  type: 'priced_feature';
  feature_id: string;
  feature_type: 'single_use' | 'metered';
  feature: FeatureDefinition;
  included_usage: number;
  interval: 'month' | 'year' | 'lifetime' | null;
  interval_count: number;
  price: number;
  usage_model: 'prepaid' | 'postpaid';
  billing_units: number;
  reset_usage_when_enabled: boolean;
  quantity: number;
  entity_feature_id: string | null;
}

export interface FeatureDefinition {
  id: string;
  name: string;
  type: 'credit_system' | 'single_use' | 'metered';
  display: {
    singular: string;
    plural: string;
  };
  credit_schema: CreditSchemaItem[];
}

export interface CreditSchemaItem {
  metered_feature_id: string;
  credit_cost: number;
}

export interface Feature {
  id: string;
  name: string;
  type: 'single_use' | 'metered' | 'continuous_use';
  unlimited: boolean;
  balance: number | null;
  usage: number;
  included_usage: number;
  next_reset_at: number | null;
  interval: 'month' | 'year' | 'lifetime' | 'multiple' | null;
  interval_count: number | null;
  overage_allowed: boolean;
  breakdown?: FeatureBreakdown[];
  credit_schema?: CreditSchemaFeature[];
  rollovers?: any[];
}

export interface FeatureBreakdown {
  interval: 'month' | 'year' | 'lifetime';
  interval_count: number;
  balance: number;
  usage: number;
  included_usage: number;
  next_reset_at: number | null;
}

export interface CreditSchemaFeature {
  feature_id: string;
  credit_amount: number;
}

export interface CreditSchemaMap {
  [key: string]: number; // e.g., "gpu-t4": 0.018
}

// Helper type guards
export function isPriceItem(item: ProductItem): item is PriceItem {
  return item.type === 'price';
}

export function isFeatureItem(item: ProductItem): item is FeatureItem {
  return item.type === 'feature';
}

export function isPricedFeatureItem(item: ProductItem): item is PricedFeatureItem {
  return item.type === 'priced_feature';
}
