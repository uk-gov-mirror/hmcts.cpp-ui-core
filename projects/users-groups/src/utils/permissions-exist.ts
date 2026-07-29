import { AggregatedRolePermission, RolePermission } from '../users-groups.interfaces';

type PermissionSourceAndTarget = Pick<RolePermission, 'source' | 'target'>;
export type RequiredPermission = Pick<RolePermission, 'action' | 'object'> &
  Partial<PermissionSourceAndTarget>;
export enum PermissionOperator {
  and = 'and',
  or = 'or'
}
/**
 * A utility function to verify user permissions consists of  expected permissions
 * @param userPermissions - The users existing permissions.
 * @param requiredPermissions - the permissions to check against.
 * @param specificTarget - an explicit specific feature identifier or attribute associated with this permission (e.g the id of a Case.).
 * @param specificSource  - an explicit specific source identifier of this permission (e.g the id of a user that assigned this permission to current user).
 * @param operation - a determinant operator (and/or) for the expected permissions, (e.g user must have all expected permissions).
 */
export function permissionsExist(
  userPermissions: AggregatedRolePermission[],
  requiredPermissions: RequiredPermission[],
  operation = PermissionOperator.and,
  specificTarget?: string,
  specificSource?: string
): boolean {
  // dependent on the operator, choose a predicate function for verification
  const predicateFunction =
    operation === PermissionOperator.or ? requiredPermissions.some : requiredPermissions.every;

  // using the predicate function , check if the store user permissions contains
  // the expected permissions (dependent on the operator) using specific conditions below.
  // if specific source is provided, the expected permission's source is ignored.
  // the same applies to tspecific target.
  return predicateFunction.call(requiredPermissions, (expectedPerm: RequiredPermission) =>
    userPermissions.some(
      permission =>
        permission.action.toLowerCase() === expectedPerm.action.toLowerCase() &&
        permission.source === (specificSource || expectedPerm.source) &&
        permission.object.toLowerCase() === expectedPerm.object.toLowerCase() &&
        verifyTargets(permission.targets, specificTarget || expectedPerm.target)
    )
  );
}

function verifyTargets(existingTargets: string[] | undefined, currentTarget: string | undefined) {
  if (existingTargets && currentTarget) {
    return existingTargets.includes(currentTarget);
  }
  return existingTargets === undefined && !currentTarget;
}
