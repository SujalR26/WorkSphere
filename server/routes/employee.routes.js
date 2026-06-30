import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employee.controller.js';
import { authorize, adminOrSelf, adminOrManagerOrSelf } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(authorize('Admin', 'Manager'), getEmployees)
  .post(authorize('Admin'), createEmployee);

router.route('/:id')
  .get(adminOrManagerOrSelf, getEmployeeById)
  .put(adminOrSelf, updateEmployee)
  .delete(authorize('Admin'), deleteEmployee);

export default router;
