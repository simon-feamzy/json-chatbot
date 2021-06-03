import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage, MessageType} from '../models/message';
import {JsonChatbotService} from '../json-chatbot.service';

@Component({
  selector: 'lib-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {
  @Input() chatMessage?: ChatMessage;
  @Input() ellipsis = 'node_modules/json-chatbot/src/lib/assets/icons/ellipsis.svg';
  @Input() withDate = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  formatEpoch(epoch: number | undefined): string {
    return JsonChatbotService.getCalendarDay(epoch);
  }

  getPosition(): string {
    return this.chatMessage?.type === MessageType.MSG_REQ ? 'right' : 'left';
  }
}
