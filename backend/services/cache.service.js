/**
 * LRU Response Cache Service
 *
 * In-memory caching for AI responses using node-cache.
 * Features:
 *   - TTL-based expiration
 *   - LRU eviction when max keys exceeded
 *   - Prompt normalization for higher hit rates
 *   - Cache statistics tracking
 */

const NodeCache = require('node-cache');
const crypto = require('crypto');
const config = require('../config');
const logger = require('../config/logger');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      maxKeys: config.cache.maxKeys,
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: true,
      deleteOnExpire: true,
    });

    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0,
    };

    // Track evictions
    this.cache.on('del', (key, value) => {
      if (value !== undefined) {
        this.stats.evictions++;
      }
    });

    logger.info('Cache service initialized', {
      ttl: config.cache.ttl,
      maxKeys: config.cache.maxKeys,
    });
  }

  /**
   * Normalize a prompt string for consistent cache key generation.
   * Converts to lowercase, trims whitespace, removes common stopwords,
   * and collapses multiple spaces.
   *
   * @param {string} prompt - The raw user prompt
   * @returns {string} Normalized prompt
   */
  normalizePrompt(prompt) {
    const stopwords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'can', 'shall',
      'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
      'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me',
      'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they',
      'what', 'which', 'who', 'whom', 'how', 'please', 'tell',
      'explain', 'describe', 'about',
    ]);

    const normalized = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter((word) => word.length > 1 && !stopwords.has(word))
      .join(' ')
      .trim();

    return normalized || prompt.toLowerCase().trim();
  }

  /**
   * Generate a SHA-256 hash key from a normalized prompt.
   *
   * @param {string} prompt - The raw or normalized prompt
   * @param {string} [prefix='chat'] - Key prefix for namespacing
   * @returns {string} Hash key
   */
  generateKey(prompt, prefix = 'chat') {
    const normalized = this.normalizePrompt(prompt);
    const hash = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
    return `${prefix}:${hash}`;
  }

  /**
   * Retrieve a cached response.
   *
   * @param {string} key - Cache key
   * @returns {object|null} Cached value or null
   */
  get(key) {
    const value = this.cache.get(key);

    if (value !== undefined) {
      this.stats.hits++;
      logger.debug('Cache HIT', { key });
      return value;
    }

    this.stats.misses++;
    logger.debug('Cache MISS', { key });
    return null;
  }

  /**
   * Store a response in the cache.
   *
   * @param {string} key - Cache key
   * @param {object} value - Value to cache
   * @param {number} [ttl] - Optional TTL override in seconds
   */
  set(key, value, ttl) {
    const success = ttl ? this.cache.set(key, value, ttl) : this.cache.set(key, value);

    if (success) {
      this.stats.sets++;
      logger.debug('Cache SET', { key, ttl: ttl || config.cache.ttl });
    }

    return success;
  }

  /**
   * Invalidate a specific cache key.
   *
   * @param {string} key - Cache key to remove
   */
  invalidate(key) {
    return this.cache.del(key);
  }

  /**
   * Flush all cached entries.
   */
  flush() {
    this.cache.flushAll();
    logger.info('Cache flushed');
  }

  /**
   * Get cache statistics.
   *
   * @returns {object} Cache stats including hit rate
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0
      ? ((this.stats.hits / totalRequests) * 100).toFixed(1)
      : '0.0';

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      sets: this.stats.sets,
      evictions: this.stats.evictions,
      hitRate: `${hitRate}%`,
      totalKeys: this.cache.getStats().keys,
    };
  }
}

// Singleton instance
const cacheService = new CacheService();

module.exports = cacheService;
