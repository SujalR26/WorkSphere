export const LEAVE_TYPES = {
  ANNUAL: 'Annual',
  SICK: 'Sick',
  MATERNITY_PATERNITY: 'Maternity/Paternity',
  UNPAID: 'Unpaid'
};

export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const LEAVE_STATUS_COLORS = {
  [LEAVE_STATUS.PENDING]: 'warning',
  [LEAVE_STATUS.APPROVED]: 'success',
  [LEAVE_STATUS.REJECTED]: 'danger'
};
