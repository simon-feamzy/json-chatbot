import {TestBed} from '@angular/core/testing';

import {JsonChatbotService} from './json-chatbot.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('JsonChatbotService', () => {
  let service: JsonChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(JsonChatbotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
