export const TASK_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
};

export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done'
};

export const TASK_PRIORITY_BADGES = {
  [TASK_PRIORITY.LOW]: 'secondary',
  [TASK_PRIORITY.MEDIUM]: 'info',
  [TASK_PRIORITY.HIGH]: 'warning',
  [TASK_PRIORITY.URGENT]: 'danger'
};

export const TASK_STATUS_BADGES = {
  [TASK_STATUS.TODO]: 'secondary',
  [TASK_STATUS.IN_PROGRESS]: 'primary',
  [TASK_STATUS.REVIEW]: 'warning',
  [TASK_STATUS.DONE]: 'success'
};
