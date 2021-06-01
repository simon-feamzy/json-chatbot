import { TestBed } from '@angular/core/testing';

import { JsonChatbotService } from './json-chatbot.service';

describe('JsonChatbotService', () => {
  let service: JsonChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonChatbotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
