const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => ({ field: err.path, message: err.msg })) });
  }
  next();
};

// All task routes require authorization
router.use(authMiddleware);

// Get all tasks assigned to the user
router.get('/', getTasks);

// Create a new task manually or link it to a meeting
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required.'),
    body('priority').optional().isIn(['high', 'medium', 'low']).withMessage('Priority must be high, medium, or low.'),
    body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date format.'),
  ],
  validate,
  createTask
);

// Update task details or change task status (todo, inprogress, done)
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty.'),
    body('priority').optional().isIn(['high', 'medium', 'low']).withMessage('Priority must be high, medium, or low.'),
    body('status').optional().isIn(['todo', 'inprogress', 'done']).withMessage('Status must be todo, inprogress, or done.'),
    body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date format.'),
  ],
  validate,
  updateTask
);

// Delete task
router.delete('/:id', deleteTask);

module.exports = router;
