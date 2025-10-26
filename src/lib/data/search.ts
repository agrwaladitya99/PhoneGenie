import { Mobile, SearchParams } from "@/types/mobile";
import { loadMobiles } from "./mobile-service";

export function searchPhones(params: SearchParams): Mobile[] {
  const allPhones = loadMobiles();
  let results = allPhones;

  if (params.budget) {
    results = results.filter(p => p.price <= params.budget!);
  }
  
  if (params.budgetRange) {
    const [min, max] = params.budgetRange;
    results = results.filter(p => p.price >= min && p.price <= max);
  }

  if (params.brand && params.brand.length > 0) {
    results = results.filter(p => 
      params.brand!.some(b => p.brand_name.toLowerCase().includes(b.toLowerCase()))
    );
  }

  if (params.minBattery) {
    results = results.filter(p => p.battery_capacity >= params.minBattery!);
  }

  if (params.minCamera) {
    results = results.filter(p => p.primary_camera_rear >= params.minCamera!);
  }

  if (params.minRAM) {
    results = results.filter(p => p.ram_capacity >= params.minRAM!);
  }

  if (params.has5G) {
    results = results.filter(p => p.has_5g);
  }

  if (params.minRefreshRate) {
    results = results.filter(p => p.refresh_rate >= params.minRefreshRate!);
  }

  if (params.query) {
    const queryLower = params.query.toLowerCase();
    results = results.filter(p =>
      p.model.toLowerCase().includes(queryLower) ||
      p.brand_name.toLowerCase().includes(queryLower)
    );
  }

  return results;
}

