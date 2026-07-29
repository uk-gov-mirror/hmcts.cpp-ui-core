import { RolePermission, AggregatedRolePermission } from '../../users-groups.interfaces';
import { aggregateRolePermissions } from '../role-permissions-aggregator';

describe('aggregateRolePermissions', () => {
  let permissions = [
    { action: 'view', object: 'case', target: 'target 123', source: 'source a' },
    { action: 'view', object: 'case', target: 'target 235', source: 'source a' }
  ] as RolePermission[];

  it('should accumulate target identifiers if user has same permissions with different targets', () => {
    const expectedResult = [
      { action: 'view', object: 'case', targets: ['target 123', 'target 235'], source: 'source a' }
    ] as AggregatedRolePermission[];

    expect(aggregateRolePermissions(permissions)).toEqual(expectedResult);
  });

  it('should not accumulate target identifiers if user has same permissions with different targets and different sources', () => {
    permissions = [
      { action: 'view', object: 'case', target: 'target 123', source: 'source a' },
      { action: 'view', object: 'case', target: 'target 235', source: 'source b' }
    ] as RolePermission[];

    const expectedResult = [
      { action: 'view', object: 'case', targets: ['target 123'], source: 'source a' },
      { action: 'view', object: 'case', targets: ['target 235'], source: 'source b' }
    ] as AggregatedRolePermission[];

    expect(aggregateRolePermissions(permissions)).toEqual(expectedResult);
  });

  it('should accumulate target identifiers if user has same permissions with different targets and same source', () => {
    permissions = [
      { action: 'view', object: 'case', target: 'target 123', source: 'source a' },
      { action: 'view', object: 'case', target: 'target 235', source: 'source a' }
    ] as RolePermission[];

    const expectedResult = [
      { action: 'view', object: 'case', targets: ['target 123', 'target 235'], source: 'source a' }
    ] as AggregatedRolePermission[];

    expect(aggregateRolePermissions(permissions)).toEqual(expectedResult);
  });

  it('should resolve permissions if user has same permissions but has a target on one of the permissions', () => {
    permissions = [
      { action: 'view', object: 'case', source: 'source a' },
      { action: 'view', object: 'case', target: 'target 235', source: 'source a' }
    ] as RolePermission[];

    const expectedResult = [
      { action: 'view', object: 'case', targets: undefined, source: 'source a' },
      { action: 'view', object: 'case', targets: ['target 235'], source: 'source a' }
    ] as AggregatedRolePermission[];

    expect(aggregateRolePermissions(permissions)).toEqual(expectedResult);
  });

  it('should transform target identifiers to empty strings if targets dont exist', () => {
    permissions = [
      { action: 'view', object: 'case', source: 'source a' },
      { action: 'view', object: 'case', source: 'source b' }
    ] as RolePermission[];

    const expectedResult = [
      { action: 'view', object: 'case', source: 'source a' },
      { action: 'view', object: 'case', source: 'source b' }
    ] as AggregatedRolePermission[];

    expect(aggregateRolePermissions(permissions)).toEqual(expectedResult);
  });

  it('should return unique permissions if duplicated', () => {
    permissions = [
      { action: 'view', object: 'case', source: 'source a' },
      { action: 'view', object: 'case', source: 'source a' }
    ] as RolePermission[];

    const expectedResult = [
      { action: 'view', object: 'case', source: 'source a' }
    ] as AggregatedRolePermission[];

    expect(aggregateRolePermissions(permissions)).toEqual(expectedResult);
  });
});
