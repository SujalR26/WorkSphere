import announcementService from '../services/announcement.service.js';

export const getAnnouncements = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const announcements = await announcementService.getAll({ category, search });
    res.status(200).json({ success: true, announcements });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await announcementService.getById(req.params.id);
    res.status(200).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await announcementService.create(req.body);
    res.status(201).json({ success: true, announcement, message: 'Announcement published successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await announcementService.update(req.params.id, req.body);
    res.status(200).json({ success: true, announcement, message: 'Announcement updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await announcementService.delete(req.params.id);
    res.status(200).json({ success: true, announcement, message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};
