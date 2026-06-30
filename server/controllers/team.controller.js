import teamService from '../services/team.service.js';

export const getTeams = async (req, res, next) => {
  try {
    const { search } = req.query;
    const teams = await teamService.getAll({ search });
    res.status(200).json({ success: true, teams });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const team = await teamService.getById(req.params.id);
    res.status(200).json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const team = await teamService.create(req.body);
    res.status(201).json({ success: true, team, message: 'Team created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const team = await teamService.update(req.params.id, req.body);
    res.status(200).json({ success: true, team, message: 'Team updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    const team = await teamService.delete(req.params.id);
    res.status(200).json({ success: true, team, message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addTeamMember = async (req, res, next) => {
  try {
    const team = await teamService.addMember(req.params.id, req.body.employeeId);
    res.status(200).json({ success: true, team, message: 'Member added to team successfully' });
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (req, res, next) => {
  try {
    const team = await teamService.removeMember(req.params.id, req.params.employeeId);
    res.status(200).json({ success: true, team, message: 'Member removed from team successfully' });
  } catch (error) {
    next(error);
  }
};
