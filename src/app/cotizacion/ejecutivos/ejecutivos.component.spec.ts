import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutivosComponent } from './ejecutivos.component';

describe('EjecutivosComponent', () => {
  let component: EjecutivosComponent;
  let fixture: ComponentFixture<EjecutivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EjecutivosComponent]
    });
    fixture = TestBed.createComponent(EjecutivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
