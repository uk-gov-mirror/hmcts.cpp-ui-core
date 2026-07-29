import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getFeaturesByFeatureType, UsersGroupsState } from '../../reducers';
import { featuresExist } from '../../utils';
import { UserServiceFeature } from '../../users-groups.interfaces';
import { Subscription } from 'rxjs';

export interface HasFeatureContext {
  $implicit?: boolean;
  cppHasFeature?: boolean;
}

@Directive({ selector: '[cppHasFeatureEnabled]' })
export class CppHasFeatureEnabledDirective implements OnDestroy {
  private context: HasFeatureContext = {} as HasFeatureContext;
  private templateRef: TemplateRef<HasFeatureContext> | undefined;
  private elseTemplateRef: TemplateRef<HasFeatureContext> | undefined;
  private featuresInStore: UserServiceFeature[] = [];
  private expectedFeatureKeys: string[] = [];
  private subscription: Subscription;

  @Input()
  set cppHasFeatureEnabled(keys: string | string[]) {
    this.expectedFeatureKeys = Array.isArray(keys) ? keys : [keys];
    this.updateView();
  }

  @Input()
  set cppHasFeatureEnabledElse(templateRef: TemplateRef<HasFeatureContext>) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<HasFeatureContext>,
    private store: Store<UsersGroupsState>,
    private cdr: ChangeDetectorRef
  ) {
    this.templateRef = templateRef;
    this.subscription = this.store
      .pipe(select(getFeaturesByFeatureType('COMPONENT')))
      .subscribe((features) => {
        this.featuresInStore = features;
        this.updateView();
        this.cdr.markForCheck(); // cater for change detection OnPush scenarios
      });
  }

  updateView() {
    this.viewContainerRef.clear();
    this.displayRequiredView();
  }

  displayRequiredView() {
    const currentTemplateRef = this.verifyFeature() ? this.templateRef : this.elseTemplateRef;
    if (currentTemplateRef) {
      return this.viewContainerRef.createEmbeddedView(currentTemplateRef, this.context);
    }
  }

  // this optional argument is exposed for directive explicitly used in components
  verifyFeature(expectedFeatureKeys?: string[]): boolean {
    if (expectedFeatureKeys) {
      this.expectedFeatureKeys = expectedFeatureKeys;
    }
    this.context.$implicit = this.context.cppHasFeature = featuresExist(
      this.featuresInStore,
      this.expectedFeatureKeys
    );
    return this.context.$implicit;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
