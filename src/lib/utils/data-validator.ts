/**
 * Data validation and quality checks for the mobile phone dataset
 */

import { Mobile } from "@/types/mobile";
import { loadMobiles } from "../data/mobile-service";

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: DataStats;
}

/**
 * Dataset statistics
 */
export interface DataStats {
  totalPhones: number;
  brands: number;
  priceRange: { min: number; max: number };
  avgPrice: number;
  featuresAvailability: {
    has5G: number;
    hasNFC: number;
    hasIRBlaster: number;
    fastCharging: number;
  };
  cameraRange: { min: number; max: number };
  batteryRange: { min: number; max: number };
  ramRange: { min: number; max: number };
}

/**
 * Validates a single phone record
 * @param phone - Phone object to validate
 * @param index - Index in the dataset for error reporting
 * @returns Array of validation errors
 */
function validatePhone(phone: Mobile, index: number): string[] {
  const errors: string[] = [];

  // Required string fields
  if (!phone.model || phone.model.trim() === '') {
    errors.push(`Phone ${index}: Missing model name`);
  }
  if (!phone.brand_name || phone.brand_name.trim() === '') {
    errors.push(`Phone ${index}: Missing brand name`);
  }
  if (!phone.os || phone.os.trim() === '') {
    errors.push(`Phone ${index}: Missing OS`);
  }

  // Price validation
  if (typeof phone.price !== 'number' || phone.price <= 0) {
    errors.push(`Phone ${index}: Invalid price: ${phone.price}`);
  }
  if (phone.price > 500000) {
    errors.push(`Phone ${index}: Suspiciously high price: ₹${phone.price}`);
  }

  // Rating validation
  if (typeof phone.rating !== 'number' || phone.rating < 0 || phone.rating > 100) {
    errors.push(`Phone ${index}: Invalid rating: ${phone.rating} (must be 0-100)`);
  }

  // Camera validation
  if (typeof phone.primary_camera_rear !== 'number' || phone.primary_camera_rear < 0) {
    errors.push(`Phone ${index}: Invalid rear camera: ${phone.primary_camera_rear}MP`);
  }
  if (phone.primary_camera_rear > 300) {
    errors.push(`Phone ${index}: Unrealistic rear camera: ${phone.primary_camera_rear}MP`);
  }
  if (typeof phone.primary_camera_front !== 'number' || phone.primary_camera_front < 0) {
    errors.push(`Phone ${index}: Invalid front camera: ${phone.primary_camera_front}MP`);
  }

  // Battery validation
  if (typeof phone.battery_capacity !== 'number' || phone.battery_capacity < 1000) {
    errors.push(`Phone ${index}: Invalid battery capacity: ${phone.battery_capacity}mAh`);
  }
  if (phone.battery_capacity > 10000) {
    errors.push(`Phone ${index}: Unrealistic battery: ${phone.battery_capacity}mAh`);
  }

  // Memory validation
  if (typeof phone.ram_capacity !== 'number' || phone.ram_capacity < 1) {
    errors.push(`Phone ${index}: Invalid RAM: ${phone.ram_capacity}GB`);
  }
  if (phone.ram_capacity > 32) {
    errors.push(`Phone ${index}: Unrealistic RAM: ${phone.ram_capacity}GB`);
  }
  if (typeof phone.internal_memory !== 'number' || phone.internal_memory < 8) {
    errors.push(`Phone ${index}: Invalid storage: ${phone.internal_memory}GB`);
  }

  // Display validation
  if (typeof phone.screen_size !== 'number' || phone.screen_size < 3 || phone.screen_size > 10) {
    errors.push(`Phone ${index}: Invalid screen size: ${phone.screen_size}"`);
  }
  if (typeof phone.refresh_rate !== 'number' || phone.refresh_rate < 60) {
    errors.push(`Phone ${index}: Invalid refresh rate: ${phone.refresh_rate}Hz`);
  }
  if (![60, 90, 120, 144, 165].includes(phone.refresh_rate)) {
    errors.push(`Phone ${index}: Unusual refresh rate: ${phone.refresh_rate}Hz`);
  }

  // Processor validation
  if (typeof phone.num_cores !== 'number' || phone.num_cores < 2) {
    errors.push(`Phone ${index}: Invalid core count: ${phone.num_cores}`);
  }
  if (![2, 4, 6, 8, 10].includes(phone.num_cores)) {
    errors.push(`Phone ${index}: Unusual core count: ${phone.num_cores}`);
  }

  // Boolean validation
  if (typeof phone.has_5g !== 'boolean') {
    errors.push(`Phone ${index}: has_5g must be boolean`);
  }
  if (typeof phone.has_nfc !== 'boolean') {
    errors.push(`Phone ${index}: has_nfc must be boolean`);
  }
  if (typeof phone.has_ir_blaster !== 'boolean') {
    errors.push(`Phone ${index}: has_ir_blaster must be boolean`);
  }
  if (typeof phone.fast_charging_available !== 'boolean') {
    errors.push(`Phone ${index}: fast_charging_available must be boolean`);
  }

  return errors;
}

