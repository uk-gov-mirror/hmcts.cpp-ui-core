import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ChangeDetectorRef } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CppHasFeatureEnabledDirective } from '../cpp-user-has-feature-enabled.directive';
import { usersGroups } from '../../../reducers';
import { provideMockStore } from '@ngrx/store/testing';

describe('CppHasFeatureEnabledDirective', () => {
  let fixture: ComponentFixture<CppHasFeatureEnabledTestComponent>;
  let component: CppHasFeatureEnabledTestComponent;
  const initialState = {
    usersGroups: {
      userServices: [],
      features: [
        {
          key: 'someKey',
          title: 'someTitle',
          type: 'COMPONENT'
        }
      ]
    }
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CppHasFeatureEnabledTestComponent],
      imports: [
        StoreModule.forRoot({ usersGroups }, { runtimeChecks: {} }),
        CppHasFeatureEnabledDirective
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } }
      ]
    });
  });

  const setUpFixture = (template: string) => {
    TestBed.overrideTemplate(CppHasFeatureEnabledTestComponent, template).compileComponents();
    fixture = TestBed.createComponent(CppHasFeatureEnabledTestComponent);
    component = fixture.componentInstance;
  };

  it('should render', () => {
    const template = `<div>This is displayed always.</div>`;
    setUpFixture(template);
    expect(fixture).toMatchSnapshot();
  });

  describe('Given *cppHasFeatureEnabled is used', () => {
    it('should render the expected component is the feature is found', () => {
      const template = `
        <div *cppHasFeatureEnabled="'someKey'">
          This is displayed only if the feature is enabled
        </div>
      `;
      setUpFixture(template);
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should not render the expected component is the feature is not found', () => {
      const template = `
        <div *cppHasFeatureEnabled="'someRandomKey'">
          This shouldn't be displayed
        </div>
      `;
      setUpFixture(template);
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });

    it('should render the alternative template if the feature is not found', () => {
      const template = `
        <div *cppHasFeatureEnabled="'someRandomKey'; else someTemplateVar">
          This shouldn't be displayed
        </div>
        <ng-template #someTemplateVar>
          <div>User does not have this feature enabled.</div>
        </ng-template>
      `;
      setUpFixture(template);
      fixture.detectChanges();
      expect(fixture).toMatchSnapshot();
    });
  });
});

@Component({
  selector: 'cpp-user-has-feature-enabled-test',
  template: ``,
  standalone: false
})
export class CppHasFeatureEnabledTestComponent {}
