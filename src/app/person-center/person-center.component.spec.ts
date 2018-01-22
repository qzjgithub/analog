import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCenterComponent } from './person-center.component';

describe('PersonCenterComponent', () => {
  let component: PersonCenterComponent;
  let fixture: ComponentFixture<PersonCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
