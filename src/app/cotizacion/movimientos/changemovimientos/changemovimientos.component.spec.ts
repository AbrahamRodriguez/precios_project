import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangemovimientosComponent } from './changemovimientos.component';

describe('ChangemovimientosComponent', () => {
  let component: ChangemovimientosComponent;
  let fixture: ComponentFixture<ChangemovimientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangemovimientosComponent]
    });
    fixture = TestBed.createComponent(ChangemovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
