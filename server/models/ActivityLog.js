import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    enum: ['Employee', 'Project', 'Task', 'Leave', 'Announcement', 'Document', 'Department', 'Team'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
