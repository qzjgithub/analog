import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPasswordComponent } from './person-password.component';

describe('PersonPasswordComponent', () => {
  let component: PersonPasswordComponent;
  let fixture: ComponentFixture<PersonPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
