import Team from '../models/Team.js';
import { logActivity } from '../utils/activityLogger.js';

class TeamService {
  async getAll({ search }) {
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    return await Team.find(query)
      .populate('department', 'name code')
      .populate('lead', 'name email designation avatar')
      .populate('members', 'name email designation avatar')
      .sort({ name: 1 });
  }

  async getById(id) {
    const team = await Team.findById(id)
      .populate('department', 'name code')
      .populate('lead', 'name email designation avatar phone')
      .populate('members', 'name email designation avatar phone joiningDate');
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }
    return team;
  }

  async create(data) {
    const existing = await Team.findOne({ name: data.name });
    if (existing) {
      const error = new Error('Team with this name already exists');
      error.statusCode = 400;
      throw error;
    }

    const team = new Team(data);
    await team.save();

    await logActivity({
      action: 'Created',
      entity: 'Team',
      entityId: team._id,
      description: `Created team: ${team.name}`
    });

    return team;
  }

  async update(id, data) {
    const team = await Team.findById(id);
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }

    if (data.name && data.name !== team.name) {
      const existing = await Team.findOne({ name: data.name });
      if (existing) {
        const error = new Error('Team with this name already exists');
        error.statusCode = 400;
        throw error;
      }
    }

    Object.assign(team, data);
    await team.save();

    await logActivity({
      action: 'Updated',
      entity: 'Team',
      entityId: team._id,
      description: `Updated team details for: ${team.name}`
    });

    return team;
  }

  async delete(id) {
    const team = await Team.findById(id);
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }

    await Team.findByIdAndDelete(id);

    await logActivity({
      action: 'Deleted',
      entity: 'Team',
      entityId: id,
      description: `Deleted team: ${team.name}`
    });

    return team;
  }

  async addMember(id, employeeId) {
    const team = await Team.findById(id);
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }

    if (team.members.includes(employeeId)) {
      const error = new Error('Employee is already a member of this team');
      error.statusCode = 400;
      throw error;
    }

    team.members.push(employeeId);
    await team.save();

    await logActivity({
      action: 'Updated',
      entity: 'Team',
      entityId: team._id,
      description: `Added member to team ${team.name}: (ID: ${employeeId})`
    });

    return team;
  }

  async removeMember(id, employeeId) {
    const team = await Team.findById(id);
    if (!team) {
      const error = new Error('Team not found');
      error.statusCode = 404;
      throw error;
    }

    team.members = team.members.filter(member => member.toString() !== employeeId.toString());
    await team.save();

    await logActivity({
      action: 'Updated',
      entity: 'Team',
      entityId: team._id,
      description: `Removed member from team ${team.name}: (ID: ${employeeId})`
    });

    return team;
  }
}

export default new TeamService();
