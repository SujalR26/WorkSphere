import taskService from '../services/task.service.js';

export const getTasks = async (req, res, next) => {
  try {
    const { search, priority, status, assignee, project, page, limit } = req.query;
    const result = await taskService.getAll({ search, priority, status, assignee, project, page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getById(req.params.id);
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.create(req.body);
    res.status(201).json({ success: true, task, message: 'Task created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.update(req.params.id, req.body);
    res.status(200).json({ success: true, task, message: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.delete(req.params.id);
    res.status(200).json({ success: true, task, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addTaskComment = async (req, res, next) => {
  try {
    const task = await taskService.addComment(req.params.id, req.body);
    res.status(200).json({ success: true, task, message: 'Comment added successfully' });
  } catch (error) {
    next(error);
  }
};
