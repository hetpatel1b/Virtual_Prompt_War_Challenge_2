/**
 * Cache Service Unit Tests
 */

// Setup must run first
require('../setup');

const NodeCache = require('node-cache');

// We need to clear the module cache and get a fresh instance for each test
let cacheService;

beforeEach(() => {
  // Clear require cache to get a fresh CacheService
  jest.resetModules();
  jest.mock('../../config/logger', () => {
    const noop = () => {};
    const l = { info: noop, warn: noop, error: noop, debug: noop, http: noop, withRequestId: () => l, child: () => l, stream: { write: noop } };
    return l;
  });
  cacheService = require('../../services/cache.service');
  cacheService.flush();
});

describe('CacheService', () => {
  describe('normalizePrompt', () => {
    it('should convert to lowercase and remove punctuation', () => {
      const result = cacheService.normalizePrompt('What is DEMOCRACY?');
      expect(result).not.toContain('?');
      expect(result).toBe(result.toLowerCase());
    });

    it('should remove common stopwords', () => {
      const result = cacheService.normalizePrompt('What is the importance of voting?');
      expect(result).not.toContain('what');
      expect(result).not.toContain('the');
      expect(result).toContain('importance');
      expect(result).toContain('voting');
    });

    it('should produce similar keys for semantically similar prompts', () => {
      const key1 = cacheService.generateKey('What is voter registration?');
      const key2 = cacheService.generateKey('what is voter registration');
      expect(key1).toBe(key2);
    });

    it('should produce different keys for different prompts', () => {
      const key1 = cacheService.generateKey('What is democracy?');
      const key2 = cacheService.generateKey('How does vote counting work?');
      expect(key1).not.toBe(key2);
    });
  });

  describe('generateKey', () => {
    it('should prefix keys correctly', () => {
      const chatKey = cacheService.generateKey('test', 'chat');
      const scenarioKey = cacheService.generateKey('test', 'scenario');
      expect(chatKey).toMatch(/^chat:/);
      expect(scenarioKey).toMatch(/^scenario:/);
    });

    it('should produce consistent hashes for the same input', () => {
      const key1 = cacheService.generateKey('test prompt');
      const key2 = cacheService.generateKey('test prompt');
      expect(key1).toBe(key2);
    });
  });

  describe('get/set', () => {
    it('should store and retrieve a value', () => {
      const key = 'test:key1';
      const value = { summary: 'Test response' };

      cacheService.set(key, value);
      const result = cacheService.get(key);

      expect(result).toEqual(value);
    });

    it('should return null for missing keys', () => {
      const result = cacheService.get('test:nonexistent');
      expect(result).toBeNull();
    });

    it('should track hits and misses', () => {
      cacheService.set('test:hit', { data: true });
      cacheService.get('test:hit');   // hit
      cacheService.get('test:miss');  // miss

      const stats = cacheService.getStats();
      expect(stats.hits).toBeGreaterThanOrEqual(1);
      expect(stats.misses).toBeGreaterThanOrEqual(1);
    });
  });

  describe('invalidate', () => {
    it('should remove a specific key', () => {
      cacheService.set('test:remove', { data: true });
      expect(cacheService.get('test:remove')).not.toBeNull();

      cacheService.invalidate('test:remove');
      expect(cacheService.get('test:remove')).toBeNull();
    });
  });

  describe('flush', () => {
    it('should clear all cached entries', () => {
      cacheService.set('test:a', { a: 1 });
      cacheService.set('test:b', { b: 2 });

      cacheService.flush();

      expect(cacheService.get('test:a')).toBeNull();
      expect(cacheService.get('test:b')).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return valid statistics', () => {
      const stats = cacheService.getStats();

      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('sets');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('totalKeys');
      expect(stats.hitRate).toMatch(/%$/);
    });
  });
});
