// Product Models

export interface TechnicalSpecs {
  CPU?: string;
  RAM?: string;
  GPU?: string;
  Storage?: string;
  ScreenSize?: string;
  OS?: string;
  Color?: string;
  [key: string]: string | undefined;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
}

export interface Weight {
  value: number;
  unit: 'kg' | 'lb';
}

export interface Warranty {
  type: 'Manufacturer' | 'Seller' | 'Extended' | 'None';
  duration: string;
  coverageDetails?: string;
  serviceCenters?: string[];
}

export interface UsedDetails {
  deviceConditionDescription: string;
  previousUsageDuration: string;
  manufacturingYear: number;
  refurbishmentNotes?: string;
  signsOfWear?: string;
}

export interface ImportedDetails {
  countryOfOrigin: string;
  importDate: string;
  internationalWarranty: boolean;
  compatibilityNotes?: string;
}

export interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  subCategory?: string;
  brand: string;
  sku: string;
  condition: 'New' | 'Used' | 'Imported';
  price: number;
  discount?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  images?: string[];
  technicalSpecs?: TechnicalSpecs;
  dimensions?: Dimensions;
  weight?: Weight;
  warranty?: Warranty;
  usedDetails?: UsedDetails;
  importedDetails?: ImportedDetails;
  visibility: 'Published' | 'Draft' | 'Hidden';
  isFeatured?: boolean;
  isArchived?: boolean;
  seller?: string | { _id: string; name: string };
  rating?: number;
  reviewsCount?: number;
  soldCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Request DTOs
export interface CreateProductRequest {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  subCategory?: string;
  brand: string;
  sku: string;
  condition: 'New' | 'Used' | 'Imported';
  price: number;
  discount?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  technicalSpecs?: TechnicalSpecs;
  dimensions?: Dimensions;
  weight?: Weight;
  warranty?: Warranty;
  usedDetails?: UsedDetails;
  importedDetails?: ImportedDetails;
  visibility: 'Published' | 'Draft' | 'Hidden';
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

export interface UpdateStockRequest {
  quantity: number;
  action: 'set' | 'add' | 'subtract';
}

export interface UpdateVisibilityRequest {
  visibility: 'Published' | 'Draft' | 'Hidden';
}
export interface LowStockSummary {
  totalLowStock: number;
  critical: number;
  warning: number;
}
export interface LowStockResponse {
  success: boolean;
  summary: LowStockSummary;
  count: number;
  products: Product[];
}
// Query Parameters
export interface ProductQueryParams {
  category?: string;
  condition?: 'New' | 'Used' | 'Imported';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'sold' | 'rating' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
  seller?: string;
  featured?: boolean;
  lowStock?: boolean;
  showArchived?: boolean;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  screenSize?: string;
}

// Response DTOs
export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface ProductsListResponse {
  success: boolean;
  products: Product[];
  count:number
  total?: number;
  page?: number;
  limit?: number;
}

export interface SellerStatsResponse {
  totalProducts: number;
  totalStock: number;
  totalSold: number;
  totalRevenue: number;
  averageRating: number;
  lowStockCount: number;
  publishedCount: number;
  draftCount: number;
}

export interface Wishlist {
  _id: string;
  user_id: string;
  product_ids: Product[];
  createdAt: string;
  updatedAt: string;
}
