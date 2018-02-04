import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfasesAddComponent } from './interfases-add.component';

describe('InterfasesAddComponent', () => {
  let component: InterfasesAddComponent;
  let fixture: ComponentFixture<InterfasesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfasesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfasesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
