import { getAuthSession } from '../auth/session.js';

export const ROLE_LEVELS = {
  PARTICIPANT: 1,
  REPORT_ADMIN: 2,
  MAIN_ADMIN: 3,
  TECH_ADMIN: 4,
};

export const ROLE_NAMES = {
  1: 'Участник',
  2: 'Администратор отчетов',
  3: 'Главный администратор',
  4: 'Технический администратор',
};

export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  CASES_VIEW: 'cases.view',
  CASES_EDIT_OWN: 'cases.edit.own',
  CASES_EDIT_ANY: 'cases.edit.any',
  CONTROLLED_CASES_VIEW: 'controlledCases.view',
  CONTROLLED_CASES_EDIT: 'controlledCases.edit',
  CALENDAR_VIEW_OWN: 'calendar.view.own',
  SCHEDULE_VIEW_OWN: 'schedule.view.own',
  REPORTS_VIEW: 'reports.view',
  REPORTS_MANAGE_ALL: 'reports.manageAll',
  ENFORCEMENT_VIEW: 'enforcement.view',
  MAP_VIEW: 'map.view',
  REGISTRY_VIEW: 'registry.view',
  EMERGENCY_FUND_VIEW: 'emergencyFund.view',
  MEETINGS_VIEW: 'meetings.view',
  USERS_MANAGE: 'users.manage',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_RESET_PASSWORD: 'users.resetPassword',
  PERMISSIONS_MANAGE: 'permissions.manage',
  TECH_ADMIN_ASSIGN: 'techAdmin.assign',
  DICTIONARIES_VIEW: 'dictionaries.view',
  DICTIONARIES_MANAGE: 'dictionaries.manage',
  ROLES_MANAGE: 'roles.manage',
  TECHNICAL_ACCESS: 'technical.access',
};

export const CLOSED_SECTION_GRANTS = [
  { permission: PERMISSIONS.CONTROLLED_CASES_VIEW, label: 'Перечень контрольных дел' },
  { permission: PERMISSIONS.ENFORCEMENT_VIEW, label: 'Исполнительные производства' },
  { permission: PERMISSIONS.MAP_VIEW, label: 'Карта' },
  { permission: PERMISSIONS.REGISTRY_VIEW, label: 'Реестр муниципальной собственности' },
  { permission: PERMISSIONS.EMERGENCY_FUND_VIEW, label: 'Аварийный фонд' },
  { permission: PERMISSIONS.MEETINGS_VIEW, label: 'Совещания' },
  { permission: PERMISSIONS.REPORTS_VIEW, label: 'Отчёты' },
];

const ROUTE_PERMISSIONS = {
  dashboard: PERMISSIONS.DASHBOARD_VIEW,
  cases: PERMISSIONS.CASES_VIEW,
  controlledCases: PERMISSIONS.CONTROLLED_CASES_VIEW,
  calendar: PERMISSIONS.CALENDAR_VIEW_OWN,
  schedule: PERMISSIONS.SCHEDULE_VIEW_OWN,
  reports: PERMISSIONS.REPORTS_VIEW,
  enforcement: PERMISSIONS.ENFORCEMENT_VIEW,
  map: PERMISSIONS.MAP_VIEW,
  emergencyFund: PERMISSIONS.EMERGENCY_FUND_VIEW,
  municipalRegistry: PERMISSIONS.REGISTRY_VIEW,
  meetings: PERMISSIONS.MEETINGS_VIEW,
  adminUsers: PERMISSIONS.USERS_MANAGE,
  adminDictionaries: PERMISSIONS.DICTIONARIES_MANAGE,
};

export const ADMIN_TOOL_PERMISSIONS = [
  PERMISSIONS.USERS_MANAGE,
  PERMISSIONS.ROLES_MANAGE,
  PERMISSIONS.PERMISSIONS_MANAGE,
  PERMISSIONS.DICTIONARIES_MANAGE,
];

export const ADMIN_USERS_TOOL_PERMISSIONS = [
  PERMISSIONS.USERS_MANAGE,
  PERMISSIONS.ROLES_MANAGE,
  PERMISSIONS.PERMISSIONS_MANAGE,
];

