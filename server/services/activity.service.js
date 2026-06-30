import ActivityLog from '../models/ActivityLog.js';

class ActivityService {
  async getAll({ page = 1, limit = 20, entity }) {
    const query = {};
    if (entity) {
      query.entity = entity;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ActivityLog.countDocuments(query)
    ]);

    return {
      logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    };
  }
}

export default new ActivityService();
