import express from 'express';
import {
  getNotifications,
  markRead,
  markAllRead,
  createNotification
} from '../controllers/notification.controller.js';

const router = express.Router();

router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.route('/read-all')
  .put(markAllRead);

router.route('/:id/read')
  .put(markRead);

export default router;
