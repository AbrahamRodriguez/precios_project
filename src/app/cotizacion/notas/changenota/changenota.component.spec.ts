import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangenotaComponent } from './changenota.component';

describe('ChangenotaComponent', () => {
  let component: ChangenotaComponent;
  let fixture: ComponentFixture<ChangenotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangenotaComponent]
    });
    fixture = TestBed.createComponent(ChangenotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