export function getSessionPermissions(session = getAuthSession()) {
  if (Array.isArray(session?.permissions) && session.permissions.length) return session.permissions;
  return getFallbackRolePermissions(session);
}

export function hasPermission(permission, session = getAuthSession()) {
  return getSessionPermissions(session).includes(permission);
}

export function hasAnyPermission(permissions, session = getAuthSession()) {
  const sessionPermissions = new Set(getSessionPermissions(session));
  return permissions.some(permission => sessionPermissions.has(permission));
}

export function canUseAdminTools(session = getAuthSession()) {
  return hasAnyPermission(ADMIN_TOOL_PERMISSIONS, session);
}

export function canViewRoute(viewId, session = getAuthSession()) {
  if (viewId === 'admin') return canUseAdminTools(session);
  const permission = ROUTE_PERMISSIONS[viewId];
  return !permission || hasPermission(permission, session);
}

export function getRoleName(session = getAuthSession()) {
  const roleLevel = Number(session?.role_level || 0);
  return session?.role_name || ROLE_NAMES[roleLevel] || ROLE_NAMES[1];
}

export function canManageUsers(session = getAuthSession()) {
  return hasPermission(PERMISSIONS.USERS_MANAGE, session);
}

export const permissions = {
  canEditDashboard: true,
  canViewMap: () => canViewRoute('map'),
  canEditCases: () => hasPermission(PERMISSIONS.CASES_EDIT_OWN) || hasPermission(PERMISSIONS.CASES_EDIT_ANY),
};

function getFallbackRolePermissions(session = null) {
  if (!session) return [];
  const roleLevel = normalizeRoleLevel(session.role_level);
  const permissions = new Set([
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.CASES_VIEW,
    PERMISSIONS.CASES_EDIT_OWN,
    PERMISSIONS.CALENDAR_VIEW_OWN,
    PERMISSIONS.SCHEDULE_VIEW_OWN,
  ]);

  if (roleLevel >= ROLE_LEVELS.REPORT_ADMIN) {
    permissions.add(PERMISSIONS.REPORTS_VIEW);
    permissions.add(PERMISSIONS.REPORTS_MANAGE_ALL);
  }

  if (roleLevel >= ROLE_LEVELS.MAIN_ADMIN) {
    [
      PERMISSIONS.CASES_VIEW,
      PERMISSIONS.CONTROLLED_CASES_VIEW,
      PERMISSIONS.CONTROLLED_CASES_EDIT,
      PERMISSIONS.ENFORCEMENT_VIEW,
      PERMISSIONS.MAP_VIEW,
      PERMISSIONS.REGISTRY_VIEW,
      PERMISSIONS.EMERGENCY_FUND_VIEW,
      PERMISSIONS.MEETINGS_VIEW,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.USERS_RESET_PASSWORD,
      PERMISSIONS.PERMISSIONS_MANAGE,
      PERMISSIONS.DICTIONARIES_MANAGE,
      PERMISSIONS.CASES_EDIT_ANY,
    ].forEach(permission => permissions.add(permission));
  }

  if (roleLevel >= ROLE_LEVELS.TECH_ADMIN) {
    permissions.add(PERMISSIONS.ROLES_MANAGE);
    permissions.add(PERMISSIONS.TECH_ADMIN_ASSIGN);
    permissions.add(PERMISSIONS.TECHNICAL_ACCESS);
  }

  if (Array.isArray(session.individual_permissions)) {
    session.individual_permissions.forEach(permission => permissions.add(permission));
  }
  if (permissions.has(PERMISSIONS.CONTROLLED_CASES_VIEW)) {
    permissions.add(PERMISSIONS.CONTROLLED_CASES_EDIT);
  }

  return [...permissions];
}

function normalizeRoleLevel(value) {
  const level = Number(value || 0);
  if (level >= ROLE_LEVELS.TECH_ADMIN) return ROLE_LEVELS.TECH_ADMIN;
  if (level >= ROLE_LEVELS.MAIN_ADMIN) return ROLE_LEVELS.MAIN_ADMIN;
  if (level >= ROLE_LEVELS.REPORT_ADMIN) return ROLE_LEVELS.REPORT_ADMIN;
  return ROLE_LEVELS.PARTICIPANT;
}
