const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ assigneeId: userId })
      .populate('meetingId', 'title scheduledAt')
      .populate('assigneeId', 'name email avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, assigneeId, meetingId, priority, deadline } = req.body;

    const newTask = new Task({
      title,
      assigneeId: assigneeId || req.user.userId, // Default to self if assigneeId is not specified
      meetingId,
      priority: priority || 'medium',
      status: 'todo',
      deadline,
    });

    await newTask.save();
    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Authorization: User must be assignee or creator/host of the referenced meeting to update
    if (task.assigneeId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied. You are not assigned to this task.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (task.assigneeId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
