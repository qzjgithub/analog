import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesAddComponent } from './interfaces-add.component';

describe('InterfacesAddComponent', () => {
  let component: InterfacesAddComponent;
  let fixture: ComponentFixture<InterfacesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
