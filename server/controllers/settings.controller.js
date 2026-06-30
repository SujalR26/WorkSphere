let appSettings = {
  companyName: 'WorkSphere Corp',
  systemEmail: 'admin@worksphere.com',
  workingHoursStart: '09:00',
  workingHoursEnd: '18:00',
  allowEmployeeLeaveRequests: true,
  enableGlobalNotifications: true,
  themePreference: 'light'
};

export const getSettings = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, settings: appSettings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    appSettings = { ...appSettings, ...req.body };
    res.status(200).json({ success: true, settings: appSettings, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};
