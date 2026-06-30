import express from 'express';
import { getDashboardStats, getDashboardAnalytics } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/dashboard', getDashboardAnalytics);

export default router;
