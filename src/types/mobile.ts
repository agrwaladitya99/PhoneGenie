export interface Mobile {
  brand_name: string;
  model: string;
  price: number;
  rating: number;
  has_5g: boolean;
  has_nfc: boolean;
  has_ir_blaster: boolean;
  processor_brand: string;
  num_cores: number;
  processor_speed: number;
  battery_capacity: number;
  fast_charging_available: 0 | 1;
  fast_charging: number;
  ram_capacity: number;
  internal_memory: number;
  screen_size: number;
  refresh_rate: number;
  num_rear_cameras: number;
  num_front_cameras: number;
  os: string;
  primary_camera_rear: number;
  primary_camera_front: number;
  extended_memory_available: 0 | 1;
  resolution_width: number;
  resolution_height: number;
}

export interface SearchParams {
  query?: string;
  budget?: number;
  budgetRange?: [number, number];
  brand?: string[];
  minBattery?: number;
  minCamera?: number;
  minRAM?: number;
  has5G?: boolean;
  minRefreshRate?: number;
}

export interface SearchResult {
  phones: Mobile[];
  count: number;
}

