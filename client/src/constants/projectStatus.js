export const PROJECT_STATUS = {
  PLANNING: 'Planning',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived'
};

export const PROJECT_STATUS_BADGES = {
  [PROJECT_STATUS.PLANNING]: 'secondary',
  [PROJECT_STATUS.ACTIVE]: 'primary',
  [PROJECT_STATUS.ON_HOLD]: 'warning',
  [PROJECT_STATUS.COMPLETED]: 'success',
  [PROJECT_STATUS.ARCHIVED]: 'dark'
};
