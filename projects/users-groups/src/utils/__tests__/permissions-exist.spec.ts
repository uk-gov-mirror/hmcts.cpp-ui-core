import { RolePermission, AggregatedRolePermission } from '../../users-groups.interfaces';
import { permissionsExist, PermissionOperator } from '../permissions-exist';

describe('permissionsExist', () => {
  const userPermissions = [
    { action: 'view', object: 'case', targets: ['target 123', 'target 235'], source: 'source a' },
    { action: 'view', object: 'case', targets: ['target 678'], source: 'source b' },
    { action: 'view', object: 'case', targets: ['target 345'], source: 'source c' },
    { action: 'view', object: 'case', target: undefined, source: 'source a' },
    { action: 'view', object: 'case', target: undefined }
  ] as AggregatedRolePermission[];

  it('should return true if all of the expected permissions are present in the existing user permissions', () => {
    const expectedPermissionOne = {
      action: 'view',
      object: 'case',
      target: 'target 123',
      source: 'source a'
    } as RolePermission;
    const expectedPermissionTwo = {
      action: 'view',
      object: 'case',
      target: 'target 678',
      source: 'source b'
    } as RolePermission;
    const expectedPermissionThree = {
      action: 'view',
      object: 'case',
      target: '',
      source: 'source a'
    } as RolePermission;

    expect(
      permissionsExist(userPermissions, [
        expectedPermissionOne,
        expectedPermissionTwo,
        expectedPermissionThree
      ])
    ).toBe(true);
  });

  it('should return false if some of the expected permissions are present in the existing user permissions', () => {
    const expectedPermissionOne = {
      action: 'view',
      object: 'case',
      target: 'target 123',
      source: 'source a'
    } as RolePermission;
    const expectedPermissionTwo = {
      action: 'view',
      object: 'case',
      target: 'target 678',
      source: 'source b'
    } as RolePermission;
    const expectedPermissionThree = {
      action: 'view',
      object: 'case',
      target: 'target 825',
      source: 'source d'
    } as RolePermission;

    expect(
      permissionsExist(userPermissions, [
        expectedPermissionOne,
        expectedPermissionTwo,
        expectedPermissionThree
      ])
    ).toBe(false);
  });

  it('should return false if none of the expected permissions are present in the existing user permissions', () => {
    const expectedPermissionOne = {
      action: 'view',
      object: 'case',
      target: 'target 367',
      source: 'source c'
    } as RolePermission;
    const expectedPermissionTwo = {
      action: 'view',
      object: 'case',
      target: 'target 123',
      source: 'source d'
    } as RolePermission;
    const expectedPermissionThree = {
      action: 'view',
      object: 'case',
      target: 'target 935',
      source: 'source a'
    } as RolePermission;
    const expectedPermissionFour = {
      action: 'view',
      object: 'Hearing',
      target: 'target 678',
      source: 'source b'
    } as RolePermission;

    expect(
      permissionsExist(userPermissions, [
        expectedPermissionOne,
        expectedPermissionTwo,
        expectedPermissionThree,
        expectedPermissionFour
      ])
    ).toBe(false);
  });

  it('should return true, if specific target is provided separately for expected permissions  and it exists in user permissions', () => {
    const expectedPermissionOne = {
      action: 'view',
      object: 'case',
      source: 'source a'
    } as RolePermission;

    const specificTarget = 'target 123';

    expect(
      permissionsExist(
        userPermissions,
        [expectedPermissionOne],
        PermissionOperator.and,
        specificTarget
      )
    ).toBe(true);
  });

  it('should return false, if specific target is provided separately for expected permissions  and it does not exist in user permissions', () => {
    const expectedPermissionOne = {
      action: 'view',
      object: 'case',
      source: 'source a'
    } as RolePermission;

    const specificTarget = 'target 678';

    expect(
      permissionsExist(
        userPermissions,
        [expectedPermissionOne],
        PermissionOperator.and,
        specificTarget
      )
    ).toBe(false);
  });
});
