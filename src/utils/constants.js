export const COLORS = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  secondary: '#FF9800',
  secondaryLight: '#FFB74D',
  accent: '#03A9F4',
  danger: '#F44336',
  warning: '#FFC107',
  success: '#4CAF50',
  info: '#2196F3',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#9E9E9E',
  lightGrey: '#F5F5F5',
  darkGrey: '#616161',
  background: '#FAFAFA',
  cardBackground: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

export const STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const STATUS_LABELS = {
  [STATUSES.PENDING]: 'Pending',
  [STATUSES.IN_PROGRESS]: 'In Progress',
  [STATUSES.RESOLVED]: 'Resolved',
  [STATUSES.REJECTED]: 'Rejected',
};

export const STATUS_COLORS = {
  [STATUSES.PENDING]: '#FFC107',
  [STATUSES.IN_PROGRESS]: '#2196F3',
  [STATUSES.RESOLVED]: '#4CAF50',
  [STATUSES.REJECTED]: '#F44336',
};

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: '#4CAF50',
  [PRIORITIES.MEDIUM]: '#FF9800',
  [PRIORITIES.HIGH]: '#F44336',
};

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};
