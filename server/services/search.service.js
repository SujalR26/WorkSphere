import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Document from '../models/Document.js';
import Announcement from '../models/Announcement.js';

class SearchService {
  async searchAll(q) {
    if (!q || q.trim().length < 2) {
      return {
        employees: [],
        departments: [],
        teams: [],
        projects: [],
        tasks: [],
        documents: [],
        announcements: []
      };
    }

    const regex = { $regex: q, $options: 'i' };

    const [
      employees,
      departments,
      teams,
      projects,
      tasks,
      documents,
      announcements
    ] = await Promise.all([
      Employee.find({
        $or: [
          { name: regex },
          { email: regex },
          { designation: regex }
        ]
      }).limit(5).select('name email designation avatar'),
      
      Department.find({
        $or: [
          { name: regex },
          { code: regex }
        ]
      }).limit(5).select('name code description'),
      
      Team.find({ name: regex }).limit(5).select('name description'),
      
      Project.find({ name: regex }).limit(5).select('name status progress'),
      
      Task.find({
        $or: [
          { title: regex },
          { description: regex }
        ]
      }).limit(5).populate('project', 'name').select('title status project priority'),
      
      Document.find({ name: regex }).limit(5).select('name category fileUrl'),
      
      Announcement.find({
        $or: [
          { title: regex },
          { content: regex }
        ]
      }).limit(5).select('title category createdAt')
    ]);

    return {
      employees,
      departments,
      teams,
      projects,
      tasks,
      documents,
      announcements
    };
  }
}

export default new SearchService();
