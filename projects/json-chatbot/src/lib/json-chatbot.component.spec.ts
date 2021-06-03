import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {JsonChatbotComponent} from './json-chatbot.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('JsonChatbotComponent', () => {
  let component: JsonChatbotComponent;
  let fixture: ComponentFixture<JsonChatbotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonChatbotComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
