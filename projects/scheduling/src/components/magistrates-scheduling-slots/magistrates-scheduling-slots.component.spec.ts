import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MagistratesSchedulingSlotsComponent } from './magistrates-scheduling-slots.component';
import { DatePipe } from '@angular/common';
import { RotaBusinessType } from '@cpp/reference-data';

describe('MagistratesSchedulingSlotsComponent', () => {
  let component: MagistratesSchedulingSlotsComponent;
  let fixture: ComponentFixture<MagistratesSchedulingSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagistratesSchedulingSlotsComponent, DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(MagistratesSchedulingSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should set rotaBusinessTypes correctly and generate a mapping', () => {
    const businessTypes: RotaBusinessType[] = [
      { typeCode: 'TRL', typeDescription: 'Trial' },
      { typeCode: 'TFL', typeDescription: 'Tfl' }
    ] as unknown as RotaBusinessType[];

    component.rotaBusinessTypes = businessTypes;
    expect(component.rotaBusinessTypesByCode).toEqual({
      TRL: businessTypes[0],
      TFL: businessTypes[1]
    });
  });
});
