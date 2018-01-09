import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteServerComponent } from './remote-server.component';

describe('RemoteServerComponent', () => {
  let component: RemoteServerComponent;
  let fixture: ComponentFixture<RemoteServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
