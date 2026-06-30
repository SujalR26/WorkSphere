import leaveService from '../services/leave.service.js';

export const getLeaves = async (req, res, next) => {
  try {
    const { employee, status } = req.query;
    const leaves = await leaveService.getAll({ employee, status });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    next(error);
  }
};

export const getLeaveById = async (req, res, next) => {
  try {
    const leave = await leaveService.getById(req.params.id);
    res.status(200).json({ success: true, leave });
  } catch (error) {
    next(error);
  }
};

export const createLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.create(req.body);
    res.status(201).json({ success: true, leave, message: 'Leave request submitted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateLeave = async (req, res, next) => {
  try {
    const leave = await leaveService.update(req.params.id, req.body);
    res.status(200).json({ success: true, leave, message: `Leave request ${req.body.status.toLowerCase()} successfully` });
  } catch (error) {
    next(error);
  }
};

export const getLeaveSummary = async (req, res, next) => {
  try {
    const { employeeId } = req.query;
    const summary = await leaveService.getSummary(employeeId);
    res.status(200).json({ success: true, summary });
  } catch (error) {
    next(error);
  }
};
