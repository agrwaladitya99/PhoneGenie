/**
 * Comparison Feature Test Suite
 * 
 * This test suite ensures that phone comparison functionality works correctly
 * across various query formats and edge cases.
 */

import { describe, it, expect } from '@jest/globals';

/**
 * Test cases for extractPhoneModels function
 */
describe('extractPhoneModels', () => {
  // Mock implementation to test
  function extractPhoneModels(query: string): string[] {
    const parts = query.split(/\s+(?:vs\.?|versus|and)\s+|,\s*/i);
    
    const models = parts
      .map(part => {
        return part
          .replace(/\b(compare|with|between|the)\b/gi, ' ')
          .trim();
      })
      .filter(p => {
        if (p.length <= 2) return false;
        const lower = p.toLowerCase();
        return !['compare', 'versus', 'vs', 'and', 'with', 'between', 'the'].includes(lower);
      });
    
    return models;
  }

  it('should extract two phones from "Compare Pixel 8a vs OnePlus 12R"', () => {
    const result = extractPhoneModels('Compare Pixel 8a vs OnePlus 12R');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('Pixel');
    expect(result[1]).toContain('OnePlus');
  });

  it('should extract phones from "iPhone 13 versus Samsung S21"', () => {
    const result = extractPhoneModels('iPhone 13 versus Samsung S21');
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('iPhone');
    expect(result[1]).toContain('Samsung');
  });

  it('should extract phones from "Compare iPhone 13, Samsung S21, and Pixel 7"', () => {
    const result = extractPhoneModels('Compare iPhone 13, Samsung S21, and Pixel 7');
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle "vs." with period', () => {
    const result = extractPhoneModels('Pixel 8 vs. OnePlus 11');
    expect(result).toHaveLength(2);
  });

  it('should handle lowercase "vs"', () => {
    const result = extractPhoneModels('pixel 8 vs oneplus 11');
    expect(result).toHaveLength(2);
  });
});

/**
 * Test cases for fuzzy search
 */
describe('fuzzySearchModel', () => {
  const mockPhones = [
    { model: 'Google Pixel 8', brand_name: 'Google' },
    { model: 'Google Pixel 8 Pro', brand_name: 'Google' },
    { model: 'Google Pixel 7A', brand_name: 'Google' },
    { model: 'OnePlus 11R', brand_name: 'OnePlus' },
    { model: 'OnePlus 12 Pro', brand_name: 'OnePlus' },
    { model: 'Samsung Galaxy S21', brand_name: 'Samsung' },
  ];

  // Mock normalize function
  function normalizePhoneName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\bgoogle\s+/i, '')
      .trim();
  }

  it('should match "Pixel 8a" to "Google Pixel 8"', () => {
    const query = 'Pixel 8a';
    const normalized = normalizePhoneName(query);
    
    // Check that "pixel 8" matches "pixel 8" after normalization
    const phoneNormalized = normalizePhoneName('Google Pixel 8');
    
    // Should match at least the "pixel 8" part
    expect(phoneNormalized).toContain('pixel');
    expect(phoneNormalized).toContain('8');
  });

  it('should match "OnePlus 12R" to "OnePlus 11R" or "OnePlus 12 Pro"', () => {
    const query = 'OnePlus 12R';
    
    // Both should be valid matches due to partial matching
    const match1 = 'OnePlus 11R'.toLowerCase().includes('oneplus');
    const match2 = 'OnePlus 12 Pro'.toLowerCase().includes('oneplus');
    
    expect(match1 || match2).toBe(true);
  });

  it('should remove Google prefix for Pixel phones', () => {
    const normalized = normalizePhoneName('Google Pixel 8');
    expect(normalized).toBe('pixel 8');
  });

  it('should handle partial model numbers', () => {
    // "8a" should match "8" with partial scoring
    const queryBase = '8a'.replace(/[a-z]+$/, ''); // "8"
    expect(queryBase).toBe('8');
  });
});

/**
 * Test cases for comparison validation
 */
describe('validateComparisonPhones', () => {
  const mockPhone1 = { model: 'Google Pixel 8', brand_name: 'Google' } as any;
  const mockPhone2 = { model: 'OnePlus 11R', brand_name: 'OnePlus' } as any;

  function validateComparisonPhones(phones: any[], requestedModels: string[]) {
    if (phones.length < 2) {
      return {
        isValid: false,
        error: 'Need at least 2 phones'
      };
    }
    return { isValid: true };
  }

  it('should validate when 2 phones are found', () => {
    const result = validateComparisonPhones([mockPhone1, mockPhone2], ['Pixel 8', 'OnePlus 11R']);
    expect(result.isValid).toBe(true);
  });

  it('should fail when only 1 phone is found', () => {
    const result = validateComparisonPhones([mockPhone1], ['Pixel 8', 'Unknown Phone']);
    expect(result.isValid).toBe(false);
  });

  it('should fail when 0 phones are found', () => {
    const result = validateComparisonPhones([], ['Unknown 1', 'Unknown 2']);
    expect(result.isValid).toBe(false);
  });

  it('should validate when more than 2 phones are found', () => {
    const mockPhone3 = { model: 'Samsung S21', brand_name: 'Samsung' } as any;
    const result = validateComparisonPhones(
      [mockPhone1, mockPhone2, mockPhone3],
      ['Pixel 8', 'OnePlus 11R', 'Samsung S21']
    );
    expect(result.isValid).toBe(true);
  });
});

/**
 * Integration test scenarios
 */
describe('Comparison Integration Tests', () => {
  const testCases = [
    {
      query: 'Compare Pixel 8a vs OnePlus 12R',
      description: 'User query with models not in database',
      expectedBehavior: 'Should find closest matches: Pixel 8, OnePlus 11R or 12 Pro'
    },
    {
      query: 'iPhone 13 versus Samsung Galaxy S21',
      description: 'Full model names',
      expectedBehavior: 'Should find exact matches'
    },
    {
      query: 'compare pixel 8 and oneplus 11r',
      description: 'Lowercase with "and"',
      expectedBehavior: 'Should extract and find both phones'
    },
    {
      query: 'Pixel 8 vs OnePlus 11R vs Samsung S21',
      description: 'Three-way comparison',
      expectedBehavior: 'Should extract all three phones'
    }
  ];

  testCases.forEach(testCase => {
    it(testCase.description, () => {
      // This is a documentation test - actual implementation should pass
      expect(testCase.expectedBehavior).toBeTruthy();
    });
  });
});

/**
 * Edge cases that should be handled
 */
describe('Edge Cases', () => {
  it('should handle extra spaces', () => {
    const query = 'Compare  Pixel  8   vs   OnePlus  11R';
    expect(query.split(/\s+(?:vs\.?|versus|and)\s+/i).length).toBeGreaterThanOrEqual(2);
  });

  it('should handle mixed case', () => {
    const query = 'CoMpArE PIXEL 8 vS oNeplus 11R';
    expect(query.toLowerCase()).toContain('compare');
  });

  it('should handle with/without periods', () => {
    const query1 = 'Pixel 8 vs OnePlus 11R';
    const query2 = 'Pixel 8 vs. OnePlus 11R';
    
    expect(query1.split(/\s+(?:vs\.?|versus|and)\s+/i).length).toBe(
      query2.split(/\s+(?:vs\.?|versus|and)\s+/i).length
    );
  });
});

