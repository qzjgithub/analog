import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularManageComponent } from './modular-manage.component';

describe('ModularManageComponent', () => {
  let component: ModularManageComponent;
  let fixture: ComponentFixture<ModularManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModularManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
