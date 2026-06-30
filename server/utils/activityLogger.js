import ActivityLog from '../models/ActivityLog.js';
import logger from './logger.js';

export const logActivity = async ({ user = 'System Admin', action, entity, entityId, description }) => {
  try {
    const log = new ActivityLog({
      user,
      action,
      entity,
      entityId,
      description
    });
    await log.save();
    logger.info(`Activity Logged: ${action} on ${entity} (${entityId}) - ${description}`);
  } catch (error) {
    logger.error(`Failed to create Activity Log: ${error.message}`);
  }
};
