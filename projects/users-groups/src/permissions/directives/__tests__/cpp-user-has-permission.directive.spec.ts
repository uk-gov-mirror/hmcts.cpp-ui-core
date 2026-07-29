import { CppUserHasPermissionDirective } from '../cpp-user-has-permission.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { usersGroups, UsersGroupsState } from '../../../reducers';
import { RolePermission } from '../../../users-groups.interfaces';
import { setUserPermissions } from '../../../actions/users-groups.actions';
import { Component } from '@angular/core';

describe('CppUserHasPermissionDirective', () => {
  let permissions: RolePermission[];
  let store: Store<UsersGroupsState>;
  let fixture: ComponentFixture<CppUserHasPermissionsTestComponent>;
  let component: CppUserHasPermissionsTestComponent;
  let expectedPermission: RolePermission | RolePermission[];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CppUserHasPermissionsTestComponent],
      imports: [
        StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} }),
        CppUserHasPermissionDirective
      ]
    });

    permissions = [
      {
        action: 'view',
        object: 'case',
        target: 'target 235',
        source: 'source a',
        permissionId: 'permission-1'
      },
      {
        action: 'view',
        object: 'case',
        target: 'target 123',
        source: 'source a',
        permissionId: 'permission-2'
      },
      { action: 'view', object: 'case', target: '', permissionId: 'permission-3' }
    ] as RolePermission[];
  });

  const setUpFixture = (template: string) => {
    TestBed.overrideTemplate(CppUserHasPermissionsTestComponent, template).compileComponents();
    fixture = TestBed.createComponent(CppUserHasPermissionsTestComponent);
    component = fixture.componentInstance;
  };

  const setUpTestData = (
    expectedPermissions: RolePermission | RolePermission[],
    providedTarget?: string,
    providedSource?: string
  ) => {
    store = TestBed.inject(Store);
    store.dispatch(setUserPermissions({ permissions }));
    component.expectedPermission = expectedPermissions;
    component.providedTarget = providedTarget;
    component.providedSource = providedSource;
  };

  it('should render', () => {
    const template = `<div>This is displayed without directive.</div>`;
    setUpFixture(template);
    expect(fixture).toMatchSnapshot();
  });

  describe('Given *cppUserHasPermission is used, ', () => {
    it('should render expected view if cpp User has permissions', () => {
      expect.assertions(1);

      expectedPermission = { action: 'view', object: 'case' } as RolePermission;
      const template = `<div *cppUserHasPermission="expectedPermission">
                            This is displayed ONLY if user has permissions.
                        </div> `;

      setUpFixture(template);
      setUpTestData(expectedPermission);
      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
    });

    it('should not render expected view if cpp User does not have permissions', () => {
      expect.assertions(1);

      expectedPermission = { action: 'view', object: 'hearing' } as RolePermission;
      const template = `<div *cppUserHasPermission="expectedPermission">
                            This is displayed ONLY if user has permissions.
                        </div> `;

      setUpFixture(template);
      setUpTestData(expectedPermission);
      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
    });

    describe('and target attribute is provided, ', () => {
      beforeEach(() => {
        const template = `<div *cppUserHasPermission="expectedPermission; target: providedTarget">
                              This is displayed ONLY if user has the specified target attribute as part of expected user permission.
                          </div> `;
        setUpFixture(template);
        expectedPermission = {
          action: 'view',
          object: 'case',
          source: 'source a'
        } as RolePermission;
      });

      it('when user has target attribute access in existing permissions, it should render view', () => {
        expect.assertions(1);

        setUpTestData(expectedPermission, 'target 235');
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
      });

      it('when user does not have target attribute access in existing permissions, it should not render view', () => {
        expect.assertions(1);

        setUpTestData(expectedPermission, 'target 444');
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
      });
    });

    describe('and source attribute is provided, ', () => {
      beforeEach(() => {
        const template = `<div *cppUserHasPermission="expectedPermission; target: providedTarget; source: providedSource">
                            This is displayed ONLY if user has the specified SOURCE attribute as part of expected user permission.
                          </div> `;
        setUpFixture(template);
        expectedPermission = { action: 'view', object: 'case' } as RolePermission;
      });

      it('when user has source attribute access in existing permissions, it should render view', () => {
        expect.assertions(1);

        setUpTestData(expectedPermission, 'target 123', 'source a');
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
      });

      it('when user does not have source attribute access in existing permissions, it should not render view', () => {
        expect.assertions(1);

        setUpTestData(expectedPermission, undefined, 'source a');
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
      });
    });

    describe('when user is required to have expected permissions, ', () => {
      beforeEach(() => {
        const template = `<div *cppUserHasPermission="expectedPermission; target: providedTarget; source: providedSource; required: true">
                            This is displayed ONLY if user is REQUIRED to have expected user permission.
                          </div> `;
        setUpFixture(template);
        expectedPermission = { action: 'view', object: 'case' } as RolePermission;
      });

      it('it should render view', () => {
        expect.assertions(1);

        setUpTestData(expectedPermission, 'target 123', 'source a');
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
      });
    });

    describe('when user is required not to have expected permissions, ', () => {
      beforeEach(() => {
        const template = `<div *cppUserHasPermission="expectedPermission; target: providedTarget; source: providedSource; required: false">
                            This is displayed ONLY if user is REQUIRED NOT TO HAVE expected user permission.
                          </div> `;
        setUpFixture(template);
        expectedPermission = { action: 'view', object: 'case' } as RolePermission;
      });

      it('it should render view', () => {
        expect.assertions(1);

        setUpTestData(expectedPermission, 'target 444', 'source a');
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
      });
    });

    describe('when user is required to have some of the permissions, ', () => {
      beforeEach(() => {
        const template = `<div *cppUserHasPermission="expectedPermission; target: providedTarget; source: providedSource; operation: 'or' ">
                            This is displayed ONLY if user is has SOME of the expected user permissions.
                          </div> `;
        setUpFixture(template);
        expectedPermission = [
          { action: 'view', object: 'case', target: 'target 444', source: 'source a' },
          { action: 'view', object: 'case', target: 'target 123', source: 'source a' }
        ] as RolePermission[];
      });

      it('it should render view', () => {
        expect.assertions(1);

        setUpTestData(expectedPermission);
        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
      });
    });
  });
});

@Component({
  selector: 'cpp-user-has-permissions-test',
  template: ``,
  standalone: false
})
export class CppUserHasPermissionsTestComponent {
  expectedPermission: any;
  providedTarget: any;
  providedSource: any;
}
