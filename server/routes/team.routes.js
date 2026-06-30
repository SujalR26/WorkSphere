import express from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember
} from '../controllers/team.controller.js';

const router = express.Router();

router.route('/')
  .get(getTeams)
  .post(createTeam);

router.route('/:id')
  .get(getTeamById)
  .put(updateTeam)
  .delete(deleteTeam);

router.route('/:id/members')
  .post(addTeamMember);

router.route('/:id/members/:employeeId')
  .delete(removeTeamMember);

export default router;