/**
 * Validates the entire mobile phone dataset
 * @returns Validation result with errors, warnings, and stats
 */
export function validateDataset(): ValidationResult {
  const phones = loadMobiles();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate each phone
  phones.forEach((phone, index) => {
    const phoneErrors = validatePhone(phone, index);
    errors.push(...phoneErrors);
  });

  // Check for duplicates
  const models = new Map<string, number>();
  phones.forEach((phone, index) => {
    const key = `${phone.brand_name}-${phone.model}`.toLowerCase();
    if (models.has(key)) {
      warnings.push(`Possible duplicate: ${phone.brand_name} ${phone.model} (indices ${models.get(key)}, ${index})`);
    } else {
      models.set(key, index);
    }
  });

  // Check dataset completeness
  if (phones.length < 100) {
    warnings.push(`Dataset is small: only ${phones.length} phones`);
  }

  // Calculate statistics
  const stats = calculateStats(phones);

  // Check data distribution
  if (stats.brands < 5) {
    warnings.push(`Limited brand diversity: only ${stats.brands} brands`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats
  };
}

/**
 * Calculate dataset statistics
 * @param phones - Array of phone objects
 * @returns Dataset statistics
 */
export function calculateStats(phones: Mobile[]): DataStats {
  const prices = phones.map(p => p.price);
  const cameras = phones.map(p => p.primary_camera_rear);
  const batteries = phones.map(p => p.battery_capacity);
  const rams = phones.map(p => p.ram_capacity);
  
  const brands = new Set(phones.map(p => p.brand_name.toLowerCase())).size;
  
  const featuresAvailability = {
    has5G: phones.filter(p => p.has_5g).length,
    hasNFC: phones.filter(p => p.has_nfc).length,
    hasIRBlaster: phones.filter(p => p.has_ir_blaster).length,
    fastCharging: phones.filter(p => p.fast_charging_available).length,
  };

  return {
    totalPhones: phones.length,
    brands,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices)
    },
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / phones.length),
    featuresAvailability,
    cameraRange: {
      min: Math.min(...cameras),
      max: Math.max(...cameras)
    },
    batteryRange: {
      min: Math.min(...batteries),
      max: Math.max(...batteries)
    },
    ramRange: {
      min: Math.min(...rams),
      max: Math.max(...rams)
    }
  };
}

/**
 * Get phones with missing or suspicious data
 * @returns Array of phones that might need review
 */
export function getPhonesNeedingReview(): {phone: Mobile; issues: string[]}[] {
  const phones = loadMobiles();
  const needsReview: {phone: Mobile; issues: string[]}[] = [];

  phones.forEach(phone => {
    const issues: string[] = [];

    // Check for suspiciously low prices
    if (phone.price < 5000) {
      issues.push(`Very low price: ₹${phone.price}`);
    }

    // Check for missing key features
    if (phone.primary_camera_rear < 8) {
      issues.push(`Very low camera: ${phone.primary_camera_rear}MP`);
    }

    // Check for low ratings
    if (phone.rating < 50) {
      issues.push(`Low rating: ${phone.rating}/100`);
    }

    // Check for very old specs
    if (phone.ram_capacity < 3) {
      issues.push(`Low RAM: ${phone.ram_capacity}GB`);
    }

    if (issues.length > 0) {
      needsReview.push({ phone, issues });
    }
  });

  return needsReview;
}

/**
 * Get dataset quality score (0-100)
 * @returns Quality score and breakdown
 */
