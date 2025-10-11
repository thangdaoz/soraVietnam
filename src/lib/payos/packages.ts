/**
 * Credit Package Definitions
 * 
 * Defines available credit packages for purchase with Vietnamese pricing.
 * Fetches packages from the database instead of using mock data.
 */

export interface CreditPackage {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  credits: number;
  priceVnd: number;
  discountPercentage: number;
  isPopular: boolean;
  displayOrder: number;
  features: string[];
}

// Cache for credit packages
let cachedPackages: CreditPackage[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch credit packages from API
 */
export async function fetchCreditPackages(): Promise<CreditPackage[]> {
  // Return cached data if still valid
  const now = Date.now();
  if (cachedPackages && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedPackages;
  }

  try {
    const response = await fetch("/api/credit-packages", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch credit packages");
    }

    const data = await response.json();
    
    if (data.success && data.packages) {
      cachedPackages = data.packages;
      cacheTimestamp = now;
      return data.packages;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching credit packages:", error);
    
    // Return empty array if fetch fails
    return [];
  }
}

/**
 * Get package by ID from cached packages or fetch fresh
 */
export async function getPackageById(id: string): Promise<CreditPackage | undefined> {
  const packages = await fetchCreditPackages();
  return packages.find((pkg) => pkg.id === id);
}

/**
 * Calculate final price after discount
 */
export function calculateFinalPrice(priceVnd: number, discountPercentage: number): number {
  return Math.round(priceVnd * (1 - discountPercentage / 100));
}

/**
 * Format Vietnamese currency
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Calculate cost per credit
 */
export function calculateCostPerCredit(priceVnd: number, credits: number): number {
  return Math.round(priceVnd / credits);
}
