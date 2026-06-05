import {
  detroitDynamoAdminModules,
  detroitDynamoAdminModuleRegistry,
  detroitDynamoAdminRoles,
  detroitDynamoRolePermissionMatrix,
} from './detroitDynamoDataModel.js';

export const detroitDynamoAccessCapabilities = {
  none: [],
  view: ['view'],
  contribute: ['view', 'contribute'],
  approve: ['view', 'contribute', 'approve'],
  manage: ['view', 'contribute', 'manage'],
  admin: ['view', 'contribute', 'approve', 'manage', 'admin'],
};

export function normalizeDetroitDynamoRoleName(roleName) {
  const value = String(roleName || '').trim().toLowerCase();
  return detroitDynamoRolePermissionMatrix.find((role) => role.role.toLowerCase() === value)?.role || '';
}

export function getDetroitDynamoRolePolicy(roleName) {
  const normalizedRole = normalizeDetroitDynamoRoleName(roleName);
  return detroitDynamoRolePermissionMatrix.find((role) => role.role === normalizedRole) || null;
}

export function getDetroitDynamoPermission(roleName, moduleName) {
  const role = getDetroitDynamoRolePolicy(roleName);
  const module = detroitDynamoAdminModules.find((item) => item.toLowerCase() === String(moduleName || '').trim().toLowerCase());
  const fallback = {
    module: module || String(moduleName || ''),
    access: 'none',
    scope: 'No assigned access for this role and module.',
  };

  if (!role || !module) return fallback;
  return role.permissions.find((permission) => permission.module === module) || fallback;
}

export function canDetroitDynamoRoleAccess(roleName, moduleName, requiredAccess = 'view') {
  const permission = getDetroitDynamoPermission(roleName, moduleName);
  const capabilities = detroitDynamoAccessCapabilities[permission.access] || [];
  return capabilities.includes(requiredAccess);
}

export function getDetroitDynamoActionRequirement(actionLabel) {
  const action = String(actionLabel || '').toLowerCase();
  if (action.includes('approve')) return 'approve';
  if (
    action.includes('create')
    || action.includes('assign')
    || action.includes('connect')
    || action.includes('set ')
    || action.includes('set public')
    || action.includes('manage')
    || action.includes('map ')
    || action.includes('publish')
    || action.includes('schedule')
    || action.includes('archive')
    || action.includes('prepare')
    || action.includes('route')
    || action.includes('confirm')
    || action.includes('gate')
    || action.includes('define')
    || action.includes('update')
  ) {
    return 'manage';
  }
  if (action.includes('draft') || action.includes('capture') || action.includes('propose')) return 'contribute';
  if (action.includes('review') || action.includes('track') || action.includes('export')) return 'view';
  return 'contribute';
}

export function buildDetroitDynamoModuleActionGuard(moduleRegistryEntry) {
  const moduleName = moduleRegistryEntry?.module || '';
  const ownerRoles = moduleRegistryEntry?.ownerRoles || [];
  const enabledActions = moduleRegistryEntry?.enabledActions || [];

  return {
    module: moduleName,
    ownerRoles,
    actions: enabledActions.map((action) => {
      const requiredAccess = getDetroitDynamoActionRequirement(action);
      const permittedRoles = detroitDynamoAdminRoles.filter((role) => (
        canDetroitDynamoRoleAccess(role, moduleName, requiredAccess)
      ));
      const permittedOwnerRoles = ownerRoles.filter((role) => permittedRoles.includes(role));

      return {
        action,
        requiredAccess,
        permittedRoles,
        permittedOwnerRoles,
      };
    }),
  };
}

export function summarizeDetroitDynamoRoleAccess(roleName) {
  const role = getDetroitDynamoRolePolicy(roleName);
  if (!role) {
    return {
      role: String(roleName || ''),
      purpose: '',
      sensitiveControls: [],
      controlModules: [],
      contributeModules: [],
      viewOnlyModules: [],
      blockedModules: detroitDynamoAdminModules,
      permissions: [],
    };
  }

  return {
    role: role.role,
    purpose: role.purpose,
    sensitiveControls: role.sensitiveControls,
    controlModules: role.permissions
      .filter((permission) => ['admin', 'manage', 'approve'].includes(permission.access))
      .map((permission) => permission.module),
    contributeModules: role.permissions
      .filter((permission) => permission.access === 'contribute')
      .map((permission) => permission.module),
    viewOnlyModules: role.permissions
      .filter((permission) => permission.access === 'view')
      .map((permission) => permission.module),
    blockedModules: role.permissions
      .filter((permission) => permission.access === 'none')
      .map((permission) => permission.module),
    permissions: role.permissions,
  };
}