export function getDatasetQualityScore(): {
  overallScore: number;
  breakdown: {
    completeness: number;
    accuracy: number;
    consistency: number;
    diversity: number;
  };
} {
  const validation = validateDataset();
  const phones = loadMobiles();
  
  // Completeness: Are all fields populated?
  const completeness = Math.max(0, 100 - (validation.errors.length / phones.length) * 100);
  
  // Accuracy: Are values within reasonable ranges?
  const accuracy = validation.isValid ? 100 : Math.max(0, 100 - (validation.errors.length * 2));
  
  // Consistency: Are there duplicates or inconsistencies?
  const consistency = Math.max(0, 100 - (validation.warnings.length * 5));
  
  // Diversity: Good brand and feature distribution?
  const diversity = Math.min(100, (validation.stats.brands / 20) * 100);
  
  const overallScore = Math.round((completeness + accuracy + consistency + diversity) / 4);
  
  return {
    overallScore,
    breakdown: {
      completeness: Math.round(completeness),
      accuracy: Math.round(accuracy),
      consistency: Math.round(consistency),
      diversity: Math.round(diversity)
    }
  };
}

/**
 * Print validation report to console
 */
export function printValidationReport(): void {
  console.log('\n📊 Dataset Validation Report\n');
  console.log('═'.repeat(50));
  
  const validation = validateDataset();
  const quality = getDatasetQualityScore();
  
  console.log(`\n✨ Overall Quality Score: ${quality.overallScore}/100\n`);
  console.log('Breakdown:');
  console.log(`  • Completeness: ${quality.breakdown.completeness}/100`);
  console.log(`  • Accuracy: ${quality.breakdown.accuracy}/100`);
  console.log(`  • Consistency: ${quality.breakdown.consistency}/100`);
  console.log(`  • Diversity: ${quality.breakdown.diversity}/100`);
  
  console.log(`\n📈 Dataset Statistics:\n`);
  console.log(`  • Total Phones: ${validation.stats.totalPhones}`);
  console.log(`  • Brands: ${validation.stats.brands}`);
  console.log(`  • Price Range: ₹${validation.stats.priceRange.min.toLocaleString()} - ₹${validation.stats.priceRange.max.toLocaleString()}`);
  console.log(`  • Average Price: ₹${validation.stats.avgPrice.toLocaleString()}`);
  console.log(`  • Camera Range: ${validation.stats.cameraRange.min}MP - ${validation.stats.cameraRange.max}MP`);
  console.log(`  • Battery Range: ${validation.stats.batteryRange.min}mAh - ${validation.stats.batteryRange.max}mAh`);
  console.log(`  • RAM Range: ${validation.stats.ramRange.min}GB - ${validation.stats.ramRange.max}GB`);
  
  console.log(`\n🌟 Features Availability:\n`);
  const total = validation.stats.totalPhones;
  console.log(`  • 5G: ${validation.stats.featuresAvailability.has5G} (${Math.round(validation.stats.featuresAvailability.has5G / total * 100)}%)`);
  console.log(`  • NFC: ${validation.stats.featuresAvailability.hasNFC} (${Math.round(validation.stats.featuresAvailability.hasNFC / total * 100)}%)`);
  console.log(`  • IR Blaster: ${validation.stats.featuresAvailability.hasIRBlaster} (${Math.round(validation.stats.featuresAvailability.hasIRBlaster / total * 100)}%)`);
  console.log(`  • Fast Charging: ${validation.stats.featuresAvailability.fastCharging} (${Math.round(validation.stats.featuresAvailability.fastCharging / total * 100)}%)`);
  
  if (validation.errors.length > 0) {
    console.log(`\n❌ Errors (${validation.errors.length}):\n`);
    validation.errors.slice(0, 10).forEach(error => console.log(`  • ${error}`));
    if (validation.errors.length > 10) {
      console.log(`  ... and ${validation.errors.length - 10} more`);
    }
  } else {
    console.log(`\n✅ No validation errors found!`);
  }
  
  if (validation.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${validation.warnings.length}):\n`);
    validation.warnings.slice(0, 5).forEach(warning => console.log(`  • ${warning}`));
    if (validation.warnings.length > 5) {
      console.log(`  ... and ${validation.warnings.length - 5} more`);
    }
  } else {
    console.log(`\n✅ No warnings!`);
  }
  
  const needsReview = getPhonesNeedingReview();
  if (needsReview.length > 0) {
    console.log(`\n🔍 Phones Needing Review (${needsReview.length}):\n`);
    needsReview.slice(0, 5).forEach(({phone, issues}) => {
      console.log(`  • ${phone.brand_name} ${phone.model}:`);
      issues.forEach(issue => console.log(`    - ${issue}`));
    });
    if (needsReview.length > 5) {
      console.log(`  ... and ${needsReview.length - 5} more`);
    }
  }
  
  console.log('\n' + '═'.repeat(50) + '\n');
}

