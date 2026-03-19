const { body, query, param } = require('express-validator');

const create = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 100 }).withMessage('Title must be 1–100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description max 1000 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Due date must be a valid date'),
];

const update = [
  param('id')
    .isMongoId().withMessage('Invalid task ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Title must be 1–100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description max 1000 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Due date must be a valid date'),
];

const getAll = [
  query('status')
    .optional()
    .custom((val) => {
      if (val === '' || val === undefined) return true;
      if (['pending', 'completed'].includes(val)) return true;
      throw new Error('Status must be pending or completed');
    }),

  query('priority')
    .optional()
    .custom((val) => {
      if (val === '' || val === undefined) return true;
      if (['low', 'medium', 'high'].includes(val)) return true;
      throw new Error('Priority must be low, medium, or high');
    }),

  query('page')
    .optional()
    .custom((val) => {
      if (val === '' || val === undefined) return true;
      if (Number.isInteger(+val) && +val >= 1) return true;
      throw new Error('Page must be a positive integer');
    }),

  query('limit')
    .optional()
    .custom((val) => {
      if (val === '' || val === undefined) return true;
      const n = +val;
      if (Number.isInteger(n) && n >= 1 && n <= 50) return true;
      throw new Error('Limit must be between 1 and 50');
    }),

  query('sortBy')
    .optional()
    .custom((val) => {
      if (val === '' || val === undefined) return true;
      const allowed = ['createdAt','-createdAt','title','-title','priority','-priority','dueDate','-dueDate'];
      if (allowed.includes(val)) return true;
      throw new Error('Invalid sort field');
    }),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long'),
];

const mongoId = [
  param('id').isMongoId().withMessage('Invalid task ID'),
];

module.exports = { create, update, getAll, mongoId };
