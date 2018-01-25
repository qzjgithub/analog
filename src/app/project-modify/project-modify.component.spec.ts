import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectModifyComponent } from './project-modify.component';

describe('ProjectModifyComponent', () => {
  let component: ProjectModifyComponent;
  let fixture: ComponentFixture<ProjectModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
