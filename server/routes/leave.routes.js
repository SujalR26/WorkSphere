import express from 'express';
import {
  getLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  getLeaveSummary
} from '../controllers/leave.controller.js';

const router = express.Router();

router.route('/')
  .get(getLeaves)
  .post(createLeave);

router.route('/summary')
  .get(getLeaveSummary);

router.route('/:id')
  .get(getLeaveById)
  .put(updateLeave);

export default router;
