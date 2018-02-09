import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogManageComponent } from './analog-manage.component';

describe('AnalogManageComponent', () => {
  let component: AnalogManageComponent;
  let fixture: ComponentFixture<AnalogManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
