import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularAddComponent } from './modular-add.component';

describe('ModularAddComponent', () => {
  let component: ModularAddComponent;
  let fixture: ComponentFixture<ModularAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModularAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