export const detroitDynamoRoleAccessSummaries = detroitDynamoRolePermissionMatrix.map((role) => (
  summarizeDetroitDynamoRoleAccess(role.role)
));

export const detroitDynamoModuleActionGuards = detroitDynamoAdminModuleRegistry.map((moduleRegistryEntry) => (
  buildDetroitDynamoModuleActionGuard(moduleRegistryEntry)
));

export function auditDetroitDynamoActionGuards() {
  const issues = [];

  if (detroitDynamoModuleActionGuards.length !== detroitDynamoAdminModuleRegistry.length) {
    issues.push('Module action guard count does not match the admin module registry.');
  }

  for (const moduleRegistryEntry of detroitDynamoAdminModuleRegistry) {
    const guard = detroitDynamoModuleActionGuards.find((item) => item.module === moduleRegistryEntry.module);
    if (!guard) {
      issues.push(`Missing action guard for ${moduleRegistryEntry.module}`);
      continue;
    }

    if (guard.actions.length !== moduleRegistryEntry.enabledActions.length) {
      issues.push(`${moduleRegistryEntry.module} action guard count does not match enabled actions.`);
    }

    for (const action of guard.actions) {
      if (!Object.hasOwn(detroitDynamoAccessCapabilities, action.requiredAccess)) {
        issues.push(`${moduleRegistryEntry.module} action ${action.action} has invalid required access.`);
      }
      if (action.permittedRoles.length === 0) {
        issues.push(`${moduleRegistryEntry.module} action ${action.action} has no permitted roles.`);
      }
      if (action.permittedOwnerRoles.length === 0) {
        issues.push(`${moduleRegistryEntry.module} action ${action.action} has no permitted owner role.`);
      }
    }
  }

  return issues;
}

export function auditDetroitDynamoAccessPolicy() {
  const issues = [];
  const validAccessLevels = new Set(Object.keys(detroitDynamoAccessCapabilities));

  for (const role of detroitDynamoRolePermissionMatrix) {
    const normalizedRole = normalizeDetroitDynamoRoleName(role.role);
    if (normalizedRole !== role.role) {
      issues.push(`Role cannot be normalized: ${role.role}`);
    }

    const modules = new Set(role.permissions.map((permission) => permission.module));
    for (const module of detroitDynamoAdminModules) {
      if (!modules.has(module)) {
        issues.push(`${role.role} is missing module policy for ${module}`);
      }
    }

    for (const permission of role.permissions) {
      if (!validAccessLevels.has(permission.access)) {
        issues.push(`${role.role} has invalid ${permission.access} access for ${permission.module}`);
      }
      if (!permission.scope) {
        issues.push(`${role.role} is missing scope language for ${permission.module}`);
      }
    }
  }

  const policyExpectations = [
    { role: 'Master Admin', module: 'Payments/packages', access: 'admin', expected: true },
    { role: 'Club Director', module: 'News posts', access: 'approve', expected: true },
    { role: 'Training Director', module: 'Training bookings', access: 'manage', expected: true },
    { role: 'Registrar', module: 'Waivers/forms', access: 'manage', expected: true },
    { role: 'Coach', module: 'Payments/packages', access: 'view', expected: false },
    { role: 'Media/Admin Staff', module: 'Waivers/forms', access: 'view', expected: false },
  ];

  for (const { role, module, access, expected } of policyExpectations) {
    const actual = canDetroitDynamoRoleAccess(role, module, access);
    if (actual !== expected) {
      issues.push(`${role} ${expected ? 'should' : 'should not'} have ${access} access to ${module}`);
    }
  }

  return issues;
}
