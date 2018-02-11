import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogAddComponent } from './analog-add.component';

describe('AnalogAddComponent', () => {
  let component: AnalogAddComponent;
  let fixture: ComponentFixture<AnalogAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
