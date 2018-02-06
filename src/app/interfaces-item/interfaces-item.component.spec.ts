import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacesItemComponent } from './interfaces-item.component';

describe('InterfacesItemComponent', () => {
  let component: InterfacesItemComponent;
  let fixture: ComponentFixture<InterfacesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
