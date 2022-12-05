import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCardModalComponent } from './send-card-modal.component';

describe('SendCardModalComponent', () => {
  let component: SendCardModalComponent;
  let fixture: ComponentFixture<SendCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendCardModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
