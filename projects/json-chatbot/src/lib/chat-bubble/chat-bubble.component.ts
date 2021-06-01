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
  loading = false;
  @Input() ellipsis = 'node_modules/json-chatbot/src/lib/assets/icons/ellipsis.svg';
  @Input() withDate = false;

  constructor() {
  }

  ngOnInit(): void {
    if (this.chatMessage?.timer && this.chatMessage?.timer > 0) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, this.chatMessage.timer);
    } else {
      this.loading = false;
    }
  }

  formatEpoch(epoch: number | undefined): string {
    return JsonChatbotService.getCalendarDay(epoch);
  }

  getPosition(): string {
    return this.chatMessage?.type === MessageType.MSG_REQ ? 'right' : 'left';
  }
}
