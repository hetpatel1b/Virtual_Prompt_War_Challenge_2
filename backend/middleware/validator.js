/**
 * Input Validation Middleware
 *
 * Validation schemas using express-validator for:
 *   - Chat messages
 *   - Quiz submissions
 *   - Scenario questions
 *
 * Includes XSS sanitization and structured error responses.
 */

const { body, query, validationResult } = require('express-validator');

/**
 * Process validation results and return 422 with structured errors.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input. Please check your request.',
        details: formattedErrors,
      },
    });
  }

  next();
}

/**
 * Strip HTML/script tags from a string to prevent XSS.
 * @param {string} value
 * @returns {string}
 */
function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Validate chat message input.
 * - message: required string, 1-2000 characters, sanitized
 */
const validateChatMessage = [
  body('message')
    .exists({ checkFalsy: true })
    .withMessage('Message is required.')
    .isString()
    .withMessage('Message must be a string.')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters.')
    .customSanitizer(sanitizeInput),
  handleValidationErrors,
];

/**
 * Validate scenario simulation input.
 * - scenario: required string, 1-1000 characters, sanitized
 */
const validateScenario = [
  body('scenario')
    .exists({ checkFalsy: true })
    .withMessage('Scenario question is required.')
    .isString()
    .withMessage('Scenario must be a string.')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Scenario must be between 1 and 1000 characters.')
    .customSanitizer(sanitizeInput),
  handleValidationErrors,
];

/**
 * Validate quiz submission input.
 * - answers: required array of { questionId, selectedOption }
 * - Maximum 20 answers per submission
 */
const validateQuizSubmission = [
  body('answers')
    .exists({ checkFalsy: true })
    .withMessage('Answers are required.')
    .isArray({ min: 1, max: 20 })
    .withMessage('Answers must be an array with 1-20 items.'),
  body('answers.*.questionId')
    .exists({ checkFalsy: true })
    .withMessage('Each answer must have a questionId.')
    .isString()
    .withMessage('questionId must be a string.')
    .trim(),
  body('answers.*.selectedOption')
    .exists({ checkNull: true })
    .withMessage('Each answer must have a selectedOption.')
    .isInt({ min: 0, max: 3 })
    .withMessage('selectedOption must be an integer between 0 and 3.'),
  handleValidationErrors,
];

/**
 * Validate quiz question query parameters.
 * - category: optional string
 * - difficulty: optional enum (easy, medium, hard)
 * - count: optional integer (1-20)
 */
const validateQuizQuery = [
  query('category')
    .optional()
    .isString()
    .trim()
    .customSanitizer(sanitizeInput),
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be one of: easy, medium, hard.'),
  query('count')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Count must be between 1 and 20.')
    .toInt(),
  handleValidationErrors,
];

module.exports = {
  validateChatMessage,
  validateScenario,
  validateQuizSubmission,
  validateQuizQuery,
  handleValidationErrors,
  sanitizeInput,
};
