import { RolePermission, AggregatedRolePermission } from '../users-groups.interfaces';

export const aggregateRolePermissions = (
  permissions: RolePermission[]
): AggregatedRolePermission[] =>
  permissions.reduce(
    (aggregatedPermissions: AggregatedRolePermission[], { target, permissionId, ...rest }) => {
      if (!target) {
        const permissionExists = aggregatedPermissions.some(
          (perm) =>
            perm.action === rest.action &&
            perm.object === rest.object &&
            perm.source === rest.source &&
            !perm.targets
        );
        return permissionExists ? aggregatedPermissions : [...aggregatedPermissions, rest];
      }

      // get permissions of the same type/family with existing targets
      const existingPermissionsWithTargets = aggregatedPermissions.filter(
        ({ action, object, source, targets }) =>
          action === rest.action &&
          object === rest.object &&
          source === rest.source &&
          targets &&
          targets.length > 0
      );

      // where permissions of the same type do not exist, transform permissions target and add new
      if (existingPermissionsWithTargets.length === 0) {
        return [...aggregatedPermissions, { ...rest, targets: [target] }];
      }

      // where permissions exist, transform targets by adding to existing target collection
      existingPermissionsWithTargets.forEach(({ targets }) => {
        if (targets) {
          if (!targets.includes(target)) {
            targets.push(target);
          }
        }
      });

      return aggregatedPermissions;
    },
    [] as AggregatedRolePermission[]
  );

export const getPermissionsMap = (permissions: RolePermission[]): Record<string, RolePermission> =>
  permissions.reduce((dictionary, permission) => {
    const { permissionId } = permission;
    return { ...dictionary, [permissionId]: permission };
  }, {} as Record<string, RolePermission>);
