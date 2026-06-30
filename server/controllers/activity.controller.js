import activityService from '../services/activity.service.js';

export const getActivityLogs = async (req, res, next) => {
  try {
    const { page, limit, entity } = req.query;
    const result = await activityService.getAll({ page, limit, entity });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
