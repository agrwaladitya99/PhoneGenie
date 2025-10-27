import { Mobile, SearchParams } from "@/types/mobile";
import { loadMobiles } from "./mobile-service";

// Optimized search with early returns and efficient filtering
export function searchPhones(params: SearchParams): Mobile[] {
  const allPhones = loadMobiles();
  
  // If no filters, return all (cached)
  if (Object.keys(params).length === 0) {
    return allPhones;
  }
  
  // Use a single pass filter for better performance
  return allPhones.filter(phone => {
    // Budget filter - most common, check first
    if (params.budget && phone.price > params.budget) {
      return false;
    }
    
    // Budget range filter
    if (params.budgetRange) {
      const [min, max] = params.budgetRange;
      if (phone.price < min || phone.price > max) {
        return false;
      }
    }
    
    // Brand filter - also common
    if (params.brand && params.brand.length > 0) {
      const brandMatch = params.brand.some(b => 
        phone.brand_name.toLowerCase().includes(b.toLowerCase())
      );
      if (!brandMatch) {
        return false;
      }
    }
    
    // Quick numeric comparisons
    if (params.minBattery && phone.battery_capacity < params.minBattery) {
      return false;
    }
    
    if (params.minCamera && phone.primary_camera_rear < params.minCamera) {
      return false;
    }
    
    if (params.minRAM && phone.ram_capacity < params.minRAM) {
      return false;
    }
    
    if (params.minRefreshRate && phone.refresh_rate < params.minRefreshRate) {
      return false;
    }
    
    // Boolean checks
    if (params.has5G && !phone.has_5g) {
      return false;
    }
    
    // Text search - most expensive, do last
    if (params.query) {
      const queryLower = params.query.toLowerCase();
      const modelMatch = phone.model.toLowerCase().includes(queryLower);
      const brandMatch = phone.brand_name.toLowerCase().includes(queryLower);
      if (!modelMatch && !brandMatch) {
        return false;
      }
    }
    
    return true;
  });
}

