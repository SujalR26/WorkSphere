export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee'
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    routes: [
      '/',
      '/employees',
      '/departments',
      '/teams',
      '/projects',
      '/tasks',
      '/kanban',
      '/leaves',
      '/announcements',
      '/documents',
      '/calendar',
      '/reports',
      '/activity-logs',
      '/settings'
    ],
    actions: ['EMPLOYEE_CREATE', 'PROJECT_CREATE', 'TASK_CREATE', 'TEAM_CREATE', 'ANNOUNCEMENT_CREATE'],
    settingsTabs: ['profile', 'system', 'roles'],
    canManageEmployees: true,
    canManageRoles: true,
    canManageSystemSettings: true,
    canDeleteEverything: true,
    showAnalytics: true
  },
  [ROLES.MANAGER]: {
    routes: [
      '/',
      '/employees', // read-only
      '/teams',
      '/projects',
      '/tasks',
      '/kanban',
      '/leaves',
      '/announcements',
      '/documents',
      '/calendar',
      '/reports',
      '/settings'
    ],
    actions: ['PROJECT_CREATE', 'TASK_CREATE', 'TEAM_CREATE', 'ANNOUNCEMENT_CREATE'],
    settingsTabs: ['profile'],
    canManageEmployees: false,
    canManageRoles: false,
    canManageSystemSettings: false,
    canDeleteEverything: false,
    showAnalytics: true
  },
  [ROLES.EMPLOYEE]: {
    routes: [
      '/',
      '/tasks',
      '/kanban',
      '/leaves',
      '/announcements',
      '/documents',
      '/calendar',
      '/settings'
    ],
    actions: [],
    settingsTabs: ['profile'],
    canManageEmployees: false,
    canManageRoles: false,
    canManageSystemSettings: false,
    canDeleteEverything: false,
    showAnalytics: false
  }
};

export const hasRouteAccess = (role, path) => {
  const perm = PERMISSIONS[role];
  if (!perm) return false;
  
  // Normalize double slashes or trail slash if any
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  return perm.routes.includes(normalizedPath);
};

export const hasActionAccess = (role, action) => {
  const perm = PERMISSIONS[role];
  if (!perm) return false;
  return perm.actions.includes(action);
};
