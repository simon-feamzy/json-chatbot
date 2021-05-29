import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IonicChatbotComponent } from './ionic-chatbot.component';

describe('IonicChatbotComponent', () => {
  let component: IonicChatbotComponent;
  let fixture: ComponentFixture<IonicChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IonicChatbotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IonicChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
