import Announcement from '../models/Announcement.js';
import { logActivity } from '../utils/activityLogger.js';

class AnnouncementService {
  async getAll({ category, search }) {
    const query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Return pinned items first, then by date descending
    return await Announcement.find(query)
      .populate('publishedBy', 'name designation avatar')
      .sort({ isPinned: -1, createdAt: -1 });
  }

  async getById(id) {
    const announcement = await Announcement.findById(id)
      .populate('publishedBy', 'name designation avatar');
    if (!announcement) {
      const error = new Error('Announcement not found');
      error.statusCode = 404;
      throw error;
    }
    return announcement;
  }

  async create(data) {
    const announcement = new Announcement(data);
    await announcement.save();

    await logActivity({
      action: 'Created',
      entity: 'Announcement',
      entityId: announcement._id,
      description: `Published announcement: ${announcement.title}`
    });

    return announcement;
  }

  async update(id, data) {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      const error = new Error('Announcement not found');
      error.statusCode = 404;
      throw error;
    }

    Object.assign(announcement, data);
    await announcement.save();

    await logActivity({
      action: 'Updated',
      entity: 'Announcement',
      entityId: announcement._id,
      description: `Updated announcement: ${announcement.title}`
    });

    return announcement;
  }

  async delete(id) {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      const error = new Error('Announcement not found');
      error.statusCode = 404;
      throw error;
    }

    await Announcement.findByIdAndDelete(id);

    await logActivity({
      action: 'Deleted',
      entity: 'Announcement',
      entityId: id,
      description: `Deleted announcement: ${announcement.title}`
    });

    return announcement;
  }
}

export default new AnnouncementService();
