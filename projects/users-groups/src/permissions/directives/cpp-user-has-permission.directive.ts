import { Directive, TemplateRef, Input, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { AggregatedRolePermission } from '../../users-groups.interfaces';
import { Store, select } from '@ngrx/store';
import { UsersGroupsState, getUserRolePermissions } from '../../reducers';
import { Subscription } from 'rxjs';
import { permissionsExist, PermissionOperator, RequiredPermission } from '../../utils';

export interface HasPermissionContext {
  $implicit: RequiredPermission[];
  cppUserHasPermission?: boolean;
}

/**
 * CppUserHasPermissionDirective should be used (preferably with syntactic sugar) as a structural
 *  directive to check if user has permissions to access any resource.
 */
@Directive({ selector: '[cppUserHasPermission]' })
export class CppUserHasPermissionDirective implements OnInit, OnDestroy {
  private context: HasPermissionContext = {} as HasPermissionContext;
  private templateRef: TemplateRef<HasPermissionContext> | undefined;
  private permissionsInStore: AggregatedRolePermission[] | undefined;
  private subscription: Subscription | undefined;
  private _target: string | undefined;
  private _source: string | undefined;
  private _required = true;
  private _operation: PermissionOperator = PermissionOperator.and;

  @Input()
  set cppUserHasPermission(value: RequiredPermission | RequiredPermission[]) {
    value = (value instanceof Array ? value : [value]) as RequiredPermission[];
    this.context.$implicit = value;
    this.updateView();
  }

  @Input()
  set cppUserHasPermissionTarget(target: string) {
    this._target = target;
    this.updateView();
  }

  @Input()
  set cppUserHasPermissionSource(source: string) {
    this._source = source;
    this.updateView();
  }

  @Input()
  set cppUserHasPermissionRequired(required: boolean) {
    this._required = required;
    this.updateView();
  }

  @Input()
  set cppUserHasPermissionOperation(operator: PermissionOperator) {
    this._operation = operator;
    this.updateView();
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<HasPermissionContext>,
    private store: Store<UsersGroupsState>
  ) {
    this.templateRef = templateRef;
  }

  ngOnInit() {
    this.subscription = this.store.pipe(select(getUserRolePermissions)).subscribe((permissions) => {
      this.permissionsInStore = permissions;
      this.updateView();
    });
  }

  updateView() {
    this.viewContainerRef.clear();
    this.displayRequiredView();
  }

  displayRequiredView() {
    if (this.verifyPermissions()) {
      return (
        this.templateRef && this.viewContainerRef.createEmbeddedView(this.templateRef, this.context)
      );
    }
  }

  verifyPermissions(): boolean {
    const requiredPermissions = this.context.$implicit;
    if (this.permissionsInStore) {
      this.context.cppUserHasPermission = permissionsExist(
        this.permissionsInStore,
        requiredPermissions,
        this._operation,
        this._target,
        this._source
      );
      return this._required
        ? this.context.cppUserHasPermission
        : !this.context.cppUserHasPermission;
    }
    return false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
